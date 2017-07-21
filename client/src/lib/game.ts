import {Point} from './utility';
import {Sprite, Hero, Platform, Decor, Enemy} from './sprite';

import {BodyMap, PlatformMap, GroupMap} from '../components/game-container';

export class GameProps {
  public center: Point;
  public centerX: number;
  public centerY: number;

  public cameraCenter: Point;
  public cameraCenterX: number;
  public cameraCenterY: number;

  private background: any;

  public paused: boolean = false;

  constructor(private game: Phaser.Game, private bodies: BodyMap, private platforms: PlatformMap) {
    this.center = {x: game.world.centerX, y: game.world.centerY};
    this.centerX = game.world.centerX;
    this.centerY = game.world.centerY;

    this.cameraCenter = {x: game.width/2, y: game.height/2};
    this.cameraCenterX = game.width/2;
    this.cameraCenterY = game.height/2;

    // Set paused property on game pause/resume
    this.game.onPause.add(() => this.pause());
    this.game.onResume.add(() => this.resume());
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

  public setCamera(cameraWidth: number, cameraHeight: number, gameWidth: number, gameHeight: number, deadzoneWidth?: number, deadzoneHeight?: number) {
    this.game.width = cameraWidth;
    this.game.height = cameraHeight;

    this.game.world.setBounds(0, 0, gameWidth, gameHeight);

    if (this.background) {
      this.background.width = gameWidth;
      this.background.height = gameHeight;
    }

    if (deadzoneWidth && deadzoneHeight) {
      let offsetX = 0, offsetY = 0;
      if (deadzoneWidth < cameraWidth) {
        offsetX = (cameraWidth - deadzoneWidth) / 2;
      }

      if (deadzoneHeight < cameraHeight) {
        offsetY = (cameraHeight - deadzoneHeight) / 2;
      }

      this.game.camera.deadzone = new Phaser.Rectangle(offsetX, offsetY, deadzoneWidth, deadzoneHeight);
    }
  }

  public setDimensions(width: number, height: number) {
    this.game.world.setBounds(0, 0, width, height);
  }

  public addHero(x: number, y: number, key: string): Hero {
    return this.game.add.existing(new Hero(this.game, x, y, key, 0));
  }

  public addPlatform(x: number, y: number, key: string): Platform {
    return this.game.add.existing(new Platform(this.game, x, y, key));
  }

  // public addGroup(): Group {
  //   return this.game.add.existing(new Group(this.game));
  // }

  public addDecor(x: number, y: number, key: string, width: number, height: number) {
    let decor = this.game.add.existing(new Decor(this.game, x, y, key));

    // Send this sprite to deepest level
    decor.sendToBack();

    // Move it just above the background
    if (this.background) {
      decor.moveUp();
    }
    return decor;
  }

  public addEnemy(x: number, y: number, key: string, width: number, height: number) {
    return this.game.add.existing(new Enemy(this.game, x, y, key));
  }

  public setBackground(backgroundKey: string, backgroundType: string) {
    this.background = this.game.add.image(0, 0, backgroundKey);
    this.background.width = this.game.world.width;
    this.background.height = this.game.world.height;
    this.background.sendToBack();
  }

  public setBackgroundColor(color: string) {
    this.game.stage.backgroundColor = color;
  }

  // public collision(obj1: Sprite | Group, obj2: Sprite | Group, callback?) {
  //   let arg1;
  //   let arg2;
  //   if (obj1 instanceof Group) {
  //     arg1 = obj1.phaserGroup;
  //   } else {
  //     arg1 = obj1.phaserSprite;
  //   }

  //   if (obj2 instanceof Group) {
  //     arg2 = obj2.phaserGroup;
  //   } else {
  //     arg2 = obj2.phaserSprite;
  //   }
    
  //   if (callback === undefined) {
  //     return this.game.physics.arcade.collide(arg1, arg2);
  //   } else {
  //     return this.game.physics.arcade.collide(arg1, arg2, callback);
  //   }
  // }

  // public overlap(obj1: Sprite | Group, obj2: Sprite | Group, callback?) {
  //   let arg1;
  //   let arg2;
  //   if (obj1 instanceof Group) {
  //     arg1 = obj1.phaserGroup;
  //   } else {
  //     arg1 = obj1.phaserSprite;
  //   }

  //   if (obj2 instanceof Group) {
  //     arg2 = obj2.phaserGroup;
  //   } else {
  //     arg2 = obj2.phaserSprite;
  //   }
    
  //   if (callback === undefined) {
  //     return this.game.physics.arcade.overlap(arg1, arg2);
  //   } else {
  //     return this.game.physics.arcade.overlap(arg1, arg2, callback);
  //   }
  // }

  public setGravity(g: number) {
    this.game.physics.arcade.gravity.y = g ? g : 100;
  }
}
