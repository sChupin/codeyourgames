import {Point, Velocity, Direction, Color} from './utility';

import Phaser = require('phaser');


/**
 * Default sprite. It only has access to methods and properties common to all sprites. No custom behaviors are defined for this sprite.
 * 
 * @class Sprite
 * 
 * @property {number} x Sprite horizontal position
 * @property {number} y Sprite vertical position
 * @property {number} width Sprite width
 * @property {number} height Sprite height
 * @property {number} angle Sprite angle
 */
export class Sprite extends Phaser.Sprite {

  private initX: number;
  private initY: number;
  private initWidth: number;
  private initHeight: number;
  private initAngle: number;

  private firstPreUpdate: boolean = true;

  public showHitBox: boolean = false; // only for hard lvl
  
  constructor(public game: Phaser.Game, public x: number = 0, public y: number = 0,
              public key: string = '', public frame: number | string = '', opts: any = {}) {
    super(game, x, y, key, frame);

    // Center sprite to its position
    this.anchor.setTo(0.5);

    // Set Sprite properties
    if (opts.hasOwnProperty('width')) { this.width = opts.width; }
    if (opts.hasOwnProperty('height')) { this.height = opts.height; }
    if (opts.hasOwnProperty('angle')) { this.angle = opts.angle; }
  }

  preUpdate() {
    super.preUpdate();
    
    // Set initial properties
    if (this.firstPreUpdate) {
      this.initX = this.x;
      this.initY = this.y;
      this.initWidth = this.width;
      this.initHeight = this.height;
      this.initAngle = this.angle;

      this.firstPreUpdate = false;
    }
  }

  protected restart() {
    this.reset(this.initX, this.initY);
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

  moveBehind(sprite: Sprite) {
    while (this.z > sprite.z) {
      this.moveDown();
    }
  }

  moveAhead(sprite: Sprite) {
    while (this.z < sprite.z) {
      this.moveUp();
    }
  }
 
  /**
   * Resize the Sprite hitbox
   * 
   * @param {number} ratioX the ratio between the original hitbox width and the new one (> 1: bigger hitbox, < 1: smaller hitbox)
   * @param {number} ratioY the ratio between the original hitbox height and the new one (> 1: bigger hitbox, < 1: smaller hitbox), set to ratioX if not defined
   * @memberof Sprite
   */
  public resizeHitBox(ratioX: number, ratioY?: number) {
    if (ratioY == undefined || ratioY == null) {
      ratioY = ratioX;
    }
    let hitboxWidth = this.width * ratioX;
    let hitboxHeight = this.height * ratioY;
    let hitboxOffsetX = (this.width - hitboxWidth) / 2;
    let hitboxOffsetY = (this.height - hitboxHeight) / 2;

    this.body.setSize(hitboxWidth, hitboxHeight, hitboxOffsetX, hitboxOffsetY);
  }

  public goLeft(speed: number) {
    if (!this.body) {
      if (this instanceof Decor) {
        throw Error('A decor cannot move');
      }
      throw Error('Cannot move this sprite');
    }

    this.body.velocity.x = -speed;
  }

  public goRight(speed: number) {
    if (!this.body) {
      if (this instanceof Decor) {
        throw Error('A decor cannot move');
      }
      throw Error('Cannot move this sprite');
    }

    this.body.velocity.x = speed;
  }

  public goUp(speed: number) {
    if (!this.body) {
      if (this instanceof Decor) {
        throw Error('A decor cannot move');
      }
      throw Error('Cannot move this sprite');
    }

    this.body.velocity.y = -speed;
  }

  public goDown(speed: number) {
    if (!this.body) {
      if (this instanceof Decor) {
        throw Error('A decor cannot move');
      }
      throw Error('Cannot move this sprite');
    }

    this.body.velocity.y = speed;
  }

  public createAnimation(name: string, costumes: Array<number>, changeRate: number, loop:boolean) {
    this.animations.add(name, costumes, changeRate, loop);
  }

  public playAnimation(name: string) {
    this.animations.play(name);
  }

  update() {
    if (this.showHitBox) {
      if (this.body) {
        this.game.debug.body(this);
      } else {
        // Maybe should enable physics on every sprite?? (even for Decor?)
        throw Error('The current sprite has no hitbox because no physics is applied on it.');
      }
    }
  }
}


/** 
 * @class Platformer
 * @extends {Sprite}
 * @private
 */
class Platformer extends Sprite {

  public speed: number;

