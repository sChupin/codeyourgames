import {HttpClient} from 'aurelia-http-client';
import {autoinject} from 'aurelia-framework';

@autoinject
export class BackendService {

  // getImagesBySection(section: String) {
  //   console.log('get images by section: ' + section);
  //   return new Promise((section) => {
  //         [{name: "body1", url: "http://www.untamed.wild-refuge.net/images/rpgxp/single/alberto.png"},
  //         {name: "body2", url: "http://www.untamed.wild-refuge.net/images/rpgxp/single/anakin.png"}];
  //   });
  // }

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
