# browser

The browser API exposes the WebDriver instance via the `browser.driver`.
To start a browser instance, the `browserConfig` and `defaultWaitStrategy` is passed to the constructor.

The `browserConfig` has the information to start the WebDriver instance
with the session ID string. The `defaultWaitStrategy` sets the default
waiting script that will be passed to every request via the browser
instance to synchronize the browser session and the browser API.

```
  --------------------------------------
  |                                     |
  |  Browser                            |
  |                                     |
  |    ---------------------------      |
  |    |                          |     |
  |    |  WebDriver               |     |
  |    |  started via session id. |     |
  |    |                          |     |
  |    ---------------------------      |
  |                                     |
  --------------------------------------
```