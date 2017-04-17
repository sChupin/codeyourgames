import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {GameInfo, CodeUpdated} from '../messages';

@inject(EventAggregator)
export class Editor {

  private createAceEditor;
  private updateAceEditor;
  private functionAceEditor;
  private createEditor;
  private updateEditor;
  private functionEditor;

  private newFunction = "function myFunction() {\n// Your code goes here\n}\n";

  private preloadCode: string = ""; // Not editable by user

  constructor(private ea: EventAggregator) {
    this.ea.subscribe(GameInfo, msg => {
      this.preloadCode = preloadCodeFromInfo(msg);
      this.createEditor.setValue(createCodeFromInfo(msg));
    });
  }

  public runCode() {
    this.ea.publish(new CodeUpdated(this.preloadCode, this.getCreateCode(), this.getUpdateCode()));
  }

  private getCreateCode() {
    return this.createEditor.getValue();
  }

  private getUpdateCode() {
      return this.updateEditor.getValue();
  }

  private getFunctionCode() {
    return this.functionEditor.getValue();
  }

  private attached() {
      this.createEditor = this.createAceEditor.au.ace.viewModel.editor;
      this.updateEditor = this.updateAceEditor.au.ace.viewModel.editor;
      this.functionEditor = this.functionAceEditor.au.ace.viewModel.editor;
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
  code += "this.load.crossOrigin = 'anonymous';\n"

  if (gameInfo.backgroundImage) {
    code += "this.load.image('background', '" + gameInfo.backgroundImage + "');\n";
  }

  gameInfo.bodies.forEach(body => {
    if (keyList.indexOf(body.key) === -1) {
      keyList.push(body.key);
      code += "this.load.image('" + body.key + "', '" + body.url + "');\n"
    }
  });

  console.log('Preload Code is:');
  console.log(code);
  return code;
}

function createCodeFromInfo(gameInfo) {
  let code = "this.scale.setGameSize(" + gameInfo.gameWidth + ", " + gameInfo.gameHeight + ");\n";
  code += "this.cursors = this.input.keyboard.createCursorKeys();\n";
 
  if (gameInfo.backgroundColor) {
    code += "this.game.stage.backgroundColor = '" + gameInfo.backgroundColor + "';\n";
  }

  if (gameInfo.backgroundImage) {
    code += "this.background = this.add.sprite(0, 0, 'background');\n";
    code += "this.background.width = " + gameInfo.gameWidth + ";\n";
    code += "this.background.height = " + gameInfo.gameHeight + ";\n";
  }

  gameInfo.bodies.forEach(body => {
    code += "this.bodies['" + body.name + "'] = this.add.sprite(" + (body.x + body.width/2) + ", " + (body.y + body.height/2) + ", '" + body.key + "');\n"
    code += "this.bodies." + body.name + ".anchor.setTo(0.5, 0.5);\n";
  });
  
  return code;
}
