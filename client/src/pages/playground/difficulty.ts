import {autoinject} from 'aurelia-framework';
import {Router} from 'aurelia-router';

@autoinject
export class Difficulty {

  constructor(private router: Router) { }

  goToPlayground(difficulty: string) {
    this.router.navigateToRoute('playground', {difficulty: difficulty});
  }
}
