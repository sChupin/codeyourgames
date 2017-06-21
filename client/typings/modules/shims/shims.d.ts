import * as _fabric from 'fabric';

// Hack to use fabric namespace as global
declare global {
  const fabric: typeof _fabric;
}
