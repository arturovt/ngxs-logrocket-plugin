import { inject, Injectable, Injector, NgZone } from '@angular/core';
import {
  ActionStatus,
  getActionTypeFromInstance,
  Store,
  type NgxsNextPluginFn,
  type NgxsPlugin,
} from '@ngxs/store';
import { tap } from 'rxjs';

import { ɵNGXS_LOGROCKET_REDUX_MIDDLEWARE_OPTIONS } from './symbols';

@Injectable()
export class ɵNgxsLogRocketReduxMiddlewarePlugin implements NgxsPlugin {
  private readonly _ngZone = inject(NgZone);
  private readonly _injector = inject(Injector);
  private readonly _options = inject(ɵNGXS_LOGROCKET_REDUX_MIDDLEWARE_OPTIONS);

  private _store!: Store;
  private _logRocketStore!: (newState: any) => (newAction: any) => void;

  handle(state: any, action: any, next: NgxsNextPluginFn) {
    // The `next(...)` observable will do following things:
    // * will emit `next` and then complete when the action is completed
    // * will emit `error` (not `next` or `complete`) when one of the @Action handlers errors
    // * will emit only `complete` (and not `next`) when the action is cancelled by another action of the same type
    const result = next(state, action);

    // Synchronous actions have been handled after the `next()` has been called.
    this._logReduxEvent(null, action, ActionStatus.Dispatched);

    let hasBeenCancelled = true;

    return result.pipe(
      tap({
        next: (newState) => {
          hasBeenCancelled = false;
          this._logReduxEvent(newState, action, ActionStatus.Successful);
        },
        error: () => {
          this._logReduxEvent(null, action, ActionStatus.Errored);
        },
        complete: () => {
          if (hasBeenCancelled) {
            this._logReduxEvent(null, action, ActionStatus.Canceled);
          }
        },
      }),
    );
  }

  private _logReduxEvent(
    newState: any,
    action: any,
    status: ActionStatus,
  ): void {
    // Retrieve lazily to avoid any cyclic dependency injection errors.
    this._store ??= this._injector.get(Store);

    this._logRocketStore ??= this._ngZone.runOutsideAngular(() => {
      return this._options.logrocket().reduxMiddleware()({
        getState: () => this._store.snapshot(),
      });
    });

    newState = newState || this._store.snapshot();
    const newAction = {
      type: `${getActionTypeFromInstance(action)} (${status})`,
      payload: action.payload || { ...action },
    };
    // Run outside Angular zone to prevent unnecessary change detection cycles.
    // Logrocket internally queues events and may trigger async operations.
    this._ngZone.runOutsideAngular(() => {
      try {
        this._logRocketStore(() => newState)(newAction);
      } catch (error) {
        // Swallow errors from Logrocket to prevent breaking app flow.
        console.error(error);
      }
    });
  }
}
