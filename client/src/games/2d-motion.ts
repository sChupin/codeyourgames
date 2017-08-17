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

  private myDude: Phaser.Sprite;
  private cursors: Phaser.CursorKeys;

  private mode: number = 0;
  private modeText: Phaser.Text;

  private snakeModeStarted: boolean = false;

  preload() {
    this.load.image('sky', '/assets/media/phaser_img/sky.png');
    this.load.spritesheet('dude', '/assets/media/phaser_img/dude.png', 32, 48);
  }

  create() {
    // Set physics and enable body
    this.physics.startSystem(Phaser.Physics.ARCADE);
    this.world.enableBody = true;

    // Set background
    this.add.sprite(0, 0, 'sky');

    this.add.button(10, 10, 'dude', () => {this.mode = (this.mode + 1) % 4}, null, 0, 5, 8, 10);

    this.modeText = this.add.text(this.world.centerX, 10, 'Motion mode', null);
    this.modeText.anchor.setTo(0.5, 0);

    // Set dude
    this.myDude = this.add.sprite(this.world.centerX, this.world.centerY, 'dude');
    this.myDude.anchor.setTo(0.5, 0.5);
    
    this.myDude.body.collideWorldBounds = true;
    
    this.myDude.animations.add('left', [0, 1, 2, 3], 10, true);
    this.myDude.animations.add('right', [5, 6, 7, 8], 10, true);

    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update() {
    if (this.mode == 0) {
      this.modeText.text = 'Oblique mode';
      this.oblique();
    } else if (this.mode == 1) {
      this.modeText.text = 'Pokemon mode';
      this.pokemon();
    } else if (this.mode == 2) {
      this.modeText.text = 'Snake mode';
      this.snake();
    } else if (this.mode == 3) {
      this.modeText.text = 'Mario mode';
      this.mario();
    } else if (this.mode == 4) {
      this.modeText.text = 'Rotation mode';
      this.rotation();
    }
  }

  oblique() {
    this.snakeModeStarted = false;

    this.myDude.body.velocity.setTo(0, 0);
    this.myDude.body.gravity.setTo(0, 0);
    this.myDude.animations.stop();
    this.myDude.frame = 4;

    if (this.cursors.left.isDown) {
      this.myDude.body.velocity.x = -150;
    } else if (this.cursors.right.isDown) {
      this.myDude.body.velocity.x = 150;
    }
    
    if (this.cursors.up.isDown) {
      this.myDude.body.velocity.y = -150;
    } else if (this.cursors.down.isDown) {
      this.myDude.body.velocity.y = 150;
    }

    if (this.cursors.up.isDown && this.cursors.down.isDown) {
      this.myDude.body.velocity.y = 0;
    }

    if (this.cursors.left.isDown && this.cursors.right.isDown) {
      this.myDude.body.velocity.x = 0;
    }
  }

  pokemon() {
    this.snakeModeStarted = false;

    this.myDude.body.velocity.setTo(0, 0);
    this.myDude.body.gravity.setTo(0, 0);
    this.myDude.animations.stop();
    this.myDude.frame = 4;

    if (this.cursors.left.isDown) {
      this.myDude.body.velocity.x = -150;
    } else if (this.cursors.right.isDown) {
      this.myDude.body.velocity.x = 150;
    } else if (this.cursors.up.isDown) {
      this.myDude.body.velocity.y = -150;
    } else if (this.cursors.down.isDown) {
      this.myDude.body.velocity.y = 150;
    }

    if (this.cursors.up.isDown && this.cursors.down.isDown) {
      this.myDude.body.velocity.y = 0;
    }

    if (this.cursors.left.isDown && this.cursors.right.isDown) {
      this.myDude.body.velocity.x = 0;
    }
  }

  snake() {
    this.myDude.body.gravity.setTo(0, 0);
    
    if (!this.snakeModeStarted) {
      this.myDude.body.velocity.x = 150;
      this.snakeModeStarted = true;
    }

    if (this.cursors.left.isDown) {
      this.myDude.body.velocity.y = 0;
      this.myDude.body.velocity.x = -150;
    } else if (this.cursors.right.isDown) {
      this.myDude.body.velocity.y = 0;
      this.myDude.body.velocity.x = 150;
    } else if (this.cursors.up.isDown) {
      this.myDude.body.velocity.x = 0;
      this.myDude.body.velocity.y = -150;
    } else if (this.cursors.down.isDown) {
      this.myDude.body.velocity.x = 0;      
      this.myDude.body.velocity.y = 150;
    }
  }

  mario() {
    this.myDude.body.gravity.y = 500;
    
    this.myDude.body.velocity.x = 0;
    this.myDude.animations.stop();
    this.myDude.frame = 4;

    if (this.cursors.left.isDown) {
      this.myDude.body.velocity.x = -150;
    } else if (this.cursors.right.isDown) {
      this.myDude.body.velocity.x = 150;
    }

    if (this.cursors.up.isDown && (this.myDude.body.touching.down || this.myDude.body.blocked.down)) {
      this.myDude.body.velocity.y = -300;
    }
  }

  rotation() {
    
  }
}
