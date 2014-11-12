define([], function() {
  // cache elements
  var el = {};

  var init = function() {
    el = {
      emailSlide: $('#trial-email-slide'),
      emailNextButton: $('#trial-email-next')
    };

    el['emailNextButton'].click(function() {
      el['emailSlide'].hide();
    });
  };

  var emailNextHandler = function() {

  };

  return {
    init: init
  };
});
