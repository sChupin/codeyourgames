import {EventAggregator, Subscription} from "aurelia-event-aggregator";
import {autoinject} from "aurelia-framework";

import {CodeUpdated, EditorFocus} from "./messages";

import Phaser = require('phaser');

@autoinject
export class GameContainer {
  private codeUpdateSubscriber: Subscription;
  private editorFocusSubscriber: Subscription;

  private game: Game;

  private gamePaused = false;

  constructor(private ea: EventAggregator) { }

  attached() {
    this.codeUpdateSubscriber = this.ea.subscribe(CodeUpdated, msg => this.update(msg.preloadCode, msg.createCode, msg.updateCode));
    
    // Disable/enable key capture when editor is focused/blur
    this.editorFocusSubscriber = this.ea.subscribe(EditorFocus, msg => {
      if (this.game) {
        this.game.input.enabled = !msg.focused;
      }
    })
  }

  private update(preloadCode: string, createCode: string, updateCode: string) {    
    if (this.game != null) {
      this.game.destroy();
    }

    this.game = new Game(preloadCode, createCode, updateCode);
  }

  detached() {
    this.codeUpdateSubscriber.dispose();
    if (this.game != null) {
      this.game.destroy();
    }
    this.editorFocusSubscriber.dispose();
  }

  private pauseGame() {
    if (this.game) {
      this.game.paused = !this.gamePaused;
      this.gamePaused = !this.gamePaused;
    }
  }

}

class Game extends Phaser.Game {
  constructor(preloadCode: string, createCode: string, updateCode: string, containerId: string = "game-container", width: number = 400, height: number = 300) {
    super(width, height, Phaser.AUTO, containerId, null);
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
  
  private background;

  private bodies: any = {};

  private cursors: Phaser.CursorKeys;
  private left;
  private right;
  private up;
  private down;

  private Keyboard = {};

  preload() {
    this.userPreload();
  }

  create() {
    this.Keyboard['A'] = this.input.keyboard.addKey(Phaser.Keyboard.A);
    this.Keyboard['B'] = this.input.keyboard.addKey(Phaser.Keyboard.B);
    this.Keyboard['C'] = this.input.keyboard.addKey(Phaser.Keyboard.C);
    this.Keyboard['D'] = this.input.keyboard.addKey(Phaser.Keyboard.D);
    this.Keyboard['E'] = this.input.keyboard.addKey(Phaser.Keyboard.E);
    this.Keyboard['F'] = this.input.keyboard.addKey(Phaser.Keyboard.F);
    this.Keyboard['G'] = this.input.keyboard.addKey(Phaser.Keyboard.G);
    this.Keyboard['H'] = this.input.keyboard.addKey(Phaser.Keyboard.H);
    this.Keyboard['I'] = this.input.keyboard.addKey(Phaser.Keyboard.I);
    this.Keyboard['J'] = this.input.keyboard.addKey(Phaser.Keyboard.J);
    this.Keyboard['K'] = this.input.keyboard.addKey(Phaser.Keyboard.K);
    this.Keyboard['L'] = this.input.keyboard.addKey(Phaser.Keyboard.L);
    this.Keyboard['M'] = this.input.keyboard.addKey(Phaser.Keyboard.M);
    this.Keyboard['N'] = this.input.keyboard.addKey(Phaser.Keyboard.N);
    this.Keyboard['O'] = this.input.keyboard.addKey(Phaser.Keyboard.O);
    this.Keyboard['P'] = this.input.keyboard.addKey(Phaser.Keyboard.P);
    this.Keyboard['Q'] = this.input.keyboard.addKey(Phaser.Keyboard.Q);
    this.Keyboard['R'] = this.input.keyboard.addKey(Phaser.Keyboard.R);
    this.Keyboard['S'] = this.input.keyboard.addKey(Phaser.Keyboard.S);
    this.Keyboard['T'] = this.input.keyboard.addKey(Phaser.Keyboard.T);
    this.Keyboard['U'] = this.input.keyboard.addKey(Phaser.Keyboard.U);
    this.Keyboard['V'] = this.input.keyboard.addKey(Phaser.Keyboard.V);
    this.Keyboard['W'] = this.input.keyboard.addKey(Phaser.Keyboard.W);
    this.Keyboard['X'] = this.input.keyboard.addKey(Phaser.Keyboard.X);
    this.Keyboard['Y'] = this.input.keyboard.addKey(Phaser.Keyboard.Y);
    this.Keyboard['Z'] = this.input.keyboard.addKey(Phaser.Keyboard.Z);

    this.Keyboard['UP'] = this.input.keyboard.addKey(Phaser.Keyboard.UP);
    this.Keyboard['DOWN'] = this.input.keyboard.addKey(Phaser.Keyboard.DOWN);
    this.Keyboard['RIGHT'] = this.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    this.Keyboard['LEFT'] = this.input.keyboard.addKey(Phaser.Keyboard.LEFT);

    this.Keyboard['SPACEBAR'] = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);    
    
    this.game.onPause.add(() => {console.log("game pause"); this.input.enabled = false;}, this);
    this.game.onResume.add(() => {console.log("game resumed"); this.input.enabled = true;}, this);

    this.userCreate();
  }

  update() {
    this.userUpdate();
  }
}
