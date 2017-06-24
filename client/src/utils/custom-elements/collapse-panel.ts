/* This view-model is a slightly modified version of the one coded by Nikolaj Ivancic (adriatic) protected by an MIT license in the aurelia-bootstrap-bridge github repository */

import {bindable} from 'aurelia-framework';

export class CollapsePanel {
  @bindable title;
  @bindable footer;
  @bindable allowCollapse = false;
  @bindable collapsed = false;
  @bindable panelClass = 'default';

  toggle() {
    if (this.allowCollapse) {
      this.collapsed = !this.collapsed;
    }
  }
}
