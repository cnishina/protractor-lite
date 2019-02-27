export interface Capabilities {
  [key:string]: any;

  /**
   * Indicates whether a WebDriver session implicity trusts otherwise untrusted
   * and self-signed TLS certificates during navigation.
   */
  acceptInsecureCerts?: boolean;

  /**
   * The browser name.
   */
  browserName?: string;

  /**
   * Identifies the browser version.
   */
  browserVersion?: string;

  /**
   * Key for the logging driver logging preferences.
   */
  loggingPrefs?: any;

  /**
   * Defines the session's page loading strategy.
   */
  pageLoadStrategy?: any;

  /**
   * Identifies the operating system of the endpoint node.
   */
  platformName?: string;

  /**
   * Describes the proxy configuration to use for a new WebDriver session.
   */
  proxy?: string;

  /**
   * Indicates whether the remote end supports all of the window resizing and
   * positioning commands.
   */
  setWindowRect?: any;

  /**
   * Describes the timeouts imposed on certain session operations.
   */
  timeouts?: any;

  /**
   * Defines how a WebDriver session should respond to unhandled user prompts.
   */
  unhandledPromptBehavior?: any;
}