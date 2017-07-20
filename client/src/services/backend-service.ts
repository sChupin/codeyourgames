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

  parseEventCode(code): Promise<any> {
    let postBody: any = {};
    postBody.code = code;
    return this.http.post('transpiler/event', postBody);
  }
  
  parseFunctionCode(code) {
    let postBody: any = {};
    postBody.code = code;
    return this.http.post('transpiler/function', postBody);
  }

  parseCollisionCode(code) {
    let postBody: any = {};
    postBody.code = code;
    return this.http.post('transpiler/collision', postBody);
  }

}
