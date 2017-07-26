import Phaser = require('phaser');

export class PhaserGame {

  private gameContainer: GameContainer;

  attached() {
    this.gameContainer = new GameContainer();
  }

  detached() {
    this.gameContainer.destroy();
  }

}

class GameContainer extends Phaser.Game {
  constructor() {
    super(800, 500, Phaser.AUTO, 'game-container', null);
    this.state.add('main', GameWorld);
    this.state.start('main');
  }
}

class GameWorld extends Phaser.State {

  private hero: Hero;
  
  private platformGroup: Phaser.Group;

  private fireButton: Phaser.Key;

  preload() {
    this.load.crossOrigin = 'anonymous';
    this.load.image('background', 'http://localhost:9000/public/images/Backgrounds/cave.png');
    this.load.spritesheet('hero', 'http://localhost:9000/public/images/Sprites/sheets/alberto.png', 32, 53);
    this.load.image('platform', 'http://localhost:9000/public/images/Tiles/dirtHalf.png');
    this.load.image('bullet', 'http://localhost:9000/public/images/Items/fireball.png');
  }

  create() {

    let background = this.add.image(0, 0, 'background');
    background.height = this.game.height;
    this.world.setBounds(0, 0, background.width, this.game.height);

    this.hero = this.add.existing(new Hero(this.game, 100, 25, 'hero', 8));

    // this.platformGroup = this.add.group();

    let x = 0;
    let y = 400;
    while (x < this.world.width) {
      x += Math.floor(Math.random() * 75);
      let width = Math.floor(Math.random() * 100) + 200;

      // Create new platform
      let platform = new Platform(this.game, x, y, 'platform', {width: width});

      x += platform.width;

      // Add platform to world
      this.add.existing(platform);

      // Add platform to platformGroup
      // this.platformGroup.add(platform);

      y -= Math.sign(Math.random() - 0.35) * Math.floor((Math.random() * 75));
    }  

    // let platform = this.game.add.existing(new Platform(this.game, this.game.world.centerX, 400, 'platform', {width: this.game.world.width}));
    
    let fireball = <Weapon>this.game.add.plugin(new Weapon(this.game, 'bullet'));
    fireball.width = 50;
    fireball.height = 50;
    fireball.fireDirection = Phaser.ANGLE_RIGHT;
    fireball.bulletGravity.y = 400;
    fireball.bounceOnPlatforms = true;

    this.hero.equipWeapon(fireball);

    this.fireButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  }

  update() {
    // this.game.physics.arcade.collide(this.hero, this.platformGroup);

    if (this.fireButton.isDown) {
      this.hero.fire();
    }

  }

  render() {

  }
}

class Platform extends Phaser.Sprite {

  private group: Phaser.Group;

  constructor(public game: Phaser.Game, public x: number, public y: number, public key: string, opts: any = {}) {
    super(game, x, y, key);

    // Enable platform physics
    this.game.physics.arcade.enable(this);

    // Set up properties
    if (opts.hasOwnProperty('width')) {
      this.width = opts.width;
    }
    if (opts.hasOwnProperty('height')) {
      this.height = opts.height;
    }
    if (opts.hasOwnProperty('orientation')) {
      this.angle = opts.orientation;
    }
  
    // Set immovable 
    this.body.immovable = true;

  }

}

class Hero extends Phaser.Sprite {

  private cursors;
  private weapon: Weapon = null;
  
  // Default properties
  private defaultCanFall: boolean = false;
  private defaultSpeed: number = 200;
  private defaultGravity = 500;
  private defaultJumpForce = 300;

  // Physics properties
  public canFall: boolean;
  public speed: number;
  public gravity: number;
  public jumpForce: number;

  // Debug texts
  private speedText: Phaser.Text;
  private frameRateText: Phaser.Text;
  private frameRate: number = 10;

