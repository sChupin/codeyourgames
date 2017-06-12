import {autoinject} from 'aurelia-framework';
import {EventAggregator, Subscription} from 'aurelia-event-aggregator';

import {GameInfo, CodeUpdated} from '../messages';
import {TranspilerService} from "../transpiler-service";

@autoinject
export class Editor {
  private subscriber: Subscription;

  private createAceEditor;
  private eventAceEditor;
  private functionAceEditor;

  private createEditor;
  private eventEditor;
  private functionEditor;

  private newEvent = "when /*event*/\nthen /*action*/\n";
  private newFunction = "function myFunction() {\n// Your code goes here\n}\n";

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
    this.eventEditor = this.eventAceEditor.au.ace.viewModel.editor;
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
      
      if (body.spritesheet === undefined) {
        code += "this.load.image('" + body.key + "', '" + body.url + "');\n"
      } else {
        code += "this.load.spritesheet('" + body.key + "', '" + body.spritesheet.sheetUrl + "', " + body.spritesheet.spriteWidth + ", " + body.spritesheet.spriteHeight + ", " + body.spritesheet.spriteNbr + ");\n";
      }
    }
  });

  return code;
}

function createCodeFromInfo(gameInfo) {
  let code = "";
  
  code += "Game.setDimensions(" + gameInfo.dimensions.width + ", " + gameInfo.dimensions.height + ");\n";

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
    code += "Game.add" + body.type.charAt(0).toUpperCase() + body.type.slice(1) + "('" + body.name + "', " + body.x + ", " + body.y + ", '" + body.key + "', " + body.width + ", " + body.height + ");\n\n";

    if (body.angle) {
      code += "Bodies." + body.name + ".pointIn(" + body.angle + ");\n";
    }

    if (body.spritesheet !== undefined) {
      code += "Bodies." + body.name + ".changeCostume(" + body.spritesheet.defaultSpriteNo + ");\n";
      body.spritesheet.animations.forEach(animation => {
        code += "Bodies." + body.name + ".addAnimation('" + animation.name + "', [" + animation.frameList + "]);\n";
      });
      code += "\n";
    }
  });

  code += "\n";

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

  let camera = gameInfo.camera;
  if (camera.enabled) {
    code += "Game.setCamera(" + camera.width + ", " + camera.height + ", Bodies." + camera.spriteName + ", '" + camera.mode + "');\n";
  }

  return code;
}

