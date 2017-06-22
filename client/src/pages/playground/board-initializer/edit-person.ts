import {DialogController} from 'aurelia-dialog';
import {autoinject} from 'aurelia-framework';

@autoinject
export class EditPerson {

  person = { firstName: '' };
  constructor(private controller: DialogController) { }
  
  activate(person){
    this.person = person;
  }
}