  constructor(public game: Phaser.Game, public x: number = 0, public y: number = 0,
              public key: string = '', public frame: number | string = '', opts: any = {}) {
    super(game, x, y, key, frame);

    this.speedText = this.game.add.text(16, 16, 'Speed: 0', { fontSize: '32px', fill: '#fff' });
    this.speedText.fixedToCamera = true;
    this.frameRateText = this.game.add.text(16, 48, 'Frame rate: 0', { fontSize: '32px', fill: '#fff' });
    this.frameRateText.fixedToCamera = true;
    
    // Enable hero physics
    this.game.physics.arcade.enable(this);

    // Set hero properties
    this.canFall = opts.hasOwnProperty('canFall') ? opts.canFall : this.defaultCanFall;
    this.speed = opts.hasOwnProperty('speed') ? opts.speed : this.defaultSpeed;
    this.gravity = opts.hasOwnProperty('gravity') ? opts.gravity : this.defaultGravity;
    this.jumpForce = opts.hasOwnProperty('jumpForce') ? opts.jumpForce : this.defaultJumpForce;
    
    // Enable collision with world bounds
    this.body.collideWorldBounds = true;

    // Set hero gravity
    this.body.gravity.y = this.gravity;

    // Create animations
    this.animations.add('moveRight', [8, 9, 10, 11], this.frameRate, true);
    this.animations.add('moveLeft', [4, 5, 6, 7], this.frameRate, true);

    // Set motion signals
    this.cursors = this.game.input.keyboard.createCursorKeys();
// signal based motion 
    // this.cursors.left.onDown.add(() => {
    //   this.body.velocity.x = -this.speed;
    // });
    // this.cursors.left.onUp.add(() => {
    //   if (!this.cursors.right.isDown) {
    //     this.body.velocity.x = 0;
    //   } else {
    //     this.body.velocity.x = this.speed;
    //   }
    // });

    // this.cursors.right.onDown.add(() => {
    //   this.body.velocity.x = this.speed;
    // });
    // this.cursors.right.onUp.add(() => {
    //   if (!this.cursors.left.isDown) {
    //     this.body.velocity.x = 0;
    //   } else {
    //     this.body.velocity.x = -this.speed;
    //   }
    // });

    // this.cursors.up.onDown.add(() => {
    //   if (this.body.blocked.down || this.body.touching.down) {
    //     this.body.velocity.y = -this.jumpForce;
    //   }
    // });
//
    // Set up camera
    this.game.camera.follow(this);
    let left = this.game.width / 3;
    let width = left;
    this.game.camera.deadzone = new Phaser.Rectangle(left, 0, width, this.game.height);

    // Speed & frame rate modifier
    let A = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
    A.onDown.add(() => {
      this.speed++;
    });
    A.onHoldCallback = () => {
      if (A.duration > 300) {
        this.speed++;
      }
    };
    let Z = this.game.input.keyboard.addKey(Phaser.Keyboard.Z);
    Z.onDown.add(() => {
      this.speed--;
    });
    Z.onHoldCallback = () => {
      if (Z.duration > 300) {
        this.speed--;
      }
    };
    let Q = this.game.input.keyboard.addKey(Phaser.Keyboard.Q);
    Q.onDown.add(() => {
      this.frameRate++;
    });
    Q.onHoldCallback = () => {
      if (Q.duration > 300) {
      this.frameRate++;        
      }
    };
    let S = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
    S.onDown.add(() => {
      this.frameRate--;
    });
    S.onHoldCallback = () => {
      if (S.duration > 300) {
        this.frameRate--;
      }
    };
  }

