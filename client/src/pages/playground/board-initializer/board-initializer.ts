import {autoinject, bindable, BindingEngine} from 'aurelia-framework';
import {DialogService} from 'aurelia-dialog';

import {BoardCanvas} from '../../../services/board-canvas';
import {ImageGallery} from '../../../utils/custom-elements/image-gallery';
import {ImageInfo, SpriteInfo} from '../../../utils/interfaces';


@autoinject
export class BoardInitializer {
  private board: BoardCanvas;

  private gameWidth: number = 600;
  private gameHeight: number = 400;

  private cameraWidth: number;
  private cameraHeight: number;

  private background: ImageInfo = null;
  private sprites: Array<fabric.Image> = [];
  private spriteErrors: Array<any> = [];

  @bindable private backgroundType: string;

  private bgndTypes = new Map([
    ['fixed', { name: 'board-init.bgndFixed', descr: 'board-init.bgndFixedDescr' }],
    ['camera', { name: 'board-init.bgndCamera', descr: 'board-init.bgndCameraDescr' }],
    ['scroll', { name: 'board-init.bgndScroll', descr: 'board-init.bgndScrollDescr' }]
  ]);

  constructor(private dialogService: DialogService, private bindingEngine: BindingEngine) {
    // not working
    // this.bindingEngine.collectionObserver(this.spriteErrors).subscribe(this.errorsChanged);
  }

  attached() {
    // Initialize fabric canvas and associated events
    this.board = new BoardCanvas(this.gameWidth, this.gameHeight);
  }

  private openBackgroundGallery() {
    let model = {
      title: 'board-init.bgnd-gallery-title',
      sections: ['Backgrounds']
    }
    this.dialogService.open({ viewModel: ImageGallery, model: model }).whenClosed(response => {
      if (!response.wasCancelled && response.output != undefined) {
        this.board.setBackground(response.output);
        this.background = response.output;
      }
    });
  }

  private resizeBoard() {
    this.board.resize(this.gameWidth, this.gameHeight);
    
    // Resize background to fit new board dimensions
    if (this.background) {
      this.board.setBackground(this.background);
    }
  }

  private resizeCamera() {
    this.board.resizeCamera(this.cameraWidth, this.cameraHeight);
  }

  private removeBackground() {
    this.board.removeBackground();
    this.background = null;
  }

  private saveBoard() {
    if (this.spriteErrors.length > 0) {
      console.log('Sprite name errors');
      this.showNotif();
    } else {
      console.log('Saving board...');
    }
  }

  private showNotif() {
    let notif = $('#error-notif');
    notif.fadeIn();
  }

  private closeNotif() {
    $('#error-notif').hide();
  }

  backgroundTypeChanged() {
    if (this.backgroundType == 'camera') {
      this.cameraWidth = this.board.getWidth();
      this.cameraHeight = this.board.getHeight();
      this.board.addCamera(this.cameraWidth, this.cameraHeight);
    } else {
      this.board.removeCamera();
    }
  }
}
