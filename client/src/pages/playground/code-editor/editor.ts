import {autoinject, bindable} from 'aurelia-framework';
import {EventAggregator, Subscription} from 'aurelia-event-aggregator';
import {I18N} from 'aurelia-i18n';

import {BoardInfo, CodeUpdate} from '../../../services/messages';
import {BoardInfoParser} from '../../../services/board-info-parser';
import {TranspilerService} from "../../../services/transpiler-service";
import {CodeTranslator} from "../../../services/code-translator";

import * as ace from 'ace';
import 'ace/theme-monokai';
import 'ace/mode-typescript';
import 'ace/ext-language_tools';

import * as jsonDoc from '../../../../doc/sprite.json!json';

@autoinject
export class Editor {
  private subscriber: Subscription;

  private isAttached: boolean = false;

  private editors: Array<AceAjax.Editor> = [];

  private createEditor: AceAjax.Editor = null;
  private eventEditor: AceAjax.Editor = null;
  private functionEditor: AceAjax.Editor = null;
  private typeEditor: AceAjax.Editor = null;

  private preloadCode: string = "";

  private genCodeLength: number = 0;

  @bindable private difficulty: string;

  constructor(private ea: EventAggregator, private boardInfoParser: BoardInfoParser, private transpiler: TranspilerService, private i18n: I18N, private translator: CodeTranslator) { }

  attached() {
    // Initialize editors
    this.createEditor = ace.edit('create-editor');
    this.eventEditor = ace.edit('event-editor');
    this.functionEditor = ace.edit('function-editor');
    this.typeEditor = ace.edit('type-editor');
    
    this.editors.push(this.createEditor, this.eventEditor, this.functionEditor, this.typeEditor);

    let langTools = ace.require('ace/ext/language_tools');

    this.editors.forEach((editor: AceAjax.Editor) => {
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

    // Prevent editing auto-generated code and prevent backspace on first editable line
    let commands: any = this.createEditor.commands; // fix typedef bug
    commands.on('exec', e => {
      let authorizedCommands = [
        'gotoleft', 'gotoright', 'golineup', 'golinedown',
        'gotowordright', 'gotowordleft', 'gotolinestart', 'gotolineend',
        'selectleft', 'selectright', 'selectwordleft', 'selectwordright', 'selectup', 'selectdown'];        
      let commandName = e.command.name;
      
      var rowCol = this.createEditor.selection.getCursor();
      if ((rowCol.row >= 0 && rowCol.row <= this.genCodeLength - 2 && authorizedCommands.indexOf(commandName) == -1) ||
          (e.command.name == 'backspace' && rowCol.row == this.genCodeLength - 1 && rowCol.column == 0)) {
        e.preventDefault();
        e.stopPropagation();
      }
    });

    // Subscribe to board initializer saves
    this.subscriber = this.ea.subscribe(BoardInfo, boardInfo => {
      
      // Save previously written user code
      let previousUserCreateCode = '';
      if (this.genCodeLength !== 0) {
        this.createEditor.selectAll();
        let range = this.createEditor.getSelectionRange();
        range.setStart(this.genCodeLength - 1, 0);
        previousUserCreateCode = this.createEditor.getSession().getTextRange(range);
      }

      this.preloadCode = this.boardInfoParser.toPreloadCode(boardInfo);
      let createCode = this.boardInfoParser.toCreateCode(boardInfo);
      
      // Insert generated code from board initializer in create editor
      this.createEditor.setValue('// The code below has been generated automatically from the board initializer.\n// You can add more code initialization at the end of this editor.\n\n', 1);
      this.createEditor.insert(createCode);
      this.createEditor.insert('// You can add more code initialization below this comment.\n');

      // Get new code generated length
      this.genCodeLength = this.createEditor.session.getLength();

      // Insert previously written user code
      this.createEditor.insert(previousUserCreateCode);

      // Reset the undo stack
      this.createEditor.getSession().setUndoManager(new (<any>ace).UndoManager());
    });

    this.isAttached = true;
  }

  detached() {
    this.subscriber.dispose();
    
    this.editors.forEach(editor => {
      editor.destroy();
      editor = null;
    });

    this.isAttached = false;
  }

  /**
   * Execute the code from all editors
   */
  public runCode() {
    
    let enCreateCode = this.createEditor.getValue();
    let enEventCode = this.eventEditor.getValue();

    // Translate code from fr to en
    if (this.i18n.getLocale() == 'fr') {
      enCreateCode = this.translator.translateToEnglish(enCreateCode);
      enEventCode = this.translator.translateToEnglish(enEventCode);
    }

    this.transpiler.transpileEvents(enEventCode).then(value => {
      let eventCode = this.transpiler.addEvents(JSON.parse(value.response).events);
      let createCode = parseCreate(enCreateCode) + eventCode.create;
      createCode = appendTryCatch(createCode);
      let updateCode = eventCode.update;
      this.ea.publish(new CodeUpdate(this.preloadCode, createCode, updateCode));
    });
  }

}

function parseCreate(createCode: string) {
  return createCode.replace(/repeat( )*\(( )*(\d+)( )*\)( )*{/g, 'for (let _i = 0; _i < ' + '$3' + '; _i++) {');
}

function appendTryCatch(code: string) {
  return 'try {\n\n' + code + '\n\n} catch(err) {\n  console.log("Code error: " + err.message);\n}';
}
