import { ActionContext, ChainedAction, Slowness } from './actions';
import { SeleniumConfig } from '../utils/selenium_config';
import { getDriver } from '../utils/webdriver';

/**
 * Builds the objects for protractor that use the same selenium browser session.
 * @param seleniumConfig A configuration object with a capabilities property.
 */
export function build(seleniumConfig: SeleniumConfig) {
  const driver = getDriver(seleniumConfig);
  const defaultAction = ActionContext.default(driver);
  const baseAction = new ChainedAction(defaultAction);

  const find = baseAction.find.bind(baseAction);
  const see = baseAction.see.bind(baseAction);
  const click = baseAction.click.bind(baseAction);
  const longPress = baseAction.longPress.bind(baseAction);
  const tap = baseAction.tap.bind(baseAction);
  const not = baseAction.not;
  const slow = new ChainedAction(defaultAction.setSlow(Slowness.SLOW));
  const agonizinglySlow =
    new ChainedAction(defaultAction.setSlow(Slowness.AGONIZINGLY_SLOW));
  const under = baseAction.under.bind(baseAction);
  const leftOf = baseAction.leftOf.bind(baseAction);
  const rightOf = baseAction.rightOf.bind(baseAction);
  const below = baseAction.below.bind(baseAction);
  const inside = baseAction.inside.bind(baseAction);

  return {
    find,
    see,
    click,
    longPress,
    tap,
    not,
    slow,
    agonizinglySlow,
    under,
    leftOf,
    rightOf,
    below,
    inside
  }
}




