export interface Cookie {
  /**
   * The domain the cookie is visible to. Defaults to the current browsing
   * context's document's URL when adding a cookie.
   */
  domain?: string;

  /**
   * When the cookie expires. Always returned in seconds since epoch.
   */

  expiry?: number|Date;

  /**
   * Whether the cookie is an HTTP only cookie. Defaults to false when adding a
   * new cookie.
   */
  httpOnly?: boolean;

  /**
   * The name of the cookie.
   */
  name: string;

  /**
   * The cookie path. Defaults to "/" when adding a cookie.
   */
  path?: string;

  /**
   * Whether the cookie is a secure cookie. Defaults to false when adding a new
   * cookie.
   */
  secure?: boolean;

  /**
   * The value of the cookie.
   */
  value: string;
}