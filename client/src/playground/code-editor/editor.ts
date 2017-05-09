import {autoinject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {GameInfo, CodeUpdated, EditorFocus} from '../messages';
import {TranspilerService} from '../transpiler-service';
import {BackendService} from '../../backend-service';

@autoinject
export class Editor {

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

  private defaultCollision = "Collide: group.platforms and group.bodies\n";
  private worldBoundsCollision = "Collide: Board.bounds and List(/*list of bodies/groups*/)\n";

  private preloadCode: string = ""; // Not editable by user

  constructor(private ea: EventAggregator, private transpiler: TranspilerService, private backend: BackendService) {
    this.ea.subscribe(GameInfo, msg => {
      this.preloadCode = preloadCodeFromInfo(msg);
      this.createEditor.setValue(createCodeFromInfo(msg));
    });
  }

  public runCode() {
    //this.ea.publish(new CodeUpdated(this.preloadCode, this.getCreateCode(), this.getUpdateCode()));
    //console.log(this.transpiler.parseEvents(this.getEventCode()));
    console.log(this.getEventCode());
    let parseEventCodePromise = this.backend.parseEventCode(this.getEventCode());
    let parseFunctionCodePromise = this.backend.parseFunctionCode(this.getFunctionCode());

    Promise.all([parseEventCodePromise, parseFunctionCodePromise])
      .then(values => {
        console.log(values);
        let eventData = values[0];
        let functionData = values[1];
        // Add events to code
        let eventCode = this.addEvents(JSON.parse(eventData.response));
        let functionCode = this.addFunctions(JSON.parse(functionData.response));

        let createCode = this.getCreateCode() + functionCode + eventCode.create;
        let updateCode = this.getUpdateCode() + eventCode.update;

        console.log(createCode);
        console.log(updateCode);

        // Publish codes to game-container
        this.ea.publish(new CodeUpdated(this.preloadCode, createCode, updateCode));
        //console.log(data.response)

      })

  }

  private addFunctions(functions) {
    let create = '';
    console.log(functions);
    functions.forEach(func => {
      let name = func[0];
      let body = func[1];

      create += "this.userFunctions." + name + " = function() {\n";
      create += "\t" + body + ";\n";
      create += "}\n";
      create += "\n";
    });

    return create;
  }

  private addEvents(events: Array<any>): EventCode {
    let create = '';
    let update = '';
    console.log(events);
    if (events) {
      events.forEach((event, i) => {
        let condition = event[0];
        let action = event[1];
        let type = event[2];

        create += "this.userEvents.push(new Phaser.Signal());\n";
        if (type === "once") {
          create += "this.userEvents[" + i + "].addOnce(this.userFunctions." + action + ", this);\n";          
        } else {
          create += "this.userEvents[" + i + "].add(this.userFunctions." + action + ", this);\n";
        }
        create += "\n";

        update += "if (" + condition + ") {\n";
        update += "\tthis.userEvents[" + i + "].dispatch();\n";
        if (type === "when") {
          update += "\tthis.userEvents[" + i + "].active = false;\n";
          update += "} else {\n";
          update += "\tthis.userEvents[" + i + "].active = true;\n";
        }
        update += "}\n"
        update += "\n";
      });
    }

    return {create: create, update: update};
  }

  private getCreateCode() {
    return this.createEditor.getValue();
  }

  private getCollisionCode() {
      return this.collisionEditor.getValue();
  }

  private getEventCode() {
    return this.eventEditor.getValue();
  }

  private getUpdateCode() {
      return this.updateEditor.getValue();
  }

  private getFunctionCode() {
    return this.functionEditor.getValue();
  }

  private attached() {
      this.createEditor = this.createAceEditor.au.ace.viewModel.editor;
      this.collisionEditor = this.collisionAceEditor.au.ace.viewModel.editor;
      this.collisionEditor.setValue(this.defaultCollision + '\n' + this.worldBoundsCollision);
      this.eventEditor = this.eventAceEditor.au.ace.viewModel.editor;
      this.updateEditor = this.updateAceEditor.au.ace.viewModel.editor;
      this.functionEditor = this.functionAceEditor.au.ace.viewModel.editor;

      // Ask Phaser to disabled key capture
      this.createEditor.on('focus', () => this.ea.publish(new EditorFocus(true)));
      this.createEditor.on('blur', () => this.ea.publish(new EditorFocus(false)));
      this.collisionEditor.on('focus', () => this.ea.publish(new EditorFocus(true)));
      this.collisionEditor.on('blur', () => this.ea.publish(new EditorFocus(false)));
      this.eventEditor.on('focus', () => this.ea.publish(new EditorFocus(true)));
      this.eventEditor.on('blur', () => this.ea.publish(new EditorFocus(false)));
      this.updateEditor.on('focus', () => this.ea.publish(new EditorFocus(true)));
      this.updateEditor.on('blur', () => this.ea.publish(new EditorFocus(false)));
      this.functionEditor.on('focus', () => this.ea.publish(new EditorFocus(true)));
      this.functionEditor.on('blur', () => this.ea.publish(new EditorFocus(false)));
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

  return code;
}

function createCodeFromInfo(gameInfo) {
  let code = "this.scale.setGameSize(" + gameInfo.gameWidth + ", " + gameInfo.gameHeight + ");\n";
  code += "this.left = this.input.keyboard.createCursorKeys().left;\n";
  code += "this.right = this.input.keyboard.createCursorKeys().right;\n";
  code += "this.up = this.input.keyboard.createCursorKeys().up;\n";
  code += "this.down = this.input.keyboard.createCursorKeys().down;\n";
 
  if (gameInfo.backgroundColor) {
    code += "this.game.stage.backgroundColor = '" + gameInfo.backgroundColor + "';\n";
  }

  if (gameInfo.backgroundImage) {
    code += "this.background = this.add.sprite(0, 0, 'background');\n";
    code += "this.background.width = " + gameInfo.gameWidth + ";\n";
    code += "this.background.height = " + gameInfo.gameHeight + ";\n";
  }

  gameInfo.bodies.forEach(body => {
    code += "this.bodies['" + body.name + "'] = this.add.sprite(" + (body.x) + ", " + (body.y) + ", '" + body.key + "');\n"
    code += "this.bodies." + body.name + ".anchor.setTo(0.5, 0.5);\n";
    code += "this.bodies." + body.name + ".height = " + body.height + ";\n";
    code += "this.bodies." + body.name + ".width = " + body.width + ";\n";
    code += "this.physics.arcade.enable(this.bodies." + body.name + ");\n";
  });

  return code;
}

interface EventCode {
  create: string;
  update: string;
}
