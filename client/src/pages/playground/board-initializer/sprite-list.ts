import {autoinject, bindable} from 'aurelia-framework';
import {DialogService} from 'aurelia-dialog';
import {ValidationControllerFactory, ValidationRules, ValidationController} from '../../../../jspm_packages/npm/aurelia-validation@1.0.0/aurelia-validation';

import {ImageGallery} from '../../../utils/custom-elements/image-gallery';
import {BoardCanvas} from './board-canvas';
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
        let sprite: ImageInfo = response.output;
        let callback = (img: fabric.Image) => {
          // Set sprite info
          let data: any = img.data = {};
          
          data.key = sprite.name;
          data.name = this.createUniqueName(sprite.name);

          // Set spritesheet info
          data.spritesheet = sprite.spritesheet ? {} : undefined;
          for (let props in sprite.spritesheet) {
            data.spritesheet[props] = sprite.spritesheet[props];
          }

          this.sprites.push(img);
        };

        if (sprite.spritesheet) {
          this.board.addSpriteSheet(sprite.spritesheet, callback);
        } else {
          this.board.addSprite(sprite, callback);
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