  private animated: boolean; // Cannot be changed during game
  private defaultAnimated: boolean = false;

  constructor(public game: Phaser.Game, public x: number = 0, public y: number = 0,
              public key: string = '', public frame: number | string = '', opts: any = {}) {
    super(game, x, y, key, frame);

    this.animated = opts.hasOwnProperty('animated') ? opts.animated : this.defaultAnimated;

    // Create animations
    this.animations.add('moveRight', [8, 9, 10, 11], 10, true);
    this.animations.add('moveLeft', [4, 5, 6, 7], 10, true);
  }

  update() {
    if (this.animated) {
      // Set animations and frame based on motion
      this.animations.currentAnim.speed = this.speedToFrameRate(this.speed);

      if (this.body.velocity.x > 0 && this.speed > 0 || this.body.velocity.x < 0 && this.speed < 0) {
        if (this.body.blocked.down || this.body.touching.down) {
          this.animations.play('moveRight');
        } else {
          this.animations.stop();
          this.frame = 9;
        }
      } else if (this.body.velocity.x < 0 && this.speed > 0 || this.body.velocity.x > 0 && this.speed < 0) {
        if (this.body.blocked.down || this.body.touching.down) {
          this.animations.play('moveLeft');
        } else {
          this.animations.stop();
          this.frame = 5;
        }
      } else {
        this.animations.stop();
        if (this.frame == 0) {
          this.frame = 0;
        } else if (this.frame >= 8) {
          this.frame = 8;
        } else {
          this.frame = 4;
        }
      }
    }

    super.update();
  }

  private speedToFrameRate(speed: number) {
    speed = Math.abs(speed);

    if (speed < 15) {
      return 4;
    }
    if (speed < 50) {
      return 5;
    }
    if (speed < 75) {
      return 6;
    }
    
    return Math.floor(speed/50 + 6);
  }
}

export class Group extends Phaser.Group {
  constructor(public game: Phaser.Game) {
    super(game);
  }
}


/**
 * Main character of a platform game. It is controllable with the keyboard arrows.
 * 
 * @class Hero
 * @extends {Platformer}
 * 
 * @property {boolean} [canFall=true] Allows hero to fall below the bottom border of the game
 * @property {number} [speed=200] Hero movement speed
 * @property {number} [gravity=500] Gravity applied to the hero
 * @property {number} [jumpForce=250] Hero jump force
 * 
 * @event isHit Indicates whether the hero is hit by a bullet
 * @event fell Indicates whether the hero has fallen below the bottom border of the game
 * @event touchEnemy Indicates whether the hero is touching an Enemy
 */
export class Hero extends Platformer {

  private cursors: Phaser.CursorKeys;
  private weapon: Weapon = null;
  
  // Initial properties
  private initFrame: number | string;
  private initJumpForce: number;
  private initGravity: number;
  private initSpeed: number;

  // Default properties
  private defaultCanFall: boolean = true;
  private defaultSpeed: number = 200;
  private defaultGravity = 500;
  private defaultJumpForce = 250;

  // Properties
  public canFall: boolean;
  public speed: number; // Useless as inherited, redeclared for doc purpose only
  public gravity: number;
  public jumpForce: number;

  // Event notification
  public isHit: boolean = false; // Hit notification
  public fell: boolean = false // Fall notification
  public touchEnemy: boolean = false; // Touch enemy notification

  constructor(public game: Phaser.Game, public x: number = 0, public y: number = 0,
              public key: string = '', public frame: number | string = '', opts: any = {}) {
    super(game, x, y, key, frame, opts);

    // Enable hero physics
    this.game.physics.arcade.enable(this);

    // Set hero properties
    this.canFall = opts.hasOwnProperty('canFall') ? opts.canFall : this.defaultCanFall;
    this.speed = opts.hasOwnProperty('speed') ? opts.speed : this.defaultSpeed;
    this.gravity = opts.hasOwnProperty('gravity') ? opts.gravity : this.defaultGravity;
    this.jumpForce = opts.hasOwnProperty('jumpForce') ? opts.jumpForce : this.defaultJumpForce;

    // Set initial properties
    this.initFrame = frame;
    this.initJumpForce = this.jumpForce;
    this.initGravity = this.gravity;
    this.initSpeed = this.speed;
    
    // Enable collision with world bounds
    this.body.collideWorldBounds = !this.canFall;
    // todo enable collision without left/right in any case

    // Set hero gravity
    this.body.gravity.y = this.gravity;

    // Create cursors
    this.cursors = this.game.input.keyboard.createCursorKeys();

    // Set up camera
    this.game.camera.follow(this);
    let left = this.game.width / 3;
    let width = left;
    this.game.camera.deadzone = new Phaser.Rectangle(left, 0, width, this.game.height);
  }

