import {Router, RouterConfiguration} from 'aurelia-router';

export class Documentation {
  public router: Router;

  public configureRouter(config: RouterConfiguration, router: Router) {
    config.map([
      { route: ['', 'language'], name: 'language', moduleId: './language', nav: true, title: 'documentation.languageTitle' },
      { route: 'globals', name: 'globals', moduleId: './globals', nav: true, title: 'documentation.globalsTitle' },
      { route: 'types', name: 'types', moduleId: './types', nav: true, title: 'documentation.typesTitle' }
    ]);

    this.router = router;
  }
}
