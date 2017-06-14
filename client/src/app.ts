import {Router, RouterConfiguration} from 'aurelia-router';

export class App {
  public router: Router;

  public configureRouter(config: RouterConfiguration, router: Router) {
    config.title = '';
    config.map([
      { route: '', moduleId: 'landing'},
      { route: 'playground', moduleId: './difficulty' },
      { route: 'playground/easy', name: 'playground', moduleId: './playground/playground', nav: true, title: 'nav-bar.playground' },
      { route: 'documentation', name: 'documentation', moduleId: './doc/documentation', nav: true, title: 'nav-bar.doc' },
      { route: 'games', moduleId: './games/games' },
      { route: 'about', name: 'about', moduleId: './about', nav: true, title: 'nav-bar.about' }
    ]);

    this.router = router;
  }

}
