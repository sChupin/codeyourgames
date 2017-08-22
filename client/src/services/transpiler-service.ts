import {autoinject} from "aurelia-framework";
import {EventAggregator} from 'aurelia-event-aggregator';

import {CodeUpdate} from "./messages";
import {BackendService} from './backend-service';

@autoinject
export class TranspilerService {

  constructor(private ea: EventAggregator, private backend: BackendService) { }

  public transpileEvents(code) {
    return this.backend.transpileCode(code);
  }

  public addFunctions(functions) {
    let create = '';

    functions.forEach(func => {
      create += func + '\n';
    });

    return create;
  }

  public addEvents(events: Array<any>) {
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
        create += "(" + action + ", this);\n";
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
