import {Point, Angle, Velocity, Direction} from './utility';

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
      this.animations.currentAnim.speed = speedToFrameRate(this.speed);

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
}

// export class Body extends Sprite {
  //   private phaserBody: Phaser.Physics.Arcade.Body = null;

  //   public touchMouse: boolean = false;
  //   // onDown for the moment
  //   // maybe better on release?
  //   public clicked: boolean = false;

  //   private startClicked: boolean = false;

  //   constructor(phaserSprite: Phaser.Sprite) {
  //     super(phaserSprite);
  //     phaserSprite.game.physics.arcade.enable(phaserSprite);
  //     this.phaserBody = phaserSprite.body;

  //     // Set touched/clicked properties on sprite touched/clicked
  //     phaserSprite.inputEnabled = true;
  //     phaserSprite.events.onInputOver.add(() => this.touchMouse = true);
  //     phaserSprite.events.onInputOut.add(() => {this.touchMouse = false; this.clicked = false;});
  //     phaserSprite.events.onInputDown.add(() => this.clicked = true);
  //     phaserSprite.events.onInputUp.add(() => this.clicked = false);
  //   }

  //   /*
  //    **********
  //    * Motion *
  //    **********
  //    */

  //    public disableControls() {
  //      // todo: usefull for tetris in order to stop control of a piece
  //    }

  //    public enableMarioMode() {
  //      let jumpSpeed = 200;
  //      let gravity = 500;
  //      let runSpeed = 150;

  //      this.phaserBody.gravity.y = gravity;

  //      let keyboard = this.phaserSprite.game.input.keyboard;
      
  //      let jumpKey1: Phaser.Key = keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  //      let jumpKey2: Phaser.Key = keyboard.addKey(Phaser.Keyboard.UP);
  //      let rightKey: Phaser.Key = keyboard.addKey(Phaser.Keyboard.RIGHT);
  //      let leftKey: Phaser.Key = keyboard.addKey(Phaser.Keyboard.LEFT);

  //      jumpKey1.onDown.add(() => {
  //        if (this.phaserBody.touching.down || this.phaserBody.blocked.down) {
  //          this.phaserBody.velocity.y = -jumpSpeed;
  //        }
  //      });

  //      jumpKey2.onDown.add(() => {
  //        this.phaserBody.velocity.y = -jumpSpeed;
  //      });

  //      rightKey.onDown.add(() => {
  //        this.phaserBody.velocity.x = runSpeed;
  //      });
  //      rightKey.onUp.add(() => {
  //        if (!leftKey.isDown) {
  //          this.phaserBody.velocity.x = 0;
  //        } else {
  //          this.phaserBody.velocity.x = -runSpeed;
  //        } 
  //      });

  //      leftKey.onDown.add(() => {
  //        this.phaserBody.velocity.x = -runSpeed;
  //      });
  //      leftKey.onUp.add(() => {
  //        if (!rightKey.isDown) {
  //          this.phaserBody.velocity.x = 0;
  //        } else {
  //          this.phaserBody.velocity.x = runSpeed;
  //        } 
  //      });
  //    }

  //    public enableControls(speed: number = 150, animations: boolean = true, mode: string = 'oblique', keys: string = 'arrows') {
  //      let keyboard = this.phaserSprite.game.input.keyboard;
      
  //      let upKey: Phaser.Key, downKey: Phaser.Key, leftKey: Phaser.Key, rightKey: Phaser.Key;

  //      if (keys == 'arrows') {
  //       upKey = keyboard.addKey(Phaser.Keyboard.UP);
  //       downKey = keyboard.addKey(Phaser.Keyboard.DOWN);
  //       leftKey = keyboard.addKey(Phaser.Keyboard.LEFT);
  //       rightKey = keyboard.addKey(Phaser.Keyboard.RIGHT);
  //      } else if (keys == 'zqsd') {
  //       upKey = keyboard.addKey(Phaser.Keyboard.Z);
  //       downKey = keyboard.addKey(Phaser.Keyboard.S);
  //       leftKey = keyboard.addKey(Phaser.Keyboard.Q);
  //       rightKey = keyboard.addKey(Phaser.Keyboard.D);
  //      }

  //      upKey.onDown.add(() => {
  //        this.phaserBody.velocity.y = -speed;
  //      });
  //      upKey.onUp.add(() => {
  //        if (!downKey.isDown) {
  //          this.phaserBody.velocity.y = 0;
  //       } else {
  //         this.phaserBody.velocity.y = speed;
  //       }
  //      });
      
  //      downKey.onDown.add(() => {
  //        this.phaserBody.velocity.y = speed;
  //      });
  //      downKey.onUp.add(() => {
  //        if (!upKey.isDown) {
  //          this.phaserBody.velocity.y = 0;
  //       } else {
  //         this.phaserBody.velocity.y = -speed;
  //       }
  //      });

  //      leftKey.onDown.add(() => {
  //        this.phaserBody.velocity.x = -speed;
  //      });
  //      leftKey.onUp.add(() => {
  //        if (!rightKey.isDown) {
  //          this.phaserBody.velocity.x = 0;
  //       } else {
  //         this.phaserBody.velocity.x = speed;
  //       }
  //      });

  //      rightKey.onDown.add(() => {
  //        this.phaserBody.velocity.x = speed;
  //      });
  //      rightKey.onUp.add(() => {
  //        if (!leftKey.isDown) {
  //          this.phaserBody.velocity.x = 0;
  //       } else {
  //         this.phaserBody.velocity.x = -speed;
  //       }
  //      });
  //    }

  //   // Translation
  //   public moveForward(velocity?: number) {
  //     let speed = velocity || this.phaserBody.speed;
      
  //     let ySpeed = speed * Math.sin(this.phaserBody.sprite.angle * Math.PI / 180);
  //     let xSpeed = speed;
  //     if (ySpeed != 0) {
  //       xSpeed = ySpeed / Math.tan(this.phaserBody.sprite.angle * Math.PI / 180);
  //     }

  //     this.phaserBody.velocity.x = xSpeed;
  //     this.phaserBody.velocity.y = ySpeed;
  //   }

  //   public moveForwardBy(steps: number) {
  //     let y = steps * Math.sin(this.phaserBody.sprite.angle * Math.PI / 180);
  //     let x = steps;
  //     if (y != 0) {
  //       x = y /  Math.tan(this.phaserBody.sprite.angle * Math.PI / 180);
  //     }

  //     this.phaserBody.sprite.x += x;
  //     this.phaserBody.sprite.y += y;
  //   }

  //   public moveBackward(velocity: number) {
  //     this.moveForward(-velocity);
  //   }

  //   public moveBackwardBy(steps: number) {
  //     this.moveForwardBy(-steps);
  //   }

  //   public stop() {
  //     this.phaserBody.velocity.setTo(0, 0);
  //   }

  //   public stopX() {
  //     this.phaserBody.velocity.x = 0;
  //   }

  //   public stopY() {
  //     this.phaserBody.velocity.y = 0;
  //   }

  //   public moveUp(velocity?: number) {
  //     let speed = velocity || this.phaserBody.speed;
      
  //     //this.phaserBody.velocity.setTo(0, -speed);
  //     this.phaserBody.velocity.y = -speed;
  //   }

  //   public moveDown(velocity?: number) {
  //     let speed = velocity || this.phaserBody.speed;
      
  //     this.phaserBody.velocity.y = speed;
  //   }

  //   public moveLeft(velocity?: number) {
  //     let speed = velocity || this.phaserBody.speed;

  //     this.phaserBody.velocity.x = -speed;
  //   }

  //   public moveRight(velocity?: number) {
  //     let speed = velocity || this.phaserBody.speed;

  //     this.phaserBody.velocity.x = speed;
  //   }

  //   public moveUpBy(steps: number) {
  //     this.phaserBody.sprite.y -= steps;
  //   }

  //   public moveDownBy(steps: number) {
  //     this.phaserBody.sprite.y += steps;
  //   }

  //   public moveLeftBy(steps: number) {
  //     this.phaserBody.sprite.x -= steps;
  //   }

  //   public moveRightBy(steps: number) {
  //     this.phaserBody.sprite.x += steps;
  //   }

  //   public moveTowardsXY(x: number, y: number, velocity?: number) {
  //     let speed = velocity || this.phaserBody.speed;
      
  //     let deltaX = this.phaserBody.sprite.x - x;
  //     let deltaY = this.phaserBody.sprite.y - y;

  //     let signX = Math.sign(deltaX);
  //     let signY = Math.sign(deltaY);

  //     let alpha = ( Math.atan(deltaY/deltaX) * 180 ) / Math.PI;

  //     if (signX !== -1) {
  //       alpha -= signY * 180;
  //     }

  //     let ySpeed = speed * Math.sin(alpha * Math.PI / 180);
  //     let xSpeed = speed;
  //     if (ySpeed != 0) {
  //       xSpeed = ySpeed / Math.tan(alpha * Math.PI / 180);
  //     }

  //     this.phaserBody.velocity.x = xSpeed;
  //     this.phaserBody.velocity.y = ySpeed;
  //   }

  //   public moveTowards(point: Point, velocity?: number) {
  //     this.moveTowardsXY(point.x, point.y, velocity);
  //   }

  //   // given both direction
  //   public moveBy(x: number, y: number): void {
  //     this.phaserBody.sprite.x += x;
  //     this.phaserBody.sprite.y += y;
  //   }

  //   public moveToXY(x: number, y: number): void {
  //     this.phaserBody.sprite.x = x;
  //     this.phaserBody.sprite.y = y;
  //   }

  //   public moveTo(point: Point): void {
  //     this.moveToXY(point.x, point.y);
  //   }

  //   public slideByXYIn(x: number, y: number, duration: number): void {
  //     //let props = {x: this.phaserBody.sprite.x + x, y: this.phaserBody.sprite.y + y};
  //     //this.phaserBody.game.add.tween(this.phaserBody.sprite).to(props, duration, "Linear", true);
      
  //     let distance = Math.sqrt(x*x + y*y);
  //     let direction = Math.atan(y/x) * 180 / Math.PI;

  //     this.phaserBody.moveTo(duration*1000, distance, direction);
  //   }

  //   public slideByXY(x: number, y: number, velocity?: number): void {
  //     let speed = velocity || this.phaserBody.speed;

  //     let distance = Math.sqrt(x*x + y*y);
  //     let duration = distance / speed;

  //     this.slideByXYIn(x, y, duration);
  //     //this.phaserBody.game.add.tween(this.phaserBody.sprite).to({x: nextX, y: nextY}, duration, "Linear", true);
  //   }

  //   public slideToXYIn(x: number, y: number, duration: number): void {
  //     //this.phaserBody.game.add.tween(this.phaserBody.sprite).to({x: x, y: y}, duration, "Linear", true);
  //     let distanceX = this.phaserBody.sprite.x - x;
  //     let distanceY = this.phaserBody.sprite.y - y;

  //     this.slideByXYIn(distanceX, distanceY, duration);
  //   }

  //   public slideToXY(x: number, y: number, velocity?: number): void {
  //     let speed = velocity || this.phaserBody.speed;
  //     let deltaX = this.phaserBody.sprite.x - x;
  //     let deltaY = this.phaserBody.sprite.y - y;

  //     let distance = Math.sqrt(deltaX*deltaX + deltaY*deltaY);
  //     let duration = distance / speed;

  //     this.slideToXYIn(x, y, duration);
      
  //     //this.phaserBody.game.add.tween(this.phaserBody.sprite).to({x: x, y: y}, duration, "Linear", true);
  //   }

  //   public slideToIn(point: Point, duration: number): void {
  //     this.slideToXYIn(point.x, point.y, duration);    
  //   }

  //   public slideTo(point: Point, velocity?: number): void {
  //     this.slideToXY(point.x, point.y, velocity);
  //   }

  //   // given x direction
  //   public moveXBy(x: number): void {
  //     this.phaserBody.sprite.x += x;
  //   }

  //   public moveXTo(x: number): void {
  //     this.phaserBody.sprite.x = x;
  //   }

  //   public slideXByIn(x: number, duration: number): void {
  //     // let props = {x: this.phaserBody.sprite.x + x};
  //     // this.phaserBody.game.add.tween(this.phaserBody.sprite).to(props, duration, "Linear", true);
  //     this.slideByXYIn(x, 0, duration);
  //   }

  //   public slideXToIn(x: number, duration: number): void {
  //     // this.phaserBody.game.add.tween(this.phaserBody.sprite).to({x: x}, duration, "Linear", true);
  //     this.slideToXYIn(x, 0, duration);
  //   }
    
  //   public slideXBy(x: number, velocity?: number) {
  //     this.slideByXY(x, 0, velocity);
  //   }

  //   public slideXTo(x: number, velocity?: number): void {
  //     this.slideToXY(x, 0, velocity);
  //   }

  //   // given y direction
  //   public moveYBy(y: number): void {
  //     this.phaserBody.sprite.y += y;
  //   }

  //   public moveYTo(y: number): void {
  //     this.phaserBody.sprite.y = y;
  //   }

  //   public slideYByIn(y: number, duration: number): void {
  //     // let props = {y: this.phaserBody.sprite.y + y};
  //     // this.phaserBody.game.add.tween(this.phaserBody.sprite).to(props, duration, "Linear", true);
  //     this.slideByXYIn(0, y, duration);
  //   }

  //   public slideYToIn(y: number, duration: number): void {
  //     // this.phaserBody.game.add.tween(this.phaserBody.sprite).to({y: y}, duration, "Linear", true);
  //     this.slideToXYIn(0, y, duration);
  //   }
    
  //   public slideYBy(y: number, velocity?: number): void {
  //     this.slideByXY(0, y, velocity);
  //   }

  //   public slideYTo(y: number, velocity?: number): void {
  //     this.slideToXY(0, y, velocity);
  //   }

  //   // Rotation
  //   public turnBy(degree: number): void {
  //     this.phaserBody.sprite.angle += degree;
  //   }

  //   public pointIn(degree: number): void {
  //     this.phaserBody.sprite.angle = degree;
  //   }

  //   public pointTowardsXY(x: number, y: number): void {
  //     let deltaX = this.phaserBody.sprite.x - x;
  //     let deltaY = this.phaserBody.sprite.y - y;

  //     let signX = Math.sign(deltaX);
  //     let signY = Math.sign(deltaY);

  //     let alpha = ( Math.atan(deltaY/deltaX) * 180 ) / Math.PI;

  //     if (signX !== -1) {
  //       alpha -= signY * 180;
  //     }

  //     this.phaserBody.sprite.angle = alpha;
  //   }

  //   public pointTowards(point: Point): void {
  //     this.pointTowardsXY(point.x, point.y);
  //   }

  //   // Appearance
  //   public scaleToPercent(scale: number) {
  //     this.phaserSprite.scale.setTo(scale/100);
  //   }

  //   public enlargeBy(scale: number) {
  //     this.phaserSprite.scale.setTo(this.phaserSprite.scale.x + scale/100);
  //   }

  //   public enlarge() {
  //     this.enlargeBy(10);
  //   }

  //   public reduceBy(scale: number) {
  //     this.enlargeBy(-scale);
  //   }

  //   public reduce() {
  //     this.reduceBy(10);
  //   }

  //   public changeColorBy() {
  //     //todo
  //   }

  //   public randomColor() {
  //     this.phaserSprite.tint = Math.random() * 0xFFFFFF
  //   }

  //   public resetColor() {
  //     this.phaserSprite.tint = 0xFFFFFF;
  //   }

  //   public changeCostume(costumeNo) {
  //     this.phaserSprite.frame = costumeNo;
  //   }

  //   // Animations
  //   public addAnimation(name: string, frames?: Array<number>, frameRate: number = 10) {
  //     this.phaserSprite.animations.add(name, frames, frameRate, true);
  //   }

  //   public playAnimation(name: string, frameRate?: number, loop?: boolean) {
  //     this.phaserSprite.animations.play(name);
  //   }

  //   public stopAnimation() {
  //     this.phaserSprite.animations.stop();
  //   }

  //   // would be better in variable rather than in function
  //   // use collision obj instead?
  //   // public isTouched(): boolean {
  //   //   return !this.phaserBody.touching.none;
  //   // }

  //   // public touchBounds(): boolean {
  //   //   let blocked = this.phaserBody.blocked;
  //   //   return blocked.up || blocked.down || blocked.left || blocked.right;
  //   // }

  //   //bug too
  //   // public touchMouse(): boolean {
  //   //   return this.phaserBody.sprite.input.pointerOver();
  //   // }
