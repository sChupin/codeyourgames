import {Point, Angle, Velocity, Direction} from './utility';

export class Sprite {
  public readonly position: Point;

  public readonly orientation: number | Angle;

  constructor(private phaserSprite: Phaser.Sprite) {
    this.position = phaserSprite.position;
  }
}

export class Platform {

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
    this.phaserBody.velocity.setTo(0);
  }

  public moveUp(velocity?: number) {
    let speed = velocity || this.phaserBody.speed;
    
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
    let props = {x: this.phaserBody.sprite.x + x, y: this.phaserBody.sprite.y + y};
    this.phaserBody.game.add.tween(this.phaserBody.sprite).to(props, duration, "Linear", true);
  }

  public slideByXY(x: number, y: number, velocity?: number): void {
    let speed = velocity || this.phaserBody.speed;

    let nextX = this.phaserBody.sprite.x + x;
    let nextY = this.phaserBody.sprite.y + y;

    let deltaX = this.phaserBody.sprite.x - nextX;
    let deltaY = this.phaserBody.sprite.y - nextY;

    let dist = Math.sqrt(deltaX*deltaX + deltaY*deltaY);

    let duration = dist / speed;
    
    this.phaserBody.game.add.tween(this.phaserBody.sprite).to({x: nextX, y: nextY}, duration, "Linear", true);
  }

  public slideToXYIn(x: number, y: number, duration: number): void {
    this.phaserBody.game.add.tween(this.phaserBody.sprite).to({x: x, y: y}, duration, "Linear", true);
  }

  public slideToXY(x: number, y: number, velocity?: number): void {
    let speed = velocity || this.phaserBody.speed;
    let deltaX = this.phaserBody.sprite.x - x;
    let deltaY = this.phaserBody.sprite.y - y;

    let dist = Math.sqrt(deltaX*deltaX + deltaY*deltaY);

    let duration = dist / speed;
    
    this.phaserBody.game.add.tween(this.phaserBody.sprite).to({x: x, y: y}, duration, "Linear", true);
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
    let props = {x: this.phaserBody.sprite.x + x};
    this.phaserBody.game.add.tween(this.phaserBody.sprite).to(props, duration, "Linear", true);
  }

  public slideXToIn(x: number, duration: number): void {
    this.phaserBody.game.add.tween(this.phaserBody.sprite).to({x: x}, duration, "Linear", true);
  }
  
  public slideXBy(x: number, velocity?: number) {
    let speed = velocity || this.phaserBody.speed;

    let nextX = this.phaserBody.sprite.x + x;

    let dist = this.phaserBody.sprite.x - nextX;

    let duration = dist / speed;
    
    this.phaserBody.game.add.tween(this.phaserBody.sprite).to({x: nextX}, duration, "Linear", true);
  }

  public slideXTo(x: number, velocity?: number): void {
    let speed = velocity || this.phaserBody.speed;
    let dist = this.phaserBody.sprite.x - x;

    let duration = dist / speed;
    
    this.phaserBody.game.add.tween(this.phaserBody.sprite).to({x: x}, duration, "Linear", true);
  }

  // given y direction
  public moveYBy(y: number): void {
    this.phaserBody.sprite.y += y;
  }

  public moveYTo(y: number): void {
    this.phaserBody.sprite.y = y;
  }

  public slideYByIn(y: number, duration: number): void {
    let props = {y: this.phaserBody.sprite.y + y};
    this.phaserBody.game.add.tween(this.phaserBody.sprite).to(props, duration, "Linear", true);
  }

  public slideYToIn(y: number, duration: number): void {
    this.phaserBody.game.add.tween(this.phaserBody.sprite).to({y: y}, duration, "Linear", true);
  }
  
  public slideYBy(y: number, velocity?: number): void {
    let speed = velocity || this.phaserBody.speed;

    let nextY = this.phaserBody.sprite.y + y;

    let dist = this.phaserBody.sprite.y - nextY;

    let duration = dist / speed;
    
    this.phaserBody.game.add.tween(this.phaserBody.sprite).to({y: nextY}, duration, "Linear", true);
  }

  public slideYTo(y: number, velocity?: number): void {
    let speed = velocity || this.phaserBody.speed;
    let dist = this.phaserBody.sprite.y - y;

    let duration = dist / speed;
    
    this.phaserBody.game.add.tween(this.phaserBody.sprite).to({y: y}, duration, "Linear", true);
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
