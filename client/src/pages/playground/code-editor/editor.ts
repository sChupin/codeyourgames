import {autoinject} from 'aurelia-framework';
import {EventAggregator, Subscription} from 'aurelia-event-aggregator';

import {BoardInfo, CodeUpdate} from '../../../services/messages';
import {BoardInfoParser} from '../../../services/boardInfoParser';
import {TranspilerService} from "../../../services/transpiler-service";

import * as ace from 'ace';
import 'ace/theme-monokai';
import 'ace/mode-typescript';
import 'ace/ext-language_tools';

import * as jsonDoc from '../../../../doc/sprite.json!json';

@autoinject
export class Editor {
  private subscriber: Subscription;

  private createEditor: AceAjax.Editor;
  private eventEditor: AceAjax.Editor;
  private functionEditor: AceAjax.Editor;

  private preloadCode: string = "";

  constructor(private ea: EventAggregator, private boardInfoParser: BoardInfoParser, private transpiler: TranspilerService) { }

  attached() {
    // Initialize editors
    let editors: Array<AceAjax.Editor> = [];
    this.createEditor = ace.edit('create-editor');
    this.eventEditor = ace.edit('event-editor');
    this.functionEditor = ace.edit('function-editor');
    
    editors.push(this.createEditor, this.eventEditor, this.functionEditor);

    let langTools = ace.require('ace/ext/language_tools');

    editors.forEach((editor: AceAjax.Editor) => {
      let session = editor.getSession();
      editor.setTheme('ace/theme/monokai');
      editor.$blockScrolling = Infinity;

      editor.setOptions({
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true
      });

      // var customCompleter = {
      //   getCompletions: function(editor, session, pos, prefix, callback) {
      //     // let regex = /^[A-z]\w*(\((( )*\w*( )*(\,( )*\w*)( )*)\))?\.$/;
      //       // if (prefix.length === 0) { callback(null, []); return }
      //       // $.getJSON(
      //       //     "http://rhymebrain.com/talk?function=getRhymes&word=" + prefix,
      //       //     function(wordList) {
      //       //         // wordList like [{"word":"flow","freq":24,"score":300,"flags":"bc","syllables":"1"}]
      //       //         callback(null, wordList.map(function(ea) {
      //       //             return {name: ea.word, value: ea.word, score: ea.score, meta: "rhyme"}
      //       //         }));
      //       //     });
      //   }
      // }
      // langTools.addCompleter(customCompleter);

      // editor.commands.on("afterExec", function(e){
      //     if (e.command.name == "insertstring"&&/^[\w.]$/.test(e.args)) {
      //         editor.execCommand("startAutocomplete")
      //     }
      // });

      session.setMode('ace/mode/typescript')
      session.setTabSize(2);
      session.setUseSoftTabs(true);
      session.setUseWrapMode(true);
      session.setWrapLimitRange(80, 80);
    });

    // Subscribe to board initializer saves
    this.subscriber = this.ea.subscribe(BoardInfo, boardInfo => {
      this.preloadCode = this.boardInfoParser.toPreloadCode(boardInfo);
      let createCode = this.boardInfoParser.toCreateCode(boardInfo);
      
      this.createEditor.setValue('// The code below has been generated automatically from the board initializer.\n// You can add more code initialization at the end of this editor.\n\n', 1);
      this.createEditor.insert(createCode);
      this.createEditor.insert('// You can add more code initialization below this comment.\n');

      let commands: any = this.createEditor.commands; // fix typedef bug
      commands.on('exec', e => {
        let authorizedCommands = [
          'gotoleft', 'gotoright', 'golineup', 'golinedown',
          'gotowordright', 'gotowordleft', 'gotolinestart', 'gotolineend',
          'selectleft', 'selectright', 'selectwordleft', 'selectwordright', 'selectup', 'selectdown'];        
        let commandName = e.command.name;
        let currentLength = this.createEditor.session.getLength();
        
        // Prevent editing auto-generated code and prevent backspace on first editable line
        var rowCol = this.createEditor.selection.getCursor();
        if ((rowCol.row >= 0 && rowCol.row <= currentLength - 2 && authorizedCommands.indexOf(commandName) == -1) ||
            (e.command.name == 'backspace' && rowCol.row == currentLength - 1 && rowCol.column == 0)) {
          e.preventDefault();
          e.stopPropagation();
        }
      });

      // Reset the undo stack
      this.createEditor.getSession().setUndoManager(new (<any>ace).UndoManager());
    });

  }

  detached() {
    this.subscriber.dispose();
    
    let editors: Array<AceAjax.Editor> = [];
    editors.push(this.createEditor, this.eventEditor, this.functionEditor);

    editors.forEach(editor => {
      editor.destroy();
      editor = null;
    });
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
