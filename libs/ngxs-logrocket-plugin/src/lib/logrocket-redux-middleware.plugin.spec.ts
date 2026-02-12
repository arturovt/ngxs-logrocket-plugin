import { describe, it } from 'vitest';
import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  Action,
  provideStore,
  State,
  Store,
  type StateContext,
} from '@ngxs/store';
import { firstValueFrom, throwError, timer, tap } from 'rxjs';
import type LogRocket from 'logrocket';

import { withNgxsLogRocketReduxMiddlewarePlugin } from './providers';

describe('NgxsLogRocketReduxMiddlewarePlugin', () => {
  function setup() {
    const recorder: any = [];

    type CountriesStateModel = string[];

    class LoadCountries {
      static type = '[Countries] Load countries';
    }

    class LoadCountriesWithError {
      static type = '[Countries] Load countries with error';
    }

    @State<CountriesStateModel>({
      name: 'countries',
      defaults: [],
    })
    @Injectable()
    class CountriesState {
      @Action(LoadCountries, { cancelUncompleted: true })
      loadCountries(ctx: StateContext<CountriesStateModel>) {
        return timer(0).pipe(
          tap(() => {
            ctx.setState(() => ['Mexico', 'Canada', 'USA']);
          }),
        );
      }

      @Action(LoadCountriesWithError)
      loadCountriesWithError() {
        return throwError(() => new Error('Load countries with error.'));
      }
    }

    TestBed.configureTestingModule({
      providers: [
        provideStore(
          [CountriesState],
          withNgxsLogRocketReduxMiddlewarePlugin({
            logrocket: () =>
              ({
                reduxMiddleware: () => {
                  return () => {
                    return (newState: any) => {
                      return (newAction: any) => {
                        recorder.push(newAction.type);
                      };
                    };
                  };
                },
              }) as unknown as typeof LogRocket,
          }),
        ),
      ],
    });

    const store = TestBed.inject(Store);

    function loadCountries() {
      return store.dispatch(new LoadCountries());
    }

    function loadCountriesWithError() {
      return store.dispatch(new LoadCountriesWithError());
    }

    return { store, recorder, loadCountries, loadCountriesWithError };
  }

  it('should log events to the `logrocket` through the NGXS plugin', async () => {
    // Arrange
    const { recorder, loadCountries, loadCountriesWithError } = setup();

    // Act
    await firstValueFrom(loadCountries());

    // Assert
    expect(recorder).toEqual([
      '@@INIT (DISPATCHED)',
      '@@INIT (SUCCESSFUL)',
      '[Countries] Load countries (DISPATCHED)',
      '[Countries] Load countries (SUCCESSFUL)',
    ]);

    // Explicitly cancel an action.
    loadCountries();
    await firstValueFrom(loadCountries());

    expect(recorder).toEqual([
      '@@INIT (DISPATCHED)',
      '@@INIT (SUCCESSFUL)',
      '[Countries] Load countries (DISPATCHED)',
      '[Countries] Load countries (SUCCESSFUL)',
      '[Countries] Load countries (DISPATCHED)',
      '[Countries] Load countries (CANCELED)',
      '[Countries] Load countries (DISPATCHED)',
      '[Countries] Load countries (SUCCESSFUL)',
    ]);

    loadCountriesWithError();

    expect(recorder).toEqual([
      '@@INIT (DISPATCHED)',
      '@@INIT (SUCCESSFUL)',
      '[Countries] Load countries (DISPATCHED)',
      '[Countries] Load countries (SUCCESSFUL)',
      '[Countries] Load countries (DISPATCHED)',
      '[Countries] Load countries (CANCELED)',
      '[Countries] Load countries (DISPATCHED)',
      '[Countries] Load countries (SUCCESSFUL)',
      '[Countries] Load countries with error (DISPATCHED)',
      '[Countries] Load countries with error (ERRORED)',
    ]);
  });
});
