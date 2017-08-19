import {Point, Velocity, Direction} from './utility';

import Phaser = require('phaser');

export class Sprite {
  public readonly position: Point;

  public readonly orientation: number;

  // todo set phaserSprite private if possible
  constructor(public phaserSprite: Phaser.Sprite) {
    this.position = phaserSprite.position;
  }
}

export class Platform extends Sprite {
  private phaserBody: Phaser.Physics.Arcade.Body = null;

  constructor(phaserSprite: Phaser.Sprite) {
    super(phaserSprite);
    phaserSprite.game.physics.arcade.enable(phaserSprite);
    this.phaserBody = phaserSprite.body;

    // Set immovable and no gravity
    this.phaserBody.allowGravity = false;
    this.phaserBody.immovable = true;
  }
}

export class Body extends Sprite {
  private phaserBody: Phaser.Physics.Arcade.Body = null;

  public touchMouse: boolean = false;
  // onDown for the moment
  // maybe better on release?
  public clicked: boolean = false;

  private startClicked: boolean = false;

  constructor(phaserSprite: Phaser.Sprite) {
    super(phaserSprite);
    phaserSprite.game.physics.arcade.enable(phaserSprite);
    this.phaserBody = phaserSprite.body;

    // Set touched/clicked properties on sprite touched/clicked
    phaserSprite.inputEnabled = true;
    phaserSprite.events.onInputOver.add(() => this.touchMouse = true);
    phaserSprite.events.onInputOut.add(() => {this.touchMouse = false; this.clicked = false;});
    phaserSprite.events.onInputDown.add(() => this.clicked = true);
    phaserSprite.events.onInputUp.add(() => this.clicked = false);
  }

  /*
   **********
   * Motion *
   **********
   */

   public disableControls() {
     // todo: usefull for tetris in order to stop control of a piece
   }

   public enableMarioMode() {
     let jumpSpeed = 200;
     let gravity = 500;
     let runSpeed = 150;

     this.phaserBody.gravity.y = gravity;

     let keyboard = this.phaserSprite.game.input.keyboard;
     
     let jumpKey1: Phaser.Key = keyboard.addKey(Phaser.Keyboard.SPACEBAR);
     let jumpKey2: Phaser.Key = keyboard.addKey(Phaser.Keyboard.UP);
     let rightKey: Phaser.Key = keyboard.addKey(Phaser.Keyboard.RIGHT);
     let leftKey: Phaser.Key = keyboard.addKey(Phaser.Keyboard.LEFT);

     jumpKey1.onDown.add(() => {
       if (this.phaserBody.touching.down || this.phaserBody.blocked.down) {
         this.phaserBody.velocity.y = -jumpSpeed;
       }
     });

     jumpKey2.onDown.add(() => {
       this.phaserBody.velocity.y = -jumpSpeed;
     });

     rightKey.onDown.add(() => {
       this.phaserBody.velocity.x = runSpeed;
     });
     rightKey.onUp.add(() => {
       if (!leftKey.isDown) {
         this.phaserBody.velocity.x = 0;
       } else {
         this.phaserBody.velocity.x = -runSpeed;
       } 
     });

     leftKey.onDown.add(() => {
       this.phaserBody.velocity.x = -runSpeed;
     });
     leftKey.onUp.add(() => {
       if (!rightKey.isDown) {
         this.phaserBody.velocity.x = 0;
       } else {
         this.phaserBody.velocity.x = runSpeed;
       } 
     });
   }

