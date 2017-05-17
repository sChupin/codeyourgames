import {Point, Angle, Velocity, Orientation} from './utility';

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

    // Set clicked properties on sprite clicked
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
  public moveForward(duration: number, velocity?: number | Velocity) {

  }

  public moveBackward(duration: number, velocity?: number | Velocity) {

  }

  public moveUp(duration: number, velocity?: number | Velocity) {

  }
  public moveDown(duration: number, velocity?: number | Velocity) {

  }

  public moveLeft(duration: number, velocity?: number | Velocity) {

  }

  public moveRight(duration: number, velocity?: number | Velocity) {

  }

  public moveTowardsXY(x: number, y: number) {

  }

  public moveTowards(point: Point) {

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
    this.phaserBody.sprite.x = point.x;
    this.phaserBody.sprite.y = point.y;
  }

  public slideByXYIn(x: number, y: number, duration: number): void {
    
  }

  public slideToXY(x: number, y: number, velocity?: number | Velocity): void {

  }

  public slideTo(point: Point, velocity?: number | Velocity): void {

  }

  public slideToXYIn(x: number, y: number, duration: number): void {

  }

  public slideToIn(point: Point, duration: number): void {

  }
  
  public slideByXY(x: number, y: number, velocity?: number | Velocity): void {

  }

  // given x direction
  public moveXBy(x: number): void {

  }

  public moveXTo(x: number): void {

  }

  public slideXByIn(x: number, duration: number): void {

  }

  public slideXToIn(x: number, duration: number): void {

  }
  
  public slideXBy(x: number, velocity?: number | Velocity) {

  }

  public slideXTo(x: number, velocity?: number | Velocity): void {

  }

  // given y direction
  public moveYBy(y: number): void {

  }

  public moveYTo(y: number): void {

  }

  public slideYByIn(y: number, duration: number): void {

  }

  public slideYToIn(y: number, duration: number): void {

  }
  
  public slideYBy(y: number, velocity?: number | Velocity): void {

  }

  public slideYTo(y: number, velocity?: number | Velocity): void {

  }

  // Rotation
  public turnBy(degree: number): void {
    this.phaserBody.sprite.angle += degree;
  }

  public pointIn(degree: number): void {
    this.phaserBody.sprite.angle = degree;
  }

  public pointTowards(x: number, y: number): void {

  }

  public pointTowardsPoint(point: Point): void {

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
