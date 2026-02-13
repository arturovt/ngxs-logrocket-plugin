import { InjectionToken } from '@angular/core';
import type LogRocket from 'logrocket';

/**
 * Extract options from LogRocket's `reduxMiddleware` function.
 * Since LogRocket doesn't export these types, we extract them from the function signature.
 */
export type ReduxMiddlewareOptions = NonNullable<
  Parameters<(typeof LogRocket)['reduxMiddleware']>[0]
>;

export interface NgxsLogRocketReduxMiddlewareOptions
  extends ReduxMiddlewareOptions {
  /**
   * Factory function that returns the LogRocket object.
   *
   * Runs in injection context, allowing use of Angular's `inject()` function.
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
   *
   * @example
   * // Option 3: Use Angular injection
   * import { inject, DOCUMENT } from '@angular/core';
   *
   * logrocket: () => {
   *   const document = inject(DOCUMENT);
   *   return document.defaultView?.LogRocket;
   * }
   */
  logrocket: () => typeof LogRocket;
}

export const ɵNGXS_LOGROCKET_REDUX_MIDDLEWARE_OPTIONS =
  new InjectionToken<NgxsLogRocketReduxMiddlewareOptions>(
    typeof ngDevMode !== 'undefined' && ngDevMode
      ? 'NGXS_LOGROCKET_MIDDLEWARE_OPTIONS'
      : '',
  );
