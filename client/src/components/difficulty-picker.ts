import {autoinject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';

@autoinject
export class DifficultyPicker {
  constructor(private ea: EventAggregator, private element: Element) { }

  attached() {
    $('.selectpicker').selectpicker();
    this.ea.subscribe('i18n:locale:changed', payload => {
      // This is a hack to fix translation refreshing bug
      setTimeout(() => $('.selectpicker').selectpicker('render'), 0);
    });
  }

  star_icon = ' <span style="top: 2px;" class="glyphicon glyphicon-star"></span>';
  difficulties = [
    { value: 'easy', name: 'difficulty.lvl1' },
    { value: 'medium', name: 'difficulty.lvl2' },
    { value: 'hard', name: 'difficulty.lvl3' }
  ];
  selectedLevel = 'easy';

}
