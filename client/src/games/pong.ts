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

  private paddle1: Phaser.Sprite;
  private paddle2: Phaser.Sprite;

  private ball: Phaser.Sprite;

  private ball_launched: boolean;
  private ball_velocity: number;

  private score1_text: Phaser.BitmapText;
  private score2_text: Phaser.BitmapText;

  private score1: number;
  private score2: number;

  preload() {
    this.load.image('paddle', '/media/phaser_img/paddle.png');
    this.load.image('ball', '/media/phaser_img/ball.png');
    this.load.bitmapFont('font', '/media/phaser_img/font.png', '/media/phaser_img/font.xml');
    this.load.audio('hit1', '/media/hit1.mp3');
    this.load.audio('hit2', '/media/hit2.mp3');
  }

  create() {

    this.ball_launched = false;
    this.ball_velocity = 400;

    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.world.enableBody = true;

    this.paddle1 = this.createPaddle(0, this.game.world.centerY);
    this.paddle2 = this.createPaddle(this.game.world.width - 8, this.game.world.centerY);

    this.ball = this.createBall(this.game.world.centerX, this.game.world.centerY);
    this.game.input.onDown.add(this.launch_ball, this);

    // this.score1_text = this.game.add.text(128, 128, '0', {
    //   font: '64px Gabriella',
    //   fill: '#ffffff',
    //   align: 'center'
    // });

    // this.score2_text = this.game.add.text(this.game.world.width - 128, 128, '0', {
    //   font: '64px Gabriella',
    //   fill: '#ffffff',
    //   align: 'center'
    // });

    this.score1_text = this.add.bitmapText(128, 128, 'font', '0', 64);
    this.score2_text = this.add.bitmapText(this.world.width - 128, 128, 'font', '0', 64);

    this.score1 = 0;
    this.score2 = 0;

  }

  update() {

    this.score1_text.text = this.score1.toString();
    this.score2_text.text = this.score2.toString();

    this.controlPaddle(this.paddle1, this.game.input.y);
    this.physics.arcade.collide(this.paddle1, this.ball, this.ballBounce, null, this);
    this.physics.arcade.collide(this.paddle2, this.ball, this.ballBounce, null, this);

    if (this.ball.body.blocked.left) {
      this.score2 += 1;
    }

    if (this.ball.body.blocked.right) {
      this.score1 += 1;
    }

    if (this.paddle2.y < this.ball.y && this.ball.body.velocity.y < 0
        || this.paddle2.y > this.ball.y && this.ball.body.velocity.y > 0) {
      this.paddle2.body.velocity.setTo(0, - this.ball.body.velocity.y);
    } else {
      this.paddle2.body.velocity.setTo(0, this.ball.body.velocity.y);
    }
    this.paddle2.body.maxVelocity.y = 200;
  }

  render() {
    this.game.debug.bodyInfo(this.ball, 32, 32, 'white');
  }

  private createPaddle(x: number, y: number): Phaser.Sprite {
    let paddle = this.game.add.sprite(x, y, 'paddle');
    paddle.scale.setTo(0.5);
    paddle.anchor.setTo(0.5, 0.5);
    //paddle.body.collideWorldBounds = true;
    paddle.body.immovable = true;

    return paddle;
  }
  
  private createBall(x: number, y: number): Phaser.Sprite {
    let ball = this.game.add.sprite(x, y, 'ball');
    ball.anchor.setTo(0.5, 0.5);
    ball.body.collideWorldBounds = true;
    ball.body.bounce.setTo(1);

    return ball;
  }

  private controlPaddle(paddle: Phaser.Sprite, y: number): void {
    paddle.y = y;
    
    if (paddle.y < paddle.height / 2) {
      paddle.y = paddle.height / 2;
    } else if (paddle.y > this.game.world.height - paddle.height / 2) {
      paddle.y = this.game.world.height - paddle.height / 2;
    }
  }

  private launch_ball() {
    if (this.ball_launched) {
      this.ball.x = this.game.world.centerX;
      this.ball.y = this.game.world.centerY;
      this.ball.body.velocity.setTo(0);
      this.ball_launched = false;
    } else {
      this.ball.body.velocity.x = - this.ball_velocity;
      this.ball.body.velocity.y = this.ball_velocity;
      this.ball_launched = true;
    }
  }

  private ballBounce(paddle, ball) {
    let angle = Math.random() * 120 - 60;
    let velocity;
    if (paddle.x < this.world.centerX) {
      this.sound.play('hit1');
      velocity = this.ball_velocity;
    } else {
      this.sound.play('hit2');
      velocity = - this.ball_velocity;
    }
    this.physics.arcade.velocityFromAngle(angle, velocity*1.5, ball.body.velocity);
  }

}
