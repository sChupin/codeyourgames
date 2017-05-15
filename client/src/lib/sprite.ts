import {Point} from './utility';

export class Sprite {
  public readonly position;//: Point;
  public readonly positionX: number;
  public readonly positionY: number;

  public readonly orientation: number;// | Angle;

  constructor(private phaserSprite: Phaser.Sprite) { }
}

export class Platform {

}

export class Body extends Sprite {
  private phaserBody = null;
  
  constructor(phaserSprite: Phaser.Sprite) {
    super(phaserSprite);
    phaserSprite.game.physics.arcade.enable(phaserSprite);
    this.phaserBody = phaserSprite.body;
  }

  public moveBy(x: number, y: number): void {
    this.phaserBody.x += x;
    this.phaserBody.y += y;
  }

  public moveTo(x: number, y: number): void {
    this.phaserBody.x = x;
    this.phaserBody.y = y;
  }

  public moveToPoint(point: Point): void {
    this.phaserBody.x = point.x;
    this.phaserBody.y = point.y;
  }

}
