import { Session, WebDriver } from 'selenium-webdriver';
import { Executor, HttpClient } from 'selenium-webdriver/http';
import { SeleniumConfig } from './selenium_config';

export function getDriver(seleniumConfig: SeleniumConfig): WebDriver {
  if (seleniumConfig) {
    const httpClient = new HttpClient(seleniumConfig.seleniumAddress);
    const executor = new Executor(httpClient);
    const session = new Session(seleniumConfig.seleniumSessionId, null);
    return new WebDriver(session, executor);
  } else {
    return null;
  }
}
