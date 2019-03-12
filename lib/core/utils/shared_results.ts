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

  afterCookies?: Cookie[];
  afterDocumentReadyState?: string;
  afterPageSource?: string;
  afterUrl?: string;
  afterUtcTimestamp?: number; 

  beforeCookies?: Cookie[];
  beforeUrl?: string;
  beforeUtcTimestamp?: number;

  retry?: number;
  duration?: number;
  url?: string;
}