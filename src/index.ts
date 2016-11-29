import { NgZone, NgModule, ModuleWithProviders, Inject, OpaqueToken } from '@angular/core';
// import { PreloadingStrategy, Route } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

 /*
  * token to requestIdleCallback
  */
export const REQUEST_IDLE_CALLBACK = new OpaqueToken('REQUEST_IDLE_CALLBACK');

 /*
  * Private please use @angularclass/request-idle-callback if you want to use this
  */
export function _requestIdle(zone: NgZone) {
  let win: any = window;
  if (win.requestIdleCallback) {
    return win.requestIdleCallback;
  }
  return (fn) => zone.runOutsideAngular(() => win.setTimeout(fn, 10));
}

export class IdlePreload /*implements PreloadingStrategy*/ {
 /*
  * include zone to run outside of zone.js
  */
  constructor(private _ngZone: NgZone, @Inject(REQUEST_IDLE_CALLBACK) private requestIdleCallback: any) {}

 /*
  * fire off preloading async modules
  */
  preload(route: /*Route*/ any, fn: () => Observable<any>): Observable<any> {
    this.requestIdleCallback(fn);
    return Observable.of(null);
  }

}

 /*
  * raw providers
  */
export const ANGULARCLASS_IDLE_PRELOAD_PROVIDERS: any[] = [
  { provider: IdlePreload, useClass: IdlePreload }
];

export const ANGULARCLASS_REQUEST_IDLE_CALLBACK_PROVIDERS: any[] = [
  { provider: REQUEST_IDLE_CALLBACK, useFactory: _requestIdle, deps: [ NgZone ] }
];

@NgModule({
  // because Angular
})
export class IdlePreloadModule {
 /*
  * forRoot() to allow providers only be created once
  */
  static forRoot(config: any = {}): ModuleWithProviders {
    return {
      ngModule: IdlePreloadModule,
      providers: [
        ...(config.requestIdleCallback === false ? [] : ANGULARCLASS_REQUEST_IDLE_CALLBACK_PROVIDERS),
        ...ANGULARCLASS_IDLE_PRELOAD_PROVIDERS
      ]
    }
  }

 /*
  * alias for reference to IdlePreload token
  */
  static IdleStrategy() {
    return IdlePreload;
  }

}
