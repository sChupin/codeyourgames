import {Router, RouterConfiguration} from 'aurelia-router';

export class App {
  public router: Router;

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

}
