var functions = {};

/**
 * Find buttons by textual content.
 * @param {string} searchText The exact text to match.
 * @param {Element} using The scope of the search.
 * @return {Array.<Element>} The matching elements.
 */
functions.findByButtonText = function(searchText, using) {
  using = using || document;

  var elements = using.querySelectorAll(
    'button, input[type="button"], input[type="submit"]');
  var matches = [];
  for (var i = 0; i < elements.length; ++i) {
    var element = elements[i];
    var elementText;
    if (element.tagName.toLowerCase() == 'button') {
      elementText = element.textContent || element.innerText || '';
    } else {
      elementText = element.value;
    }
    if (elementText.trim() === searchText) {
      matches.push(element);
    }
  }
  return matches;
}

let util = require('util');
var scriptFmt = (
  'try { return (%s).apply(this, arguments); }\n' +
  'catch(e) { throw (e instanceof Error) ? e : new Error(e); }');

exports.findByButtonText = util.format(scriptFmt, functions.findByButtonText);