  update() {
    // Reset event notifications
    this.isHit = false;
    this.fell = false;
    this.touchEnemy = false;

    // Apply properties in case they changed
    this.body.collideWorldBounds = !this.canFall;
    this.body.gravity.y = this.gravity;

    // Set collision with platforms
    let children = this.game.world.children;
    for (let i = 0; i < children.length; i++) {
      let child = children[i];
      if (child instanceof Platform) {
        this.game.physics.arcade.collide(this, child);
      }
      // Notify when touch enemy
      if (child instanceof Enemy) {
        this.game.physics.arcade.overlap(this, child, () => this.touchEnemy = true);
      }
    }

    // Set motion
    this.body.velocity.x = 0;

    if (this.cursors.left.isDown) {
      this.body.velocity.x = -this.speed;
      if (this.weapon) {
        this.weapon.fireAngle = Phaser.ANGLE_LEFT + 25;
      }
    } else if (this.cursors.right.isDown) {
      this.body.velocity.x = this.speed;
      if (this.weapon) {
        this.weapon.fireAngle = Phaser.ANGLE_RIGHT - 25;
      }
    }

    if (this.cursors.up.isDown) {
      if (this.body.blocked.down || this.body.touching.down) {
        this.body.velocity.y = -this.jumpForce;
      }
    }

    // Notify if hero falls
    if (this.y - this.height/2 > this.game.world.height) {
      this.fell = true;
    }

    // Call inherited update method so touching check happens after collide
    super.update();
  }

  /**
   * Reset the hero properties to its initial values: position, width, height, angle, costume, jumpForce, gravity and speed
   * 
   * @method restart
   * @return {void}
   * @memberof Hero
   */
  public restart(): void {
    super.restart();
    this.frame = this.initFrame;
    this.jumpForce = this.initJumpForce;
    this.gravity = this.initGravity;
    this.speed = this.initSpeed;
  }

  public getSick() {
    if (this.speed > 0) {
      this.speed = -this.speed;
    }
    if (this.tint == 0xFFFFFF) {
      this.tint = 0xB5F3A2;      
    }
  }

  public getCured() {
    if (this.speed < 0) {
      this.speed = -this.speed;
    }
    if (this.tint != 0xFFFFFF) {
      this.tint = 0xFFFFFF;      
    }
  }

  /**
   * Equip an existing weapon. Note: use fire() to use the equipped weapon
   * 
   * @method equipWeapon
   * @param {Weapon} weapon The weapon to equip
   * @return {void}
   * @memberof Hero
   */
  public equipWeapon(weapon: Weapon): void {
    this.weapon = weapon;
    this.weapon.trackSprite(this);
    this.weapon.fireAngle = Phaser.ANGLE_RIGHT - 25;
    this.weapon.bulletGravity.y = this.gravity;
  }

  /**
   * Use the weapon equipped by the hero if any
   * 
   * @method fire
   * @return {void}
   * @memberof Hero
   */
  public fire(): void {
    if (this.weapon) {
      this.weapon.fire();
    }
  }

  /**
   * Unequip the equipped weapon if any
   * 
   * @method unequipWeapon
   * @return {void}
   * @memberof Hero
   */
  public unequipWeapon() {
    this.weapon.trackedSprite = null;
    this.weapon = null;
  }
}


/**
 * Platform on which hero and enemies can stand
 * 
 * @class Platform
 * @extends {Sprite}
 * 
 * @property {boolean} [bottomBlocking=true] If false, a hero can jump on the platform from below
 */
export class Platform extends Sprite {

  // Default properties
  private defaultBottomBlocking: boolean = true;

  // Properties
  public bottomBlocking: boolean;

  constructor(public game: Phaser.Game, public x: number = 0, public y: number = 0,
              public key: string = '', public frame: number | string = '', opts: any = {}) {
    super(game, x, y, key, frame);

    // Set platform properties
    this.bottomBlocking = opts.hasOwnProperty('bottomBlocking') ? opts.bottomBlocking : this.defaultBottomBlocking;

    // Enable platform physics
    this.game.physics.arcade.enable(this);
  
    // Set immovable 
    this.body.immovable = true;
  }
  
