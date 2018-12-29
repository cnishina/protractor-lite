## Integration tests

Integration testing will require using other components in the project. An example: "by" can be unit tested; however, to test it out with an integration test, you will need to involve other components.

testing "by":

- A browser session is required to load the website.
- use a `WebElement.findElment` method or Protractor `element` object to find the object in the DOM.