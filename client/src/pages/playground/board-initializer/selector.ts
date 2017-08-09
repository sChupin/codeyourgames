import {autoinject} from 'aurelia-framework';
import {DialogController}from 'aurelia-dialog';

import {SpriteSheetInfo} from '../../../utils/interfaces';

@autoinject
export class Selector {
  private sprite: SpriteSheetInfo;

  constructor(private controller: DialogController) { }

  activate(sprite) {
    this.sprite = sprite;
  }

  getImgPositionStyle(i: number, j: number) {
    let style = 'object-fit: none; object-position:';
    style += ' -' + j*this.sprite.spriteWidth + 'px ';
    style += ' -' + i*this.sprite.spriteHeight + 'px; ';
    style += 'width: ' + this.sprite.spriteWidth + 'px; ';
    style += 'height: ' + this.sprite.spriteHeight + 'px;';

    return style;
  }
}
