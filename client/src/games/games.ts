import {Router, RouterConfiguration} from 'aurelia-router';

export class Games {
  public heading = 'Games';
  public router: Router;

  public configureRouter(config: RouterConfiguration, router: Router) {
    config.map([
      { route: ['', 'phaser-game'], name: 'phaser-game', moduleId: './phaser-game', nav: true, title: 'Phaser Game' },
      { route: '2d-motion', name: '2d-motion', moduleId: './2d-motion', nav: true, title: '2D Motion'},
      { route: 'camera', name: 'camera', moduleId: './camera', nav: true, title: 'Camera'},
      { route: 'snake', name: 'snake', moduleId: './snake', nav: true, title: 'Snake' },
      { route: 'pong', name: 'pong', moduleId: './pong', nav: true, title: 'Pong' },
      { route: 'mario', name: 'mario', moduleId: './mario', nav: true, title: 'Mario' },
      { route: 'zelda', name: 'zelda', moduleId: './zelda', nav: true, title: 'Zelda' },
      { route: 'platform', name: 'platform', moduleId: './platform', nav: true, title: 'Platform' }
    ]);

    this.router = router;
  }
}
