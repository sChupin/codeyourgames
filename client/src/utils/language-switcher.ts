import {autoinject} from 'aurelia-framework';
import {I18N} from 'aurelia-i18n';

@autoinject
export class LanguageSwitcher {

  constructor(private i18n: I18N) {
  }

  languages = [
        { value: 'en', text: 'English', flag: 'flag-icon-us'},
        { value: 'fr', text: 'Français', flag: 'flag-icon-fr'}
    ];
  selectedLanguage = 'en';

  switchLanguage() {
    this.i18n.setLocale(this.selectedLanguage);
  }

  attached() {
    $('.selectpicker').selectpicker();
  }
}
