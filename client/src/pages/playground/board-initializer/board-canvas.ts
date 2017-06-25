import {ImageInfo, SpriteSheetInfo} from '../../../utils/interfaces';

export class BoardCanvas extends fabric.Canvas {

  private camera = new fabric.Rect({
    left: 0, top: 0,
    hasControls: false, hasBorders: false, selectable: true,
    fill: 'transparent', stroke: '#ddd', strokeDashArray: [5, 5]
  });

  constructor(width: number, height: number) {
    super('board');
    this.setWidth(width);
    this.setHeight(height);
  }

  public resize(width: number, height: number): void {
    this.setWidth(width);
    this.setHeight(height);
  }

  public setBackground(image: ImageInfo): void {
    this.setBackgroundImage(image.url, this.renderAll.bind(this), {
      width: this.getWidth(),
      height: this.getHeight(),
      originX: 'left',
      originY: 'top'
    });
  }

  public removeBackground(): void {
    this.backgroundImage = null;
    this.backgroundColor = '#FFFFFF';
    this.renderAll();
  }

  public addCamera(width: number, height: number): void {
    this.camera.width = width - 1;
    this.camera.height = height - 1;
    this.add(this.camera);
  }

  public removeCamera(): void {
    this.camera.remove();
  }

  public resizeCamera(width: number, height: number): void {
    let boardWidth = this.getWidth();
    let boardHeight = this.getHeight();

    this.camera.set({
      width: (boardWidth < width) ? boardWidth - 1 : width - 1,
      height: (boardHeight < height) ? boardHeight - 1 : height - 1
    });

    this.renderAll();
  }

  public getCameraWidth(): number {
    return this.camera.width;
  }

  public getCameraHeight(): number {
    return this.camera.height;
  }

  public addSprite(sprite: ImageInfo, callback): void {

    fabric.Image.fromURL(sprite.url, (img) => {
      // Set anchor to 0.5 in both direction
      img.set({
        originX: "center", 
        originY: "center"
      });

      this.addImage(img);

      callback(img);
    }, { crossOrigin: 'anonymous' });
  }

  public addSpriteSheet(spritesheet: SpriteSheetInfo, callback): void {
    fabric.Image.fromURL(spritesheet.sheetUrl, (img) => {
      fabric.Image.fromURL(img.toDataURL({ left: 0, top: 0, width: spritesheet.spriteWidth, height: spritesheet.spriteHeight }), (img) => {
        img.set({
          originX: "center",
          originY: "center"
        });

        this.addImage(img);

        callback(img);
      }, { crossOrigin: 'anonymous' });
    }, { crossOrigin: 'anonymous' });
  }

  public deleteActiveObject() {
    let aObj = this.getActiveObject();
    this.remove(aObj);
  }

  private addImage(image: fabric.Image) {
    this.add(image);
    image.center();
    image.setCoords();
    this.setActiveObject(image);
  }

}
