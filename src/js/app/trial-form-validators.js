define(['lodash'], function(_) {

  var email = function(email) {
    var emailFilter = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailFilter.test(email);
  };

  var country = function(country) {
    return country.length === 2;
  };

  var language = function(language) {
    return /^[a-z]{2}(-[A-Z]{2})?$/.test(language);
  };

  var firstName = function(firstName) {
    return firstName.length < 255;
  };

  var lastName = function(lastName) {
    return lastName.length < 255;
  };

  var password = function(password) {
    return password.length >= 8;
  };

  var marketplaceType = function(type) {
    return _.contains(['product', 'rental', 'service'], type);
  };

  var marketplaceName = function(name) {
    return name.length > 1;
  };

  return {
    validEmail: email,
    validCountry: country,
    validLanguage: language,
    validFirstName: firstName,
    validLastName: lastName,
    validPassword: password,
    validMarketplaceType: marketplaceType,
    validMarketplaceName: marketplaceName
  };
});
