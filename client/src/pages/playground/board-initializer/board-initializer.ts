import {BoardCanvas} from './board-canvas';
import {ImageGallery} from '../../../utils/custom-elements/image-gallery';
import {DialogService} from 'aurelia-dialog';
import {autoinject} from 'aurelia-framework';

@autoinject
export class BoardInitializer {
  private board: BoardCanvas;

  private gameWidth: number = 600;
  private gameHeight: number = 400;

  constructor(private dialogService: DialogService) { }

  submit() {
    let model = {
      title: 'board-init.bgnd-gallery-title',
      sections: ['background']
    }
    this.dialogService.open({ viewModel: ImageGallery, model: model }).whenClosed(response => {
      if (!response.wasCancelled && response.output != undefined) {
        console.log(response.output);
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
}
