import {Point} from './utility';
import {Sprite, Body, Platform, Group} from './sprite';

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

  public setCamera(width: number, height: number, sprite: Body, mode: string, args: any) {
    let _mode = mode ? mode : 'basic';
    // this.game.width = width;
    // this.game.height = height;
    if (_mode == 'basic' || _mode == 'deadzone') {
      this.game.camera.follow(sprite.phaserSprite);
      if (_mode == 'deadzone') {
        // todo get rectangle size from parameters
        this.game.camera.deadzone = new Phaser.Rectangle(100, 100, width - 200, height - 200);
      }
    } else if (mode == 'smooth') {
      // todo get smooth value from params
      this.game.camera.follow(sprite.phaserSprite, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
    }

  }

  public setDimensions(width: number, height: number) {
    this.game.world.setBounds(0, 0, width, height);
  }

  public addDecor(x: number, y: number, key: string, width: number, height: number) {
    let sprite = this.game.add.image(x, y, key);
    sprite.anchor.setTo(0.5, 0.5);
    sprite.width = width;
    sprite.height = height;
  }

  public addBody(name: string, x: number, y: number, key: string, width: number, height: number) {
    let phaserSprite = this.game.add.sprite(x, y, key);
    phaserSprite.anchor.setTo(0.5, 0.5);
    phaserSprite.width = width;
    phaserSprite.height = height;
    let body = this.bodies[name] = new Body(phaserSprite);

    // Add to body group
    this.groups.bodies.add(body);
  }

  public addPlatform(name: string, x: number, y: number, key: string, width: number, height: number) {
    let phaserSprite = this.game.add.sprite(x, y, key);
    phaserSprite.anchor.setTo(0.5, 0.5);
    phaserSprite.width = width;
    phaserSprite.height = height;
    let platform = this.platforms[name] = new Platform(phaserSprite);

    // Add to platform group
    this.groups.platforms.add(platform);
  }

  // todo move to Group ?
  public addGroup(name:string) {
    this.groups[name] = new Group(this.game.add.group());
  }

  public setBackground(backgroundKey: string) {
    this.background = this.game.add.image(0, 0, backgroundKey);
    this.background.width = this.game.world.width;
    this.background.height = this.game.world.height;
    this.background.sendToBack();
  }

  public setBackgroundColor(color: string) {
    this.game.stage.backgroundColor = color;
  }

  public collision(obj1: Sprite | Group, obj2: Sprite | Group, callback?) {
    let arg1;
    let arg2;
    if (obj1 instanceof Group) {
      arg1 = obj1.phaserGroup;
    } else {
      arg1 = obj1.phaserSprite;
    }

    if (obj2 instanceof Group) {
      arg2 = obj2.phaserGroup;
    } else {
      arg2 = obj2.phaserSprite;
    }
    
    if (callback === undefined) {
      return this.game.physics.arcade.collide(arg1, arg2);
    } else {
      return this.game.physics.arcade.collide(arg1, arg2, callback);
    }
  }

  public overlap(obj1: Sprite | Group, obj2: Sprite | Group, callback?) {
    let arg1;
    let arg2;
    if (obj1 instanceof Group) {
      arg1 = obj1.phaserGroup;
    } else {
      arg1 = obj1.phaserSprite;
    }

    if (obj2 instanceof Group) {
      arg2 = obj2.phaserGroup;
    } else {
      arg2 = obj2.phaserSprite;
    }
    
    if (callback === undefined) {
      return this.game.physics.arcade.overlap(arg1, arg2);
    } else {
      return this.game.physics.arcade.overlap(arg1, arg2, callback);
    }
  }

  public setGravity(g: number) {
    this.game.physics.arcade.gravity.y = g ? g : 100;
  }
}
