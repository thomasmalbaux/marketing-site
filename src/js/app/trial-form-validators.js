define([], function() {

  var email = function(email) {
    var emailFilter = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailFilter.test(email);
  };

  var country = function(country) {
    return country.length === 2;
  };

  var language = function(language) {
    return language.length === 2;
  };

  var firstName = function(firstName) {
    return firstName.length > 2;
  };

  var lastName = function(lastName) {
    return lastName.length > 1;
  };

  return {
    validEmail: email,
    validCountry: country,
    validLanguage: language,
    validFirstName: firstName,
    validLastName: lastName
  };
});
