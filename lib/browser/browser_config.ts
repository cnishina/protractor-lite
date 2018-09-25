export interface BrowserConfig {
  capabilities?: Capabilities;

  /* The output directory where webdriver-manager saves the binaries. */
  outDir?: string;

  /* direct connect: connect directly to a browser driver. */
  directConnect?: boolean;

  /* hosted: Selenium address example: http://127.0.0.1:4444/wd/hub */
  seleniumAddress?: string;

  /* local: The starting port range. */
  portRangeStart?: number;

  /* local: The end port range. */
  portRangeEnd?: number;
}

export interface Capabilities {
  [key: string]: any;

  /* The browser name. */
  browserName?: string;
}