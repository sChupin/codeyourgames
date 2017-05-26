import {bindable, autoinject} from 'aurelia-framework';
import {ValidationControllerFactory, ValidationRules, ValidationController} from '../../../jspm_packages/npm/aurelia-validation@1.0.0/aurelia-validation';

@autoinject
export class ImgList {
  @bindable list;
  @bindable canvas;
  @bindable selectedObj;
  @bindable selectedObjs;
  @bindable groups;

  private controller;

  private oneObjectSelected: boolean = false;
  private severalObjectsSelected: boolean = false;

  private currentGroupName: string = "groupName";
  private existingGroup: boolean = false;
  private notFromSameGroup: boolean = false;
  private subGroup: boolean = false;

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
   * Delete active group bodies
   * 
   * @private
   * 
   * @memberof BoardInitializer
   */
  private deleteSelectedObjs() {
    let curSelectedObjects = this.canvas.getActiveGroup().getObjects();
    this.canvas.discardActiveGroup();

    for (let i = 0; i < curSelectedObjects.length; i++) {
        this.deleteObj(curSelectedObjects[i]);
    }

    // Select first body or none if no bodies left
    let nObj = this.list.length;
    if (nObj !== 0) {
      let selectObj = this.list[0];
      this.canvas.setActiveObject(selectObj);
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

  /**
   * Create a group composed of the currently selected bodies
   * 
   * @private
   * 
   * @memberof BoardInitializer
   */
  private createGroup() {
    let curSelectedObjects = this.canvas.getActiveGroup().getObjects();

    this.groups[this.currentGroupName] = [];
    curSelectedObjects.forEach(body => {
      body.grpName = this.currentGroupName;
      this.groups[this.currentGroupName].push(body.name);
    });

    this.existingGroup = true;
    
    console.log('group ' + this.currentGroupName + ' created!');
  }

  private deleteGroup() {
    let curSelectedObjects = this.canvas.getActiveGroup().getObjects();

    this.groups[this.currentGroupName] = [];
    curSelectedObjects.forEach(body => {
      body.grpName = "";
    });

    this.existingGroup = false;

    console.log('group ' + this.currentGroupName + ' deleted!');
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

  selectedObjsChanged(newval, oldval) {
    // Determine if several objects are selected
    // this.oneObjectSelected = this.canvas.getActiveObject() ? true : false;
    // this.severalObjectsSelected = this.canvas.getActiveGroup() ? true : false;

    console.log('selectedBodiesChanged');
    console.log(newval);

    if (newval !== undefined && newval.length !== 0) {
      this.severalObjectsSelected = true;
      let grpName = newval[0].grpName;
      if (newval.every((el) => el.grpName == grpName)) {
        this.notFromSameGroup = false;
        if (grpName == "") {
          this.existingGroup = false;
          this.subGroup = false;
          this.currentGroupName = "groupName";
        } else if (this.groups[grpName].length == newval.length) {
          // All elements belong to the same existing group
          this.existingGroup = true;
          this.subGroup = false;
          this.currentGroupName = grpName;
        } else {
          this.existingGroup = false;
          this.subGroup = true;
          this.currentGroupName = grpName;
        }
      } else {
        this.existingGroup = false;
        this.subGroup = false;
        this.notFromSameGroup = true;
        this.currentGroupName = "";
      }
    } else {
      this.severalObjectsSelected = false;
    }
  }
}