   public enableControls(speed: number = 150, animations: boolean = true, mode: string = 'oblique', keys: string = 'arrows') {
     let keyboard = this.phaserSprite.game.input.keyboard;
     
     let upKey: Phaser.Key, downKey: Phaser.Key, leftKey: Phaser.Key, rightKey: Phaser.Key;

     if (keys == 'arrows') {
      upKey = keyboard.addKey(Phaser.Keyboard.UP);
      downKey = keyboard.addKey(Phaser.Keyboard.DOWN);
      leftKey = keyboard.addKey(Phaser.Keyboard.LEFT);
      rightKey = keyboard.addKey(Phaser.Keyboard.RIGHT);
     } else if (keys == 'zqsd') {
      upKey = keyboard.addKey(Phaser.Keyboard.Z);
      downKey = keyboard.addKey(Phaser.Keyboard.S);
      leftKey = keyboard.addKey(Phaser.Keyboard.Q);
      rightKey = keyboard.addKey(Phaser.Keyboard.D);
     }

     upKey.onDown.add(() => {
       this.phaserBody.velocity.y = -speed;
     });
     upKey.onUp.add(() => {
       if (!downKey.isDown) {
         this.phaserBody.velocity.y = 0;
      } else {
        this.phaserBody.velocity.y = speed;
      }
     });
     
     downKey.onDown.add(() => {
       this.phaserBody.velocity.y = speed;
     });
     downKey.onUp.add(() => {
       if (!upKey.isDown) {
         this.phaserBody.velocity.y = 0;
      } else {
        this.phaserBody.velocity.y = -speed;
      }
     });

     leftKey.onDown.add(() => {
       this.phaserBody.velocity.x = -speed;
     });
     leftKey.onUp.add(() => {
       if (!rightKey.isDown) {
         this.phaserBody.velocity.x = 0;
      } else {
        this.phaserBody.velocity.x = speed;
      }
     });

     rightKey.onDown.add(() => {
       this.phaserBody.velocity.x = speed;
     });
     rightKey.onUp.add(() => {
       if (!leftKey.isDown) {
         this.phaserBody.velocity.x = 0;
      } else {
        this.phaserBody.velocity.x = -speed;
      }
     });
   }

  // Translation
  public moveForward(velocity?: number) {
    let speed = velocity || this.phaserBody.speed;
    
    let ySpeed = speed * Math.sin(this.phaserBody.sprite.angle * Math.PI / 180);
    let xSpeed = speed;
    if (ySpeed != 0) {
      xSpeed = ySpeed / Math.tan(this.phaserBody.sprite.angle * Math.PI / 180);
    }

    this.phaserBody.velocity.x = xSpeed;
    this.phaserBody.velocity.y = ySpeed;
  }

  public moveForwardBy(steps: number) {
    let y = steps * Math.sin(this.phaserBody.sprite.angle * Math.PI / 180);
    let x = steps;
    if (y != 0) {
      x = y /  Math.tan(this.phaserBody.sprite.angle * Math.PI / 180);
    }

    this.phaserBody.sprite.x += x;
    this.phaserBody.sprite.y += y;
  }

  public moveBackward(velocity: number) {
    this.moveForward(-velocity);
  }

  public moveBackwardBy(steps: number) {
    this.moveForwardBy(-steps);
  }

  public stop() {
    this.phaserBody.velocity.setTo(0, 0);
  }

  public stopX() {
    this.phaserBody.velocity.x = 0;
  }

  public stopY() {
    this.phaserBody.velocity.y = 0;
  }

  public moveUp(velocity?: number) {
    let speed = velocity || this.phaserBody.speed;
    
    //this.phaserBody.velocity.setTo(0, -speed);
    this.phaserBody.velocity.y = -speed;
  }

  public moveDown(velocity?: number) {
    let speed = velocity || this.phaserBody.speed;
    
    this.phaserBody.velocity.y = speed;
  }

  public moveLeft(velocity?: number) {
    let speed = velocity || this.phaserBody.speed;

    this.phaserBody.velocity.x = -speed;
  }

  public moveRight(velocity?: number) {
    let speed = velocity || this.phaserBody.speed;

    this.phaserBody.velocity.x = speed;
  }

  public moveUpBy(steps: number) {
    this.phaserBody.sprite.y -= steps;
  }

  public moveDownBy(steps: number) {
    this.phaserBody.sprite.y += steps;
  }

  public moveLeftBy(steps: number) {
    this.phaserBody.sprite.x -= steps;
  }

  public moveRightBy(steps: number) {
    this.phaserBody.sprite.x += steps;
  }

