import {autoinject, inject, bindable} from 'aurelia-framework';
import {EventAggregator, Subscription} from 'aurelia-event-aggregator';
import {ValidationControllerFactory, ValidationRules} from '../../../jspm_packages/npm/aurelia-validation@1.0.0/aurelia-validation';

import jscolor = require('EastDesire/jscolor');
import {fabric} from 'fabric';
// import * as fabric from 'fabric';

import {ImgMsg, GameInfo, GameDimensions} from '../messages';
import {ImageInfo} from '../image-gallery';


@autoinject
export class BoardInitializer {
  private subscriber: Subscription;
  private controller;

  private currentTab;
  
  private board;
  private width: number = 400;
  private height: number = 300;

  private camera: CameraInfo = {enabled: false, width: 400, height: 300, mode: 'basic', spriteName: ''};
  private cameraRect = new fabric.Rect({
    width: 399, height: 299,
    left: 0, top: 0,
    hasControls: false, hasBorders: false, selectable: false,
    fill: 'transparent', stroke: '#ddd', strokeDashArray: [5, 5],
    camRect: true
  });
  private camDescription: string = "The camera is the portion of the game visible at any time. It can follow one sprite and move over the board.";
  private camModeDescription: string = 
    "<b>Basic mode</b>: The camera is centered on one sprite and follows it instantaneously.<br>"
    + "<b>Smooth mode</b>: The camera is centered on one sprite and follows it with a small delay.<br>"
    + "<b>Deadzone mode</b>: The camera defines a rectangle inside which the sprite it follows can move without causing the camera to move.";

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
    // Enable bootstrap tooltip
    $('[data-toggle="tooltip"]').tooltip();

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
      if (!obj.camRect) {
        obj.center();
        obj.setCoords();
        __this.board.setActiveObject(obj);
      }
    });
    // this.board.on('object:scaling', (evt) => {evt.target.scaleX = 1; evt.target.scaleY = 1;});

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
      // img.spritesheet = imgInfo.spritesheet;
      // Shadow copy
      img.spritesheet = imgInfo.spritesheet ? {} : undefined;
      for (let props in imgInfo.spritesheet) {
        img.spritesheet[props] = imgInfo.spritesheet[props];
      }
      // Default animations
      if (img.spritesheet) {
        img.spritesheet.animations = [
          {name: 'moveDown', frameList: [0, 1, 2, 3]},
          {name: 'moveLeft', frameList: [4, 5, 6, 7]},
          {name: 'moveRight', frameList: [8, 9, 10, 11]},
          {name: 'moveUp', frameList: [12, 13, 14, 15]}
        ];
      }
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
    
    // Resize background to fit new board dimensions
    if (this.board.backgroundImage) {
      this.setBackgroundFromUrl(this.board.backgroundImage);
    }

    this.setCamDimensions();
  }
  
  /**
   * 
   * 
   * 
   * @memberof BoardInitializer
   */
  public setCamDimensions() {
    
    // Ensure camera size is not bigger than board dimensions
    if (this.board.width < this.camera.width) {
      this.camera.width = this.board.width;
    }
    if (this.board.height < this.camera.height) {
      this.camera.height = this.board.height;
    }

    this.cameraRect.set({width: this.camera.width - 1, height: this.camera.height - 1});
    this.board.renderAll();
    // this.cameraRect.setWidth(this.camWidth - 1);
    // this.cameraRect.setHeight(this.camHeight - 1);
  }

  private camOn: boolean = false;
  public toggleCamRect() {
    if (this.camOn) {
      this.cameraRect.remove();
      this.camOn = false;
    } else {
      this.board.add(this.cameraRect);
      this.camOn = true;
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
    this.ea.publish(new GameInfo(this.board.backgroundColor, this.board.backgroundImage, this.board._objects, this.groups, {width: this.board.width, height: this.board.height}, this.camera));
    
    let gameWidth = this.camera.enabled ? this.camera.width : this.board.width;
    let gameHeight = this.camera.enabled ? this.camera.height : this.board.height;
    this.ea.publish(new GameDimensions(gameWidth, gameHeight, this.board.width, this.board.height));
    console.log('Camera info');
    console.log(this.camera);
  }
}

interface CameraInfo {
  enabled: boolean;
  width: number;
  height: number;
  mode: string;
  spriteName: string;
}
