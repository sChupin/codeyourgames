import {HttpClient} from 'aurelia-http-client';
import {autoinject} from 'aurelia-framework';

@autoinject
export class BackendService {

  constructor(private http: HttpClient) {
    http.configure(config => {
      config.withBaseUrl('http://localhost:9000/api/');
    });
  }

  getImagesBySection(section: String) {
    return this.http.get('img-gallery/' + section);
  }

  getGallerySections() {
    return this.http.get('img-gallery');
  }

}
