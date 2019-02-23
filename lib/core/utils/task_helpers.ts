import * as loglevel from 'loglevel';
import { WebDriver } from 'selenium-webdriver';
import { SharedResults } from './task_options';

const log = loglevel.getLogger('protractor');

const TIMEOUT = 5000;
const POLL_TIMEOUT = 500;

export async function afterCookies(sharedResults: SharedResults,
    driver: WebDriver): Promise<void> {
  sharedResults.afterCookies = await driver.manage().getCookies();
}

export async function afterDocumentReadyState(sharedResults: SharedResults,
    driver: WebDriver): Promise<void> {
  // TODO(cnishina): fix when driver.wait supports 4 params.
  await (driver as any).wait(async () => {
    sharedResults.afterDocumentReadyState = await driver.executeScript(
      'return document.readyState;') as string;
    const result = sharedResults.afterDocumentReadyState === 'complete';
    if (result) {
      log.debug('The document readyState is complete.');
    }
    return result;
  }, TIMEOUT, 'Ready state is not complete.', POLL_TIMEOUT);
}

export async function afterPageSource(sharedResults: SharedResults,
    driver: WebDriver): Promise<void> {
  let previousPageSource = null;
  let currentPageSource = await driver.getPageSource();

  // TODO(cnishina): fix when driver.wait supports 4 params.
  await (driver as any).wait(async () => {
    if (previousPageSource === currentPageSource) {
      log.debug('The page source matches.');
      sharedResults.afterPageSource = currentPageSource;
      return true;
    } else {
      previousPageSource = currentPageSource;
      currentPageSource = await driver.getPageSource();
      return false;
    }
  }, TIMEOUT, 'The page resource should match', POLL_TIMEOUT);
}

export async function afterUrl(sharedResults: SharedResults,
    driver: WebDriver): Promise<void> {
  sharedResults.afterUrl = await driver.getCurrentUrl();
}

export async function beforeCookies(sharedResults: SharedResults,
    driver: WebDriver): Promise<void> {
  sharedResults.beforeCookies = await driver.manage().getCookies();
}

export async function beforeUrl(sharedResults: SharedResults,
    driver: WebDriver): Promise<void> {
  sharedResults.beforeUrl = await driver.getCurrentUrl();
}