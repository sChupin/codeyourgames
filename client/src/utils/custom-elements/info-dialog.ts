import {autoinject} from 'aurelia-framework';
import {DialogController} from 'aurelia-dialog';

@autoinject
export class InfoDialog {
  private title: string;
  private info: string;

  constructor(private controller: DialogController) {
    controller.settings.centerHorizontalOnly = true;
  }

  activate(model) {
    this.title = model.title;
    this.info = model.info;
  }

}
