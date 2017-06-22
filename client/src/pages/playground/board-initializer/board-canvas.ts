import {ImageInfo} from '../../../utils/interfaces';

export class BoardCanvas extends fabric.Canvas {
  constructor(width: number, height: number) {
    super('board');
    this.setWidth(width);
    this.setHeight(height);
  }

  public resize(width: number, height: number) {
    this.setWidth(width);
    this.setHeight(height);
  }

  public setBackground(image: ImageInfo) {
    this.setBackgroundImage(image.url, this.renderAll.bind(this), {
      width: this.getWidth(),
      height: this.getHeight(),
      originX: 'left',
      originY: 'top'
    });
  }

  public removeBackground() {
    this.backgroundImage = null;
    this.backgroundColor = '#FFFFFF';
    this.renderAll();
  }
}
