import {Point, Angle, Velocity, Direction, Color} from './utility';

import Phaser = require('phaser');

export class Sprite extends Phaser.Sprite {
  
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

  public hide() {
    this.visible = false;
  }
  
  public show() {
    this.visible = true;
  }
}

class Platformer extends Sprite {

  public speed: number;

  private animated: boolean; // Cannot be changed during game
  private defaultAnimated: boolean = false;

  constructor(public game: Phaser.Game, public x: number = 0, public y: number = 0,
              public key: string = '', public frame: number | string = '', opts: any = {}) {
    super(game, x, y, key, frame);

    this.animated = opts.hasOwnProperty('animated') ? opts.animated : this.defaultAnimated;

    // Create animations
    if (this.animated) {
      this.animations.add('moveRight', [8, 9, 10, 11], 10, true);
      this.animations.add('moveLeft', [4, 5, 6, 7], 10, true);
    }
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

export class Hero extends Platformer {

  private cursors: Phaser.CursorKeys;
  private weapon: Weapon = null;
  
  // Event notification
  public isHit: boolean = false; // Hit notification
  public fell: boolean = false // Fall notification
  public touchEnemy: boolean = false; // Touch enemy notification
  
  // Initial properties
  private initX: number;
  private initY: number;
  private initFrame: number | string;
  private initJumpForce: number;
  private initGravity: number;
  private initSpeed: number;

  // Default properties
  private defaultCanFall: boolean = true;
  private defaultSpeed: number = 200;
  private defaultGravity = 500;
  private defaultJumpForce = 250;

  // Physics properties
  public canFall: boolean;
  public speed: number; // Useless as inherited, redeclared for doc purpose only
  public gravity: number;
  public jumpForce: number;

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
    this.initX = x;
    this.initY = y;
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

  public restart() {
    this.x = this.initX;
    this.y = this.initY;
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

  public equipWeapon(weapon: Weapon) {
    this.weapon = weapon;
    this.weapon.trackSprite(this);
    this.weapon.fireAngle = Phaser.ANGLE_RIGHT - 25;
    this.weapon.bulletGravity.y = this.gravity;
  }

  public fire() {
    if (this.weapon) {
      this.weapon.fire();
    }
  }

  public unequipWeapon() {
    this.weapon.trackedSprite = null;
    this.weapon = null;
  }
}

export class Platform extends Sprite {

  constructor(public game: Phaser.Game, public x: number = 0, public y: number = 0,
              public key: string = '', public frame: number | string = '', opts: any = {}) {
    super(game, x, y, key, frame);

    // Enable platform physics
    this.game.physics.arcade.enable(this);
  
    // Set immovable 
    this.body.immovable = true;
  }
}

export class Decor extends Sprite {

  constructor(public game: Phaser.Game, public x: number = 0, public y: number = 0,
              public key: string = '', public frame: number | string = '', opts: any = {}) {
    super(game, x, y, key, frame);
  }
}

export class Enemy extends Platformer {

  private directionRight: boolean = true; // true <-> right; false <-> left
  
  // Hit notification
  public isHit: boolean = false;
  
  // Default properties
  private defaultCanFall: boolean = true;
  private defaultSpeed: number = 150;
  private defaultGravity = 500;
  private defaultMove: boolean = true;

  // Physics properties
  public canFall: boolean;
  public speed: number; // Useless as inherited, redeclared for doc purpose only
  public gravity: number;
  public move: boolean;

  constructor(public game: Phaser.Game, public x: number = 0, public y: number = 0,
              public key: string = '', public frame: number | string = '', opts: any = {}) {
    super(game, x, y, key, frame, opts);

    // Enable enemy physics
    this.game.physics.arcade.enable(this);

    // Set enemy properties
    this.canFall = opts.hasOwnProperty('canFall') ? opts.canFall : this.defaultCanFall;
    this.speed = opts.hasOwnProperty('speed') ? opts.speed : this.defaultSpeed;
    this.gravity = opts.hasOwnProperty('gravity') ? opts.gravity : this.defaultGravity;
    this.move = opts.hasOwnProperty('move') ? opts.move : this.defaultMove;

    // Enable collision with world bounds
    this.body.collideWorldBounds = !this.canFall;
    // todo enable collision without left/right in any case

    // Set enemy gravity
    this.body.gravity.y = this.gravity;
  }

  update() {
    // Reset the hit notification
    this.isHit = false;

    // Apply properties in case they changed
    this.body.collideWorldBounds = !this.canFall;
    this.body.gravity.y = this.gravity; 

    if (!this.move) {
      this.body.velocity.x = 0;
    }

    // Set collision with platforms
    let children = this.game.world.children;
    for (let i = 0; i < children.length; i++) {
      let child = children[i];
      if (child instanceof Platform) {
        this.game.physics.arcade.collide(this, child, (enemy, platform) => {
          // Initiate enemy motion when on a platform
          if (this.body.velocity.x == 0 && this.move) {
            this.body.velocity.x = this.speed;
          }

          // Enemy AI
          if (enemy.body.velocity.x > 0 && enemy.x + enemy.width / 2 > platform.x + platform.width / 2
              || enemy.body.velocity.x < 0 && enemy.x - enemy.width / 2 < platform.x - platform.width / 2) {
            this.directionRight = !this.directionRight;
          }
          if (this.move) {
            this.body.velocity.x = this.directionRight ? this.speed : -this.speed;
          }
        });
      }
    }

    // Call inherited update method so touching check happens after collide
    super.update();
  }
}

export class Spaceship extends Sprite {

  private cursors: Phaser.CursorKeys;
  private fireButton: Phaser.Key;
  private weapons: Array<Weapon> = [];

  private initScale: number = 1;

  // Hit notification
  public isHit: boolean = false;

  // Default properties
  private defaultSpeed: number = 250;

  // Physics properties
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

export class Weapon extends Phaser.Weapon {

  // private previousAmmoQuantity: number;

  // Default properties
  private defaultAmmoQuantity: number = -1;
  private defaultFireAngle: number = Phaser.ANGLE_UP;
  private defaultFireRate: number = 200;
  private defaultBulletSpeed: number = 300;

  // Physics properties
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
    this.ammoQuantity = opts.hasOwnProperty('ammoQuantity') ? opts.ammoQuantity : this.defaultAmmoQuantity;
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
          console.log('bullet killed by overlap');
          
          // Notify the target it is hit by a bullet
          target.isHit = true;
        });
      }
    }

    // Check for ammoQuantity change
    // if (this.previousAmmoQuantity != this.ammoQuantity) {
    //   this.previousAmmoQuantity = this.ammoQuantity;
    //   this.bullets.forEachDead((bullet) => bullet.destroy(), this);
    //   this.createBullets(this.ammoQuantity - this.bullets.countLiving(), this.bulletKey);
    // }
  }
}

export class TextImage extends Phaser.Text {

  constructor(public game: Phaser.Game, public x: number = 0, public y: number = 0,
              public text: string, public color: string, public fontSize: number) {
    super(game, x, y, text, {fill: color, fontSize: fontSize});
  }

  update() {
    this.setStyle({ fill: this.color, fontSize: this.fontSize });
  }
}

export class Obj extends Sprite {
  constructor(public game: Phaser.Game, public x: number = 0, public y: number = 0,
            public key: string = '', public frame: number | string = '', opts: any = {}) {
    super(game, x, y, key, frame, opts); 
  }
}
