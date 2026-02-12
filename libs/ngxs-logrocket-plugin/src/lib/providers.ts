import { makeEnvironmentProviders } from '@angular/core';
import { withNgxsPlugin } from '@ngxs/store';

import {
  ɵNGXS_LOGROCKET_REDUX_MIDDLEWARE_OPTIONS,
  type NgxsLogRocketReduxMiddlewareOptions,
} from './symbols';
import { ɵNgxsLogRocketReduxMiddlewarePlugin } from './logrocket-redux-middleware.plugin';

export function withNgxsLogRocketReduxMiddlewarePlugin(
  options: NgxsLogRocketReduxMiddlewareOptions,
) {
  return makeEnvironmentProviders([
    {
      provide: ɵNGXS_LOGROCKET_REDUX_MIDDLEWARE_OPTIONS,
      useValue: options,
    },
    withNgxsPlugin(ɵNgxsLogRocketReduxMiddlewarePlugin),
  ]);
}
