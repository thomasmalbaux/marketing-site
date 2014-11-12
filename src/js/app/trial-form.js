define(['jquery', 'move', 'app/trial-form-validators'], function($, move, validator) {
  var transitionEnd = "webkitTransitionEnd oTransitionEnd otransitionend transitionend msTransitionEnd";
  // cache elements
  var el = {};

  var init = function() {
    el = {
      emailSlide: $('#trial-email-slide'),
      emailInput: $('#trial-email-input'),
      emailNextButton: $('#trial-email-next'),
      emailNotSell: $('#trial-email-not-sell'),
      emailInvalid: $('#trial-email-invalid')
    };

    el['emailNextButton'].click(emailNextHandler);
  };

  var hide = function(slide) {
    move(el.emailSlide[0])
      .translate(-300)
      .set('opacity', 0.1)
      .duration('0.2s')
      .then()
        .set('display', 'none')
        .pop()
      .end();
  };

  var emailNextHandler = function() {
    var email = el['emailInput'].val();
    if (validator.validEmail(email)){
      hide(el.emailSlide);
    } else {
      el.emailNotSell.hide();
      el.emailInvalid.show();
    }
  };

  return {
    init: init
  };
});
