import {Aurelia, inject} from 'aurelia-framework';

@inject(Aurelia)
export class Test {

  constructor(private au: Aurelia) { }

  private goToApp() {
    this.au.setRoot('app');
  }
}
