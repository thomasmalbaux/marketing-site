/**
  Load HotJar asynchronously AFTER jquery is loaded.
*/
define([
  'jquery' // jQuery dependency. This makes sure jQuery is loaded.
], function() {
  var b = document;
  var g = window.XMLHttpRequest;
  var c=b.createElement("script");

  // From Hotjar installation script
  c.async=1;c.src="//static.hotjar.com/insights.js";b.getElementsByTagName("head")[0].appendChild(c);
});
