import {DialogController} from 'aurelia-dialog';
import {autoinject} from 'aurelia-framework';

import {BackendService} from '../../services/backend-service';
import {ImageInfo} from '../interfaces';

@autoinject
export class ImageGallery {
  private title: string = '';
  private sections: Array<string> = [];
  private images: Array<ImageInfo> = null;

  selectedImg: ImageInfo = null;
  
  constructor(private controller: DialogController, private backend: BackendService) {
    controller.settings.centerHorizontalOnly = true;
    this.backend.getImagesBySection('Backgrounds').then(data => {
      this.images = JSON.parse(data.response);
    });
  }
  
  activate(model) {
    this.title = model.title;
    this.sections = model.sections;
  }

  private selectImg(img) {
    this.selectedImg = img;
  }
}
