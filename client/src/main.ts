import 'bootstrap';
import 'EastDesire/jscolor';
import {Aurelia} from 'aurelia-framework';
import config from './other/auth-config';

export function configure(aurelia: Aurelia) {
  aurelia.use
    .standardConfiguration()
    .developmentLogging()
    .plugin('aurelia-dialog')
    .plugin('abalmus/aurelia-ace-editor')
    .plugin('aurelia-auth', (baseConfig) => {
      baseConfig.configure(config);
    });

  // Uncomment the line below to enable animation.
  // aurelia.use.plugin('aurelia-animator-css');

  // Anyone wanting to use HTMLImports to load views, will need to install the following plugin.
  // aurelia.use.plugin('aurelia-html-import-template-loader')

  // TODO: set root to app if already inside the app...
  let root = 'app';
  aurelia.start().then(() => aurelia.setRoot(root));
}
