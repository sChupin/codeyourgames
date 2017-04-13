import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {CodeUpdated, GameInfo} from '../messages';
import Phaser = require('phaser');

@inject(EventAggregator)
export class GameView {

  private gameContainer: GameContainer;
  private gameInfo;

  constructor(private ea: EventAggregator) {
    ea.subscribe(CodeUpdated, msg => this.update(msg.createCode, msg.updateCode));
    ea.subscribe(GameInfo, msg => this.gameInfo = msg);
  }

  private update(createCode: string, updateCode: string) {
    if (!this.gameInfo) {
      console.log('You need to initialize the board first');
      return;
    }
    
    if (this.gameContainer != null) {
      this.gameContainer.destroy();
    }

    let preloadCode = getPreloadCode(this.gameInfo);

    this.gameContainer = new GameContainer(preloadCode, createCode, updateCode);
  }

  detached() {
    if (this.gameContainer != null) {
      this.gameContainer.destroy();
    }
  }

}

function getPreloadCode(gameInfo) {
  let code = "";

  // Allow cross-origin
  code += "this.load.crossOrigin = 'anonymous';\n"

  gameInfo.bodies.forEach(body => {
    code += "this.load.image('" + body.key + "', '" + body.url + "');\n"
  });

  console.log('Preload Code is:');
  console.log(code);
  return code;
}

class GameContainer extends Phaser.Game {
  constructor(preloadCode: string, createCode: string, updateCode: string, containerId: string = "game-container", width: number = 400, height: number = 300) {
    super(width, height, Phaser.AUTO, containerId, null);
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

  private myDude: Phaser.Sprite;
  private platforms: Phaser.Group;
  private stars: Phaser.Group;

  private score: number = 0;
  private scoreText: Phaser.Text;

  private cursors: Phaser.CursorKeys;

  private left;
  private right;
  private up;
  private down;

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
