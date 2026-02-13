import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import { provideStore } from '@ngxs/store';
import { withNgxsLogRocketReduxMiddlewarePlugin } from 'ngxs-logrocket-plugin';
import LogRocket from 'logrocket';

import { appRoutes } from './app.routes';
import { CounterState } from './counter.state';

declare const appId: string;

if (!ngServerMode) {
  LogRocket.init(appId);
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(withEventReplay()),
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes),
    provideStore(
      [CounterState],
      withNgxsLogRocketReduxMiddlewarePlugin({
        logrocket: () => LogRocket,
      }),
    ),
  ],
};
