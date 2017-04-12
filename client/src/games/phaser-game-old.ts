import Phaser = require('phaser');

export class PhaserGame {
  
  private game: Phaser.Game;

  private myDude: Phaser.Sprite;
  private platforms: Phaser.Group;
  private stars: Phaser.Group;

  private score: number = 0;
  private scoreText: Phaser.Text;

  private cursors: Phaser.CursorKeys;

  attached() {
    this.game = new Phaser.Game(800, 500, Phaser.AUTO, 'game-container', this);
  }

  private preload() {
    this.game.load.image('sky', '/media/phaser_img/sky.png');
    this.game.load.image('ground', '/media/phaser_img/ground.png');
    this.game.load.image('star', '/media/phaser_img/star.png');
    this.game.load.spritesheet('dude', '/media/phaser_img/dude.png', 32, 48);
  }

  private create() {

    // Set physics and enable body
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.world.enableBody = true;

    // Set background
    this.game.add.sprite(0, 0, 'sky');

    // Create platform group
    this.platforms = this.game.add.physicsGroup();
    

    // Set ground and ledges
    let ground: Phaser.Sprite = this.platforms.create(0, this.game.height, 'ground');
    ground.anchor.setTo(0,1);
    ground.scale.setTo(2,2);

    let ledge = this.platforms.create(400, 300, 'ground');
    ledge = this.platforms.create(-150, 150, 'ground');

    // Create star group
    this.stars = this.game.add.physicsGroup();

    // Set stars
    for (let i = 0; i < 10; i++) {
      let star = this.stars.create(80 + i*70, 100, 'star');
      star.body.bounce.y = 0.5 + Math.random()*0.2;
    }

    this.stars.setAll('body.gravity.y', 50);

    // Set dude
    this.myDude = this.game.add.sprite(100, 100, 'dude');
    
    this.myDude.body.collideWorldBounds = true;
    this.myDude.body.gravity.y = 100;
    
    this.myDude.animations.add('left', [0, 1, 2, 3], 10, true);
    this.myDude.animations.add('right', [5, 6, 7, 8], 10, true);

    // Set platforms immovable
    this.platforms.setAll('body.immovable', true);

    // Set the score
    this.scoreText = this.game.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });

    this.cursors = this.game.input.keyboard.createCursorKeys();
  }

  private update() {
    this.game.physics.arcade.collide(this.myDude, this.platforms);

    this.game.physics.arcade.collide(this.stars, this.platforms);

    this.game.physics.arcade.overlap(this.myDude, this.stars, this.collectStar, null, this);

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

    private collectStar(dude: Phaser.Sprite, star: Phaser.Sprite) {
    star.kill();

    this.score += 10;
    this.scoreText.text = 'Score: ' + this.score;
  }

  detached() {
    this.game.destroy();
  }

}
