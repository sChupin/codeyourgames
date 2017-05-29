import {autoinject, inject, bindable} from 'aurelia-framework';
import {EventAggregator, Subscription} from 'aurelia-event-aggregator';
import {ValidationControllerFactory, ValidationRules} from '../../../jspm_packages/npm/aurelia-validation@1.0.0/aurelia-validation';

import jscolor = require('EastDesire/jscolor');
import {fabric} from 'fabric';
// import * as fabric from 'fabric';

import {ImgMsg, GameInfo} from '../messages';
import {ImageInfo} from '../image-gallery';


@autoinject
export class BoardInitializer {
  private subscriber: Subscription;
  private controller;

  private currentTab;
  
  private board;
  private width: number = 400;
  private height: number = 300;

  @bindable
  private selectedBody = {};
  @bindable
  private selectedBodies = [];
  private oneObjectSelected: boolean = false;
  private severalObjectsSelected: boolean = false;
  private id: number = 0;

  private bgColorPicker;
  
  private bodies = [];
  private platforms = [];
  private decors = [];
  private bodyNames = [];

  private groups = {};

  constructor(private ea : EventAggregator, private controllerFactory: ValidationControllerFactory) {
    this.controller = controllerFactory.createForCurrentScope();
  }

  attached() {
    // Listen for gallery image/background picking
    this.subscriber = this.ea.subscribe(ImgMsg, msg => {
      let imgInfo: ImageInfo = msg.image;
      if (msg.isBackground) {
        this.setBackgroundFromUrl(imgInfo.url);
      } else if (msg) {
        this.addImageToBoard(imgInfo);
      }
    });
    
    // Capture current context
    let __this = this;

    // Initialize fabric canvas and associated events
    this.board = new fabric.Canvas('board');
    this.board.setDimensions({width: __this.width, height: __this.height});
    this.board.on('object:selected', (evt) => __this.selectedBody = evt.target);
    this.board.on('selection:created', (evt) => __this.selectedBodies = evt.target._objects);
    this.board.on('selection:cleared', () => {__this.selectedBody = {}; __this.selectedBodies = [];});
    this.board.on('object:added', function (evt) {
      let obj = evt.target;
      obj.center();
      obj.setCoords();
      __this.board.setActiveObject(obj);
    });

    // Initialize background color picker
    this.bgColorPicker = new jscolor('jscolortest', {valueElement: null});
    this.bgColorPicker.onFineChange = function() { __this.updatebgcolor() };
  }

  detached() {
    this.subscriber.dispose();
  }

  private setCurrentTab(tabName: string) {
    this.currentTab = tabName;
  }

  /**
   * Update canvas background color from color picker
   * 
   * @private
   * 
   * @memberof BoardInitializer
   */
  private updatebgcolor() {
    this.board.setBackgroundColor(this.bgColorPicker.toRGBString());
    this.board.renderAll();
  }


  /**
   * Add an image to the canvas from a url
   * 
   * @private
   * @param {string} name name of the image
   * @param {string} url url of the image
   * 
   * @memberof BoardInitializer
   */
  private addImageToBoard(imgInfo: ImageInfo) {
    let __this = this;
    
    if (imgInfo.spritesheet === undefined) {
      fabric.Image.fromURL(imgInfo.url, callback, {crossOrigin: 'anonymous'});
    } else {
      fabric.Image.fromURL(imgInfo.spritesheet.sheetUrl, function(img) {
        let width = imgInfo.spritesheet.spriteWidth;
        let height = imgInfo.spritesheet.spriteHeight;
        fabric.Image.fromURL(img.toDataURL({left: 0, top: 0, width: width, height: height}), callback, {crossOrigin: 'anonymous'});
      }, {crossOrigin: 'anonymous'});
    }

    function callback(img) {
      img.id = __this.getId();
      img.key = imgInfo.name;
      img.name = __this.createName('my' + imgInfo.name.charAt(0).toUpperCase() + imgInfo.name.slice(1));
      img.grpName = "";
      img.spritesheet = imgInfo.spritesheet;

      // Set anchor to 0.5 in both direction
      img.set({
        originX: "center", 
        originY: "center"
      });
      
      img.type = __this.currentTab;
      switch (__this.currentTab) {
        case "decor":
          __this.decors.push(img);
          break;
        case "platform":
          __this.platforms.push(img);
          break;        
        case "body":
          __this.bodies.push(img);
          break;
      }

      __this.board.add(img);
    }
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


  /**
   * Create a unique ID
   * 
   * @private
   * @returns 
   * 
   * @memberof BoardInitializer
   */
  private getId() {
    return ++this.id;
  }


  /**
   * Delete current active body
   * 
   * @private
   * 
   * @memberof BoardInitializer
   */
  private deleteSelectedBody() {
    let bodyPos = this.deleteBody(this.board.getActiveObject());
    let nBodies = this.bodies.length;
    if (nBodies !== 0) {
      let selectObj;
      if (bodyPos == 0) {
        selectObj = this.bodies[bodyPos]
      } else {
        selectObj = this.bodies[bodyPos-1];
      }
      this.selectObj(selectObj);
    }
  }

  private selectObj(obj) {
    this.board.setActiveObject(obj);
  }

  /**
   * Delete a body from canvas and list of bodies
   * 
   * @private
   * @param {any} body 
   * @returns {number} the previous position of the body in the body list
   * 
   * @memberof BoardInitializer
   */
  private deleteBody(body): number {
    // Remove body from list of bodies
    let bodyPos = this.bodies.map(body => body.id).indexOf(body.id);
    this.bodies.splice(bodyPos, 1);
    
    // Remove body from canvas
    body.remove();

    return bodyPos;
  }


  /**
   * Delete active group bodies
   * 
   * @private
   * 
   * @memberof BoardInitializer
   */
  private deleteSelectedBodies() {
    let curSelectedObjects = this.board.getActiveGroup().getObjects();
    this.board.discardActiveGroup();

    for (let i = 0; i < curSelectedObjects.length; i++) {
        this.deleteBody(curSelectedObjects[i]);
    }

    // Select first body or none if no bodies left
    let nBodies = this.bodies.length;
    if (nBodies !== 0) {
      let selectObj = this.bodies[0];
      this.board.setActiveObject(selectObj);
      this.selectedBody = selectObj;
    }
  }


  /**
   * Set canvas background from url
   * 
   * @param {any} url background image url
   * 
   * @memberof BoardInitializer
   */
  public setBackgroundFromUrl(url) {
    let __this = this;

    this.board.setBackgroundImage(url, this.board.renderAll.bind(this.board), {
      width: parseInt(__this.board.width),
      height: parseInt(__this.board.height),
      originX: 'left',
      originY: 'top'
    });
  }


  /**
   * Resize canvas from properties
   * 
   * 
   * @memberof BoardInitializer
   */
  public setDimensions() {
    let __this = this;
    this.board.setDimensions({width: __this.width, height: __this.height});
    
    if (this.board.backgroundImage) {
      this.setBackgroundFromUrl(this.board.backgroundImage);
    }
  }
  

  /**
   * Save the board and publish its info
   * 
   * 
   * @memberof BoardInitializer
   */
  public saveBoard() {
    console.log('Board info');
    console.log(this.board);
    this.board.deactivateAll().renderAll();
    this.ea.publish(new GameInfo(this.width, this.height, this.board.backgroundColor, this.board.backgroundImage, this.board._objects, this.groups));
  }
}
