define(
  [ "jquery"
  , "smoothScroll"
  , "odometer"
  , "app/trial-form"
  , "app/scrollspy"
  , "fancybox"
  , "sticky"
  , "fastclick"
  , "googleAnalytics"
  , "placeholder"
  ]
  , function ($, SmoothScroll, Odometer, trialForm, scrollSpy, fancybox, sticky, FastClick) {

    var initializeTrialLightbox = function(el) {
      $(el)
        .fancybox({
          width       : '100%',
          height      : '100%',
          type        : 'inline',
          autoSize    : false,
          padding     : '0',

          // This prevents jumping when the lightbox is closed
          helpers: {
            overlay: {
              locked: true
            }
          }
        });
    };

    var app = {
      init: function() {
        new FastClick(document.body);
        $('input, textarea').placeholder();

        //initialize sticky nav bar
        $('#main-navigation').fixedsticky();
        var sidenav = $('#side-navigation');
        sidenav.fixedsticky();

        //Initialize smooth-scroll plugin
        SmoothScroll.init({
          speed: 300,
          callbackBefore: function(toggle, anchor) {
            scrollSpy.stop();
            scrollSpy.select(anchor);
          },
          callbackAfter: function(toggle, anchor) {
            setTimeout(scrollSpy.restart, 0);
          }
        });

        this.initializeOdometers();

        // Initialize lightbox
        trialForm.init($('#trial-lightbox'));

        // Initialize index page trial form
        trialForm.init($('#trial'));

        scrollSpy.init($('.scrollspy a'));

        if (window.console && window.console.log) {
          window.console.log('Hi there! Interested in code?\n\nSharetribe is an open-source marketplace platform. See https://github.com/sharetribe/sharetribe for more information about the open-source project.');
        }

        $("#sharetribe-video")
          .fancybox({
            width       : '75%',
            height      : '75%',
            type        : 'iframe',
            padding     : '0',
            scrolling   : 'no',
            preload     : 'true',

            // This prevents jumping when the lightbox is closed
            helpers: {
              overlay: {
                locked: false
              }
            }
          });

        initializeTrialLightbox("#home-get-started");
        initializeTrialLightbox("#menu-get-started");
        initializeTrialLightbox("#mobilemenu-get-started");
        initializeTrialLightbox(".pricing-get-started");

        $( "#mobilemenu" ).click(function() {
          $( ".menu-cover" ).slideDown( "slow" );
        });

        $( "#menuclose" ).click(function() {
          $( ".menu-cover" ).slideUp( "slow" );
        });

        }

      , initializeOdometers: function() {
        //TODO magic numbers
        this.initializeOdometer($('.starter.price-container'), 39, 49);
        this.initializeOdometer($('.pro.price-container'), 19, 49);
        this.initializeOdometer($('.growth.price-container'), 59, 99);
        this.initializeOdometer($('.scale.price-container'), 39, 99);
      }

      , initializeOdometer: function($priceContainer, reducedPrice, monthlyPrice) {
        var $pricingTable = $priceContainer.parents('.pricing-table');
        var $deal = $pricingTable.find('.odometer');

        if($deal.length > 0) {

          var odometer = new Odometer(
            { el: $deal[0]
            , value: reducedPrice
            }
          );

          $pricingTable.find('.switch-price').on('click', function(e) {
	    e.preventDefault();

	    //no monthly class is reduced price, and price is reduced by default
	    $deal.toggleClass('monthly')

            var switchPrice = $(e.currentTarget);

            if($deal.hasClass('monthly')) {
              $deal.html(monthlyPrice);
              switchPrice
                .removeClass('switch-monthly')
                .addClass('switch-biannually')
                .text('› Switch to semiannual billing and save up to 20%');

              $pricingTable.find('.billing-cycle').text('Billed monthly');

            } else {
              $deal.html(reducedPrice);
              switchPrice
                .removeClass('switch-biannually')
                .addClass('switch-monthly')
                .text('› Switch to monthly billing');

              $pricingTable.find('.billing-cycle').text('Billed every 6 months');
            }
          });
        }
      }
    }
    app.init();
    return app;
});