  public moveTowardsXY(x: number, y: number, velocity?: number) {
    let speed = velocity || this.phaserBody.speed;
    
    let deltaX = this.phaserBody.sprite.x - x;
    let deltaY = this.phaserBody.sprite.y - y;

    let signX = Math.sign(deltaX);
    let signY = Math.sign(deltaY);

    let alpha = ( Math.atan(deltaY/deltaX) * 180 ) / Math.PI;

    if (signX !== -1) {
      alpha -= signY * 180;
    }

    let ySpeed = speed * Math.sin(alpha * Math.PI / 180);
    let xSpeed = speed;
    if (ySpeed != 0) {
      xSpeed = ySpeed / Math.tan(alpha * Math.PI / 180);
    }

    this.phaserBody.velocity.x = xSpeed;
    this.phaserBody.velocity.y = ySpeed;
  }

  public moveTowards(point: Point, velocity?: number) {
    this.moveTowardsXY(point.x, point.y, velocity);
  }

  // given both direction
  public moveBy(x: number, y: number): void {
    this.phaserBody.sprite.x += x;
    this.phaserBody.sprite.y += y;
  }

  public moveToXY(x: number, y: number): void {
    this.phaserBody.sprite.x = x;
    this.phaserBody.sprite.y = y;
  }

  public moveTo(point: Point): void {
    this.moveToXY(point.x, point.y);
  }

  public slideByXYIn(x: number, y: number, duration: number): void {
    //let props = {x: this.phaserBody.sprite.x + x, y: this.phaserBody.sprite.y + y};
    //this.phaserBody.game.add.tween(this.phaserBody.sprite).to(props, duration, "Linear", true);
    
    let distance = Math.sqrt(x*x + y*y);
    let direction = Math.atan(y/x) * 180 / Math.PI;

    this.phaserBody.moveTo(duration*1000, distance, direction);
  }

  public slideByXY(x: number, y: number, velocity?: number): void {
    let speed = velocity || this.phaserBody.speed;

    let distance = Math.sqrt(x*x + y*y);
    let duration = distance / speed;

    this.slideByXYIn(x, y, duration);
    //this.phaserBody.game.add.tween(this.phaserBody.sprite).to({x: nextX, y: nextY}, duration, "Linear", true);
  }

  public slideToXYIn(x: number, y: number, duration: number): void {
    //this.phaserBody.game.add.tween(this.phaserBody.sprite).to({x: x, y: y}, duration, "Linear", true);
    let distanceX = this.phaserBody.sprite.x - x;
    let distanceY = this.phaserBody.sprite.y - y;

    this.slideByXYIn(distanceX, distanceY, duration);
  }

  public slideToXY(x: number, y: number, velocity?: number): void {
    let speed = velocity || this.phaserBody.speed;
    let deltaX = this.phaserBody.sprite.x - x;
    let deltaY = this.phaserBody.sprite.y - y;

    let distance = Math.sqrt(deltaX*deltaX + deltaY*deltaY);
    let duration = distance / speed;

    this.slideToXYIn(x, y, duration);
    
    //this.phaserBody.game.add.tween(this.phaserBody.sprite).to({x: x, y: y}, duration, "Linear", true);
  }

  public slideToIn(point: Point, duration: number): void {
    this.slideToXYIn(point.x, point.y, duration);    
  }

  public slideTo(point: Point, velocity?: number): void {
    this.slideToXY(point.x, point.y, velocity);
  }

  // given x direction
  public moveXBy(x: number): void {
    this.phaserBody.sprite.x += x;
  }

  public moveXTo(x: number): void {
    this.phaserBody.sprite.x = x;
  }

  public slideXByIn(x: number, duration: number): void {
    // let props = {x: this.phaserBody.sprite.x + x};
    // this.phaserBody.game.add.tween(this.phaserBody.sprite).to(props, duration, "Linear", true);
    this.slideByXYIn(x, 0, duration);
  }

  public slideXToIn(x: number, duration: number): void {
    // this.phaserBody.game.add.tween(this.phaserBody.sprite).to({x: x}, duration, "Linear", true);
    this.slideToXYIn(x, 0, duration);
  }
  
  public slideXBy(x: number, velocity?: number) {
    this.slideByXY(x, 0, velocity);
  }

