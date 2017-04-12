import {autoinject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {ImageInfo, GameInfo} from '../messages';
import {Body} from './body';
import {BackendService} from '../../backend-service';

import jscolor = require('EastDesire/jscolor');

import {fabric} from 'fabric';
// import * as fabric from 'fabric';

@autoinject
export class BoardInitializer {
  private board;
  private width: number = 400;
  private height: number = 300;
  private selectedBody = {height: 0, width: 0, top: 0, left: 0};
  private bgColorPicker;
  
  private currentBackgroundUrl = 'http://fabricjs.com/assets/honey_im_subtle.png';

  private bodies = [];
  // private bodies: Array<Body> = [];
  // private bodies  = [{name: "body1", url: "http://www.untamed.wild-refuge.net/images/rpgxp/single/alberto.png"},
  //                    {name: "body2", url: "http://www.untamed.wild-refuge.net/images/rpgxp/single/anakin.png"}];

  constructor(private ea : EventAggregator) {
    ea.subscribe(ImageInfo, msg => this.addImageToBoard(msg.name, msg.URL));
  }

  attached() {
    let __this = this;

    this.board = new fabric.Canvas('board');
    this.board.setDimensions({width: __this.width, height: __this.height});
    this.board.on('object:selected', function(evt) {__this.selectedBody = evt.target});
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
      this.setBackgroundFromUrl(this.currentBackgroundUrl);
    }
    // this.board.renderAll();
  }
  
  public saveBoard() {
    console.log(this.board._objects);
    this.ea.publish(new GameInfo(this.width, this.height, this.board.backgroundColor, this.board.backgroundImage, this.board._objects));
  }

}
