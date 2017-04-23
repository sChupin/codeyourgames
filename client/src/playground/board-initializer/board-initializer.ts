import {autoinject, inject, bindable} from 'aurelia-framework';
import {EventAggregator, Subscription} from 'aurelia-event-aggregator';
import {ImageInfo, GameInfo} from '../messages';
import {BackendService} from '../../backend-service';
import {ValidationControllerFactory, ValidationRules} from '../../../jspm_packages/npm/aurelia-validation@1.0.0/aurelia-validation';

import jscolor = require('EastDesire/jscolor');

import {fabric} from 'fabric';
// import * as fabric from 'fabric';

@autoinject
export class BoardInitializer {
  private subscriber: Subscription;
  private controller;
  
  private board;
  private width: number = 400;
  private height: number = 300;

  @bindable
  private selectedBody = {};
  private id: number = 0;

  private bgColorPicker;
  
  private currentBackgroundUrl = '';

  private bodies = [];
  private bodyNames = [];

  constructor(private ea : EventAggregator, private controllerFactory: ValidationControllerFactory) {
    this.controller = controllerFactory.createForCurrentScope();
  }

  attached() {
    this.subscriber = this.ea.subscribe(ImageInfo, msg => {
      if (msg.isBackground) {
        this.setBackgroundFromUrl(msg.URL);
      } else {
        this.addImageToBoard(msg.name, msg.URL);
      }
    });
    
    let __this = this;

    this.board = new fabric.Canvas('board');
    this.board.setDimensions({width: __this.width, height: __this.height});
    this.board.on('object:selected', function(evt) {__this.selectedBody = evt.target;});
    this.board.on('selection:cleared', function(evt) {__this.selectedBody = {};});
    this.board.on('object:added', function (evt) {
      let obj = evt.target;
      obj.center();
      obj.setCoords();
      __this.board.setActiveObject(obj);
    });
    this.bgColorPicker = new jscolor('jscolortest', {valueElement: null});
    this.bgColorPicker.onFineChange = function() { __this.updatebgcolor() };
  }

  public updatebgcolor() {
    this.board.setBackgroundColor(this.bgColorPicker.toRGBString());
    this.board.renderAll();
  }

  private addImageToBoard(name: string, url: string) {
    let __this = this;
    fabric.Image.fromURL(url, function(img) {
      img.id = __this.getId();
      img.key = name;
      img.name = __this.createName('my' + name.charAt(0).toUpperCase() + name.slice(1));
      img.set({
        originX: "center", 
        originY: "center"
    });
      __this.board.add(img);
      __this.bodies.push(img);
    });
  }

  /**
   * Ensure unique body name creation
   * 
   * @private
   * @param {any} baseName name prefix
   * @returns name appended by suffix to uniquify name
   * 
   * @memberOf BoardInitializer
   */
  private createName(baseName) {
    let newName = baseName;
    let suffix = 2;
    while (this.bodies.map(body => body.name).indexOf(newName) !== -1) {
      newName = baseName + suffix;
      suffix++;
    }
    return newName;
  }

  private getId() {
    return ++this.id;
  }

  selectedBodyChanged(oldval, newval) {
    if (this.controller.errors) {
      this.controller.reset();
    }
    ValidationRules.ensure('name')
      .required().withMessage("Sprite name is required")
      .matches(/^[a-z].*$/).withMessage("Sprite name should start with lower case letter")
      .matches(/^\w*$/).withMessage("Sprite name shouldn\'t contain special character")
      .satisfies((selectedBodyName: string, selectedBody: any) => {
        return this.bodies.map(body => {
          if (body.id !== selectedBody.id)
            return body.name
        }).indexOf(selectedBodyName) == -1;
      })
      .withMessage("Sprite name should be unique")
      .on(this.selectedBody);
  }

  private deleteSelectedBody() {
    let bodyPos = this.bodies.map(body => body.id).indexOf(this.board.getActiveObject().id);
    this.bodies.splice(bodyPos, 1);
    this.board.getActiveObject().remove();
    this.selectedBody = {};
    let nBodies = this.bodies.length;
    if (nBodies !== 0) {
      let selectObj;
      if (bodyPos == 0) {
        selectObj = this.bodies[bodyPos]
      } else {
        selectObj = this.bodies[bodyPos-1];
      }
      this.board.setActiveObject(selectObj);
      this.selectedBody = selectObj;
    }
  }

  private selectObj(obj) {
    this.board.setActiveObject(obj);
  }

  public setBackgroundFromUrl(url) {
    let __this = this;

    this.board.setBackgroundImage(url, this.board.renderAll.bind(this.board), {
      width: parseInt(__this.board.width),
      height: parseInt(__this.board.height),
      originX: 'left',
      originY: 'top'
    });
  }

  public setBackground(file) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.currentBackgroundUrl = reader.result;
      this.setBackgroundFromUrl(reader.result);
    }
  }

  public setDimensions() {
    let __this = this;
    this.board.setDimensions({width: __this.width, height: __this.height});
    
    if (this.board.backgroundImage) {
      this.setBackgroundFromUrl(this.board.backgroundImage);
    }
    // this.board.renderAll();
  }
  
  public saveBoard() {
    console.log(this.board._objects);
    this.ea.publish(new GameInfo(this.width, this.height, this.board.backgroundColor, this.board.backgroundImage, this.board._objects));
  }

  detached() {
    this.subscriber.dispose();
  }

}
