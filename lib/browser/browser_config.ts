export interface BrowserConfig {
  capabilities?: Capabilities,
  directConnect?: boolean,
}

export interface Capabilities {
  [key: string]: any;
  browserName?: string;
}