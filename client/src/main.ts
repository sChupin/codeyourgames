import 'bootstrap';
import 'fabric';
import 'EastDesire/jscolor';
import 'silviomoreto/bootstrap-select';
import {Aurelia} from 'aurelia-framework';
import {I18N, Backend, TCustomAttribute} from 'aurelia-i18n';
import {AppRouter} from 'aurelia-router';
import {EventAggregator} from 'aurelia-event-aggregator';

export function configure(aurelia: Aurelia) {
  aurelia.use
    .standardConfiguration()
    .developmentLogging()
    .plugin('aurelia-dialog', config => {
      config.useDefaults();
    })
    .plugin('martingust/aurelia-repeat-strategies')
    .plugin('abalmus/aurelia-ace-editor')
    .plugin('aurelia-validation')
    .plugin('aurelia-i18n', (instance) => {
      let aliases = ['t', 'i18n'];
      // add aliases for 't' attribute
      TCustomAttribute.configureAliases(aliases);
      
      // register backend plugin
      instance.i18next.use(Backend.with(aurelia.loader));

      // adapt options to your needs (see http://i18next.com/docs/options/)
      // make sure to return the promise of the setup method, in order to guarantee proper loading
      return instance.setup({
        backend: {                                  // <-- configure backend settings
          loadPath: './locales/{{lng}}/{{ns}}.json', // <-- XHR settings for where to get the files from
        },
        attributes: aliases,
        lng : 'en',
        fallbackLng : 'en',
        debug : false
      }).then(() => {
        const router: AppRouter = aurelia.container.get(AppRouter);
        router.transformTitle = title => instance.tr(title);
        
        const eventAggregator = aurelia.container.get(EventAggregator);
        eventAggregator.subscribe('i18n:locale:changed', () => {
          router.updateTitle();
        });
      });
    });

  // Uncomment the line below to enable animation.
  // aurelia.use.plugin('aurelia-animator-css');

  // Anyone wanting to use HTMLImports to load views, will need to install the following plugin.
  // aurelia.use.plugin('aurelia-html-import-template-loader')

  let root = 'app';
  aurelia.start().then(() => aurelia.setRoot(root));
}
