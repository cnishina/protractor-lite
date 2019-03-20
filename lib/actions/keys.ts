import { Key } from 'selenium-webdriver';

/**
 * Common keys and key combinations.
 */

export const CLEAR = Key.CONTROL + Key.END +
    Key.SHIFT + Key.HOME +
    Key.NULL /* Release modifier keys. */ + Key.DELETE;
export const ENTER = Key.ENTER;
export const TAB = Key.TAB;