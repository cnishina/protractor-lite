# driver providers

The driver provider defines a way that Protractor will connect to WebDriver.
Below are the list of driver providers:

- **direct connect**: Directly run with a browser driver binary. The supported
browsers include firefox and chrome. Direct connect relies on passing the
`directConnect` boolean via the browser config and will launch with the driver
provider based on the capabilities `browserName`. The binaries required be
downloaded via webdriver-manager.
- **hosted**: The selenium server standalone is already running. Passing the
`seleniumAddress` string via the browser config. The value usually is
'http://127.0.0.1:4444/wd/hub'. No binaries are required since the server is
already running.
- **local**: When launching locally, this will find a port on a range and
launch the selenium standalone server. It will start the server with binaries
downloaded by webdriver-manager. It must have a minimum of the selenium jar
and one of the browser binaries. This does not check to see if the capabilities
match up.
