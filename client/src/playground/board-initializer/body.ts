export class Body {
  private height;
  private url;
  
  activate(model) {
    this.height = model.height;
  }

  printInfo() {
    console.log('test' + this.height);
  }
}
