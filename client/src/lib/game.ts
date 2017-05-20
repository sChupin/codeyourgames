import {Point} from './utility';
import {Body, Platform, Group} from './sprite';

import {BodyMap, PlatformMap, GroupMap} from '../playground/game-container';

export class GameProps {
  public center: Point;
  public centerX: number;
  public centerY: number;

  public paused: boolean = false;

  constructor(private game: Phaser.Game, private background: any, private bodies: BodyMap, private platforms: PlatformMap, private groups: GroupMap) {
    this.center = {x: game.world.centerX, y: game.world.centerY};
    this.centerX = game.world.centerX;
    this.centerY = game.world.centerY;

    // Set paused property on game pause/resume
    this.game.onPause.add(() => this.game.paused = true);
    this.game.onResume.add(() => this.game.paused = false);

    // Create bodies and platforms groups
    this.groups.bodies = new Group(this.game.add.group());
    this.groups.platforms = new Group(this.game.add.group());
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

  public addDecor(x: number, y: number, key: string, height: number, width: number) {
    let sprite = this.game.add.sprite(x, y, key);
    sprite.anchor.setTo(0.5, 0.5);
    sprite.height = height;
    sprite.width = width;
  }

  public addBody(name: string, x: number, y: number, key: string, height: number, width: number) {
    let phaserSprite = this.game.add.sprite(x, y, key);
    phaserSprite.anchor.setTo(0.5, 0.5);
    phaserSprite.height = height;
    phaserSprite.width = width;
    let body = this.bodies[name] = new Body(phaserSprite);

    // Add to body group
    this.groups.bodies.add(body);
  }

  public addPlatform(name: string, x: number, y: number, key: string, height: number, width: number) {
    //todo
    let phaserSprite = this.game.add.sprite(x, y, key);
    phaserSprite.anchor.setTo(0.5, 0.5);
    phaserSprite.height = height;
    phaserSprite.width = width;
    let platform = this.platforms[name] = new Platform(phaserSprite);

    // Add to platform group
    this.groups.platforms.add(platform);
  }

  // todo move to Group ?
  public addGroup(name:string) {
    this.groups[name] = new Group(this.game.add.group());
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
