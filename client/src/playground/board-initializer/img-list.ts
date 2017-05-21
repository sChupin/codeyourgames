import {bindable, autoinject} from 'aurelia-framework';
import {ValidationControllerFactory, ValidationRules} from '../../../jspm_packages/npm/aurelia-validation@1.0.0/aurelia-validation';

@autoinject
export class ImgList {
  @bindable list;
  @bindable canvas;
  @bindable selectedObj;

  private controller;

  private oneObjectSelected: boolean = false;

  constructor(private controllerFactory: ValidationControllerFactory) {
    this.controller = controllerFactory.createForCurrentScope();
  }

  private selectObj(obj) {
    this.canvas.setActiveObject(obj);
  }

  /**
   * Delete current active object
   * 
   * @private
   * 
   * @memberof BoardInitializer
   */
  private deleteSelectedObj() {
    let objPos = this.deleteObj(this.canvas.getActiveObject());
    let nObj = this.list.length;
    if (nObj !== 0) {
      let selectObj;
      if (objPos == 0) {
        selectObj = this.list[objPos]
      } else {
        selectObj = this.list[objPos-1];
      }
      this.selectObj(selectObj);
    }
  }

  /**
   * Delete a object from canvas and list of bodies
   * 
   * @private
   * @param {any} object 
   * @returns {number} the previous position of the object in the object list
   * 
   * @memberof BoardInitializer
   */
  private deleteObj(obj): number {
    // Remove obj from list of bodies
    let objPos = this.list.map(obj => obj.id).indexOf(obj.id);
    this.list.splice(objPos, 1);
    
    // Remove obj from canvas
    obj.remove();

    return objPos;
  }

  // Properties listeners
  selectedObjChanged(newval, oldval) {
    if (this.list !== undefined && this.list.length != 0 && this.list.includes(newval)) {
      this.oneObjectSelected = true;
    } else {
      this.oneObjectSelected = false;
    }

    if (this.controller.errors) {
      this.controller.reset();
    }

    // Define validation rules
    ValidationRules.ensure('name')
      .required().withMessage("Sprite name is required")
      .matches(/^[a-z].*$/).withMessage("Sprite name should start with lower case letter")
      .matches(/^\w*$/).withMessage("Sprite name shouldn\'t contain special character")
      .satisfies((selectedBodyName: string, selectedBody: any) => {
        return this.list.map(body => {
          if (body.id !== selectedBody.id)
            return body.name
        }).indexOf(selectedBodyName) == -1;
      }).withMessage("Sprite name should be unique")
      .on(this.selectedObj);
  }
}
