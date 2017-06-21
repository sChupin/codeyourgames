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

  private background: Phaser.TileSprite;
  private cursors: Phaser.CursorKeys;

  preload() {
    this.load.crossOrigin = 'anonymous';
    this.load.image('background', 'http://localhost:9000/public/images/Backgrounds/space19.png');
    this.load.spritesheet('hero', 'http://localhost:9000/public/images/Sprites/sheets/alberto.png', 32, 53);
  }

  create() {

    this.background = this.add.tileSprite(0, 0, this.game.width, this.game.height, 'background');
    this.cursors = this.input.keyboard.createCursorKeys();
    this.world.setBounds(0, 0, 3000, 3000);

    // this.add.existing(new Hero(this.game, 100, 25, 'hero', 8, {gravity: 0}));
  }

  update() {
    this.background.tilePosition.y += 2;

    if (this.cursors.right.isDown) {
      this.background.tilePosition.x -= 1;
    } else if (this.cursors.left.isDown) {
      this.background.tilePosition.x += 1;
    }
  }

  render() {

  }
}

class Hero extends Phaser.Sprite {

  private cursors;
  
  // Default properties
  private defaultCanFall: boolean = false;
  private defaultSpeed: number = 200;
  private defaultGravity = 500;
  private defaultJumpForce = 300;

  // Physics properties
  public canFall: boolean;
  public speed: number;
  public gravity: number;
  public jumpForce: number;

  constructor(public game: Phaser.Game, public x: number = 0, public y: number = 0,
              public key: string = '', public frame: number | string = '', opts: any = {}) {
    super(game, x, y, key, frame);
    
    // Enable hero physics
    this.game.physics.arcade.enable(this);

    // Set hero properties
    this.canFall = opts.hasOwnProperty('canFall') ? opts.canFall : this.defaultCanFall;
    this.speed = opts.hasOwnProperty('speed') ? opts.speed : this.defaultSpeed;
    this.gravity = opts.hasOwnProperty('gravity') ? opts.gravity : this.defaultGravity;
    this.jumpForce = opts.hasOwnProperty('jumpForce') ? opts.jumpForce : this.defaultJumpForce;
    
    // Enable collision with world bounds
    this.body.collideWorldBounds = this.canFall;

    // Set hero gravity
    this.body.gravity.y = this.gravity;

    // Create animations
    this.animations.add('moveRight', [8, 9, 10, 11], 10 , true);
    this.animations.add('moveLeft', [4, 5, 6, 7], 10  , true);

    // Set motion signals
    this.cursors = this.game.input.keyboard.createCursorKeys();

    this.cursors.left.onDown.add(() => {
      this.body.velocity.x = -this.speed;
    });
    this.cursors.left.onUp.add(() => {
      if (!this.cursors.right.isDown) {
        this.body.velocity.x = 0;
      } else {
        this.body.velocity.x = this.speed;
      }
    });

    this.cursors.right.onDown.add(() => {
      this.body.velocity.x = this.speed;
    });
    this.cursors.right.onUp.add(() => {
      if (!this.cursors.left.isDown) {
        this.body.velocity.x = 0;
      } else {
        this.body.velocity.x = -this.speed;
      }
    });

    this.cursors.up.onDown.add(() => {
      this.body.velocity.y = -this.speed;
    });
    this.cursors.up.onUp.add(() => {
      if (!this.cursors.left.isDown) {
        this.body.velocity.y = 0;
      } else {
        this.body.velocity.y = this.speed;
      }
    });

    this.cursors.down.onDown.add(() => {
      this.body.velocity.y = this.speed;
    });
    this.cursors.down.onUp.add(() => {
      if (!this.cursors.left.isDown) {
        this.body.velocity.y = 0;
      } else {
        this.body.velocity.y = -this.speed;
      }
    });

    // Set up camera
    this.game.camera.follow(this);
    let left = this.game.width / 3;
    let width = left;
    //this.game.camera.deadzone = new Phaser.Rectangle(left, 0, width, this.game.height);
  }

  update() {

    // Set animations and frame based on motion
    if (this.body.velocity.x > 0) {
      if (this.body.blocked.down || this.body.touching.down) {
        this.animations.play('moveRight');
      } else {
        this.animations.stop();
        this.frame = 9;
      }
    } else if (this.body.velocity.x < 0) {
      if (this.body.blocked.down || this.body.touching.down) {
        this.animations.play('moveLeft');
      } else {
        this.animations.stop();
        this.frame = 5;
      }
    } else {
      this.animations.stop();
      if (this.frame >= 8) {
        this.frame = 8;
      } else {
        this.frame = 4;
      }
    }
  }
}
