import {autoinject} from 'aurelia-framework';
import {EventAggregator, Subscription} from 'aurelia-event-aggregator';
import {ImageInfo, GameInfo} from '../messages';
import {BackendService} from '../../backend-service';

import jscolor = require('EastDesire/jscolor');

import {fabric} from 'fabric';
// import * as fabric from 'fabric';

@autoinject
export class BoardInitializer {
  private subscriber: Subscription;
  
  private board;
  private width: number = 400;
  private height: number = 300;
  private selectedBody;
  private bgColorPicker;
  
  private currentBackgroundUrl = '';

  private bodies = [];

  constructor(private ea : EventAggregator) { }

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
    this.board.on('object:selected', function(evt) {__this.selectedBody = evt.target});
    this.board.on('selection:cleared', function(evt) {__this.selectedBody = null;});
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
      img.key = name;
      img.name = 'my' + name.charAt(0).toUpperCase() + name.slice(1);
      __this.board.add(img);
      __this.bodies.push(img);
    });
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
