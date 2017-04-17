export class CodeUpdated {
  constructor(public preloadCode: string, public createCode: string, public updateCode: string) { }
}

export class ImageInfo {
  constructor(public isBackground: boolean, public name: string, public URL: string) { }
}

export class GameInfo {
  public backgroundImage;
  public bodies = [];

  constructor(public gameWidth: number, public gameHeight: number, public backgroundColor: string, backgroundImage, bodies) { 
    if (backgroundImage) {
      this.backgroundImage = backgroundImage._element.src;
    }
    let _this = this;
    bodies.forEach(function(body) {
      let _body: any = {};
      _body.key = body.key;
      _body.name = body.name;
      _body.height = body.height;
      _body.width = body.width;
      _body.width = body.width;
      _body.x = body.left;
      _body.y = body.top;
      _body.url = body._element.src;
      
      _this.bodies.push(_body);
    });
  }
}
