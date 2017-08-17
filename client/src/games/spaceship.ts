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

  public spaceship: Spaceship;
  public spaceEnemy: SpaceEnemy;
  public weapon: Phaser.Weapon;
  private scrollingSpeed: number = 2;

  private aKey: Phaser.Key;

  preload() {
    this.load.crossOrigin = 'anonymous';
    this.load.image('background', 'http://localhost:9000/public/images/Backgrounds/space19.png');
    this.load.image('spaceship', '/assets/media/phaser_img/player.png');
    this.load.image('bullet', '/assets/media/phaser_img/bullet.png');
    this.load.image('space_enemy', 'http://localhost:9000/public/images/Sprites/astromechdroid2.png');
  }

  create() {

    this.background = this.add.tileSprite(0, 0, this.game.width, this.game.height, 'background');
    this.background.autoScroll(0, 50);

    this.spaceship = this.add.existing(new Spaceship(this.game, this.game.world.centerX, this.game.world.height - 50, 'spaceship'));

    this.spaceEnemy = this.add.existing(new SpaceEnemy(this.game, this.game.world.centerX, 50, 'space_enemy'));

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

export class Sprite extends Phaser.Sprite {

  private initX: number;
  private initY: number;
  private initWidth: number;
  private initHeight: number;
  private initAngle: number;
  
  constructor(public game: Phaser.Game, public x: number = 0, public y: number = 0,
              public key: string = '', public frame: number | string = '', opts: any = {}) {
    super(game, x, y, key, frame);

    // Center sprite to its position
    this.anchor.setTo(0.5);

    // Set Sprite properties
    if (opts.hasOwnProperty('width')) { this.width = opts.width; }
    if (opts.hasOwnProperty('height')) { this.height = opts.height; }
    if (opts.hasOwnProperty('angle')) { this.angle = opts.angle; }

    // Set initial properties
    this.initX = x;
    this.initY = y;
    this.initWidth = this.width;
    this.initHeight = this.height;
    this.initAngle = this.angle;
  }

  protected restart() {
    this.x = this.initX;
    this.y = this.initY;
    this.width = this.initWidth;
    this.height = this.initHeight;
    this.angle = this.initAngle;
  }

  public changeCostume(costumeNo: number) {
    this.frame = costumeNo;
  }

  public scaleBy(scale: number) {
    this.scale.setTo(this.scale.x * scale, this.scale.y * scale);
  }

  public scaleTo(scale: number) {
    this.scale.setTo(scale);
  }

  public resetScale() {
    this.scale.setTo(1);
  }


  /**
   * Set the sprite invisible
   * 
   * @method hide
   * @return {void}
   * @memberof Sprite
   */
  public hide() {
    this.visible = false;
  }


  /**
   * Set the sprite visible
   * 
   * @method show
   * @return {void}
   * @memberof Sprite
   */
  public show() {
    this.visible = true;
  }

  /**
   * Move the sprite one layer up
   * 
   * @method moveUp
   * @return {void}
   * @memberof Sprite
   */
  // Implemented by Phaser.Sprite

  /**
   * Move the sprite one layer down
   * 
   * @method moveDown
   * @return {void}
   * @memberof Sprite
   */
  // Implemented by Phaser.Sprite

  /**
   * Send the sprite to the lowest layer
   * 
   * @method sendToBack
   * @return {void}
   * @memberof Sprite
   */
  // public sendToBack() {
  //   super.sendToBack();
  //   // if background
  //   this.moveUp();
  // }

  /**
   * Bring the sprite to the highest layer
   * 
   * @method bringToTop
   * @return {void}
   * @memberof Sprite
   */
  // Implemented by Phaser.Sprite
}

class SpaceEnemy extends Sprite {
    constructor(public game: Phaser.Game, public x: number = 0, public y: number = 0,
              public key: string = '', public frame: number | string = '', opts: any = {}) {
      super(game, x, y, key, frame);
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
    this.weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
    this.weapon.bulletAngleOffset = 90;
    this.weapon.bulletSpeed = 400;
    this.weapon.fireRate = 120;
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
