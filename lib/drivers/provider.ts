import { WebDriver } from 'selenium-webdriver';

/**
 * Generic interface for driver providers.
 */
export interface Provider {

  /* Gets the webdriver object. */
  getDriver(): Promise<WebDriver>;

  /* Quits the driver. */
  quitDriver(): Promise<void>;
}