  public slideXTo(x: number, velocity?: number): void {
    this.slideToXY(x, 0, velocity);
  }

  // given y direction
  public moveYBy(y: number): void {
    this.phaserBody.sprite.y += y;
  }

  public moveYTo(y: number): void {
    this.phaserBody.sprite.y = y;
  }

  public slideYByIn(y: number, duration: number): void {
    // let props = {y: this.phaserBody.sprite.y + y};
    // this.phaserBody.game.add.tween(this.phaserBody.sprite).to(props, duration, "Linear", true);
    this.slideByXYIn(0, y, duration);
  }

  public slideYToIn(y: number, duration: number): void {
    // this.phaserBody.game.add.tween(this.phaserBody.sprite).to({y: y}, duration, "Linear", true);
    this.slideToXYIn(0, y, duration);
  }
  
  public slideYBy(y: number, velocity?: number): void {
    this.slideByXY(0, y, velocity);
  }

  public slideYTo(y: number, velocity?: number): void {
    this.slideToXY(0, y, velocity);
  }

  // Rotation
  public turnBy(degree: number): void {
    this.phaserBody.sprite.angle += degree;
  }

  public pointIn(degree: number): void {
    this.phaserBody.sprite.angle = degree;
  }

  public pointTowardsXY(x: number, y: number): void {
    let deltaX = this.phaserBody.sprite.x - x;
    let deltaY = this.phaserBody.sprite.y - y;

    let signX = Math.sign(deltaX);
    let signY = Math.sign(deltaY);

    let alpha = ( Math.atan(deltaY/deltaX) * 180 ) / Math.PI;

    if (signX !== -1) {
      alpha -= signY * 180;
    }

    this.phaserBody.sprite.angle = alpha;
  }

  public pointTowards(point: Point): void {
    this.pointTowardsXY(point.x, point.y);
  }

  // Appearance
  public scaleToPercent(scale: number) {
    this.phaserSprite.scale.setTo(scale/100);
  }

  public enlargeBy(scale: number) {
    this.phaserSprite.scale.setTo(this.phaserSprite.scale.x + scale/100);
  }

  public enlarge() {
    this.enlargeBy(10);
  }

  public reduceBy(scale: number) {
    this.enlargeBy(-scale);
  }

  public reduce() {
    this.reduceBy(10);
  }

  public changeColorBy() {
    //todo
  }

  public randomColor() {
    this.phaserSprite.tint = Math.random() * 0xFFFFFF
  }

  public resetColor() {
    this.phaserSprite.tint = 0xFFFFFF;
  }

  public changeCostume(costumeNo) {
    this.phaserSprite.frame = costumeNo;
  }

  // Animations
  public addAnimation(name: string, frames?: Array<number>, frameRate: number = 10) {
    this.phaserSprite.animations.add(name, frames, frameRate, true);
  }

  public playAnimation(name: string, frameRate?: number, loop?: boolean) {
    this.phaserSprite.animations.play(name);
  }

  public stopAnimation() {
    this.phaserSprite.animations.stop();
  }

  // would be better in variable rather than in function
  // use collision obj instead?
  // public isTouched(): boolean {
  //   return !this.phaserBody.touching.none;
  // }

  // public touchBounds(): boolean {
  //   let blocked = this.phaserBody.blocked;
  //   return blocked.up || blocked.down || blocked.left || blocked.right;
  // }

  //bug too
  // public touchMouse(): boolean {
  //   return this.phaserBody.sprite.input.pointerOver();
  // }
}


export class Group {
  constructor(public phaserGroup: Phaser.Group) { }

  public add(...sprites) {
    sprites.forEach(sprite => {
      this.phaserGroup.add(sprite.phaserSprite);
    });
  }
}

export class Hero extends Phaser.Sprite {

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
      if (this.body.blocked.down || this.body.touching.down) {
        this.body.velocity.y = -this.jumpForce;
      }
    });

    // Set up camera
    this.game.camera.follow(this);
    let left = this.game.width / 3;
    let width = left;
    this.game.camera.deadzone = new Phaser.Rectangle(left, 0, width, this.game.height);
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

