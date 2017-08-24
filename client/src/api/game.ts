import {Point, Color} from './utility';
import {Sprite, Hero, Platform, Decor, Enemy, Spaceship, Weapon, TextImage, Obj, FlappyBird} from './sprite';


/**
 * Manage game and background manipulation.
 * 
 * @class Game
 */
export class GameProps {
  private background: any;


  /**
   * Indicates whether the game is paused
   * 
   * @readonly
   * @type {boolean}
   * @memberof Game
   */
  public readonly paused: boolean = false;

  constructor(private game: Phaser.Game) {
    // Set paused property on game pause/resume
    this.game.onPause.add(() => this.pause());
    this.game.onResume.add(() => this.resume());
  }

  
  /**
   * Pause the game
   * 
   * @method pause
   * @return {void}
   * @memberof Game
   */
  public pause() {
    this.game.paused = true;
  }

  /**
   * Resume the game
   * 
   * @method resume
   * @return {void}
   * @memberof Game
   */
  public resume() {
    this.game.paused = false;
  }


  /**
   * Set the game background
   * 
   * @method setBackground
   * @param {string} backgroundKey Background image key
   * @param {string} backgroundType Background type
   * @returns returns the created background
   * @memberof GameProps
   */
  public setBackground(backgroundKey: string, backgroundType: string) {
    if (backgroundType == 'scroll') {
      // Create scrollable background
      this.background = this.game.add.existing(new ScrollableBackground(this.game, this.game.width, this.game.height, backgroundKey));

    } else {
      this.background = this.game.add.image(0, 0, backgroundKey);
      this.background.width = this.game.world.width;
      this.background.height = this.game.world.height;
    }
    this.background.sendToBack();
    
    return this.background;
  }

  public scrollBackground(speed: number = 50, direction: number = Phaser.ANGLE_DOWN) {
    if (!this.background) {
      throw Error('No background set');
    }

    if (!(this.background instanceof ScrollableBackground)) {
      throw Error('The background is not scrollable');
    }

    if (direction == Phaser.ANGLE_UP) {
      this.background.autoScroll(0, -speed);
    } else if (direction == Phaser.ANGLE_DOWN) {
      this.background.autoScroll(0, speed);
    } else if (direction == Phaser.ANGLE_LEFT) {
      this.background.autoScroll(-speed, 0);
    } else if (direction == Phaser.ANGLE_RIGHT) {
      this.background.autoScroll(speed, 0);
    }
  }

  /**
   * Define the camera size with optional deadzone. Moving inside the deadzone will no cause the camera to move.
   * 
   * @method setCamera
   * @param {number} cameraWidth camera width
   * @param {number} cameraHeight camera height
   * @param {number} gameWidth actual game width
   * @param {number} gameHeight actual game height
   * @param {number} [deadzoneWidth] deadzone width
   * @param {number} [deadzoneHeight] deadzone height
   * @memberof Game
   */
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


  /**
   * Set the dimensions of the game
   * 
   * @method setDimensions
   * @param {number} width game width
   * @param {number} height game height
   * @memberof Game
   */
  public setDimensions(width: number, height: number) {
    this.game.world.setBounds(0, 0, width, height);
  }


  /**
   * Create and add a sprite on the board game
   * 
   * @method addSprite
   * @param {number} x Sprite x coordinate
   * @param {number} y Sprite y coordinate
   * @param {string} key Image key name
   * @memberof Game
   */
  public addSprite(x: number, y: number, key: string): Sprite {
    return this.game.add.existing(new Sprite(this.game, x, y, key, 0));
  }


  /**
   * Create and add a sprite of type Hero.
   * 
   * @method addHero
   * @param {number} x Hero x coordinate
   * @param {number} y Hero y coordinate
   * @param {string} key Image key name
   * @returns {Hero} returns the created Hero
   * @memberof Game
   */
  public addHero(x: number, y: number, key: string): Hero {
    return this.game.add.existing(new Hero(this.game, x, y, key, 0));
  }


