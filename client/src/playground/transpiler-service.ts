import {autoinject} from "aurelia-framework";
import {EventAggregator} from 'aurelia-event-aggregator';

import {CodeUpdated} from "./messages";
import {BackendService} from '../backend-service';

@autoinject
export class TranspilerService {

  constructor(private ea: EventAggregator, private backend: BackendService) { }

  transpile(preloadCode, createCode, eventCode, functionCode) {
    let parseEventCodePromise = this.backend.parseEventCode(eventCode);
    let parseFunctionCodePromise = this.backend.parseFunctionCode(functionCode);

    Promise.all([parseEventCodePromise, parseFunctionCodePromise])
      .then(values => {
        let eventData = values[0];
        let functionData = values[1];
        // Add events to code
        let eventCode = this.addEvents(JSON.parse(eventData.response));
        let functionCode = this.addFunctions(JSON.parse(functionData.response));

        let create = createCode + functionCode + eventCode.create;
        let update = eventCode.update;

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
        update += "}\n";
        update += "\n";
      });
    }

    return {create: create, update: update};
  }
  
}


interface EventCode {
  create: string;
  update: string;
}
