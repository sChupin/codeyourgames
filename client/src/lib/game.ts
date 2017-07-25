import {Point} from './utility';
import {Sprite, Hero, Platform, Decor, Enemy, Spaceship, Weapon} from './sprite';

export class GameProps {
  public center: Point;
  public centerX: number;
  public centerY: number;

  public cameraCenter: Point;
  public cameraCenterX: number;
  public cameraCenterY: number;

  private background: any;

  public paused: boolean = false;

  constructor(private game: Phaser.Game) {
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

  public addHero(x: number, y: number, key: string, opts?: any): Hero {
    return this.game.add.existing(new Hero(this.game, x, y, key, 0, opts));
  }

  public addPlatform(x: number, y: number, key: string, opts?: any): Platform {
    return this.game.add.existing(new Platform(this.game, x, y, key, opts));
  }

  // public addGroup(): Group {
  //   return this.game.add.existing(new Group(this.game));
  // }

  public addDecor(x: number, y: number, key: string, opts?: any): Decor {
    let decor = this.game.add.existing(new Decor(this.game, x, y, key, opts));

    // Send this sprite to deepest level
    decor.sendToBack();

    // Move it just above the background
    if (this.background) {
      decor.moveUp();
    }
    return decor;
  }

  public addEnemy(x: number, y: number, key: string, opts?: any): Enemy {
    return this.game.add.existing(new Enemy(this.game, x, y, key, 0, opts));
  }

  public addSpaceship(x: number, y: number, key: string, opts?: any): Spaceship {
    return this.game.add.existing(new Spaceship(this.game, x, y, key, 0, opts));
  }

  public createWeapon(key: string, opts?: any) {
    // return new Weapon(this.game, key, opts);
    return this.game.add.plugin(new Weapon(this.game, key, 0, opts));
  }

  public setBackground(backgroundKey: string, backgroundType: string) {
    if (backgroundType == 'scroll') {
      // Get original image size
      let bgCache = this.game.cache.getImage(backgroundKey);
      let imgWidth = bgCache.width;
      let imgHeight = bgCache.height;

      // Create scrollable background
      let bg: Phaser.TileSprite = this.background = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, backgroundKey);
      
      // Scale image so it fits game size
      bg.tileScale.set(this.game.width/imgWidth, this.game.height/imgHeight);
    } else {
      this.background = this.game.add.image(0, 0, backgroundKey);
      this.background.width = this.game.world.width;
      this.background.height = this.game.world.height;
    }
    this.background.sendToBack();
    
    return this.background;
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
