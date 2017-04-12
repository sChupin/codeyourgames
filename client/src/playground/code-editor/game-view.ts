import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {CodeUpdated, GameInfo} from '../messages';
import Phaser = require('phaser');

@inject(EventAggregator)
export class GameView {

  private gameContainer: GameContainer;
  private gameInfo;

  constructor(private ea: EventAggregator) {
    ea.subscribe(CodeUpdated, msg => this.update(msg.code));
    ea.subscribe(GameInfo, msg => this.gameInfo = msg);
  }

  private update(updateCode: string) {
    if (!this.gameInfo) {
      console.log('You need to initialize the board first');
      return;
    }
    
    if (this.gameContainer != null) {
      this.gameContainer.destroy();
    }

    let preloadCode = getPreloadCode(this.gameInfo);

    let createCode = getCreateCode(this.gameInfo);
    //let createCode = setUpBoard(this.gameInfo);
    this.gameContainer = new GameContainer(preloadCode, createCode, updateCode);
  }

  detached() {
    if (this.gameContainer != null) {
      this.gameContainer.destroy();
    }
  }
/*
  private updateIframe(userCode: string) {

    // Refresh the iframe
    document.getElementsByTagName('iframe')[0].remove();
    let iframe = document.createElement('iframe');
    iframe.className = 'game-view';
    let right = document.getElementById('right');
    right.appendChild(iframe);
    let frameDoc = iframe.contentDocument;

    if (iframe.contentWindow) {
      frameDoc = iframe.contentWindow.document; // IE
    }

    // Construct the code
    let code: string = this.constructCode(userCode);

    // Write into iframe
    frameDoc.open();
    frameDoc.writeln(userCode);
    frameDoc.close();

    // Set focus on iframe
    iframe.contentWindow.focus();
  }
*/
/*
  private constructCode(userCode: string) {
    let code: string;

    code = '<h1 id="title">Test</h1>'
         + '<script>'
         + 'var game = new Phaser.Game(800, 600, Phaser.AUTO, \'\', { preload: preload, create: create, update: update });'
         + 'function preload() {'
         //+ 'game.load.image(\'sky\', \'media/phaser_assets/sky.png\');'
         + '}'
         + 'function create() {'
         + '}'
         + 'function update() {'
         + '}'
         + '</script>';
    
    return code;
  }
  */

}

function getPreloadCode(gameInfo) {
  let code = "";
  if (gameInfo.backgroundColor) {
    code += "this.game.stage.backgroundColor = '" + gameInfo.backgroundColor + "';\n";
  }

  // Allow cross-origin
  code += "this.load.crossOrigin = 'anonymous';\n"

  gameInfo.bodies.forEach(body => {
    code += "this.load.image('" + body.key + "', '" + body.url + "');\n"
  });

  console.log('Preload Code is:');
  console.log(code);
  return code;
}

function getCreateCode(gameInfo) {
  let code = "this.cursors = this.input.keyboard.createCursorKeys();\n";
  // if (gameInfo.backgroundImage) {
  //   code += "this.add.sprite(0, 0, '" + gameInfo.backgroundImage.key + "');\n";
  // }
  // add background image key to key list
  // Modify first how background image is set

  gameInfo.bodies.forEach(body => {
    // code += "var " + body.name + " = this.add.sprite(" + body.x + ", " + body.y + ", '" + body.key + "');\n"
    code += "this.bodies['" + body.name + "'] = this.add.sprite(" + body.x + ", " + body.y + ", '" + body.key + "');\n"
  });

  return code;
}

/*
function getCreateCode() {

  return `this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

    // Set physics and enable body
    this.physics.startSystem(Phaser.Physics.ARCADE);
    this.world.enableBody = true;

    // Set background
    this.add.sprite(0, 0, 'sky');

    // Create platform group
    this.platforms = this.add.physicsGroup();
    

    // Set ground and ledges
    let ground = this.platforms.create(0, this.game.height, 'ground');
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

    this.cursors = this.input.keyboard.createCursorKeys();`;
}
*/
class GameContainer extends Phaser.Game {
  constructor(preloadCode: string, createCode: string, updateCode: string, width: number = 400, height: number = 300) {
    super(width, height, Phaser.AUTO, 'game-container', null);
    GameWorld.prototype.userPreload = Function(preloadCode);
    GameWorld.prototype.userCreate = Function(createCode);
    GameWorld.prototype.userUpdate = Function(updateCode);

    this.state.add('main', GameWorld);
    this.state.start('main');
  }
}

interface GameWorld {
  userPreload: Function;
  userCreate: Function;
  userUpdate: Function;
  userRender: Function;
}

class GameWorld extends Phaser.State {
  
  private bodies: any = {};

  private myDude: Phaser.Sprite;
  private platforms: Phaser.Group;
  private stars: Phaser.Group;

  private score: number = 0;
  private scoreText: Phaser.Text;

  private cursors: Phaser.CursorKeys;

  private left;
  private right;
  private up;
  private down;

  preload() {
    // this.load.image('sky', '/media/phaser_img/sky.png');
    // this.load.image('ground', '/media/phaser_img/ground.png');
    // this.load.image('star', '/media/phaser_img/star.png');
    // this.load.spritesheet('dude', '/media/phaser_img/dude.png', 32, 48);
    this.userPreload();
  }

  create() {
    this.userCreate();
  }

  update() {
    this.userUpdate();
  }

}
