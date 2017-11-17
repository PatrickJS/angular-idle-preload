<p align="center">
  <a href="https://tipe.io/" target="_blank">
    <img  alt="Tipe" src="https://user-images.githubusercontent.com/1016365/30999155-30430eb8-a488-11e7-850e-a7c38dad77c1.png" class="img-responsive">
  </a>
</p>

---

# Angular Idle Preload
> Angular Idle Preload for preloading async/lazy routes using `requestIdleCallback` (or fallback to setTimeout which is run outside of `zone.js` [Angular 5+)

### Why should I use angular-idle-preload?
Scheduling non-essential work yourself is very difficult to do. It’s impossible to figure out exactly how much frame time remains because after `requestAnimationFrame` callbacks execute there are style calculations, layout, paint, and other browser internals that need to run. A home-rolled solution can’t account for any of those. In order to be sure that a user isn’t interacting in some way you would also need to attach listeners to every kind of interaction event `(scroll, touch, click)`, even if you don’t need them for functionality, just so that you can be absolutely sure that the user isn’t interacting. The browser, on the other hand, knows exactly how much time is available at the end of the frame, and if the user is interacting, and so through `requestIdleCallback` we gain an API that allows us to make use of any spare time in the most efficient way possible.

![](https://developers.google.com/web/updates/images/2015-08-27-using-requestidlecallback/frame.jpg)

## links
* [Using requestIdleCallback](https://developers.google.com/web/updates/2015/08/using-requestidlecallback)
* [Cooperative Scheduling of Background Tasks](https://www.w3.org/TR/requestidlecallback/)

### Install
> `npm install angular-idle-preload --save`


```typescript
import { IdlePreload, IdlePreloadModule } from 'angular-idle-preload';

@NgModule({
  bootstrap: [ App ],
  imports: [
    IdlePreloadModule.forRoot(), // forRoot ensures the providers are only created once
    RouterModule.forRoot([], { useHash: false, preloadingStrategy: IdlePreload }),
  ]
})
export class Main {}
```


enjoy — **PatrtickJS**
