export interface BrowserConfig {
  capabilities?: Capabilities,
  directConnect?: boolean,
  outDir?: string,
  seleniumAddress?: string,
}

export interface Capabilities {
  [key: string]: any;
  browserName?: string;
}