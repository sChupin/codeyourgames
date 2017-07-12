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

  private hero: Hero;
  
  private platformGroup: Phaser.Group;

  preload() {
    this.load.crossOrigin = 'anonymous';
    this.load.image('background', 'http://localhost:9000/public/images/Backgrounds/cave.png');
    this.load.spritesheet('hero', 'http://localhost:9000/public/images/Sprites/sheets/alberto.png', 32, 53);
    this.load.image('platform', 'http://localhost:9000/public/images/Tiles/dirtHalf.png');
  }

  create() {

    let background = this.add.image(0, 0, 'background');
    background.height = this.game.height;
    this.world.setBounds(0, 0, background.width, this.game.height);

    this.hero = this.add.existing(new Hero(this.game, 100, 25, 'hero', 8));

    this.platformGroup = this.add.group();

    let x = 0;
    let y = 400;
    while (x < this.world.width) {
      x += Math.floor(Math.random() * 75);
      let width = Math.floor(Math.random() * 100) + 200;

      // Create new platform
      let platform = new Platform(this.game, x, y, 'platform', {width: width});

      x += platform.width;

      // Add platform to world
      this.add.existing(platform);

      // Add platform to platformGroup
      this.platformGroup.add(platform);

      y -= Math.sign(Math.random() - 0.35) * Math.floor((Math.random() * 75));
    }  

  }

  update() {
    this.game.physics.arcade.collide(this.hero, this.platformGroup);
  }

  render() {

  }
}

class Platform extends Phaser.Sprite {

  private group: Phaser.Group;

  constructor(public game: Phaser.Game, public x: number, public y: number, public key: string, opts: any = {}) {
    super(game, x, y, key);

    // Enable platform physics
    this.game.physics.arcade.enable(this);

    // Set up properties
    if (opts.hasOwnProperty('width')) {
      this.width = opts.width;
    }
    if (opts.hasOwnProperty('height')) {
      this.height = opts.height;
    }
    if (opts.hasOwnProperty('orientation')) {
      this.angle = opts.orientation;
    }
  
    // Set immovable 
    this.body.immovable = true;

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
// signal based motion 
    // this.cursors.left.onDown.add(() => {
    //   this.body.velocity.x = -this.speed;
    // });
    // this.cursors.left.onUp.add(() => {
    //   if (!this.cursors.right.isDown) {
    //     this.body.velocity.x = 0;
    //   } else {
    //     this.body.velocity.x = this.speed;
    //   }
    // });

    // this.cursors.right.onDown.add(() => {
    //   this.body.velocity.x = this.speed;
    // });
    // this.cursors.right.onUp.add(() => {
    //   if (!this.cursors.left.isDown) {
    //     this.body.velocity.x = 0;
    //   } else {
    //     this.body.velocity.x = -this.speed;
    //   }
    // });

    // this.cursors.up.onDown.add(() => {
    //   if (this.body.blocked.down || this.body.touching.down) {
    //     this.body.velocity.y = -this.jumpForce;
    //   }
    // });
//
    // Set up camera
    this.game.camera.follow(this);
    let left = this.game.width / 3;
    let width = left;
    this.game.camera.deadzone = new Phaser.Rectangle(left, 0, width, this.game.height);
  }

  update() {

    this.body.velocity.x = 0;

    if (this.cursors.left.isDown) {
      this.body.velocity.x = -this.speed;
    } else if (this.cursors.right.isDown) {
      this.body.velocity.x = this.speed;
    }

    if (this.cursors.up.isDown) {
      if (this.body.blocked.down || this.body.touching.down) {
        this.body.velocity.y = -this.jumpForce;
      }
    }

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
