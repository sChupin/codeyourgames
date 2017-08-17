import {Color} from '../api/utility';

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

  private myDude: Phaser.Sprite;
  private platforms: Phaser.Group;
  private stars: Phaser.Group;

  private score: number = 0;
  private scoreText: Phaser.Text;

  private cursors: Phaser.CursorKeys;

  preload() {
    this.load.image('sky', '/assets/media/phaser_img/sky.png');
    this.load.image('ground', '/assets/media/phaser_img/ground.png');
    this.load.image('star', '/assets/media/phaser_img/star.png');
    this.load.spritesheet('dude', '/assets/media/phaser_img/dude.png', 32, 48);
  }

  create() {
    // Set physics and enable body
    this.physics.startSystem(Phaser.Physics.ARCADE);
    this.world.enableBody = true;

    // Set background
    this.add.sprite(0, 0, 'sky');

    // Create platform group
    this.platforms = this.add.physicsGroup();
    

    // Set ground and ledges
    let ground: Phaser.Sprite = this.platforms.create(0, this.game.height, 'ground');
    ground.anchor.setTo(0,1);
    ground.scale.setTo(2,2);

    let ledge = this.platforms.create(400, 300, 'ground');
    ledge = this.platforms.create(-150, 150, 'ground');

    // Create star group
    this.stars = this.add.physicsGroup();

    // Set stars
    for (let i = 0; i < 10; i++) {
      let star = this.stars.create(80 + i*70, 100, 'star');
      star.body.bounce.y = 0.5 + Math.random()*0.2;
    }

    this.stars.setAll('body.gravity.y', 50);

    // Set dude
    this.myDude = this.add.sprite(100, 100, 'dude');
    
    this.myDude.body.collideWorldBounds = true;
    this.myDude.body.gravity.y = 100;
    
    this.myDude.animations.add('left', [0, 1, 2, 3], 10, true);
    this.myDude.animations.add('right', [5, 6, 7, 8], 10, true);

    // Set platforms immovable
    this.platforms.setAll('body.immovable', true);

    // Set the score
    this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: Color.LightGoldenRodYellow });

    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update() {
    this.game.physics.arcade.collide(this.myDude, this.platforms);

    this.game.physics.arcade.collide(this.stars, this.platforms);

    this.game.physics.arcade.overlap(this.myDude, this.stars, this.collectStar , null, this);

    if (this.cursors.left.isDown) {

      this.myDude.body.velocity.x = -150;

      if (this.myDude.body.touching.down) {
        this.myDude.animations.play('left');
      } else {
        this.myDude.animations.stop();
        this.myDude.frame = 3;
      }

    } else if (this.cursors.right.isDown) {

      this.myDude.body.velocity.x = 150;

      if (this.myDude.body.touching.down) {
        this.myDude.animations.play('right');
      } else {
        this.myDude.animations.stop();
        this.myDude.frame = 8;
      }

    } else {

      this.myDude.body.velocity.x = 0;

      this.myDude.animations.stop();
      this.myDude.frame = 4;

    }

    if (this.cursors.up.isDown && this.myDude.body.touching.down) {
      this.myDude.body.velocity.y = -200;
    }
    
  }

  private collectStar(dude: Phaser.Sprite, star: Phaser.Sprite) {
    star.kill();

    this.score += 10;
    this.scoreText.text = 'Score: ' + this.score;
  }

}
