import {Router, RouterConfiguration} from 'aurelia-router';

export class App {
  public router: Router;

  public configureRouter(config: RouterConfiguration, router: Router) {
    config.title = '';
    config.map([
      { route: '', moduleId: './pages/landing/index', title: 'nav-bar.home'},
      { route: 'playground', moduleId: './pages/playground/difficulty', nav: true, title: 'nav-bar.playground' },
      { route: 'playground/:difficulty', name: 'playground', moduleId: './pages/playground/index', title: 'nav-bar.playground' },
      { route: 'documentation', name: 'documentation', moduleId: './doc/documentation', nav: true, title: 'nav-bar.doc' },
      { route: 'games', moduleId: './games/games', title: 'nav-bar.games' },
      { route: 'about', name: 'about', moduleId: './pages/about/index', nav: true, title: 'nav-bar.about' }
    ]);

    this.router = router;
  }

}
