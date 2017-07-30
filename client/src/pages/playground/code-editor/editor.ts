import {autoinject} from 'aurelia-framework';
import {EventAggregator, Subscription} from 'aurelia-event-aggregator';

import {BoardInfo, CodeUpdate} from '../../../services/messages';
import {BoardInfoParser} from '../../../services/boardInfoParser';
import {TranspilerService} from "../../../services/transpiler-service";

import * as ace from 'ace';

@autoinject
export class Editor {
  private subscriber: Subscription;

  private createAceEditor;
  private eventAceEditor;
  private functionAceEditor;

  private createEditor;
  private eventEditor;
  private functionEditor;

  private preloadCode: string = ""; // Not editable by user
  private createCode: string = "";

  constructor(private ea: EventAggregator, private boardInfoParser: BoardInfoParser, private transpiler: TranspilerService) { }

  attached() {
    console.log(ace);
    // Process game info from board initializer
    this.subscriber = this.ea.subscribe(BoardInfo, boardInfo => {
      this.preloadCode = this.boardInfoParser.toPreloadCode(boardInfo);
      this.createCode = this.boardInfoParser.toCreateCode(boardInfo);
      
      this.createEditor.setValue(this.createCode);
    });

    // Initialise editors
    this.createEditor = this.createAceEditor.au.ace.viewModel.editor;
    this.eventEditor = this.eventAceEditor.au.ace.viewModel.editor;
    this.functionEditor = this.functionAceEditor.au.ace.viewModel.editor;

    this.createEditor.setOptions({enableBasicAutocompletion: true});

    // this.createEditor.setReadOnly(true);
  }

  detached() {
    this.subscriber.dispose();
  }

  /**
   * Execute the code from all editors
   */
  public runCode() {
    this.transpiler.transpileEvents(this.eventEditor.getValue()).then(value => {
      let test = JSON.parse(value.response);
      let eventCode = this.transpiler.addEvents(test);
      let createCode = this.createEditor.getValue() + eventCode.create;
      let updateCode = eventCode.update;
      this.ea.publish(new CodeUpdate(this.preloadCode, createCode, updateCode));
    });
  }
}



