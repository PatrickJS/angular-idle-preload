/*
 * @PatrickJS
 */

import {
  NgZone,
  NgModule,
  ModuleWithProviders,
  Inject,
  InjectionToken,
  Injectable
} from '@angular/core';
import {of} from "rxjs";

 /*
  * token to requestIdleCallback
  */
export const REQUEST_IDLE_CALLBACK = new InjectionToken<string>('REQUEST_IDLE_CALLBACK');

 /*
  * Private API.
  * please use @angularclass/request-idle-callback if you want
  * to use `__requestIdle` this without providers
  */
export function __requestIdle(zone: NgZone) {
  if (typeof window === 'undefined') {
    return (fn) => setTimeout(fn);
  }
  let win: any = window;
  if (win.requestIdleCallback) {
    return (fn) => win.requestIdleCallback(fn);
  }
  return (fn) => zone.runOutsideAngular(() => win.setTimeout(fn, 10));
}

@Injectable()
export class IdlePreload /*implements PreloadingStrategy*/ {
 /*
  * include zone to run outside of zone.js
  */
  constructor(private _ngZone: NgZone, @Inject(REQUEST_IDLE_CALLBACK) private requestIdleCallback: any) {}
  loadingRoute = new Set<Route>();
  loading = true;
  
  /*To avoid reloading the route*/
  if (this.loadingRoute.has(route)) {
    this.loading = false;
  }
  /*Checking for slow internet connection*/
  const conn = typeof navigator !== 'undefined' ? (navigator as any).connection : undefined;
  if (conn) {
      if ((conn.effectiveType || '').includes('2g') || conn.saveData) { this.loading = false};
  }

 /*
  * fire off preloading async modules - loading only required modules
  */
  preload(route: /*Route*/ any, fn: any /* () => Observable<any>*/ ): any/* Observable<any> */ {
    if(this.loading) {
     if(route.data && !route.data.preload) {
        return null;
      } else {
        this.requestIdleCallback(fn);
        return of(null);
      }
    }
 }

/*
 * raw providers
 */
export const IDLE_PRELOAD_PROVIDERS: any[] = [
  { provide: IdlePreload, useClass: IdlePreload, deps: [ NgZone, REQUEST_IDLE_CALLBACK ] }
];

export const REQUEST_IDLE_CALLBACK_PROVIDERS: any[] = [
  { provide: REQUEST_IDLE_CALLBACK, useFactory: __requestIdle, deps: [ NgZone ] }
];

export interface IdlePreloadConfig {
  requestIdleCallback?: boolean;
}

@NgModule({
  // because Angular
})
export class IdlePreloadModule {
 /*
  * forRoot() to allow providers only be created once
  */
  static forRoot(config: IdlePreloadConfig = {}): ModuleWithProviders {
    return {
      ngModule: IdlePreloadModule,
      providers: [
        ...(config.requestIdleCallback === false ? [] : REQUEST_IDLE_CALLBACK_PROVIDERS),
        ...IDLE_PRELOAD_PROVIDERS
      ]
    };
  }

 /*
  * alias for reference to IdlePreload token
  */
  static IdleStrategy() {
    return IdlePreload;
  }

}
