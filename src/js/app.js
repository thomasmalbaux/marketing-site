requirejs.config(
  { paths:
      { 'jquery':       '../vendor/jquery-2.1.1.min'
      , 'bind':         '../vendor/smooth-scroll/bind-polyfill'
      , 'chosen':       '../vendor/chosen/chosen.jquery.min'
      , 'odometer':     '../vendor/odometer/odometer.min'
      , 'smoothScroll': '../vendor/smooth-scroll/smooth-scroll'
      , 'sticky':       '../vendor/fixedsticky/fixedsticky'
      , 'text':         '../vendor/text'
      , 'fancybox':     '../vendor/fancybox/jquery.fancybox'
      , 'lodash':       '../vendor/lodash'
      , 'move':         '../vendor/move'
      , 'googleAnalytics': '../vendor/google-analytics/google-analytics'
      , 'fastclick':       '../vendor/fastclick'
      }
  , shim:
    { sticky:
      {
        'deps': ['jquery']
      }
    , chosen:
      {
        deps: ['jquery']
      }
    , fancybox:
      {
        'deps': ['jquery']
      }
    }
  }
);

requirejs(['app/main']);
