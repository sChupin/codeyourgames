import Phaser = require('phaser');

export class PhaserGame {
  private gameContainer: GameContainer;

  attached() {
    this.gameContainer = new GameContainer();
  }

  detached() {
    this.gameContainer.destroy();
  }

}

class GameContainer extends Phaser.Game {
  constructor() {
    super(800, 500, Phaser.AUTO, 'game-container', null);
    this.state.add('main', GameWorld);
    this.state.start('main');
  }
}

class GameWorld extends Phaser.State {

  preload() {
    this.load.image('sky', '/media/phaser_img/sky.png');
  }

  create() {
    // Set physics and enable body
    this.physics.startSystem(Phaser.Physics.ARCADE);
    this.world.enableBody = true;

    // Set background
    this.add.sprite(0, 0, 'sky');
  }

  update() {
    
  }

}
