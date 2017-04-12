import {autoinject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-http-client';
import {ImageInfo} from '../messages';
import {EventAggregator} from 'aurelia-event-aggregator';

@autoinject
export class Gallery {
  public gallery;

  constructor(private http: HttpClient, private ea: EventAggregator) {
    http.configure(config => {
      config
        .withBaseUrl('http://localhost:9000/api/');
    });
  }
  
  attached() {
    return this.http.get('img-gallery')
      .then(data => this.gallery = JSON.parse(data.response));
  }
  
  publishImg(imageId) {
    console.log('image ' + imageId + ' published');
    this.ea.publish(new ImageInfo(this.gallery[imageId].name, this.gallery[imageId].url));
  }

}
