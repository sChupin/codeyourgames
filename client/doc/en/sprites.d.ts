declare class Sprite {
  public position: Point;
  public positionX: number;
  public positionY: number;

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
  public slideForward(duration: number, velocity?: number | Velocity);
  public slideBackward(duration: number, velocity?: number | Velocity);

  public slideUp(duration: number, velocity?: number | Velocity);
  public slideDown(duration: number, velocity?: number | Velocity);
  public slideLeft(duration: number, velocity?: number | Velocity);
  public slideRight(duration: number, velocity?: number | Velocity);

  // given both direction
  public moveBy(x: number, y: number): void;

  public moveTo(x: number, y: number): void;
  public moveToPoint(point: Point): void;

  public slideBy(x: number, y: number, duration: number): void;

  public slideTo(x: number, y: number, duration: number): void;
  public slideTo(point: Point, duration: number): void;
  
  public slideBy(x: number, y: number, velocity?: number | Velocity): void;

  public slideTo(x: number, y: number, velocity?: number | Velocity): void;
  public slideTo(point: Point, velocity?: number | Velocity): void;

  // given x direction
  public moveXBy(x: number): void;

  public moveXTo(x: number): void;

  public slideXBy(x: number, duration: number): void;

  public slideXTo(x: number, duration: number): void;
  
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
  public pointTowards(point: Point): void;

   /*
   **************
   * Appearence *
   **************
   */
  // hide/show (Phaser visibility)
  // destroy/kill
}
