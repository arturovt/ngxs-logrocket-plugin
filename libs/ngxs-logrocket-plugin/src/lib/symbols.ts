import { InjectionToken } from '@angular/core';
import type LogRocket from 'logrocket';

export interface NgxsLogRocketReduxMiddlewareOptions {
  /**
   * Factory function that returns the LogRocket object.
   *
   * This allows flexibility in how LogRocket is loaded:
   *
   * @example
   * // Option 1: Import from npm package
   * import LogRocket from 'logrocket';
   *
   * logrocket: () => LogRocket
   *
   * @example
   * // Option 2: Load from window (script tag)
   * logrocket: () => window.LogRocket
   */
  logrocket: () => typeof LogRocket;
}

export const ɵNGXS_LOGROCKET_REDUX_MIDDLEWARE_OPTIONS =
  new InjectionToken<NgxsLogRocketReduxMiddlewareOptions>(
    typeof ngDevMode !== 'undefined' && ngDevMode
      ? 'NGXS_LOGROCKET_MIDDLEWARE_OPTIONS'
      : '',
  );
