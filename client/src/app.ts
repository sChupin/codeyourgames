import {Router, RouterConfiguration} from 'aurelia-router';
import {FetchConfig} from 'aurelia-auth';
import {inject} from 'aurelia-framework';

@inject(FetchConfig)
export class App {
  public router: Router;
  public fetchConfig: FetchConfig;

  constructor(fetchConfig: FetchConfig) {
    this.fetchConfig = fetchConfig;
  }

  public configureRouter(config: RouterConfiguration, router: Router) {
    config.title = 'Loop';
    config.map([
      {route: '', redirect: 'playground'},
      { route: 'playground', name: 'playground', moduleId: './playground/playground', nav: true, title: 'Play Ground' },
      { route: 'documentation', name: 'documentation', moduleId: './doc/documentation', nav: true, title: 'Documentation' },
      { route: 'games', name: 'games', moduleId: './games/games', nav: true, title: 'Games'}
    ]);

    this.router = router;
  }

  activate() {
    this.fetchConfig.configure();
  }

}
