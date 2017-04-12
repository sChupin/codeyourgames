import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {GameInfo, CodeUpdated} from '../messages';

@inject(EventAggregator)
export class Editor {

  private createAceEditor;
  private updateAceEditor;
  private createEditor;
  private updateEditor;

  constructor(private ea: EventAggregator) {
    this.ea.subscribe(GameInfo, msg => this.createEditor.setValue(getCreateCode(msg)));
   }

  public runCode() {
    this.ea.publish(new CodeUpdated(this.getCode()));
  }

  private getCode() {
      return this.updateEditor.getValue();
  }

  private attached() {
      this.createEditor = this.createAceEditor.au.ace.viewModel.editor;
      this.updateEditor = this.updateAceEditor.au.ace.viewModel.editor;
  }

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