  /**
   * Create and add a sprite of type Platform
   * 
   * @method addPlatform
   * @param {number} x Platform x coordinate
   * @param {number} y Platform y coordinate
   * @param {string} key Image key name
   * @returns {Platform} return the created Platform
   * @memberof Game
   */
  public addPlatform(x: number, y: number, key: string): Platform {
    return this.game.add.existing(new Platform(this.game, x, y, key));
  }

  /**
   * Create and add a sprite of type Decor
   * 
   * @method addDecor
   * @param {number} x Decor x coordinate
   * @param {number} y Decor y coordinate
   * @param {string} key Image key name
   * @returns {Decor} return the created Decor
   * @memberof Game
   */
  public addDecor(x: number, y: number, key: string): Decor {
    let decor = this.game.add.existing(new Decor(this.game, x, y, key));

    // Send this sprite to deepest level
    decor.sendToBack();

    // Move it just above the background
    if (this.background) {
      decor.moveUp();
    }
    return decor;
  }

  /**
   * Create and add a sprite of type Enemy
   * 
   * @method addEnemy
   * @param {number} x Enemy x coordinate
   * @param {number} y Enemy y coordinate
   * @param {string} key Image key name
   * @returns {Enemy} return the created Enemy
   * @memberof Game
   */
  public addEnemy(x: number, y: number, key: string): Enemy {
    return this.game.add.existing(new Enemy(this.game, x, y, key, 0));
  }

  /**
   * Create and add a sprite of type Spaceship
   * 
   * @method addSpaceship
   * @param {number} x Spaceship x coordinate
   * @param {number} y Spaceship y coordinate
   * @param {string} key Image key name
   * @returns {Spaceship} return the created Spaceship
   * @memberof Game
   */
  public addSpaceship(x: number, y: number, key: string): Spaceship {
    return this.game.add.existing(new Spaceship(this.game, x, y, key, 0));
  }

  /**
   * Create and add a sprite of type Object
   * 
   * @method addObject
   * @param {number} x Object x coordinate
   * @param {number} y Object y coordinate
   * @param {string} key Image key name
   * @returns {Object} return the created Object
   * @memberof Game
   */
  public addObject(x: number, y: number, key: string) {
    return this.game.add.existing(new Obj(this.game, x, y, key, 0));
  }

  /**
   * Create and add a sprite of type FlappyBird
   * 
   * @method addFlappyBird
   * @param {number} x FlappyBird x coordinate
   * @param {number} y FlappyBird y coordinate
   * @param {string} key Image key name
   * @returns {FlappyBird} return the created FlappyBird
   * @memberof Game
   */
  public addFlappyBird(x: number, y: number, key, string) {
    return this.game.add.existing(new FlappyBird(this.game, x, y, key, 0));
  }

  /**
   * Create sprite of type Weapon
   * 
   * @method addWeapon
   * @param {string} key Image key name
   * @returns {Weapon} return the created Weapon
   * @memberof Game
   */
  public createWeapon(key: string) {
    // return new Weapon(this.game, key);
    return this.game.add.plugin(new Weapon(this.game, key, 0));
  }
  
  /**
   * Create sprite of type Text
   * 
   * @method addText
   * @param {number} x Text x coordinate
   * @param {number} y Text y coordinate
   * @param {number} text Text content
   * @returns {TextImage} return the created Text
   * @memberof Game
   */
  public addText(x: number, y: number, text: string): TextImage {
    return this.game.add.existing(new TextImage(this.game, x, y, text));
  }


        // public createObject(key: string) {
        //   return new Obj(this.game, 0, 0, key, 0);
        // }
}

class ScrollableBackground extends Phaser.TileSprite {
  constructor(game, width, height, key) {
    super(game, 0, 0, width, height, key);

    // Get original image size
    let bgCache = this.game.cache.getImage(key);
    let imgWidth = bgCache.width;
    let imgHeight = bgCache.height;

    // Scale image so it fits game size
    this.tileScale.set(this.game.width/imgWidth, this.game.height/imgHeight);
  }

  public scrollHorizontal(speed: number) {
    this.autoScroll(speed, 0);
  }

  public scrollVertical(speed: number) {
    this.autoScroll(0, speed);
  }
}