// }


// export class Group {
  //   constructor(public phaserGroup: Phaser.Group) { }

  //   public add(...sprites) {
  //     sprites.forEach(sprite => {
  //       this.phaserGroup.add(sprite.phaserSprite);
  //     });
  //   }
// }

export class Group extends Phaser.Group {
  constructor(public game: Phaser.Game) {
    super(game);
  }
}


export class Hero extends Platformer {

  private cursors: Phaser.CursorKeys;
  private weapon: Weapon = null;
  
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
    }

    // Set motion
    this.body.velocity.x = 0;

    if (this.cursors.left.isDown) {
      this.body.velocity.x = -this.speed;
      if (this.weapon) {
        this.weapon.fireAngle = Phaser.ANGLE_LEFT;
      }
    } else if (this.cursors.right.isDown) {
      this.body.velocity.x = this.speed;
      if (this.weapon) {
        this.weapon.fireAngle = Phaser.ANGLE_RIGHT;
      }
    }

    if (this.cursors.up.isDown) {
      if (this.body.blocked.down || this.body.touching.down) {
        this.body.velocity.y = -this.jumpForce;
      }
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
    this.weapon.fireAngle = Phaser.ANGLE_RIGHT;
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

function speedToFrameRate(speed: number) {
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
    this.body.maxVelocity.x = this.speed;
    this.body.drag.x = this.speed;
    this.body.acceleration.x = 0;
    
    // Squish and rotate ship for illusion of "banking"
    let bank = this.body.velocity.x / this.speed;
    this.scale.x = 1 - Math.abs(bank) / 4;
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
  // private defaultAmmoQuantity: number = -1; // Induce a bug for resizing all hitbox as the pool dynamically increase and setSize cannot be use after resizing !
  private defaultAmmoQuantity: number = 100;
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

    // Set collision with platforms
    let children = this.game.world.children;
    for (let i = 0; i < children.length; i++) {
      let child = children[i];
      if (child instanceof Platform) {
        this.game.physics.arcade.collide(this.bullets, child);
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

