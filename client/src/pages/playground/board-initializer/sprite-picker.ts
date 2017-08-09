import {autoinject, bindable} from 'aurelia-framework';
import {DialogService} from 'aurelia-dialog';

import {SpriteSheetInfo} from '../../../utils/interfaces';
import {Selector} from './selector';

@autoinject
export class SpritePicker {
  @bindable sprite: SpriteSheetInfo;

  private offsetX: number = 0;
  private offsetY: number = 0;
  private baseImgCss: string;

  constructor(private dialogService: DialogService) { }

  private openSelector() {
    this.dialogService.open({ viewModel: Selector, model: this.sprite }).whenClosed(response => {
      if (!response.wasCancelled && response.output != undefined) {
        let idx = response.output;
        let i = Math.floor(idx/this.sprite.verticalNbr);
        let j = idx%this.sprite.horizontalNbr;

        this.offsetX = -j*this.sprite.spriteWidth;
        this.offsetY = -i*this.sprite.spriteHeight;

        this.sprite.defaultSpriteNo = idx;
      }
    });
  }
}
