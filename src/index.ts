import { NgZone, NgModule, ModuleWithProviders } from '@angular/core';
import { RouterModule, PreloadingStrategy, Route } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

 /*
  * Private please use @angularclass/request-idle-callback if you want to use this
  */
function requestIdle(zone: NgZone, fn: () => any) {
  let win: any = window;
  if (win.requestIdleCallback) {
    return win.requestIdleCallback(fn);
  }
  return zone.runOutsideAngular(() => win.setTimeout(fn, 10));
}

export class IdlePreload implements PreloadingStrategy {
 /*
  * include zone to run outside of zone.js
  */
  constructor(private _ngZone: NgZone) {}

 /*
  * fire off preloading async modules
  */
  preload(route: Route, fn: () => Observable<any>): Observable<any> {
    requestIdle(this._ngZone, fn);
    return Observable.of(null);
  }

}

 /*
  * raw providers
  */
export const ANGULARCLASS_IDLE_PRELOAD_PROVIDERS: any[] = [
  { provider: IdlePreload, useClass: IdlePreload }
];

@NgModule({
  // because Angular
})
export class IdlePreloadModule {
 /*
  * forRoot() to allow providers only be created once
  */
  static forRoot(): ModuleWithProviders {
    return { ngModule: IdlePreloadModule, providers: ANGULARCLASS_IDLE_PRELOAD_PROVIDERS }
  }

 /*
  * alias for reference to IdlePreload token
  */
  static IdleStrategy() {
    return IdlePreload;
  }

}
