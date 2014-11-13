define([
  'jquery'
  , 'lodash'
  , 'move'
  , 'app/trial-form-validators'
  , 'modernizr'
  , 'xdomain'
  , 'chosen'
  , 'placeholder'
], function($, _, move, validator, Modernizr) {
  $('input, textarea').placeholder();

  // cache elements
  var el = {};

  // Helper function to create submit handler
  var submitHandler = function(clbk) {
    return function(e) {
      clbk(e); // Run the handler

      // Don't submit the form
      e.preventDefault();
      return false;
    };
  };

  var init = function() {
    el = {
      animationContainer: $('#trial-animation-container'),

      emailSlide: $('#trial-email-slide'),
      emailInput: $('#trial-email-input'),
      emailForm: $('#trial-email-form'),
      emailNotSell: $('#trial-email-not-sell'),
      emailInvalid: $('#trial-email-invalid'),

      emailCheckFailedSlide: $('#trial-email-check-failed'),

      existingAccountSlide: $('#trial-existing-account'),

      localizationSlide: $('#trial-localization'),
      localizationCountrySelect: $('#trial-localization-country-select'),
      localizationCountryDefault: $('#trial-localization-country-default'),
      localizationLanguageSelect: $('#trial-localization-language-select'),
      localizationLanguageDefault: $('#trial-localization-language-default'),
      localizationForm: $('#trial-localization-form'),
      localizationDidntFindLanguage: $('#trial-localization-didnt-find-language'),
      localizationCountryInvalid: $('#trial-localization-country-invalid'),
      localizationLanguageInvalid: $('#trial-localization-language-invalid'),

      nameSlide: $('#trial-name-slide'),
      nameFirstInput: $('#trial-name-first-input'),
      nameLastInput: $('#trial-name-last-input'),
      nameForm: $('#trial-name-form'),
      nameFirstInvalid: $('#trial-name-first-invalid'),
      nameLastInvalid: $('#trial-name-last-invalid')
    };

    initEmail();
    initLocalization();
    initName();
  };

  var initEmail = function() {
    el.emailForm.submit(emailHandler);
  };

  var initLocalization = function() {
    el.localizationCountrySelect.chosen({'inherit_select_classes': true, width: '100%', display_disabled_options: true } );
    el.localizationLanguageSelect.chosen({'inherit_select_classes': true, width: '100%'});

    // Chosen is disabled for iOS, Android, etc.
    // We need to add a default option in order to show a placeholder for those browsers
    var chosenActivated = el.localizationForm.find('.chosen-container').length > 0;

    if (!chosenActivated) {
      el.localizationCountryDefault.text(el.localizationCountrySelect.data('placeholder'));
      el.localizationLanguageDefault.text(el.localizationLanguageSelect.data('placeholder'));
    }

    el.localizationForm.submit(localizationHandler);
  };

  var initName = function() {
    el.nameForm.submit(nameHandler);
  };

  var hide = function(slide, clbk) {
    clbk = clbk || function() {};
    if (!Modernizr.csstransitions) {
      slide.hide('slow', clbk);
    } else {
      move(slide[0])
        .translate(-300)
        .set('opacity', 0.1)
        .end(function() {
          slide.css('display', 'none');
          slide.css('opacity', 1);

          _.defer(clbk);
        });
    }
  };

  var show = function(slide, clbk) {
    clbk = clbk || function() {};
    if (!Modernizr.csstransitions) {
      slide.show('slow', clbk);
    } else {
      var clone = slide.clone();

      $('#trial-animation-container')
        .show()
        .empty()
        .append(clone);

      move(clone[0])
        .set('display', 'block')
        .set('opacity', 0.1)
        .x(300)
        .duration(0)
        .end(function() {
          move(clone[0])
            .set('opacity', 1)
            .x(0)
            .end(function() {
              _.defer(function() {
                slide.show();
                $('#trial-animation-container').empty().hide();
                _.defer(clbk);
              });
            });
        });
    }
  };

  var checkEmailAvailability = function(email, success, fail) {
    var request = $.ajax(
      {
        type: "GET"
        , url: 'http://catch.sharetri.be/int_api/check_email_availability'
        , data: {email: email}
        , dataType: 'json'
      });

    request.done(function(response) {
      success(response.available);
    });
    request.fail(fail);
  };

  var emailHandler = submitHandler(function(e) {
    // Keep animation and email check state in memory
    var animationDone = false;
    var checkDone = false;
    var emailAvailable;

    // Handle animation OR check ready.
    // This is a stupid piece of code that should be handled without mutable variables
    // by some library e.g. Bacon
    var animationOrCheckDone = function() {
      if(animationDone && checkDone) {
        if (emailAvailable) {
          show(el.localizationSlide);
        } else {
          show(el.existingAccountSlide);
        }
      }
    };

    var email = el.emailInput.val();
    if (validator.validEmail(email)){
      hide(el.emailSlide, function() {
        animationDone = true;
        animationOrCheckDone();
      });
      checkEmailAvailability(email, function(available) {
        checkDone = true;
        emailAvailable = available;
        animationOrCheckDone();
      }, function() {
        show(el.emailCheckFailedSlide);
      });
    } else {
      el.emailNotSell.hide();
      el.emailInvalid.show();
    }
  });

  var localizationHandler = submitHandler(function(e) {
    var country = el.localizationCountrySelect.val();
    var language = el.localizationLanguageSelect.val();

    if (!validator.validCountry(country)) {
      el.localizationDidntFindLanguage.hide();
      el.localizationLanguageInvalid.hide();
      el.localizationCountryInvalid.show();
    } else if (!validator.validLanguage(language)) {
      el.localizationDidntFindLanguage.hide();
      el.localizationCountryInvalid.hide();
      el.localizationLanguageInvalid.show();
    } else {
      hide(el.localizationSlide, function() {
        show(el.nameSlide);
      });
    }
  });

  var nameHandler = submitHandler(function(e) {
    var first = el.nameFirstInput.val();
    var last = el.nameLastInput.val();

    if (!validator.validFirstName(first)) {
      el.nameFirstInvalid.show();
      el.nameLastInvalid.hide();
    } else if (!validator.validLastName(last)) {
      el.nameFirstInvalid.hide();
      el.nameLastInvalid.show();
    } else {
      hide(el.nameSlide);
    }
  });

  return {
    init: init
  };
});
