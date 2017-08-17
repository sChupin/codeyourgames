import {autoinject, bindable, bindingMode} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {DialogService} from 'aurelia-dialog';
import {ValidationControllerFactory, ValidationRules, ValidationController, ValidateResult} from '../../../../jspm_packages/npm/aurelia-validation@1.0.0/aurelia-validation';
import {I18N} from 'aurelia-i18n';

import {ImageGallery} from '../../../utils/custom-elements/image-gallery';
import {BoardCanvas} from '../../../services/board-canvas';
import {ImageInfo} from '../../../utils/interfaces';
import {InfoDialog} from '../../../utils/custom-elements/info-dialog';

import * as jsonDoc from '../../../../assets/doc/sprite.json!json';

@autoinject
export class SpriteList {

  private controller: ValidationController;
  @bindable({ defaultBindingMode: bindingMode.twoWay }) private errors: Array<ValidateResult> = [];

  @bindable private board: BoardCanvas = null;
  @bindable private sprites: Array<fabric.Image> = [];

  private groupSelected = false;
  private spriteTypes = jsonDoc;

  private language: string;
  
  constructor(private dialogService: DialogService, private controllerFactory: ValidationControllerFactory, private i18n: I18N, private ea: EventAggregator) {
    this.controller = controllerFactory.createForCurrentScope();
    
    this.language = i18n.getLocale();
    ea.subscribe('i18n:locale:changed', payload => {
      this.language = i18n.getLocale();
    });
  }

  attached() {
    this.errors = this.controller.errors;
  }

  // Wait the BoardCanvas to be constructed
  boardChanged(newValue: BoardCanvas, oldValue: BoardCanvas) {
    if (newValue) {
      newValue.setOnGroupSelection(() => {
        this.groupSelected = true;
      });

      newValue.setOnGroupDeselection(() => {
        this.groupSelected = false;
      });
    }
  }

  private openSpriteGallery(): void {
    let model = {
      title: 'board-init.sprite-gallery-title',
      // sections: ['Sprites', 'Tiles', 'Items']
      sections: [{name: 'img-gallery.sprites', tag: 'Sprites'}, {name: 'img-gallery.tiles', tag: 'Tiles'}, {name: 'img-gallery.items', tag: 'Items'}]
    }

    this.dialogService.open({ viewModel: ImageGallery, model: model }).whenClosed(response => {
      if (!response.wasCancelled && response.output != undefined) {
        let spriteInfo: ImageInfo = response.output;
        let callback = (newSprite: fabric.Image) => {
          // Set sprite info
          let data: any = newSprite.data = {};
          
          data.key = spriteInfo.name;
          data.name = this.createUniqueName(spriteInfo.name);
          data.url = spriteInfo.url;
          
          // Set spritesheet info
          data.spritesheet = spriteInfo.spritesheet ? {} : undefined;
          for (let props in spriteInfo.spritesheet) {
            data.spritesheet[props] = spriteInfo.spritesheet[props];
          }

          // Validation of sprite name
          ValidationRules.ensure('name')
          .required().withMessage('board-init.errorReq')
          .matches(/^[a-z].*$/).withMessage('board-init.errorLow')
          .matches(/^\w*$/).withMessage('board-init.errorSpec')
          .satisfies((name: string, data: any) => {
            return this.sprites.map(sprite => {
              if (sprite !== newSprite)
                return sprite.data.name;
            }).indexOf(name) == -1;
          }).withMessage('board-init.errorUniq')
          .on(data);

          this.sprites.push(newSprite);
        };

        if (spriteInfo.spritesheet) {
          this.board.addSpriteSheet(spriteInfo.spritesheet, callback);
        } else {
          this.board.addSprite(spriteInfo, callback);
        }
      }
    });
  }

  private openInfoDialog(title, info) {
    this.dialogService.open({ viewModel: InfoDialog, model: {title: title, info: info} }).whenClosed(response => {
    
    });
  }

  private deleteSprite(sprite: fabric.Image): void {
    // Remove sprite from canvas
    this.board.deleteActiveObject();

    // Remove sprite from sprites list
    this.removeSpriteFromList(sprite);
  }

  private deleteSprites(): void {
    // Remove sprites from canvas
    let aGrp: Array<fabric.Object> = this.board.deleteActiveGroup();
    
    aGrp.forEach(aSprite => this.removeSpriteFromList(<fabric.Image> aSprite));
  }

  private removeSpriteFromList(toDel: fabric.Image): void {
    this.sprites.forEach((sprite, idx, sprites) => {
        if (sprite == toDel) {
          sprites.splice(idx, 1);
        }
      });
  }

  private createUniqueName(oName: string): string {
    let nName = oName;
    let suffix = 2;
    while (this.sprites.map(sprite => sprite.data.name).indexOf(nName) !== -1) {
      nName = oName + suffix;
      suffix++;
    }
    return nName;
  }

}
