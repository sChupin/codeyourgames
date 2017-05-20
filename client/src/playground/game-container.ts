import {EventAggregator, Subscription} from "aurelia-event-aggregator";
import {autoinject} from "aurelia-framework";

import {CodeUpdated} from "./messages";
import {Keyboard, Mouse} from "../lib/sensors";
import {Body} from "../lib/sprite";
import {GameProps} from "../lib/game";
import {NumberMap, TextMap, BooleanMap} from "../lib/variables";

import Phaser = require('phaser');

@autoinject
export class GameContainer {
  private container: HTMLDivElement;

  private codeUpdateSubscriber: Subscription;

  private game: Game;

  constructor(private ea: EventAggregator) { }

  attached() {
    // Refresh game with new code
    this.codeUpdateSubscriber = this.ea.subscribe(CodeUpdated, msg => this.update(msg.preloadCode, msg.createCode, msg.updateCode));
    
    // Disable key capture when click outside game
    window.addEventListener('click', (e) => {
      if (this.game) {
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
    if (this.game != null) {
      this.game.destroy();
    }

    console.log('preload:');
    console.log(preloadCode);
    console.log('create:');
    console.log(createCode);
    console.log('update:');
    console.log(updateCode);

    this.game = new Game(preloadCode, createCode, updateCode);
  }

  private pauseGame() {
    if (this.game) {
      this.game.paused = !this.game.paused;
    }
  }

}

class Game extends Phaser.Game {
  constructor(preloadCode: string, createCode: string, updateCode: string, width: number = 400, height: number = 300) {
    super(width, height, Phaser.AUTO, 'game-container', null);

    GameWorld.prototype.userPreload = Function(preloadCode);
    GameWorld.prototype.userCreate = Function('Game', 'Functions', 'Mouse', 'Bodies', 'Numbers', 'Texts', 'Booleans', createCode);
    GameWorld.prototype.userUpdate = Function('Game', 'Keyboard', 'Mouse', 'Bodies', 'Numbers', 'Texts', 'Booleans', updateCode);

    this.state.add('main', GameWorld);
    this.state.start('main');
  }
}

class GameWorld extends Phaser.State {

  // Game properties handler accessed by global Game in user code
  private gameProps: GameProps;

  private background: any;

  // List of sprite accessed by global Bodies in user code
  private bodies: BodyMap = {};

  private userEvents: Array<Phaser.Signal> = [];

  // List of functions accessed by global Functions in user code
  private userFunctions: FunctionMap = {};

  // Keyboard events handler accessed by global Keyboard in user code
  private keyboard: Keyboard;

  // Mouse events handler accessed by global Mouse in user code
  private mouse: Mouse;

  // List of groups accessed by global Groups in user code
  private groups: GroupMap;

  preload() {
    this.userPreload();
  }

  create() {
    this.initGameProps();
    this.initKeyboard();
    this.initMouse();
    
    this.userCreate(this.gameProps, this.userFunctions, this.mouse, this.bodies, NumberMap, TextMap, BooleanMap);
  }

  update() {
    // Ensure onInputOver/Out are dispatched even if mouse is not moving
    this.input.activePointer.dirty = true;

    this.userUpdate(this.gameProps, this.keyboard, this.mouse, this.bodies, NumberMap, TextMap, BooleanMap);
  }

  private initGameProps() {
    this.gameProps = new GameProps(this.game, this.background, this.bodies, this.groups);
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

export interface BodyMap {
  [key: string]: Body;
}

export interface FunctionMap {
  [key: string]: Function;
}

export interface GroupMap {
  // todo: replace by new Group class
  [key: string]: Phaser.Group;
}
