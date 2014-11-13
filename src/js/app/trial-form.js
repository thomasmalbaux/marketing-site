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

  // save user input to this object right after validation
  var data = {};

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
      nameLastInvalid: $('#trial-name-last-invalid'),

      passwordSlide: $('#trial-password-slide'),
      passwordForm: $('#trial-password-form'),
      passwordInput: $('#trial-password-input'),
      passwordConfirmationInput: $('#trial-password-confirmation-input'),
      passwordMissing: $('#trial-password-missing'),
      passwordConfirmationMissing: $('#trial-password-confirmation-missing'),
      passwordTooShort: $('#trial-password-too-short'),
      passwordConfirmationMismatch: $('#trial-password-confirmation-mismatch'),

      marketplaceSlide: $('#trial-marketplace-slide'),
      marketplaceForm: $('#trial-marketplace-form'),
      marketplaceTypeSelect: $('#trial-marketplace-type-select'),
      marketplaceTypeSelectDefault: $('#trial-marketplace-type-default'),
      marketplaceNameInput: $('#trial-marketplace-name-input'),
      marketplaceTypeInvalid: $('#trial-marketplace-type-invalid'),
      marketplaceNameTooShort: $('#trial-marketplace-name-too-short'),

      createdSlide: $('#trial-created-slide'),
      createFailedSlide: $('#trial-create-failed-slide'),
      createSuccessSlide: $('#trial-create-success-slide'),

      gotoButton: $('#trial-goto-button')
    };

    initEmail();
    initLocalization();
    initName();
    initPassword();
    initMarketplace();
  };

  var initEmail = function() {
    el.emailForm.submit(emailHandler);
  };

  var initLocalization = function() {
    initChosen(el.localizationForm, el.localizationCountrySelect, el.localizationCountryDefault);
    initChosen(el.localizationForm, el.localizationLanguageSelect, el.localizationLanguageDefault);

    el.localizationForm.submit(localizationHandler);
  };

  var initName = function() {
    el.nameForm.submit(nameHandler);
  };

  var initPassword = function() {
    el.passwordForm.submit(passwordHandler);
  };

  var initMarketplace = function() {
    initChosen(el.marketplaceForm, el.marketplaceTypeSelect, el.marketplaceTypeDefault);

    el.marketplaceForm.submit(marketplaceHandler);
  };

  var initChosen = function(form, select, defaultOption) {
    select.chosen({
      inherit_select_classes: true,
      width: '100%',
      disable_search_threshold: 4
    });

    // Chosen is disabled for iOS, Android, etc.
    // We need to add a default option in order to show a placeholder for those browsers
    var chosenActivated = form.find('.chosen-container').length > 0;

    if (!chosenActivated) {
      defaultOption.text(select.data('placeholder'));
    }
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

  var hideAndShow = function(elHide, elShow, clbk) {
    clbk = clbk || function() {};
    hide(elHide, function() {
      show(elShow, clbk);
    });
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
    var email = el.emailInput.val();

    // Handle animation OR check ready.
    // This is a stupid piece of code that should be handled without mutable variables
    // by some library e.g. Bacon
    var animationOrCheckDone = function() {
      if(animationDone && checkDone) {
        if (emailAvailable) {
          data.admin_email = email;
          show(el.localizationSlide);
        } else {
          show(el.existingAccountSlide);
        }
      }
    };

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
      data.marketplace_country = country;
      data.marketplace_language = language;
      hideAndShow(el.localizationSlide, el.nameSlide);
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
      data.admin_first_name = first;
      data.admin_last_name = last;
      hideAndShow(el.nameSlide, el.passwordSlide);
    }
  });

  var passwordHandler = submitHandler(function(e) {
    var allMessages = [
      el.passwordMissing,
      el.passwordConfirmationMissing,
      el.passwordTooShort,
      el.passwordConfirmationMismatch
    ];

    var showMessage = function(activeMessage) {
      allMessages.forEach(function(message) {
        if (message === activeMessage) {
          message.show();
        } else {
          message.hide();
        }
      });
    };

    var password = el.passwordInput.val();
    var confirmation = el.passwordConfirmationInput.val();

    if (!password) {
      showMessage(el.passwordMissing);
    } else if (!validator.validPassword(password)) {
      showMessage(el.passwordTooShort);
    } else if (!confirmation) {
      showMessage(el.passwordConfirmationMissing);
    } else if (password !== confirmation) {
      showMessage(el.passwordConfirmationMismatch);
    } else {
      data.admin_password = password;
      hideAndShow(el.passwordSlide, el.marketplaceSlide);
    }
  });

  var marketplaceHandler = submitHandler(function(e) {
    var type = el.marketplaceTypeSelect.val();
    var name = el.marketplaceNameInput.val();

    if (!validator.validMarketplaceType(type)) {
      el.marketplaceTypeInvalid.show();
      el.marketplaceNameTooShort.hide();
    } else if (!validator.validMarketplaceName(name)) {
      el.marketplaceTypeInvalid.hide();
      el.marketplaceNameTooShort.show();
    } else {
      data.marketplace_type = type;
      data.marketplace_name = name;
      hideAndShow(el.marketplaceSlide, el.createdSlide, function() {
        createMarketplace(data, function(marketplaceUrl) {
            el.gotoButton.attr('href', marketplaceUrl);
            hideAndShow(el.createdSlide, el.createSuccessSlide);
          }, function() {
            hideAndShow(el.createdSlide, el.createFailedSlide);
          });
      });
    }
  });

  var createMarketplace = function(data, success, error) {
    var request = $.ajax({
      type: "POST",
      url: 'http://catch.sharetri.be/int_api/create_trial_marketplace',
      data: data,
      dataType: 'json'
    });

    request.done(function(response) {
      success(response.marketplace_url);
    });

    request.fail(error);
  };

  return {
    init: init
  };
});
