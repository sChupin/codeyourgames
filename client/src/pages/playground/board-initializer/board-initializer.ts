import {BoardCanvas} from './board-canvas';

export class BoardInitializer {
  private board: BoardCanvas;

  private gameWidth: number = 600;
  private gameHeight: number = 400;

  attached() {
    // Enable bootstrap tooltip
    $('[data-toggle="tooltip"]').tooltip();

    // Capture current context
    let __this = this;

    // Initialize fabric canvas and associated events
    this.board = new BoardCanvas(this.gameWidth, this.gameHeight);

  }
}
