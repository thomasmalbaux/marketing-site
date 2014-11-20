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
      , 'xdomain':      '../vendor/jQuery.XDomainRequest' // IE support for cross domain requests
      , 'modernizr':    '../vendor/modernizr.custom.05853' // Note: Usually modernizr should be included in the HTML head (http://modernizr.com/docs/#installing). However, since we are not using HTML classes, it's ok to use requirejs to load modernizr.
      , 'placeholder':  '../vendor/jquery-placeholder'
    }
  , shim:
    { jquery:
      {
        exports: '$'
      }
    , sticky:
      {
        deps: ['jquery']
      }
    , chosen:
      {
        deps: ['jquery']
      }
    , fancybox:
      {
        'deps': ['jquery']
      }
    , modernizr:
      {
        exports: 'Modernizr'
      }
    , placeholder:
      {
        deps: ['jquery']
      }
    }
  }
);

requirejs(['app/main']);
