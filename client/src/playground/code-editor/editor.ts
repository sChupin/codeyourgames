import {autoinject} from 'aurelia-framework';
import {EventAggregator, Subscription} from 'aurelia-event-aggregator';

import {GameInfo, CodeUpdated} from '../messages';
import {TranspilerService} from "../transpiler-service";

@autoinject
export class Editor {
  private subscriber: Subscription;

  private gameWidth: number;
  private gameHeight: number;

  private createAceEditor;
  private collisionAceEditor;
  private eventAceEditor;
  private updateAceEditor;
  private functionAceEditor;

  private createEditor;
  private collisionEditor;
  private eventEditor;
  private updateEditor;
  private functionEditor;

  private newEvent = "when /*event*/\nthen /*action*/\n";
  private newCollisionPair = "Collide: /*first body/group*/ and /*second body/group*/\n";
  private newFunction = "function myFunction() {\n// Your code goes here\n}\n";

  private defaultCollision = "Collide: Group.platforms and Group.bodies\n";
  private worldBoundsCollision = "Collide: Game.bounds and List(/*list of bodies/groups*/)\n";

  private preloadCode: string = ""; // Not editable by user

  constructor(private ea: EventAggregator, private transpiler: TranspilerService) { }

  attached() {
    // Process game info from board initializer
    this.subscriber = this.ea.subscribe(GameInfo, msg => {
      this.preloadCode = preloadCodeFromInfo(msg);
      this.createEditor.setValue(createCodeFromInfo(msg));
    });

    // Initialise editors
    this.createEditor = this.createAceEditor.au.ace.viewModel.editor;
    this.collisionEditor = this.collisionAceEditor.au.ace.viewModel.editor;
    this.collisionEditor.setValue(this.defaultCollision + '\n' + this.worldBoundsCollision);
    this.eventEditor = this.eventAceEditor.au.ace.viewModel.editor;
    this.updateEditor = this.updateAceEditor.au.ace.viewModel.editor;
    this.functionEditor = this.functionAceEditor.au.ace.viewModel.editor;
  }

  detached() {
    this.subscriber.dispose();
  }

  /**
   * Execute the code from all editors
   */
  public runCode() {
    this.transpiler.transpile(
      this.preloadCode,
      this.createEditor.getValue(),
      this.eventEditor.getValue(),
      this.functionEditor.getValue()
    );
  }

  private addNewCollisionPair() {
    let code = this.collisionEditor.getValue() ? this.collisionEditor.getValue() + "\n" + this.newCollisionPair : this.newCollisionPair;
    this.collisionEditor.setValue(code, 1);
  }

  private addNewEvent() {
    let code = this.eventEditor.getValue() ? this.eventEditor.getValue() + "\n" + this.newEvent : this.newEvent;
    this.eventEditor.setValue(code, 1);
  }

  private addNewFunction() {
    let code = this.functionEditor.getValue() ? this.functionEditor.getValue() + "\n" + this.newFunction : this.newFunction;
    this.functionEditor.setValue(code, 1);
  }
}

function preloadCodeFromInfo(gameInfo) {
  let keyList: Array<string> = [];

  let code = "";

  // Allow cross-origin
  code += "this.load.crossOrigin = 'anonymous';\n";

  // Load background image
  if (gameInfo.backgroundImage) {
    code += "this.load.image('background', '" + gameInfo.backgroundImage + "');\n";
  }

  // Load each image asset once
  gameInfo.bodies.forEach(body => {
    if (keyList.indexOf(body.key) === -1) {
      keyList.push(body.key);
      code += "this.load.image('" + body.key + "', '" + body.url + "');\n"
    }
  });

  return code;
}

function createCodeFromInfo(gameInfo) {
  let code = "";
  
  // Add background color
  if (gameInfo.backgroundColor) {
    code += "Game.setBackgroundColor('" + gameInfo.backgroundColor + "');\n";
  }

  // Add background image
  if (gameInfo.backgroundImage) {
    code += "Game.setBackground('background');\n";
  }

  // Add each body on the board
  gameInfo.bodies.forEach(body => {
    code += "Game.addBody('" + body.name + "', " + body.x + ", " + body.y + ", '" + body.key + "', " + body.height + ", " + body.width + ");\n"
  });

  for (var grpName in gameInfo.groups) {
    if (gameInfo.groups.hasOwnProperty(grpName)) {
      code += "Game.addGroup('" + grpName + "');\n";

      var group = gameInfo.groups[grpName];
      code += "Groups." + grpName + ".add("
      group.forEach((child, index, array) => {
        code += "Bodies." + child;
        if (index != array.length - 1) {
          code += ", ";
        }
      });
      code += ");\n";
    }
  }

  return code;
}

