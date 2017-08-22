import {EventAggregator, Subscription} from "aurelia-event-aggregator";
import {autoinject, bindable} from "aurelia-framework";

import {CodeUpdate} from "../services/messages";

import {Keyboard, Mouse} from "../api/sensors";
import {Time, Direction, Color} from "../api/utility";
import {GameProps} from "../api/game";

import Phaser = require('phaser');

@autoinject
export class GameContainer {
  private container: HTMLDivElement;

  private codeUpdateSubscriber: Subscription;

  private game: Game;
  @bindable private gameWidth: number;
  @bindable private gameHeight: number;

  constructor(private ea: EventAggregator) { }

  attached() {
    // Refresh game with new code
    this.codeUpdateSubscriber = this.ea.subscribe(CodeUpdate, code => this.update(code.preloadCode, code.createCode, code.updateCode));
    
    // Disable key capture when click outside game
    window.addEventListener('click', (e) => {
      if (this.game != null && this.game.input != null) {
        if (this.container.contains(<Node> e.target)) {
          this.game.input.enabled = true;
        } else {
          this.game.input.enabled = false;
        }
      }
    });
  }

  detached() {
    this.codeUpdateSubscriber.dispose();
    if (this.game != null) {
      this.game.destroy();
    }
  }

  private update(preloadCode: string, createCode: string, updateCode: string) {

    if (this.gameWidth == undefined || this.gameHeight == undefined) {
      console.log('Game width and height are not defined');
      console.log('You need to save a board first');
      return;
    }

    if (this.game != null) {
      this.game.destroy();
    }

    console.log('preload:');
    console.log(preloadCode);
    console.log('create:');
    console.log(createCode);
    console.log('update:');
    console.log(updateCode);

    this.game = new Game(preloadCode, createCode, updateCode, this.gameWidth, this.gameHeight);
  }

  private pauseGame() {
    if (this.game) {
      this.game.paused = !this.game.paused;
    }
  }

}

class Game extends Phaser.Game {
  constructor(preloadCode: string, createCode: string, updateCode: string, width: number, height: number) {
    super(width, height, Phaser.AUTO, 'game-container', null);

    let chapter: Chapter = new Chapter();

    // Trick to access create scope in update function
    createCode += '\nreturn function() {\n' + updateCode + '\n};\n';

    chapter.userPreload = Function(preloadCode);
    chapter.userCreate = Function('Game', 'Keyboard', 'Mouse', 'Time', 'Direction', 'Color', createCode);
    // chapter.userCreate = Function('Game', 'Functions', 'Keyboard', 'Mouse', createCode);
    // chapter.userUpdate = Function('Game', 'Keyboard', 'Mouse', updateCode);
    
    this.state.add('main', chapter);
    this.state.start('main');
  }
}

class Chapter extends Phaser.State {

  private userEvents: Array<Phaser.Signal> = [];

  preload() {
    this.userPreload();
  }

  create() {
    this.userUpdate = this.userCreate(new GameProps(this.game), new Keyboard(this.input.keyboard), new Mouse(this.input), new Time(this.game), new Direction, new Color());
  }

  update() {
    // Ensure onInputOver/Out are dispatched even if mouse is not moving
    this.input.activePointer.dirty = true;

    this.userUpdate();
  }
}

interface Chapter {
  userPreload: Function;
  userCreate: Function;
  userUpdate: Function;
}

export interface FunctionMap {
  [key: string]: Function;
}
