import {ImageInfo, SpriteInfo} from '../utils/interfaces';

export class CodeUpdated {
  constructor(public preloadCode: string, public createCode: string, public updateCode: string) { }
}

export class BoardInfo {
  constructor(
    public gameWidth: number, public gameHeight: number,
    public background: ImageInfo, public backgroundType: string,
    public sprites: Array<SpriteInfo>,
    public cameraWidth?: number, public cameraHeight?: number,
  ) { }
}

// to remove
export class GameInfo {
  public backgroundImage;
  public bodies = [];

  constructor(public backgroundColor: string, backgroundImage, bodies, public groups, public dimensions, public camera) { 
    if (backgroundImage) {
      this.backgroundImage = backgroundImage._element.src;
    }
    let _this = this;
    bodies.forEach(function(body) {
      // todo: don't pass bodies from canvas but from lists
      if (!body.camRect) {
        let _body: any = {};
        _body.key = body.key;
        _body.name = body.name;
        _body.height = Math.round(body.height * body.scaleY);
        _body.width = Math.round(body.width * body.scaleX);
        _body.x = body.left;
        _body.y = body.top;
        _body.url = body._element.src;
        _body.type = body.type;
        _body.angle = body.angle;
        
        if (body.spritesheet !== undefined) {
          _body.spritesheet = body.spritesheet;
        }
        
        _this.bodies.push(_body);
      }
    });
  }
}

// to remove
export class GameDimensions {
  constructor(public gameWidth: number, public gameHeight: number, public worldWidth: number, public worldHeight: number) { }
}
