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
    // this.world.enableBody = true;

    // Set background
    this.add.sprite(0, 0, 'sky');

    // add a controllable (arrow keys/space bar) Mario-like player character
    const mario = this.game.add.existing(new Zelda({
      game: this.game,
      key: 'dude',
      controls: true,
      frame: 4,
      jumps: 5
    }));
    
    // this.myDude.body.collideWorldBounds = true;
    
    // this.myDude.animations.add('left', [0, 1, 2, 3], 10, true);
    // this.myDude.animations.add('right', [5, 6, 7, 8], 10, true);

    // this.cursors = this.input.keyboard.createCursorKeys();
  }

  update() {
  }
}

class Zelda extends Phaser.Sprite {
  private state;
  private speed;
  private cursors;
  private matchDiagonalSpeed;
  private pythInverse;
  
    constructor( opts ){
        super( opts.game, opts.x || 0, opts.y || 0, opts.key || '', opts.frame || '' )

        // Enable player physics
        this.game.physics.enable( this, Phaser.Physics.ARCADE )

        // Player specifics
        this.body.collideWorldBounds = opts.hasOwnProperty('collideWorldBounds') ? opts.collideWorldBounds : true
        this.body.setSize( opts.width || 64, opts.height || 64 )
        this.health = opts.health || 1

        // Shortcut to current state object
        this.state = this.game.state.states[this.game.state.current]

        // Set up speed values
        this.speed = opts.speed || 350

        // Set up controls
        if( opts.hasOwnProperty('controls') ){
            this.cursors = this.game.input.keyboard.createCursorKeys()
        }

        // Set up diagonal movement dampener
        this.matchDiagonalSpeed =  opts.matchDiagonalSpeed || true

        // Shortcut to inverse of Pythagorean constant
        // (used to make diagonal speed match straight speed)
        this.pythInverse = 1 / Math.SQRT2
    }

    die() {
      this.kill();
    }

    update(){
        // basic living/dying checks
        if( !this.alive ) return
        if( this.health <= 0 ){
            this.die()
        }

        // horizontal movement
        if( this.cursors.left.isDown ){
            this.body.velocity.x = -1
        } else if ( this.cursors.right.isDown ){
            this.body.velocity.x = 1
        } else {
            this.body.velocity.x = 0
        }

        // vertical movement
        if( this.cursors.up.isDown ){
            this.body.velocity.y = -1
        } else if ( this.cursors.down.isDown ){
            this.body.velocity.y = 1
        } else {
            this.body.velocity.y = 0
        }

        // If the player is moving diagonally, the resultant vector
        // will have a magnitude greather than the defined speed.
        // This section makes the magnitude of the player's movement
        // match the defined speed.
        let targetSpeed =
            (this.body.velocity.x != 0 && this.body.velocity.y != 0) ?
            this.speed * this.pythInverse :
            this.speed

        this.body.velocity.x *= targetSpeed
        this.body.velocity.y *= targetSpeed
    }
}
