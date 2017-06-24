import {DialogController} from 'aurelia-dialog';
import {autoinject} from 'aurelia-framework';

import {BackendService} from '../../services/backend-service';
import {ImageInfo} from '../interfaces';

@autoinject
export class ImageGallery {
  private title: string = '';
  private sections: Array<string> = [];
  private gallery: Array<Array<ImageInfo>> = [];

  selectedImg: ImageInfo = null;
  
  constructor(private controller: DialogController, private backend: BackendService) {
    controller.settings.centerHorizontalOnly = true;
  }
  
  activate(model) {
    this.title = model.title;
    this.sections = model.sections;
  }

  attached() {
    this.sections.forEach(section => {
      this.backend.getImagesBySection(section).then(data => {
        this.gallery.push(JSON.parse(data.response));
      });
    });
  }

  private selectImg(img) {
    this.selectedImg = img;
  }
}
