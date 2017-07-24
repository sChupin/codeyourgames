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

  public spaceship: Phaser.Sprite;
  public weapon: Phaser.Weapon;
  private scrollingSpeed: number = 2;

  private aKey: Phaser.Key;

  preload() {
    this.load.crossOrigin = 'anonymous';
    this.load.image('background', 'http://localhost:9000/public/images/Backgrounds/space19.png');
    this.load.image('spaceship', 'http://localhost:9000/public/images/Tiles/tochLit.png');
    this.load.image('bullet', 'http://localhost:9000/public/images/Items/fireball.png');
  }

  create() {

    this.background = this.add.tileSprite(0, 0, this.game.width, this.game.height, 'background');
    this.background.autoScroll(0, 50);

    this.spaceship = this.add.existing(new Spaceship(this.game, this.game.world.centerX, this.game.world.height - 50, 'spaceship'));

    this.aKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);

  }

  update() {
    // this.background.tilePosition.y += this.scrollingSpeed;

    if (this.aKey.isDown) {
      this.background.autoScroll(0, 500);
    } else {
      this.background.autoScroll(0, 100);
    }

    // if (this.cursors.up.isDown) {
    //   this.scrollingSpeed = 5;
    // } else {
    //   this.scrollingSpeed = 2;
    // }
  }

}

class Spaceship extends Phaser.Sprite {

  private cursors: Phaser.CursorKeys;
  private fireButton: Phaser.Key;
  private weapon: Phaser.Weapon;
  
  // Default properties
  private defaultSpeed: number = 200;
  private defaultAllowRotation: boolean = true;

  // Physics properties
  public speed: number;
  public allowRotation: boolean = true;

  constructor(public game: Phaser.Game, public x: number = 0, public y: number = 0,
              public key: string = '', public frame: number | string = '', opts: any = {}) {
    super(game, x, y, key, frame);

    this.weapon = this.game.add.weapon(30, 'bullet');
    this.weapon.bullets.setAll('width', 50);
    this.weapon.bullets.setAll('height', 50);
    this.weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
    this.weapon.bulletAngleOffset = 90;
    this.weapon.bulletSpeed = 400;
    this.weapon.fireRate = 60;
    this.weapon.trackSprite(this, 0, 0);
    
    // Enable spaceship physics
    this.game.physics.arcade.enable(this);

    this.anchor.setTo(0.5);

    // Set hero properties
    this.speed = opts.hasOwnProperty('speed') ? opts.speed : this.defaultSpeed;
    this.allowRotation = opts.hasOwnProperty('allowRotation') ? opts.allowRotation : this.defaultAllowRotation;
    
    // Enable collision with world bounds
    this.body.collideWorldBounds = true;

    // Set motion signals
    this.cursors = this.game.input.keyboard.createCursorKeys();

    this.fireButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    this.body.drag.x = 100;
    this.body.maxVelocity = 150;
  }

  update() {
    this.body.acceleration.x = 0;
    this.body.angularVelocity = 0;
    
    this.weapon.fireAngle = this.angle - 90;

    if (this.cursors.right.isDown) {
      this.body.acceleration.x = 150;
      if (this.angle < 25) {
        this.body.angularVelocity = 50;
      }
    } else if (this.cursors.left.isDown) {
      this.body.acceleration.x = -150;
      if (this.angle > -25) {
        this.body.angularVelocity = -50;
      }
    } else if (this.angle != 0) {
      if (this.angle < -3) {
        this.body.angularVelocity = 50;
      } else if (this.angle > 3) {
        this.body.angularVelocity = -50;
      } else {
        this.angle = 0;
      }
    }

    if (this.fireButton.isDown) {
      this.weapon.fire();
    }

  }
}
