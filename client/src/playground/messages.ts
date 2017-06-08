import {ImageInfo} from './image-gallery';

export class CodeUpdated {
  constructor(public preloadCode: string, public createCode: string, public updateCode: string) { }
}

export class ImgMsg {
  constructor(public isBackground: boolean, public image: ImageInfo) { }
}

export class GameInfo {
  public backgroundImage;
  public bodies = [];

  constructor(public backgroundColor: string, backgroundImage, bodies, public groups) { 
    if (backgroundImage) {
      this.backgroundImage = backgroundImage._element.src;
    }
    let _this = this;
    bodies.forEach(function(body) {
      let _body: any = {};
      _body.key = body.key;
      _body.name = body.name;
      _body.height = Math.round(body.height * body.scaleY);
      _body.width = Math.round(body.width * body.scaleX);
      _body.x = body.left;
      _body.y = body.top;
      _body.url = body._element.src;
      _body.type = body.type;
      
      if (body.spritesheet !== undefined) {
        _body.spritesheet = body.spritesheet;
      }
      
      _this.bodies.push(_body);
    });
  }
}

export class GameDimensions {
  constructor(public gameWidth: number, public gameHeight: number) { }
}
