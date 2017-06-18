import {bindable} from 'aurelia-framework';

export class AnimationCreator {
  @bindable spritesheet;

  attached() {
    console.log(this.spritesheet);
  }

  private offsetX(frameNo) {
    let j = frameNo%this.spritesheet.horizontalNbr;

    return -j*this.spritesheet.spriteWidth;
  }

  private offsetY(frameNo) {
    let i = Math.floor(frameNo/this.spritesheet.verticalNbr);

    return -i*this.spritesheet.spriteHeight;
  }
}
