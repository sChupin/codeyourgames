import {Point} from './utility';
import {Body} from './sprite';

export class GameProps {
  public center: Point;
  public centerX: number;
  public centerY: number;

  public paused: boolean = false;

  constructor(private game: Phaser.Game, private background: any, private bodies: BodyMap, private numbers: NumberMap, private texts: TextMap, private booleans: BooleanMap) {
    this.center = {x: game.world.centerX, y: game.world.centerY};
    this.centerX = game.world.centerX;
    this.centerY = game.world.centerY;

    // Set paused property on game pause/resume
    this.game.onPause.add(() => this.game.paused = true);
    this.game.onResume.add(() => this.game.paused = false);
  }

  public pause() {
    this.game.paused = true;
  }

  public resume() {
    this.game.paused = false;
  }

  // sprite level wait vs game level wait
  // set game refresh speed
  // public wait(time: number) {

  // }

  public addNumber(name: string, value?: number) {
    this.numbers[name] = value ? value : 0;
  }

  public addText(name: string, value?: string) {
    this.texts[name] = value ? value : "";
  }

  public addBoolean(name: string, value?: boolean) {
    this.booleans[name] = value ? value : false;
  }

  public addBody(name: string, x: number, y: number, key: string, height: number, width: number) {
    let phaserSprite = this.game.add.sprite(x, y, key);
    phaserSprite.anchor.setTo(0.5, 0.5);
    phaserSprite.height = height;
    phaserSprite.width = width;
    this.bodies[name] = new Body(phaserSprite);
  }

  public setBackground(backgroundKey: string) {
    this.background = this.game.add.sprite(0, 0, backgroundKey);
    this.background.width = this.game.world.width;
    this.background.height = this.game.world.height;
  }

  public setBackgroundColor(color: string) {
    this.game.stage.backgroundColor = color;
  }
}

interface BodyMap {
  [key: string]: Body;
}

interface NumberMap {
  [key: string]: number;
}

interface TextMap {
  [key: string]: string;
}

interface BooleanMap {
  [key: string]: boolean;
}
