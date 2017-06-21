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
}