  update() {
    this.body.checkCollision.down = this.bottomBlocking;

    super.update();
  }
}


/**
 * An image that won't interact with other sprites. It is automatically set in the background.
 * 
 * @class Decor
 * @extends {Sprite}
 */
export class Decor extends Sprite {

  constructor(public game: Phaser.Game, public x: number = 0, public y: number = 0,
              public key: string = '', public frame: number | string = '', opts: any = {}) {
    super(game, x, y, key, frame);
  }
}


/**
 * Platform ennemy that automatically walks on platforms
 * 
 * @class Enemy
 * @extends {Platformer}
 * 
 * @property {number} [speed=200] Enemy movement speed
 * @property {boolean} [autoMove=true] Enable automatic motion of the enemy
 * 
 * @event isHit Indicates whether the enemy is hit by a bullet
 */
export class Enemy extends Platformer {

  private directionRight: boolean = true; // true <-> right; false <-> left
  
  // Hit notification
  public isHit: boolean = false;
  
  // Default properties
  private defaultSpeed: number = 150;
  private defaultAutoMove: boolean = true;

  // Properties
  public speed: number; // Useless as inherited, redeclared for doc purpose only
  public autoMove: boolean;

  constructor(public game: Phaser.Game, public x: number = 0, public y: number = 0,
              public key: string = '', public frame: number | string = '', opts: any = {}) {
    super(game, x, y, key, frame, opts);

    // Enable enemy physics
    this.game.physics.arcade.enable(this);

    // Set enemy properties
    this.speed = opts.hasOwnProperty('speed') ? opts.speed : this.defaultSpeed;
    this.autoMove = opts.hasOwnProperty('autoMove') ? opts.autoMove : this.defaultAutoMove;

    // Enable collision with world bounds
    this.body.collideWorldBounds = true;
    // todo enable collision without left/right in any case

    // Set enemy gravity
    this.body.gravity.y = 500;
  }

  update() {
    // Reset the hit notification
    this.isHit = false;

    if (!this.autoMove) {
      this.body.velocity.x = 0;
    }

    // Set collision with platforms
    let children = this.game.world.children;
    for (let i = 0; i < children.length; i++) {
      let child = children[i];
      if (child instanceof Platform) {
        this.game.physics.arcade.collide(this, child, (enemy, platform) => {
          // Initiate enemy motion when on a platform
          if (this.body.velocity.x == 0 && this.autoMove) {
            this.body.velocity.x = this.speed;
          }

          // Enemy AI
          if (enemy.body.velocity.x > 0 && enemy.x + enemy.width / 2 > platform.x + platform.width / 2
              || enemy.body.velocity.x < 0 && enemy.x - enemy.width / 2 < platform.x - platform.width / 2) {
            this.directionRight = !this.directionRight;
          }
          if (this.autoMove) {
            this.body.velocity.x = this.directionRight ? this.speed : -this.speed;
          }
        });
      }
    }

    // Call inherited update method so touching check happens after collide
    super.update();
  }
}


/**
 * Main character of a space game. It is controllable with the keyboard arrows
 * 
 * @class Spaceship
 * @extends {Sprite}
 * 
 * @property {number} [speed=250] Spaceship movement speed
 * 
 * @event isHit Indicates whether the spaceship is hit by a bullet
 */
export class Spaceship extends Sprite {

  private cursors: Phaser.CursorKeys;
  private fireButton: Phaser.Key;
  private weapons: Array<Weapon> = [];

  private initScale: number = 1;

  // Hit notification
  public isHit: boolean = false;

  // Default properties
  private defaultSpeed: number = 250;

  // Properties
  public speed: number;

  constructor(public game: Phaser.Game, public x: number = 0, public y: number = 0,
              public key: string = '', public frame: number | string = '', opts: any = {}) {
    super(game, x, y, key, frame, opts);

    // Enable spaceship physics
    this.game.physics.arcade.enable(this);

    // Set enemy properties
    this.speed = opts.hasOwnProperty('speed') ? opts.speed : this.defaultSpeed;

    // Enable collision with world bounds
    this.body.collideWorldBounds = true;

    // Set controllers
    this.cursors = this.game.input.keyboard.createCursorKeys();

    this.fireButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  }

