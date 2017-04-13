import {EventAggregator, Subscription} from "aurelia-event-aggregator";
import {autoinject} from "aurelia-framework";

import {CodeUpdated} from "./messages";

import Phaser = require('phaser');

@autoinject
export class GameContainer {
  private subscriber: Subscription;

  private game: Game;

  constructor(private ea: EventAggregator) { }

  attached() {
    this.subscriber = this.ea.subscribe(CodeUpdated, msg => this.update(msg.preloadCode, msg.createCode, msg.updateCode));
  }

  private update(preloadCode: string, createCode: string, updateCode: string) {    
    if (this.game != null) {
      this.game.destroy();
    }

    this.game = new Game(preloadCode, createCode, updateCode);
  }

  detached() {
    this.subscriber.dispose();
    this.game.destroy();
  }

}

class Game extends Phaser.Game {
  constructor(preloadCode: string, createCode: string, updateCode: string, containerId: string = "game-container", width: number = 400, height: number = 300) {
    super(width, height, Phaser.AUTO, containerId, null, true);
    GameWorld.prototype.userPreload = Function(preloadCode);
    GameWorld.prototype.userCreate = Function(createCode);
    GameWorld.prototype.userUpdate = Function(updateCode);

    this.state.add('main', GameWorld);
    this.state.start('main');
  }
}

interface GameWorld {
  userPreload: Function;
  userCreate: Function;
  userUpdate: Function;
  userRender: Function;
}

class GameWorld extends Phaser.State {
  
  private bodies: any = {};

  private cursors: Phaser.CursorKeys;

  preload() {
    this.userPreload();
  }

  create() {
    this.userCreate();
  }

  update() {
    this.userUpdate();
  }
}
