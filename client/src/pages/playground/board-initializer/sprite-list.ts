import {autoinject, bindable} from 'aurelia-framework';
import {DialogService} from 'aurelia-dialog';
import {ValidationControllerFactory, ValidationRules, ValidationController} from '../../../../jspm_packages/npm/aurelia-validation@1.0.0/aurelia-validation';

import {ImageGallery} from '../../../utils/custom-elements/image-gallery';
import {BoardCanvas} from '../../../services/board-canvas';
import {ImageInfo} from '../../../utils/interfaces';

@autoinject
export class SpriteList {

  private canvasSprites = [];

  @bindable private board: BoardCanvas;
  @bindable private sprites: Array<fabric.Image> = [];

  private controller: ValidationController;

  constructor(private dialogService: DialogService, private controllerFactory: ValidationControllerFactory) {
    this.controller = controllerFactory.createForCurrentScope();
  }
  
  private openSpriteGallery() {
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

  private deleteSprite(target) {
    // Remove sprite from canvas
    this.board.deleteActiveObject();

    // Remove sprite from sprites list
    this.sprites.forEach((sprite, idx, sprites) => {
      if (sprite == target) {
        sprites.splice(idx, 1);
      }
    });
  }

  private createUniqueName(oName: string) {
    return oName;
  }
}
