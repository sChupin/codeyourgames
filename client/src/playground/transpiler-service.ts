import {autoinject} from "aurelia-framework";
import {EventAggregator} from 'aurelia-event-aggregator';

import {CodeUpdated} from "./messages";
import {BackendService} from '../backend-service';

@autoinject
export class TranspilerService {

  constructor(private ea: EventAggregator, private backend: BackendService) { }

  transpile(preloadCode, createCode, eventCode, functionCode, collisionCode) {
    let parseEventCodePromise = this.backend.parseEventCode(eventCode);
    let parseFunctionCodePromise = this.backend.parseFunctionCode(functionCode);
    let parseCollisionCodePromise = this.backend.parseCollisionCode(collisionCode);

    Promise.all([parseEventCodePromise, parseFunctionCodePromise, parseCollisionCodePromise])
      .then(values => {
        let eventData = values[0];
        let functionData = values[1];
        let collisionData = values[2];

        // Add events, functions and collision to code
        let eventCode = this.addEvents(JSON.parse(eventData.response));
        let functionCode = this.addFunctions(JSON.parse(functionData.response));
        let collisionCode = this.addCollisions(JSON.parse(collisionData.response));

        let create = createCode + functionCode + eventCode.create;
        let update = eventCode.update + collisionCode;

        // Publish codes to game-container
        this.ea.publish(new CodeUpdated(preloadCode, create, update));
      });
  }

  private addFunctions(functions) {
    let create = '';
    console.log(functions);
    functions.forEach(func => {
      let name = func[0];
      let body = func[1];

      create += "\n";
      create += "this.userFunctions." + name + " = function() {\n";
      create += "\t" + body + ";\n";
      create += "}\n";
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
        create += "this.userEvents[" + i + "].add";
        if (type === "once") {
          create += "Once";
        }
        create += "(() => {\n" + action + "\n}, this);\n";
        create += "\n";

        update += "if (" + condition + ") {\n";
        update += "\tthis.userEvents[" + i + "].dispatch();\n";
        if (type === "when") {
          update += "\tthis.userEvents[" + i + "].active = false;\n";
          update += "} else {\n";
          update += "\tthis.userEvents[" + i + "].active = true;\n";
        }
        update += "}\n";
        update += "\n";
      });
    }

    return {create: create, update: update};
  }
  
  private addCollisions(collisions: Array<any>) {
    let update = '';
    console.log(collisions);

    if (collisions) {
      collisions.forEach((collision, i) => {
        let type = collision[0];
        let collider1 = collision[1];
        let collider2 = collision[2];
        let callbackBody = "";
        if (collisions.length > 3) {
          callbackBody = collision[3];
        }

        switch (type) {
          case "collision":
            update += "this.game.physics.arcade.collide(";
            break;
          case "overlap":
            update += "this.game.physics.arcade.overlap(";
        }
        update += collider1 + ".phaserBody.sprite, " + collider2 + ".phaserBody.sprite";

        if (callbackBody != "") {
          update += "(obj1, obj2) => {\n" + callbackBody + "\n}\n";
        }
        update += ");\n";
      });
    }

    return update;
  }

}


interface EventCode {
  create: string;
  update: string;
}
