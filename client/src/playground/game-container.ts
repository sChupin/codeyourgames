import {EventAggregator, Subscription} from "aurelia-event-aggregator";
import {autoinject} from "aurelia-framework";

import {CodeUpdated, EditorFocus} from "./messages";
import {Keyboard, Mouse} from "../lib/sensors";

import Phaser = require('phaser');

@autoinject
export class GameContainer {
  private codeUpdateSubscriber: Subscription;
  private editorFocusSubscriber: Subscription;

  private game: Game;

  constructor(private ea: EventAggregator) { }

  attached() {
    this.codeUpdateSubscriber = this.ea.subscribe(CodeUpdated, msg => this.update(msg.preloadCode, msg.createCode, msg.updateCode, msg.gameWidth, msg.gameHeight));
    
    // Disable/enable key capture when editor is focused/blur
    this.editorFocusSubscriber = this.ea.subscribe(EditorFocus, msg => {
      if (this.game) {
        this.game.input.enabled = !msg.focused;
      }
    });
  }

  private update(preloadCode: string, createCode: string, updateCode: string, gameWidth: number, gameHeight: number) {    
    if (this.game != null) {
      this.game.destroy();
    }

    console.log('preload:');
    console.log(preloadCode);
    console.log('create:');
    console.log(createCode);
    console.log('update:');
    console.log(updateCode);

    this.game = new Game(preloadCode, createCode, updateCode, gameWidth, gameHeight);
  }

  detached() {
    this.codeUpdateSubscriber.dispose();
    if (this.game != null) {
      this.game.destroy();
    }
    this.editorFocusSubscriber.dispose();
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

    GameWorld.prototype.userPreload = Function(preloadCode);
    GameWorld.prototype.userCreate = Function('Bodies', createCode);
    GameWorld.prototype.userUpdate = Function('Keyboard', 'Mouse', updateCode);

    this.state.add('main', GameWorld);
    this.state.start('main');
  }
}

class GameWorld extends Phaser.State {

  private background;

  private bodies: Array<Body>;

  private userEvents: Array<Phaser.Signal> = [];
  private userFunctions: FunctionMap = {};

  private keyboard: Keyboard;
  private mouse: Mouse;

  preload() {
    this.userPreload();
  }

  create() {
    this.initKeyboard();
    this.initMouse();
    
    this.userCreate(this.bodies);
  }

  update() {
    this.userUpdate(this.keyboard, this.mouse);
  }

  private initKeyboard() {
    this.keyboard = new Keyboard(this.input.keyboard);
  }

  private initMouse() {
    this.mouse = new Mouse(this.input);
  }
}

interface GameWorld {
  userPreload: Function;
  userCreate: Function;
  userUpdate: Function;
}

interface BodyMap {
  [key: string]: Phaser.Sprite;
}

interface FunctionMap {
  [key: string]: Function;
}
