export interface SeleniumConfig {
  /**
   * The selenium address.
   * For a selenium standalone server, the default is:
   * http://127.0.0.1:4444/wd/hub. For a chromedriver instance, this
   * might be: http://127.0.0.1:9515.
   */
  seleniumAddress?: string;

  /**
   * The selenium session id.
   */
  seleniumSessionId?: string;
}

