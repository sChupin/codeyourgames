import {BackendService} from '../backend-service';
import {EventAggregator} from 'aurelia-event-aggregator';
import {ImageInfo} from './messages';
import {autoinject} from 'aurelia-framework';

@autoinject
export class ImageGallery {
  public sections;
  public gallery;
  private loaded;
  private selectedImg;

  constructor(private backend: BackendService, private ea: EventAggregator) {
    this.gallery = {};
    this.loaded = {};
    backend.getGallerySections().then(data => this.sections = JSON.parse(data.response));
  }

  retrieveImg(section) {
    if (!this.loaded[section]) {
      this.loaded[section] = true;
      this.backend.getImagesBySection(section)
        .then(data => {
          this.gallery[section] = JSON.parse(data.response);
        });
    }
  }

  public selectImg(img) {
    if (!img.selected) {
      img.selected = true;
      if (!this.selectedImg) {
        this.selectedImg = img;
      } else {
        this.selectedImg.selected = false;
        this.selectedImg = img;
      }
    }
  }

  public addImage(image) {
    this.ea.publish(new ImageInfo(image.name, image.url));
  }

}
