import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {GameInfo, CodeUpdated} from '../messages';

@inject(EventAggregator)
export class Editor {

  private createAceEditor;
  private updateAceEditor;
  private createEditor;
  private updateEditor;

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

  private getUpdateCode() {
      return this.updateEditor.getValue();
  }

  private getCreateCode() {
    return this.createEditor.getValue();
  }

  private attached() {
      this.createEditor = this.createAceEditor.au.ace.viewModel.editor;
      this.updateEditor = this.updateAceEditor.au.ace.viewModel.editor;
  }

}

function preloadCodeFromInfo(gameInfo) {
  let code = "";

  // Allow cross-origin
  code += "this.load.crossOrigin = 'anonymous';\n"

  gameInfo.bodies.forEach(body => {
    code += "this.load.image('" + body.key + "', '" + body.url + "');\n"
  });

  console.log('Preload Code is:');
  console.log(code);
  return code;
}

function createCodeFromInfo(gameInfo) {
  let code = "this.cursors = this.input.keyboard.createCursorKeys();\n";
 
  if (gameInfo.backgroundColor) {
    code += "this.game.stage.backgroundColor = '" + gameInfo.backgroundColor + "';\n";
  }

  gameInfo.bodies.forEach(body => {
    code += "this.bodies['" + body.name + "'] = this.add.sprite(" + (body.x + body.width/2) + ", " + (body.y + body.height/2) + ", '" + body.key + "');\n"
    code += "this.bodies." + body.name + ".anchor.setTo(0.5, 0.5);\n";
  });
  
  return code;
}