  update() {

    // Set collision with platforms
    let children = this.game.world.children;
    for (let i = 0; i < children.length; i++) {
      let child = children[i];
      if (child instanceof Platform) {
        this.game.physics.arcade.collide(this, child);
      }
    }

    this.speedText.text = 'Speed: ' + this.speed;
    this.frameRateText.text = 'Frame rate: ' + this.frameRate;

    this.frameRate = speedToFrameRate(this.speed);

    this.animations.currentAnim.speed = this.frameRate;

    this.body.velocity.x = 0;

    if (this.cursors.left.isDown) {
      this.body.velocity.x = -this.speed;
    } else if (this.cursors.right.isDown) {
      this.body.velocity.x = this.speed;
    }

    if (this.cursors.up.isDown) {
      if (this.body.blocked.down || this.body.touching.down) {
        this.body.velocity.y = -this.jumpForce;
      }
    }

    // Set animations and frame based on motion
    if (this.body.velocity.x > 0) {
      if (this.body.blocked.down || this.body.touching.down) {
        this.animations.play('moveRight');
      } else {
        this.animations.stop();
        this.frame = 9;
      }
    } else if (this.body.velocity.x < 0) {
      if (this.body.blocked.down || this.body.touching.down) {
        this.animations.play('moveLeft');
      } else {
        this.animations.stop();
        this.frame = 5;
      }
    } else {
      this.animations.stop();
      if (this.frame >= 8) {
        this.frame = 8;
      } else {
        this.frame = 4;
      }
    }
  }

  public equipWeapon(weapon: Weapon) {
    this.weapon = weapon;
    this.weapon.trackSprite(this);
  }

  public fire() {
    if (this.weapon) {
      this.weapon.fire();
    }
  }

  public unequipWeapon() {
    this.weapon.trackedSprite = null;
    this.weapon = null;
  }
}

function speedToFrameRate(speed: number) {
  speed = Math.abs(speed);
  
  if (speed < 15) {
    return 4;
  }
  if (speed < 50) {
    return 5;
  }
  if (speed < 75) {
    return 6;
  }
  
  return Math.floor(speed/50 + 6);
}


export class Weapon extends Phaser.Weapon {

  // private previousAmmoQuantity: number;

  // Default properties
  private defaultAmmoQuantity: number = -1;
  private defaultFireDirection: number = Phaser.ANGLE_UP;
  private defaultFireRate: number = 200;
  private defaultBulletSpeed: number = 300;
  private defaultBounceOnPlatforms: boolean = true;

  // Physics properties
  public width: number;
  public height: number;
  public angle: number = 0;

  public ammoQuantity: number;
  public fireDirection: number;
  public bounceOnPlatforms: boolean;


  constructor(public game: Phaser.Game, public key: string = '', public frame: number | string = '', opts: any = {}) {
    super(game, game.plugins);

    // Set weapon properties
    this.ammoQuantity = opts.hasOwnProperty('ammoQuantity') ? opts.ammoQuantity : this.defaultAmmoQuantity;
    this.fireDirection = opts.hasOwnProperty('fireDirection') ? opts.fireDirection : this.defaultFireDirection;
    this.fireRate = opts.hasOwnProperty('fireRate') ? opts.fireRate : this.defaultFireRate;
    this.bulletSpeed = opts.hasOwnProperty('bulletSpeed') ? opts.bulletSpeed : this.defaultBulletSpeed;
    this.bounceOnPlatforms = opts.hasOwnProperty('bounceOnPlatforms') ? opts.bounceOnPlatforms : this.defaultBounceOnPlatforms;
    
    let imgCache = this.game.cache.getImage(key);
    this.width = imgCache.width;
    this.height = imgCache.height;

    // Populate the bullet pool
    this.createBullets(this.ammoQuantity, key);
    this.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
  }

  update() {
    this.bullets.setAll('width', this.width);
    this.bullets.setAll('height', this.height);

    this.bulletAngleOffset = this.angle - this.fireAngle;
    this.fireAngle = this.fireDirection;

    if (this.bounceOnPlatforms) {
      this.bullets.forEach((bullet: Phaser.Bullet) => {
        bullet.body.bounce.y = 0.5;
      }, this);
      // Set collision with platforms
      let children = this.game.world.children;
      for (let i = 0; i < children.length; i++) {
        let child = children[i];
        if (child instanceof Platform) {
          this.game.physics.arcade.collide(this.bullets, child);
        }
      }
    }

    // Check for ammoQuantity change
    // if (this.previousAmmoQuantity != this.ammoQuantity) {
    //   this.previousAmmoQuantity = this.ammoQuantity;
    //   this.bullets.forEachDead((bullet) => bullet.destroy(), this);
    //   this.createBullets(this.ammoQuantity - this.bullets.countLiving(), this.bulletKey);
    // }
  }
}
