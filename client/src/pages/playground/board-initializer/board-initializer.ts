import {autoinject, bindable, BindingEngine} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {DialogService} from 'aurelia-dialog';

import {BoardCanvas} from '../../../services/board-canvas';
import {ImageGallery} from '../../../utils/custom-elements/image-gallery';
import {ImageInfo, SpriteInfo} from '../../../utils/interfaces';
import {BoardInfo} from '../../../services/messages';


@autoinject
export class BoardInitializer {
  private board: BoardCanvas;

  private gameWidth: number = 600;
  private gameHeight: number = 400;

  private cameraWidth: number;
  private cameraHeight: number;
  private cameraSetWidth: number;
  private cameraSetHeight: number;

  private background: ImageInfo = null;
  private sprites: Array<fabric.Image> = [];
  private spriteErrors: Array<any> = [];

  @bindable private backgroundType: string;

  private bgndTypes = new Map([
    ['fixed', { name: 'board-init.bgndFixed', descr: 'board-init.bgndFixedDescr' }],
    ['camera', { name: 'board-init.bgndCamera', descr: 'board-init.bgndCameraDescr' }],
    ['scroll', { name: 'board-init.bgndScroll', descr: 'board-init.bgndScrollDescr' }]
  ]);

  constructor(private dialogService: DialogService, private bindingEngine: BindingEngine, private ea: EventAggregator) {
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
    let boardWidth = this.board.getWidth();
    let boardHeight = this.board.getHeight();

    if (this.cameraWidth > boardWidth) {
      this.cameraWidth = boardWidth;
    }

    if (this.cameraHeight > boardHeight) {
      this.cameraHeight = boardHeight;
    }

    this.board.resizeCamera(this.cameraWidth, this.cameraHeight);
    this.cameraSetWidth = this.cameraWidth;
    this.cameraSetHeight = this.cameraHeight;
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

      this.board.deselectAll();

      // Create SpriteInfo object from canvas sprites
      let spritesInfo = this.sprites.map((sprite): SpriteInfo => {
        return {
          key: sprite.data.key,
          name: sprite.data.name,
          url: sprite.data.url,
          type: sprite.data.type,
          typeProps: sprite.data.typeProps,
          x: Math.round(sprite.left),
          y: Math.round(sprite.top),
          width: Math.round(sprite.width * sprite.scaleX),
          height: Math.round(sprite.height * sprite.scaleY),
          angle: Math.round(sprite.angle),
          spritesheet: sprite.data.spritesheet
        };
      });

      let boardInfo = new BoardInfo(
        this.board.getWidth(), this.board.getHeight(),
        this.background, this.backgroundType,
        spritesInfo,
        this.cameraSetWidth, this.cameraSetHeight
      );

      console.log(boardInfo);

      this.ea.publish(boardInfo);
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
      this.cameraSetWidth = this.cameraWidth;
      this.cameraSetHeight = this.cameraHeight;
      this.board.addCamera(this.cameraWidth, this.cameraHeight);
    } else {
      this.board.removeCamera();
      this.cameraSetWidth = null;
      this.cameraSetHeight = null;
    }
  }
}
