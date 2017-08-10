import {EventAggregator, Subscription} from "aurelia-event-aggregator";
import {autoinject, bindable} from "aurelia-framework";

import {BoardInfo} from "../../../services/messages";
import {BoardInfoParser} from "../../../services/board-info-parser";
import {Dimensions} from "../../../utils/interfaces";

@autoinject
export class CodeEditor {
  // private componentName = 'code-editor';

  private boardInfoSubscriber: Subscription;

  private gameWidth: number;
  private gameHeight: number;

  @bindable private difficulty: string;

  constructor(private ea: EventAggregator, private boardInfoParser: BoardInfoParser) { }

  attached() {
    this.boardInfoSubscriber = this.ea.subscribe(BoardInfo, (boardInfo: BoardInfo) => {
      let dimensions: Dimensions = this.boardInfoParser.getDimensions(boardInfo);
      
      this.gameWidth = dimensions.width;
      this.gameHeight = dimensions.height;
    });
  }

  detached() {
    this.boardInfoSubscriber.dispose();
  }
}
