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
  private platforms: Phaser.Group;
  private stars: Phaser.Group;

  private score: number = 0;
  private scoreText: Phaser.Text;

  private cursors: Phaser.CursorKeys;
  
  private test: Phaser.Sprite;

  private myTween: Phaser.Tween;

  private space: Phaser.Key;

  private follow: boolean = false;

  preload() {
    this.load.image('sky', '/media/phaser_img/sky.png');
    this.load.image('ground', '/media/phaser_img/ground.png');
    this.load.image('star', '/media/phaser_img/star.png');
    this.load.spritesheet('dude', '/media/phaser_img/dude.png', 32, 48);
  }

  create() {
    // Set physics and enable body
    this.physics.startSystem(Phaser.Physics.ARCADE);
    this.world.enableBody = true;

    // Set background
    this.add.sprite(0, 0, 'sky');

    // Create platform group
    this.platforms = this.add.physicsGroup();
    

    // Set ground and ledges
    let ground: Phaser.Sprite = this.platforms.create(0, this.game.height, 'ground');
    ground.anchor.setTo(0,1);
    ground.scale.setTo(2,2);

    let ledge = this.platforms.create(400, 300, 'ground');
    ledge = this.platforms.create(-150, 150, 'ground');

    // Create star group
    this.stars = this.add.physicsGroup();

    // Set stars
    for (let i = 0; i < 10; i++) {
      let star = this.stars.create(80 + i*70, 100, 'star');
      star.body.bounce.y = 0.5 + Math.random()*0.2;
    }

    this.stars.setAll('body.gravity.y', 50);

    // Set dude
    this.myDude = this.add.sprite(100, 100, 'dude');
    
    this.myDude.body.collideWorldBounds = true;
    this.myDude.body.gravity.y = 100;
    
    this.myDude.animations.add('left', [0, 1, 2, 3], 10, true);
    this.myDude.animations.add('right', [5, 6, 7, 8], 10, true);

    // Set platforms immovable
    this.platforms.setAll('body.immovable', true);

    // Set the score
    this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });

    this.cursors = this.input.keyboard.createCursorKeys();

    this.test = this.add.sprite(this.world.centerX, this.world.centerY, 'dude');
    this.test.body.velocity.x = -10;
    
    this.myTween = this.add.tween(this.test);
    this.myTween.to({x: this.world.centerX+10, y: this.world.centerY+10}, 1000);

    this.space = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.space.onDown.add(this.toggleFollow, this);
    
    this.test.anchor.setTo(0.5);
    //this.test.angle = 45;

    // this.test.inputEnabled = true;
    // this.test.events.onInputUp.add((dude) => dude.body.velocity.x += 25);

  }
  private toggleFollow = function () {
    this.follow = !this.follow;
  }
  update() {

    this.scoreText.text = 'Score: ' + this.score;

    this.game.physics.arcade.collide(this.myDude, this.platforms);
    this.game.physics.arcade.collide(this.stars, this.platforms);
    this.game.physics.arcade.overlap(this.myDude, this.stars, this.collectStar , null, this);
    
    if (this.follow == true) {
      if (this.physics.arcade.distanceToPointer(this.test) < 5) {
        this.test.position.x = this.input.activePointer.position.x;
        this.test.position.y = this.input.activePointer.position.y;
        this.test.body.velocity.setTo(0);
      } else {
        this.physics.arcade.moveToObject(this.test, {x: this.input.activePointer.x, y: this.input.activePointer.y}, 200);
      }
    } else {
      this.test.body.velocity.setTo(0);
    }


    if (this.cursors.left.isDown) {

      this.myDude.body.velocity.x = -150;

      if (this.myDude.body.touching.down) {
        this.myDude.animations.play('left');
      } else {
        this.myDude.animations.stop();
        this.myDude.frame = 3;
      }

    } else if (this.cursors.right.isDown) {
      this.myDude.body.velocity.x = 150;

      if (this.myDude.body.touching.down) {
        this.myDude.animations.play('right');
      } else {
        this.myDude.animations.stop();
        this.myDude.frame = 8;
      }

    } else {

      this.myDude.body.velocity.x = 0;

      this.myDude.animations.stop();
      this.myDude.frame = 4;

    }

    if (this.cursors.up.isDown && this.myDude.body.touching.down) {
      this.myDude.body.velocity.y = -200;
    }
    
  }

  render() {
    this.game.debug.bodyInfo(this.test, 32, 32, 'white');
  }

  private collectStar(dude: Phaser.Sprite, star: Phaser.Sprite) {
    star.kill();

    this.score += 10;
  }

}
