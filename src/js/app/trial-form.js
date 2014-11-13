define(['jquery', 'move', 'app/trial-form-validators', 'modernizr', 'xdomain'], function($, move, validator, Modernizr) {
  var transitionEnd = "webkitTransitionEnd oTransitionEnd otransitionend transitionend msTransitionEnd";
  // cache elements
  var el = {};

  var init = function() {
    el = {
      emailSlide: $('#trial-email-slide'),
      emailInput: $('#trial-email-input'),
      emailForm: $('#trial-email-form'),
      emailNotSell: $('#trial-email-not-sell'),
      emailInvalid: $('#trial-email-invalid'),

      emailCheckFailedSlide: $('#trial-email-check-failed'),

      existingAccountSlide: $('#trial-existing-account'),

      localizationSlide: $('#trial-localization')
    };

    el['emailForm'].submit(emailHandler);
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

  var emailHandler = function(e) {
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

    // Don't submit form
    e.preventDefault();
    return false;
  };

  return {
    init: init
  };
});