  update() {
    // Reset the hit notification
    this.isHit = false;

    // hack to fix scale/bank problem (but still not perfect if sprite is resized when moving)
    if (this.body.velocity.x == 0) {
      this.initScale = this.scale.x;
    }
    this.body.maxVelocity.x = this.speed;
    this.body.drag.x = this.speed;
    this.body.acceleration.x = 0;
    
    // Squish and rotate ship for illusion of "banking"
    let bank = this.body.velocity.x / this.speed;
    this.scale.x = (1 - Math.abs(bank) / 4) * this.initScale;
    this.angle = bank * 10;

    if (this.cursors.right.isDown) {
      this.body.acceleration.x = this.speed * 1.5;
    } else if (this.cursors.left.isDown) {
      this.body.acceleration.x = -this.speed * 1.5;
    }

    if (this.fireButton.isDown && this.weapons.length != 0) {
      this.weapons.forEach((weapon) => weapon.fire());
    }

    super.update();
  }

  public equipWeapon(weapon: Weapon) {
    this.weapons.push(weapon);
    weapon.trackSprite(this);
  }

  public unequipWeapon(weapon: Weapon) {
    let idx = this.weapons.indexOf(weapon);
    if (idx != -1) {
      this.weapons[idx].trackedSprite = null;
      this.weapons.splice(idx, 1);
    }
  }

  public unequipAllWeapons() {
    this.weapons.forEach((weapon) => weapon.trackedSprite = null);
    this.weapons = [];
  }
}


/**
 * Represents the bullet this weapon can shoot. A weapon cannot be directly add to the game but can be equipped by some types of sprite.
 * 
 * @class Weapon
 * 
 * @property {number} width Bullets width
 * @property {number} height Bullets height
 * @property {number} [angle=0]  Bullets image orientation
 * @property {number} [fireAngle=Angle.UP] Direction toward which the bullets are fired. It will be updated automatically if equipped by a Hero.
 * @property {number} [fireRate=200] Time in ms between two shots when the weapon fires continuously.
 * @property {number} [bulletSpeed=300] Bullets flying speed in px/s
 */
export class Weapon extends Phaser.Weapon {

  // private previousAmmoQuantity: number;

  // Default properties
  private defaultFireAngle: number = Phaser.ANGLE_UP;
  private defaultFireRate: number = 200;
  private defaultBulletSpeed: number = 300;

  // Properties
  public width: number;
  public height: number;
  public angle: number = 0;

  // Prevent reduce hitbox bug
  private initWidth: number;
  private initHeight: number;

  public ammoQuantity: number;

  constructor(public game: Phaser.Game, public key: string = '', public frame: number | string = '', opts: any = {}) {
    super(game, game.plugins);

    // Set weapon properties
    this.ammoQuantity = -1;
    this.fireAngle = opts.hasOwnProperty('fireAngle') ? opts.fireAngle : this.defaultFireAngle;
    this.fireRate = opts.hasOwnProperty('fireRate') ? opts.fireRate : this.defaultFireRate;
    this.bulletSpeed = opts.hasOwnProperty('bulletSpeed') ? opts.bulletSpeed : this.defaultBulletSpeed;
    
    let imgCache = this.game.cache.getImage(key);
    this.initWidth = imgCache.width;
    this.initHeight = imgCache.height;
    this.width = this.initWidth;
    this.height = this.initHeight;

    // Populate the bullet pool
    this.createBullets(this.ammoQuantity, key);
    this.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
  }

  update() {
    this.bullets.setAll('width', this.width);
    this.bullets.setAll('height', this.height);

    // Prevent arcade hitbox bug
    this.bullets.forEach((bullet) => bullet.body.updateBounds(), this);

    // Reduce bullet hitbox
    this.bullets.forEach((bullet) => {
      bullet.body.setSize(this.initWidth/2, this.initHeight/2, this.initWidth/4, this.initHeight/4);
    }, this);

    this.bulletAngleOffset = this.angle - this.fireAngle;

    // Bullets bounce on collide
    this.bullets.forEach((bullet: Phaser.Bullet) => {
      bullet.body.bounce.y = 1;
    }, this);

    // Collisions and overlaps
    let children = this.game.world.children;
    for (let i = 0; i < children.length; i++) {
      let child = children[i];

      // Set collision with platforms
      if (child instanceof Platform) {
        this.game.physics.arcade.collide(this.bullets, child, (platform, bullet) => {
          // If collision happens on the top of a platform, the bullet bounces
          // It disappear otherwise
          if (bullet.body.touching.up || bullet.body.touching.left || bullet.body.touching.right) {
            bullet.kill();
          }
        });
      }

      if ((child instanceof Hero || child instanceof Spaceship || child instanceof Enemy) && child != this.trackedSprite) {
        this.game.physics.arcade.overlap(this.bullets, child, (target, bullet) => {
          // Kill bullet (can be replace by user logic <todo later>)
          bullet.kill();
          
          // Notify the target it is hit by a bullet
          target.isHit = true;
        });
      }
    }

    super.update();
  }
}


/**
 * Editable text
 * 
 * @class Text
 * 
 * @property {string} text The text to display
 * @property {string} [color=Color.Black] Text color
 * @property {number} [fontSize=32] Text font size
 * @property {boolean} [italic=false] Whether the text is in italic
 * @property {boolean} [bold=true] Whether the text is in bold
 */
export class TextImage extends Phaser.Text {

