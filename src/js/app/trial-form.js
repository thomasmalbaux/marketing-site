define([
  'jquery'
  , 'move'
  , 'app/trial-form-validators'
  , 'modernizr'
  , 'xdomain'
  , 'chosen'
], function($, move, validator, Modernizr) {
  var transitionEnd = "webkitTransitionEnd oTransitionEnd otransitionend transitionend msTransitionEnd";
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
      emailSlide: $('#trial-email-slide'),
      emailInput: $('#trial-email-input'),
      emailForm: $('#trial-email-form'),
      emailNotSell: $('#trial-email-not-sell'),
      emailInvalid: $('#trial-email-invalid'),

      emailCheckFailedSlide: $('#trial-email-check-failed'),

      existingAccountSlide: $('#trial-existing-account'),

      localizationSlide: $('#trial-localization'),
      localizationCountrySelect: $('#trial-localization-country-select'),
      localizationLanguageSelect: $('#trial-localization-language-select'),
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

    // initEmail();
    // initLocalization();
    initName();
  };

  var initEmail = function() {
    el.emailForm.submit(emailHandler);
  };

  var initLocalization = function() {
    el.localizationCountrySelect.chosen({'inherit_select_classes': true, width: '100%'});
    el.localizationLanguageSelect.chosen({'inherit_select_classes': true, width: '100%'});

    el.localizationForm.submit(localizationHandler);
  };

  var initName = function() {
    el.nameForm.submit(nameHandler);
  };

  var hide = function(slide) {
    if (!Modernizr.csstransitions) {
      slide.hide('slow');
    } else {
      move(slide[0])
        .translate(-300)
        .set('opacity', 0.1)
        .duration('0.2s')
        .then()
          .set('display', 'none')
          .set('opacity', 1)
          .pop()
        .end();
    }
  };

  var show = function(slide) {
    if (!Modernizr.csstransitions) {
      slide.show('slow');
    } else {
      move(slide[0])
        .set('display', 'block')
        .set('opacity', 0.1)
        .x(300)
        .duration(0)
        .then()
          .set('opacity', 1)
          .x(-300)
          .duration('0.2s')
          .pop()
        .end();
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
    var email = el.emailInput.val();
    if (validator.validEmail(email)){
      hide(el.emailSlide);
      checkEmailAvailability(email, function(available) {
        if (available) {
          show(el.localizationSlide);
        } else {
          show(el.existingAccountSlide);
        }
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
      hide(el.localizationSlide);
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
