import {autoinject, bindable} from 'aurelia-framework';
import {DialogService} from 'aurelia-dialog';

import {ImageGallery} from '../../../utils/custom-elements/image-gallery';
import {BoardCanvas} from './board-canvas';

@autoinject
export class SpriteList {

  @bindable private board: BoardCanvas;

  constructor(private dialogService: DialogService) { }
  
  private openSpriteGallery() {
    let model = {
      title: 'board-init.sprite-gallery-title',
      sections: ['Sprites', 'Tiles', 'Items']
    }
    this.dialogService.open({ viewModel: ImageGallery, model: model }).whenClosed(response => {
      if (!response.wasCancelled && response.output != undefined) {
        console.log(response.output);
      }
    });
  }
}
