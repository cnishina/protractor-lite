import { Cookie } from './cookie';

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