  // Default properties
  private defaultColor: string = Color.Black;
  private defaultFontSize: number = 32;
  private defaultItalic: boolean = false;
  private defaultBold: boolean = true;

  // Properties
  public color: string;
  public italic: boolean;
  public bold: boolean;

  constructor(public game: Phaser.Game, public x: number = 0, public y: number = 0,
              public text: string, opts: any = {}) {
    super(game, x, y, text, opts);

    // Set text properties
    this.color = opts.hasOwnProperty('color') ? opts.color : this.defaultColor;
    this.fontSize = opts.hasOwnProperty('fontSize') ? opts.fontSize : this.defaultFontSize;
    this.italic = opts.hasOwnProperty('italic') ? opts.italic : this.defaultItalic;
    this.bold = opts.hasOwnProperty('bold') ? opts.bold : this.defaultBold;
  }

  update() {
    this.addColor(this.color, 0);
    this.fontStyle = this.italic ? 'italic' : 'normal';
    this.fontWeight = this.bold ? 'bold' : 'normal';

    super.update();
  }
}


/**
 * An object can interact with all type of sprite.
 * 
 * @class Object
 * @extends {Sprite}
 * 
 * @event collected Indicates whether an object has been collected. Once an object is collected, it disappears and cannot be uncollected.
 */
export class Obj extends Sprite {

  public collected: boolean = false;

  constructor(public game: Phaser.Game, public x: number = 0, public y: number = 0,
            public key: string = '', public frame: number | string = '', opts: any = {}) {
    super(game, x, y, key, frame, opts);

    // Enable enemy physics
    this.game.physics.arcade.enable(this);
  }

  update() {
    // Set collision with platforms
    let children = this.game.world.children;
    for (let i = 0; i < children.length; i++) {
      let child = children[i];
      if (child instanceof Hero || child instanceof Spaceship) {
        this.game.physics.arcade.overlap(this, child, () => {
          this.collected = true
          this.destroy();
        });
      }
    }
  }
}


/**
 * Flappy bird-like sprite. You can fly with the spacebar and check when it crashes into a platform.
 * 
 * @class FlappyBird
 * @extends {Sprite}
 * 
 * @property {number} [gravity=500] Gravity applied to the flappy bird
 * @property {number} [flyForce=250] The vertical speed the bird takes when it flaps its wings
 * 
 * @event crashed Indicates wheter the bird crashed into a platform
 */
export class FlappyBird extends Sprite {

  private flyKey: Phaser.Key;

  // Default properties
  private defaultGravity: number = 500;
  private defaultFlyForce: number = 250;
  private defaultFlySpeed: number = 200;

  // Properties
  public gravity: number;
  public flyForce: number;
  public flySpeed: number

  // Event notification
  public crashed: boolean = false;

  constructor(public game: Phaser.Game, public x: number = 0, public y: number = 0,
            public key: string = '', public frame: number | string = '', opts: any = {}) {
    super(game, x, y, key, frame, opts);

    // Enable enemy physics
    this.game.physics.arcade.enable(this);

    // Set properties
    this.gravity = opts.hasOwnProperty('gravity') ? opts.gravity : this.defaultGravity;
    this.flyForce = opts.hasOwnProperty('flyForce') ? opts.flyForce : this.defaultFlyForce;

    // Set fly key
    this.flyKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.flyKey.onDown.add(() => this.body.velocity.y = -this.flyForce);
  }

  update() {
    // Reset event notifications
    this.crashed = false;
    
    // Apply properties in case they changed
    this.body.gravity.y = this.gravity;
    this.body.velocity.x = this.flySpeed;

    // Set collision with platforms
    let children = this.game.world.children;
    for (let i = 0; i < children.length; i++) {
      let child = children[i];
      if (child instanceof Platform) {
        this.game.physics.arcade.collide(this, child, () => this.crashed = true);
      }
    }

    super.update();
  }
}
