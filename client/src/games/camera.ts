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
    super(800, 500, Phaser.CANVAS, 'game-container', null);
    this.state.add('main', GameWorld);
    this.state.start('main');
  }
}

class GameWorld extends Phaser.State {

  private myDude: Phaser.Sprite;
  private cursors: Phaser.CursorKeys;

  private mode: number = 0;
  private modeText: Phaser.Text;

  preload() {
    this.load.image('background', '/assets/media/phaser_img/debug-grid-1920x1920.png');
    this.load.spritesheet('dude', '/assets/media/phaser_img/dude.png', 32, 48);
  }

  create() {
    // Set physics and enable body
    this.physics.startSystem(Phaser.Physics.ARCADE);
    this.world.enableBody = true;

    // Set background
    this.add.sprite(0, 0, 'background');
    this.world.setBounds(0, 0, 1920, 1920);

    this.add.button(10, 10, 'dude', () => {this.mode = (this.mode + 1) % 3}, null, 0, 5, 8, 10);

    this.modeText = this.add.text(400, 10, 'Motion mode', null);
    this.modeText.anchor.setTo(0.5, 0);
    this.modeText.fixedToCamera = true;
    // this.modeText.cameraOffset.setTo(400, 10);

    // Set dude
    this.myDude = this.add.sprite(150, 150, 'dude');
    this.myDude.anchor.setTo(0.5, 0.5);
    
    this.myDude.body.collideWorldBounds = true;
    
    this.myDude.animations.add('left', [0, 1, 2, 3], 10, true);
    this.myDude.animations.add('right', [5, 6, 7, 8], 10, true);

    this.myDude.frame = 4;

    // Set motion
    //this.cursors = this.input.keyboard.createCursorKeys();
    let upKey = this.input.keyboard.addKey(Phaser.Keyboard.UP);
    upKey.onDown.add(() => {
      this.myDude.body.velocity.y = -300;
    });
    upKey.onUp.add(() => {
      if (!downKey.isDown) {
        this.myDude.body.velocity.y = 0;
      } else {
        this.myDude.body.velocity.y = 300;
      }
    });
    let downKey = this.input.keyboard.addKey(Phaser.Keyboard.DOWN);
    downKey.onDown.add(() => {
      this.myDude.body.velocity.y = 300;
    });
    downKey.onUp.add(() => {
      if (!upKey.isDown) {
        this.myDude.body.velocity.y = 0;
      } else {
        this.myDude.body.velocity.y = -300;
      }
    });
    let rightKey = this.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    rightKey.onDown.add(() => {
      this.myDude.body.velocity.x = 300;
    });
    rightKey.onUp.add(() => {
      if (!leftKey.isDown) {
        this.myDude.body.velocity.x = 0;
      } else {
        this.myDude.body.velocity.x = -300;
      }
    });
    let leftKey = this.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    leftKey.onDown.add(() => {
      this.myDude.body.velocity.x = -300;
    });
    leftKey.onUp.add(() => {
      if (!rightKey.isDown) {
        this.myDude.body.velocity.x = 0;
      } else {
        this.myDude.body.velocity.x = 300;
      }
    });
    

    this.camera.follow(this.myDude);

    
  }

  update() {
    //this.motion(500);
    if (this.mode == 0) {
      this.modeText.text = 'Basic Follow';
      this.camera.follow(this.myDude);      
    } else if (this.mode == 1) {
      this.modeText.text = 'Smooth Follow';
      this.camera.follow(this.myDude, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
    } else if (this.mode == 2) {
      this.modeText.text = 'Dead Zone';
      this.camera.follow(this.myDude);      
      this.camera.deadzone = new Phaser.Rectangle(100, 100, 600, 300);
    }
  }

  motion(speed: number = 150) {
    this.myDude.body.velocity.setTo(0, 0);
    this.myDude.animations.stop();
    this.myDude.frame = 4;

    if (this.cursors.left.isDown) {
      this.myDude.body.velocity.x = -speed;
    } else if (this.cursors.right.isDown) {
      this.myDude.body.velocity.x = speed;
    }
    
    if (this.cursors.up.isDown) {
      this.myDude.body.velocity.y = -speed;
    } else if (this.cursors.down.isDown) {
      this.myDude.body.velocity.y = speed;
    }

    if (this.cursors.up.isDown && this.cursors.down.isDown) {
      this.myDude.body.velocity.y = 0;
    }

    if (this.cursors.left.isDown && this.cursors.right.isDown) {
      this.myDude.body.velocity.x = 0;
    }
  }

  render() {
    if (this.mode == 2) {
      this.game.context.fillStyle = 'rgba(255, 0, 0, 0.4)';
      this.game.context.fillRect(100, 100, 600, 300)
    }
  }
}
