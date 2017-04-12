import {Router, RouterConfiguration} from 'aurelia-router';

export class Games {
  public heading = 'Games';
  public router: Router;

  public configureRouter(config: RouterConfiguration, router: Router) {
    config.map([
      { route: ['', 'phaser-game'], name: 'phaser-game', moduleId: './phaser-game', nav: true, title: 'Platform' },
      { route: 'snake', name: 'snake', moduleId: './snake', nav: true, title: 'Snake' },
      { route: 'pong', name: 'pong', moduleId: './pong', nav: true, title: 'Pong' }
    ]);

    this.router = router;
  }
}
