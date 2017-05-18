declare class Sprite {
  public position: Point;

  public orientation: number | Angle;
}

declare class Decor extends Sprite {

}

declare class Platform extends Sprite {

}

declare class Body extends Sprite {
  // Default speed if not specified when sliding
  public speed: number | Velocity;

  public hitBounds: boolean;

  /*
   **********
   * Motion *
   **********
   */

  // Translation
  public moveForward(duration: number, velocity?: number | Velocity);
  public moveBackward(duration: number, velocity?: number | Velocity);

  public moveUp(duration: number, velocity?: number | Velocity);
  public moveDown(duration: number, velocity?: number | Velocity);
  public moveLeft(duration: number, velocity?: number | Velocity);
  public moveRight(duration: number, velocity?: number | Velocity);

  public moveTowards(x: number, y: number);
  public moveTowards(point: Point);

  // given both direction
  public moveByXY(x: number, y: number): void;

  public moveToXY(x: number, y: number): void;
  public moveTo(point: Point): void;

  public slideByXY(x: number, y: number, duration: number): void;

  public slideToXY(x: number, y: number, velocity?: number | Velocity): void;
  public slideTo(point: Point, velocity?: number | Velocity): void;

  public slideToXYIn(x: number, y: number, duration: number): void;
  public slideToIn(point: Point, duration: number): void;
  
  public slideByXY(x: number, y: number, velocity?: number | Velocity): void;

  // given x direction
  public moveXBy(x: number): void;

  public moveXTo(x: number): void;

  public slideXByIn(x: number, duration: number): void;

  public slideXToIn(x: number, duration: number): void;
  
  public slideXBy(x: number, velocity?: number | Velocity): void;

  public slideXTo(x: number, velocity?: number | Velocity): void;

  // given y direction
  public moveYBy(y: number): void;

  public moveYTo(y: number): void;

  public slideYBy(y: number, duration: number): void;

  public slideYTo(y: number, duration: number): void;
  
  public slideYBy(y: number, velocity?: number | Velocity): void;

  public slideYTo(y: number, velocity?: number | Velocity): void;

  // Rotation
  public turnBy(degree: number | Angle): void;

  public pointIn(degree: number | Orientation): void;

  public pointTowards(x: number, y: number): void;
  public pointTowardsPoint(point: Point): void;

   /*
   **************
   * Appearence *
   **************
   */
  public hide(): void;
  public show(): void;

  public destroy(): void;

  // Animation
  //todo

  // Size
  public changeSizeBy(scale: number);
  public resetSize();
  public goFront();
  public goUp();
  public goToBack();
  public goDown();

  // Events
  public isClicked: boolean;
  public isTouched: boolean;

  
  //

}
