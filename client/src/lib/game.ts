import {Point, Color} from './utility';
import {Sprite, Hero, Platform, Decor, Enemy, Spaceship, Weapon, TextImage, Obj} from './sprite';

export class GameProps {
  private background: any;


  /**
   * True if the game is in pause, false otherwise
   * 
   * @readonly
   * @type {boolean}
   * @memberof GameProps
   */
  public readonly paused: boolean = false;

  constructor(private game: Phaser.Game) {
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
  
  public addText(x: number, y: number, text: string, opts?: any): TextImage {
    return this.game.add.existing(new TextImage(this.game, x, y, text, opts));
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

  public createObject(key: string, opts?: any) {
    return new Obj(this.game, 0, 0, key, 0, opts);
  }

  public addObject(x: number, y: number, key: string, opts?: any) {
    return this.game.add.existing(new Obj(this.game, x, y, key, 0, opts));
  }

  public addSprite(x: number, y: number, sprite: Sprite) {
    sprite.x = x;
    sprite.y = y;
    return this.game.add.existing(sprite);
  }

  // public setBackgroundColor(color: string) {
  //   this.game.stage.backgroundColor = color;
  // }
}
