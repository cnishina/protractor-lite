import { Session, WebDriver, WebElement } from 'selenium-webdriver';
import { Executor, HttpClient } from 'selenium-webdriver/http';
import { SeleniumConfig } from './selenium_config';

export function getDriver(seleniumConfig: SeleniumConfig): WebDriver {
  const httpClient = new HttpClient(seleniumConfig.seleniumAddress);
  const executor = new Executor(httpClient);
  const session = new Session(seleniumConfig.seleniumSessionId, null);
  return new WebDriver(session, executor);
}
