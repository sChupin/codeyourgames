import {bindable} from "aurelia-framework";
import {Split} from 'split.js';

export class SplitView {
  @bindable componentName = '';

  private leftId;
  private rightId;

  attached() {
    let leftId = '#' + this.componentName + "-left";
    let rightId = '#' + this.componentName + "-right";
    Split([leftId, rightId], {
      sizes: [50, 50],
      minSize: 200
    });
  }
}
