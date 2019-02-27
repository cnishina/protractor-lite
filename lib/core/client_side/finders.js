var findBy = {};

/**
 * Find buttons by textual content.
 * @param {string} searchText The exact text to match.
 * @param {Element} using The scope of the search.
 * @return {Array.<Element>} The matching elements.
 */
findBy.buttonText = function(searchText, using) {
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

/**
 * Find elements by css selector and textual content.
 * @param {string} cssSelector The css selector to match.
 * @param {string} searchText The exact text to match or a serialized regex.
 * @param {Element} using The scope of the search.
 * @return {Array.<Element>} An array of matching elements.
 */
findBy.cssContainingText = function(cssSelector, searchText, using) {
  using = using || document;

  if (searchText.indexOf('__REGEXP__') === 0) {
    var match = searchText.split('__REGEXP__')[1].match(/\/(.*)\/(.*)?/);
    searchText = new RegExp(match[1], match[2] || '');
  }
  var elements = using.querySelectorAll(cssSelector);
  var matches = [];
  for (var i = 0; i < elements.length; ++i) {
    var element = elements[i];
    var elementText = element.textContent || element.innerText || '';
    var elementMatches = searchText instanceof RegExp ?
        searchText.test(elementText) :
        elementText.indexOf(searchText) > -1;

    if (elementMatches) {
      matches.push(element);
    }
  }
  return matches;
};

/**
 * Find buttons by textual content.
 * @param {string} searchText The exact text to match.
 * @param {Element} using The scope of the search.
 * @return {Array.<Element>} The matching elements.
 */
findBy.partialButtonText = function(searchText, using) {
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
    if (elementText.indexOf(searchText) > -1) {
      matches.push(element);
    }
  }

  return matches;
}

let util = require('util');
var scriptFmt = (
  'try { return (%s).apply(this, arguments); }\n' +
  'catch(e) { throw (e instanceof Error) ? e : new Error(e); }');

exports.buttonText = util.format(scriptFmt, findBy.buttonText);
exports.cssContainingText = util.format(scriptFmt, findBy.cssContainingText);
exports.partialButtonText = util.format(scriptFmt, findBy.partialButtonText);