import {BackendService} from '../backend-service';
import {EventAggregator} from 'aurelia-event-aggregator';
import {ImgMsg} from './messages';
import {autoinject, bindable} from 'aurelia-framework';

@autoinject
export class ImageGallery {
  @bindable background

  public sections;
  public gallery;
  private loaded;
  private selectedImg;

  constructor(private backend: BackendService, private ea: EventAggregator) {
    this.gallery = {};
    this.loaded = {};
  }

  attached() {
    if (!this.background) {
      this.backend.getGallerySections().then(data => this.sections = JSON.parse(data.response));
    } else {
      this.sections = ['Backgrounds'];
    }
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
    this.ea.publish(new ImgMsg(this.background, image));
    
    // Deselect image
    if (this.selectedImg) {
      this.selectedImg.selected = false;
      this.selectedImg = null;
    }

  }

}


export class ImageInfo {
  public name: string;
  public url: string;
  public spritesheet: SpriteSheetInfo;
}

export interface SpriteSheetInfo {
  sheetUrl: string;
  spriteWidth: number;
  spriteHeight: number;
  horizontalNbr: number;
  verticalNbr: number;
  spriteNbr: number;
  defaultSpriteNo: number;
}
