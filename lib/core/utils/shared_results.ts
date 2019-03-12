import { Cookie } from './cookie';

export function sharedResultsInit(sharedResults: SharedResults): SharedResults {
  if (!sharedResults) {
    sharedResults = {};
  }
  return sharedResults;
}

/**
 * Shared results between tasks
 */
export interface SharedResults {
  [key: string]: any;

  afterActiveWebElementId?: string;
  afterCookies?: Cookie[];
  afterDocumentReadyState?: string;
  afterPageSource?: string;
  afterUrl?: string;
  afterUtcTimestamp?: number; 
  afterWindowHandle?: string;
  
  beforeActiveWebElementId?: string;
  beforeCookies?: Cookie[];
  beforeUrl?: string;
  beforeUtcTimestamp?: number;
  beforeWindowHandle?: string;

  retry?: number;
  duration?: number;
  url?: string;
}