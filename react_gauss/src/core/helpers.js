import { getClassName } from '../helpers/components';


export function setupClassNames(rootElement, cssModule) {
  return {
    boxA: getClassName(`${rootElement}__boxA`, cssModule),
    container: getClassName(`${rootElement}__container`, cssModule),
    wrapper: getClassName(`${rootElement}__wrapper`, cssModule),
  };
}
