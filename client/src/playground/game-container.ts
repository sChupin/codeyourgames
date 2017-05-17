import {EventAggregator, Subscription} from "aurelia-event-aggregator";
import {autoinject} from "aurelia-framework";

import {CodeUpdated} from "./messages";
import {Keyboard, Mouse} from "../lib/sensors";
import {Body} from "../lib/sprite";

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
    GameWorld.prototype.userCreate = Function('Game', 'Bodies', 'Mouse', createCode);
    GameWorld.prototype.userUpdate = Function('Keyboard', 'Mouse', 'Bodies', updateCode);

    this.state.add('main', GameWorld);
    this.state.start('main');
  }
}

class GameWorld extends Phaser.State {

  private background;

  private bodies: BodyMap = {};

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
    
    this.userCreate(this, this.bodies, this.mouse);
  }

  update() {
    // Ensure onInputOver/Out are dispatched even if mouse is not moving
    this.input.activePointer.dirty = true;

    this.userUpdate(this.keyboard, this.mouse, this.bodies);
  }

  private initKeyboard() {
    this.keyboard = new Keyboard(this.input.keyboard);
  }

  private initMouse() {
    this.mouse = new Mouse(this.input);
  }
  
  private addBody(name: string, x: number, y: number, key: string, height: number, width: number) {
    let phaserSprite = this.add.sprite(x, y, key);
    phaserSprite.anchor.setTo(0.5, 0.5);
    phaserSprite.height = height;
    phaserSprite.width = width;
    this.bodies[name] = new Body(phaserSprite);
  }

  private setBackground(backgroundKey: string) {
    this.background = this.add.sprite(0, 0, backgroundKey);
    this.background.width = this.world.width;
    this.background.height = this.world.height;
  }

  private setBackgroundColor(color: string) {
    this.game.stage.backgroundColor = color;
  }
}

interface GameWorld {
  userPreload: Function;
  userCreate: Function;
  userUpdate: Function;
}

interface BodyMap {
  [key: string]: Body;
}

interface FunctionMap {
  [key: string]: Function;
}
