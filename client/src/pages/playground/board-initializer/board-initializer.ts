import {autoinject} from 'aurelia-framework';
import {DialogService} from 'aurelia-dialog';

import {BoardCanvas} from './board-canvas';
import {ImageGallery} from '../../../utils/custom-elements/image-gallery';
import {ImageInfo} from '../../../utils/interfaces';


@autoinject
export class BoardInitializer {
  private board: BoardCanvas;

  private gameWidth: number = 600;
  private gameHeight: number = 400;

  private background: ImageInfo = null;
  private backgroundType: string;

  private bgndTypes = new Map([
    ['fixed', { name: 'board-init.bgndFixed', descr: 'board-init.bgndFixedDescr' }],
    ['camera', { name: 'board-init.bgndCamera', descr: 'board-init.bgndCameraDescr' }],
    ['scroll', { name: 'board-init.bgndScroll', descr: 'board-init.bgndScrollDescr' }]
  ]);

  constructor(private dialogService: DialogService) { }

  submit() {
    let model = {
      title: 'board-init.bgnd-gallery-title',
      sections: ['background']
    }
    this.dialogService.open({ viewModel: ImageGallery, model: model }).whenClosed(response => {
      if (!response.wasCancelled && response.output != undefined) {
        this.board.setBackground(response.output);
        this.background = response.output;
      }
    });
  }

  attached() {
    // Enable bootstrap tooltip
    $('[data-toggle="tooltip"]').tooltip();

    // Capture current context
    let __this = this;

    // Initialize fabric canvas and associated events
    this.board = new BoardCanvas(this.gameWidth, this.gameHeight);

  }

  private resizeBoard() {
    this.board.resize(this.gameWidth, this.gameHeight);
  }

  private removeBackground() {
    this.board.removeBackground();
    this.background = null;
  }
}
