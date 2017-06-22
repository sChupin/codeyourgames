import {DialogController} from 'aurelia-dialog';
import {autoinject} from 'aurelia-framework';

import {BackendService} from '../../services/backend-service';

@autoinject
export class ImageGallery {
  private title: string;
  private sections: Array<string>;
  private images = null;

  selectedImg: any = "test";
  
  constructor(private controller: DialogController, private backend: BackendService) {
    controller.settings.centerHorizontalOnly = true;
    console.log('image-gallery constructed');
    this.backend.getImagesBySection('Backgrounds').then(data => {
      this.images = JSON.parse(data.response);
    })
  }

  attached() {
    console.log('image-gallery attached');
  }

  detached() {
    console.log('image-gallery detached');
  }
  
  activate(model) {
    console.log('image-gallery activated');
    this.title = model.title;
    this.sections = model.sections;
  }
}
