import {autoinject, bindable, bindingMode} from 'aurelia-framework';
import {DialogService} from 'aurelia-dialog';
import {ValidationControllerFactory, ValidationRules, ValidationController, ValidateResult} from '../../../../jspm_packages/npm/aurelia-validation@1.0.0/aurelia-validation';

import {ImageGallery} from '../../../utils/custom-elements/image-gallery';
import {BoardCanvas} from '../../../services/board-canvas';
import {ImageInfo} from '../../../utils/interfaces';

@autoinject
export class SpriteList {

  private controller: ValidationController;
  @bindable({ defaultBindingMode: bindingMode.twoWay }) private errors: Array<ValidateResult> = [];

  @bindable private board: BoardCanvas = null;
  @bindable private sprites: Array<fabric.Image> = [];

  private groupSelected = false;

  constructor(private dialogService: DialogService, private controllerFactory: ValidationControllerFactory) {
    this.controller = controllerFactory.createForCurrentScope();
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
      sections: ['Sprites', 'Tiles', 'Items']
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
          .required().withMessage("Sprite name is required")
          .matches(/^[a-z].*$/).withMessage("Sprite name should start with lower case letter")
          .matches(/^\w*$/).withMessage("Sprite name shouldn\'t contain special character")
          .satisfies((name: string, data: any) => {
            return this.sprites.map(sprite => {
              if (sprite !== newSprite)
                return sprite.data.name;
            }).indexOf(name) == -1;
          }).withMessage("Sprite name should be unique")
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
