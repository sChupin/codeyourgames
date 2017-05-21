import {autoinject, inject, bindable} from 'aurelia-framework';
import {EventAggregator, Subscription} from 'aurelia-event-aggregator';
import {ValidationControllerFactory, ValidationRules} from '../../../jspm_packages/npm/aurelia-validation@1.0.0/aurelia-validation';

import jscolor = require('EastDesire/jscolor');
import {fabric} from 'fabric';
// import * as fabric from 'fabric';

import {ImageInfo, GameInfo} from '../messages';


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

  private currentGroupName: string = "groupName";
  private existingGroup: boolean = false;
  private notFromSameGroup: boolean = false;
  private subGroup: boolean = false;
  private groups = {};

  constructor(private ea : EventAggregator, private controllerFactory: ValidationControllerFactory) {
    this.controller = controllerFactory.createForCurrentScope();
  }

  attached() {
    // Listen for gallery image/background picking
    this.subscriber = this.ea.subscribe(ImageInfo, msg => {
      if (msg.isBackground) {
        this.setBackgroundFromUrl(msg.URL);
      } else {
        this.addImageToBoard(msg.name, msg.URL);
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
  private addImageToBoard(name: string, url: string) {
    let __this = this;

    fabric.Image.fromURL(url, function(img) {
      img.id = __this.getId();
      img.key = name;
      img.name = __this.createName('my' + name.charAt(0).toUpperCase() + name.slice(1));
      img.grpName = "";
      
      // Set anchor to 0.5 in both direction
      img.set({
        originX: "center", 
        originY: "center"
      });
      
      __this.board.add(img);
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
   * Create a group composed of the currently selected bodies
   * 
   * @private
   * 
   * @memberof BoardInitializer
   */
  private createGroup() {
    let curSelectedObjects = this.board.getActiveGroup().getObjects();

    this.groups[this.currentGroupName] = [];
    curSelectedObjects.forEach(body => {
      body.grpName = this.currentGroupName;
      this.groups[this.currentGroupName].push(body.name);
    });

    this.existingGroup = true;
    
    console.log('group ' + this.currentGroupName + ' created!');
  }

  private deleteGroup() {
    let curSelectedObjects = this.board.getActiveGroup().getObjects();

    this.groups[this.currentGroupName] = [];
    curSelectedObjects.forEach(body => {
      body.grpName = "";
    });

    this.existingGroup = false;

    console.log('group ' + this.currentGroupName + ' deleted!');
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
