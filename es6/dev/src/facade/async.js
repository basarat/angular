import { global, noop } from 'angular2/src/facade/lang';
export { PromiseWrapper, Promise } from 'angular2/src/facade/promise';
import { Subject } from 'rxjs/Subject';
import { Observable as RxObservable } from 'rxjs/Observable';
import { PromiseObservable } from 'rxjs/observable/fromPromise';
import { toPromise } from 'rxjs/operator/toPromise';
export { Subject } from 'rxjs/Subject';
export class TimerWrapper {
    static setTimeout(fn, millis) {
        return global.setTimeout(fn, millis);
    }
    static clearTimeout(id) { global.clearTimeout(id); }
    static setInterval(fn, millis) {
        return global.setInterval(fn, millis);
    }
    static clearInterval(id) { global.clearInterval(id); }
}
export class ObservableWrapper {
    // TODO(vsavkin): when we use rxnext, try inferring the generic type from the first arg
    static subscribe(emitter, onNext, onError, onComplete = () => { }) {
        onError = (typeof onError === "function") && onError || noop;
        onComplete = (typeof onComplete === "function") && onComplete || noop;
        return emitter.subscribe({ next: onNext, error: onError, complete: onComplete });
    }
    static isObservable(obs) { return obs instanceof RxObservable; }
    /**
     * Returns whether `obs` has any subscribers listening to events.
     */
    static hasSubscribers(obs) { return obs.observers.length > 0; }
    static dispose(subscription) { subscription.unsubscribe(); }
    /**
     * @deprecated - use callEmit() instead
     */
    static callNext(emitter, value) { emitter.next(value); }
    static callEmit(emitter, value) { emitter.emit(value); }
    static callError(emitter, error) { emitter.error(error); }
    static callComplete(emitter) { emitter.complete(); }
    static fromPromise(promise) {
        return PromiseObservable.create(promise);
    }
    static toPromise(obj) { return toPromise.call(obj); }
}
/**
 * Use by directives and components to emit custom Events.
 *
 * ### Examples
 *
 * In the following example, `Zippy` alternatively emits `open` and `close` events when its
 * title gets clicked:
 *
 * ```
 * @Component({
 *   selector: 'zippy',
 *   template: `
 *   <div class="zippy">
 *     <div (click)="toggle()">Toggle</div>
 *     <div [hidden]="!visible">
 *       <ng-content></ng-content>
 *     </div>
 *  </div>`})
 * export class Zippy {
 *   visible: boolean = true;
 *   @Output() open: EventEmitter<any> = new EventEmitter();
 *   @Output() close: EventEmitter<any> = new EventEmitter();
 *
 *   toggle() {
 *     this.visible = !this.visible;
 *     if (this.visible) {
 *       this.open.emit(null);
 *     } else {
 *       this.close.emit(null);
 *     }
 *   }
 * }
 * ```
 *
 * Use Rx.Observable but provides an adapter to make it work as specified here:
 * https://github.com/jhusain/observable-spec
 *
 * Once a reference implementation of the spec is available, switch to it.
 */
export class EventEmitter extends Subject {
    /**
     * Creates an instance of [EventEmitter], which depending on [isAsync],
     * delivers events synchronously or asynchronously.
     */
    constructor(isAsync = true) {
        super();
        this._isAsync = isAsync;
    }
    emit(value) { super.next(value); }
    /**
     * @deprecated - use .emit(value) instead
     */
    next(value) { super.next(value); }
    subscribe(generatorOrNext, error, complete) {
        let schedulerFn;
        let errorFn = (err) => null;
        let completeFn = () => null;
        if (generatorOrNext && typeof generatorOrNext === 'object') {
            schedulerFn = this._isAsync ? (value) => { setTimeout(() => generatorOrNext.next(value)); } :
                    (value) => { generatorOrNext.next(value); };
            if (generatorOrNext.error) {
                errorFn = this._isAsync ? (err) => { setTimeout(() => generatorOrNext.error(err)); } :
                        (err) => { generatorOrNext.error(err); };
            }
            if (generatorOrNext.complete) {
                completeFn = this._isAsync ? () => { setTimeout(() => generatorOrNext.complete()); } :
                        () => { generatorOrNext.complete(); };
            }
        }
        else {
            schedulerFn = this._isAsync ? (value) => { setTimeout(() => generatorOrNext(value)); } :
                    (value) => { generatorOrNext(value); };
            if (error) {
                errorFn =
                    this._isAsync ? (err) => { setTimeout(() => error(err)); } : (err) => { error(err); };
            }
            if (complete) {
                completeFn =
                    this._isAsync ? () => { setTimeout(() => complete()); } : () => { complete(); };
            }
        }
        return super.subscribe(schedulerFn, errorFn, completeFn);
    }
}
// todo(robwormald): ts2dart should handle this properly
export class Observable extends RxObservable {
    lift(operator) {
        const observable = new Observable();
        observable.source = this;
        observable.operator = operator;
        return observable;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXN5bmMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhbmd1bGFyMi9zcmMvZmFjYWRlL2FzeW5jLnRzIl0sIm5hbWVzIjpbIlRpbWVyV3JhcHBlciIsIlRpbWVyV3JhcHBlci5zZXRUaW1lb3V0IiwiVGltZXJXcmFwcGVyLmNsZWFyVGltZW91dCIsIlRpbWVyV3JhcHBlci5zZXRJbnRlcnZhbCIsIlRpbWVyV3JhcHBlci5jbGVhckludGVydmFsIiwiT2JzZXJ2YWJsZVdyYXBwZXIiLCJPYnNlcnZhYmxlV3JhcHBlci5zdWJzY3JpYmUiLCJPYnNlcnZhYmxlV3JhcHBlci5pc09ic2VydmFibGUiLCJPYnNlcnZhYmxlV3JhcHBlci5oYXNTdWJzY3JpYmVycyIsIk9ic2VydmFibGVXcmFwcGVyLmRpc3Bvc2UiLCJPYnNlcnZhYmxlV3JhcHBlci5jYWxsTmV4dCIsIk9ic2VydmFibGVXcmFwcGVyLmNhbGxFbWl0IiwiT2JzZXJ2YWJsZVdyYXBwZXIuY2FsbEVycm9yIiwiT2JzZXJ2YWJsZVdyYXBwZXIuY2FsbENvbXBsZXRlIiwiT2JzZXJ2YWJsZVdyYXBwZXIuZnJvbVByb21pc2UiLCJPYnNlcnZhYmxlV3JhcHBlci50b1Byb21pc2UiLCJFdmVudEVtaXR0ZXIiLCJFdmVudEVtaXR0ZXIuY29uc3RydWN0b3IiLCJFdmVudEVtaXR0ZXIuZW1pdCIsIkV2ZW50RW1pdHRlci5uZXh0IiwiRXZlbnRFbWl0dGVyLnN1YnNjcmliZSIsIk9ic2VydmFibGUiLCJPYnNlcnZhYmxlLmxpZnQiXSwibWFwcGluZ3MiOiJPQUFPLEVBQUMsTUFBTSxFQUFhLElBQUksRUFBQyxNQUFNLDBCQUEwQjtBQUloRSxTQUFRLGNBQWMsRUFBRSxPQUFPLFFBQXlCLDZCQUE2QixDQUFDO09BRS9FLEVBQUMsT0FBTyxFQUFDLE1BQU0sY0FBYztPQUM3QixFQUFDLFVBQVUsSUFBSSxZQUFZLEVBQUMsTUFBTSxpQkFBaUI7T0FJbkQsRUFBQyxpQkFBaUIsRUFBQyxNQUFNLDZCQUE2QjtP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QU9BLFVBQVVBLENBQUNBLE1BQU1BLEtBQUtBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLEdBQUdBLE9BQU9BLEtBQUtBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQzVGQSxDQUFDQTtZQUVEQSxFQUFFQSxDQUFDQSxDQUFDQSxRQUFRQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDYkEsVUFBVUE7b0JBQ05BLElBQUlBLENBQUNBLFFBQVFBLEdBQUdBLFFBQVFBLFVBQVVBLENBQUNBLE1BQU1BLFFBQVFBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLFFBQVFBLFFBQVFBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQ3RGQSxDQUFDQTtRQUNIQSxDQUFDQTtRQUVEQSxNQUFNQSxDQUFDQSxLQUFLQSxDQUFDQSxTQUFTQSxDQUFDQSxXQUFXQSxFQUFFQSxPQUFPQSxFQUFFQSxVQUFVQSxDQUFDQSxDQUFDQTtJQUMzREEsQ0FBQ0E7QUFDSEosQ0FBQ0E7QUFFRCx3REFBd0Q7QUFDeEQsZ0NBQW1DLFlBQVk7SUFDN0NLLElBQUlBLENBQU9BLFFBQXdCQTtRQUNqQ0MsTUFBTUEsVUFBVUEsR0FBR0EsSUFBSUEsVUFBVUEsRUFBRUEsQ0FBQ0E7UUFDcENBLFVBQVVBLENBQUNBLE1BQU1BLEdBQUdBLElBQUlBLENBQUNBO1FBQ3pCQSxVQUFVQSxDQUFDQSxRQUFRQSxHQUFHQSxRQUFRQSxDQUFDQTtRQUMvQkEsTUFBTUEsQ0FBQ0EsVUFBVUEsQ0FBQ0E7SUFDcEJBLENBQUNBO0FBQ0hELENBQUNBO0FBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2dsb2JhbCwgaXNQcmVzZW50LCBub29wfSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2xhbmcnO1xuLy8gV2UgbWFrZSBzdXJlIHByb21pc2VzIGFyZSBpbiBhIHNlcGFyYXRlIGZpbGUgc28gdGhhdCB3ZSBjYW4gdXNlIHByb21pc2VzXG4vLyB3aXRob3V0IGRlcGVuZGluZyBvbiByeGpzLlxuaW1wb3J0IHtQcm9taXNlfSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL3Byb21pc2UnO1xuZXhwb3J0IHtQcm9taXNlV3JhcHBlciwgUHJvbWlzZSwgUHJvbWlzZUNvbXBsZXRlcn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9wcm9taXNlJztcblxuaW1wb3J0IHtTdWJqZWN0fSBmcm9tICdyeGpzL1N1YmplY3QnO1xuaW1wb3J0IHtPYnNlcnZhYmxlIGFzIFJ4T2JzZXJ2YWJsZX0gZnJvbSAncnhqcy9PYnNlcnZhYmxlJztcbmltcG9ydCB7U3Vic2NyaXB0aW9ufSBmcm9tICdyeGpzL1N1YnNjcmlwdGlvbic7XG5pbXBvcnQge09wZXJhdG9yfSBmcm9tICdyeGpzL09wZXJhdG9yJztcblxuaW1wb3J0IHtQcm9taXNlT2JzZXJ2YWJsZX0gZnJvbSAncnhqcy9vYnNlcnZhYmxlL2Zyb21Qcm9taXNlJztcbmltcG9ydCB7dG9Qcm9taXNlfSBmcm9tICdyeGpzL29wZXJhdG9yL3RvUHJvbWlzZSc7XG5cbmV4cG9ydCB7U3ViamVjdH0gZnJvbSAncnhqcy9TdWJqZWN0JztcblxuZXhwb3J0IG5hbWVzcGFjZSBOb2RlSlMge1xuICBleHBvcnQgaW50ZXJmYWNlIFRpbWVyIHt9XG59XG5cbmV4cG9ydCBjbGFzcyBUaW1lcldyYXBwZXIge1xuICBzdGF0aWMgc2V0VGltZW91dChmbjogKC4uLmFyZ3M6IGFueVtdKSA9PiB2b2lkLCBtaWxsaXM6IG51bWJlcik6IE5vZGVKUy5UaW1lciB7XG4gICAgcmV0dXJuIGdsb2JhbC5zZXRUaW1lb3V0KGZuLCBtaWxsaXMpO1xuICB9XG4gIHN0YXRpYyBjbGVhclRpbWVvdXQoaWQ6IE5vZGVKUy5UaW1lcik6IHZvaWQgeyBnbG9iYWwuY2xlYXJUaW1lb3V0KGlkKTsgfVxuXG4gIHN0YXRpYyBzZXRJbnRlcnZhbChmbjogKC4uLmFyZ3M6IGFueVtdKSA9PiB2b2lkLCBtaWxsaXM6IG51bWJlcik6IE5vZGVKUy5UaW1lciB7XG4gICAgcmV0dXJuIGdsb2JhbC5zZXRJbnRlcnZhbChmbiwgbWlsbGlzKTtcbiAgfVxuICBzdGF0aWMgY2xlYXJJbnRlcnZhbChpZDogTm9kZUpTLlRpbWVyKTogdm9pZCB7IGdsb2JhbC5jbGVhckludGVydmFsKGlkKTsgfVxufVxuXG5leHBvcnQgY2xhc3MgT2JzZXJ2YWJsZVdyYXBwZXIge1xuICAvLyBUT0RPKHZzYXZraW4pOiB3aGVuIHdlIHVzZSByeG5leHQsIHRyeSBpbmZlcnJpbmcgdGhlIGdlbmVyaWMgdHlwZSBmcm9tIHRoZSBmaXJzdCBhcmdcbiAgc3RhdGljIHN1YnNjcmliZTxUPihlbWl0dGVyOiBhbnksIG9uTmV4dDogKHZhbHVlOiBUKSA9PiB2b2lkLCBvbkVycm9yPzogKGV4Y2VwdGlvbjogYW55KSA9PiB2b2lkLFxuICAgICAgICAgICAgICAgICAgICAgIG9uQ29tcGxldGU6ICgpID0+IHZvaWQgPSAoKSA9PiB7fSk6IE9iamVjdCB7XG4gICAgb25FcnJvciA9ICh0eXBlb2Ygb25FcnJvciA9PT0gXCJmdW5jdGlvblwiKSAmJiBvbkVycm9yIHx8IG5vb3A7XG4gICAgb25Db21wbGV0ZSA9ICh0eXBlb2Ygb25Db21wbGV0ZSA9PT0gXCJmdW5jdGlvblwiKSAmJiBvbkNvbXBsZXRlIHx8IG5vb3A7XG4gICAgcmV0dXJuIGVtaXR0ZXIuc3Vic2NyaWJlKHtuZXh0OiBvbk5leHQsIGVycm9yOiBvbkVycm9yLCBjb21wbGV0ZTogb25Db21wbGV0ZX0pO1xuICB9XG5cbiAgc3RhdGljIGlzT2JzZXJ2YWJsZShvYnM6IGFueSk6IGJvb2xlYW4geyByZXR1cm4gb2JzIGluc3RhbmNlb2YgUnhPYnNlcnZhYmxlOyB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgd2hldGhlciBgb2JzYCBoYXMgYW55IHN1YnNjcmliZXJzIGxpc3RlbmluZyB0byBldmVudHMuXG4gICAqL1xuICBzdGF0aWMgaGFzU3Vic2NyaWJlcnMob2JzOiBFdmVudEVtaXR0ZXI8YW55Pik6IGJvb2xlYW4geyByZXR1cm4gb2JzLm9ic2VydmVycy5sZW5ndGggPiAwOyB9XG5cbiAgc3RhdGljIGRpc3Bvc2Uoc3Vic2NyaXB0aW9uOiBhbnkpIHsgc3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7IH1cblxuICAvKipcbiAgICogQGRlcHJlY2F0ZWQgLSB1c2UgY2FsbEVtaXQoKSBpbnN0ZWFkXG4gICAqL1xuICBzdGF0aWMgY2FsbE5leHQoZW1pdHRlcjogRXZlbnRFbWl0dGVyPGFueT4sIHZhbHVlOiBhbnkpIHsgZW1pdHRlci5uZXh0KHZhbHVlKTsgfVxuXG4gIHN0YXRpYyBjYWxsRW1pdChlbWl0dGVyOiBFdmVudEVtaXR0ZXI8YW55PiwgdmFsdWU6IGFueSkgeyBlbWl0dGVyLmVtaXQodmFsdWUpOyB9XG5cbiAgc3RhdGljIGNhbGxFcnJvcihlbWl0dGVyOiBFdmVudEVtaXR0ZXI8YW55PiwgZXJyb3I6IGFueSkgeyBlbWl0dGVyLmVycm9yKGVycm9yKTsgfVxuXG4gIHN0YXRpYyBjYWxsQ29tcGxldGUoZW1pdHRlcjogRXZlbnRFbWl0dGVyPGFueT4pIHsgZW1pdHRlci5jb21wbGV0ZSgpOyB9XG5cbiAgc3RhdGljIGZyb21Qcm9taXNlKHByb21pc2U6IFByb21pc2U8YW55Pik6IE9ic2VydmFibGU8YW55PiB7XG4gICAgcmV0dXJuIFByb21pc2VPYnNlcnZhYmxlLmNyZWF0ZShwcm9taXNlKTtcbiAgfVxuXG4gIHN0YXRpYyB0b1Byb21pc2Uob2JqOiBPYnNlcnZhYmxlPGFueT4pOiBQcm9taXNlPGFueT4geyByZXR1cm4gdG9Qcm9taXNlLmNhbGwob2JqKTsgfVxufVxuXG4vKipcbiAqIFVzZSBieSBkaXJlY3RpdmVzIGFuZCBjb21wb25lbnRzIHRvIGVtaXQgY3VzdG9tIEV2ZW50cy5cbiAqXG4gKiAjIyMgRXhhbXBsZXNcbiAqXG4gKiBJbiB0aGUgZm9sbG93aW5nIGV4YW1wbGUsIGBaaXBweWAgYWx0ZXJuYXRpdmVseSBlbWl0cyBgb3BlbmAgYW5kIGBjbG9zZWAgZXZlbnRzIHdoZW4gaXRzXG4gKiB0aXRsZSBnZXRzIGNsaWNrZWQ6XG4gKlxuICogYGBgXG4gKiBAQ29tcG9uZW50KHtcbiAqICAgc2VsZWN0b3I6ICd6aXBweScsXG4gKiAgIHRlbXBsYXRlOiBgXG4gKiAgIDxkaXYgY2xhc3M9XCJ6aXBweVwiPlxuICogICAgIDxkaXYgKGNsaWNrKT1cInRvZ2dsZSgpXCI+VG9nZ2xlPC9kaXY+XG4gKiAgICAgPGRpdiBbaGlkZGVuXT1cIiF2aXNpYmxlXCI+XG4gKiAgICAgICA8bmctY29udGVudD48L25nLWNvbnRlbnQ+XG4gKiAgICAgPC9kaXY+XG4gKiAgPC9kaXY+YH0pXG4gKiBleHBvcnQgY2xhc3MgWmlwcHkge1xuICogICB2aXNpYmxlOiBib29sZWFuID0gdHJ1ZTtcbiAqICAgQE91dHB1dCgpIG9wZW46IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICogICBAT3V0cHV0KCkgY2xvc2U6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICpcbiAqICAgdG9nZ2xlKCkge1xuICogICAgIHRoaXMudmlzaWJsZSA9ICF0aGlzLnZpc2libGU7XG4gKiAgICAgaWYgKHRoaXMudmlzaWJsZSkge1xuICogICAgICAgdGhpcy5vcGVuLmVtaXQobnVsbCk7XG4gKiAgICAgfSBlbHNlIHtcbiAqICAgICAgIHRoaXMuY2xvc2UuZW1pdChudWxsKTtcbiAqICAgICB9XG4gKiAgIH1cbiAqIH1cbiAqIGBgYFxuICpcbiAqIFVzZSBSeC5PYnNlcnZhYmxlIGJ1dCBwcm92aWRlcyBhbiBhZGFwdGVyIHRvIG1ha2UgaXQgd29yayBhcyBzcGVjaWZpZWQgaGVyZTpcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9qaHVzYWluL29ic2VydmFibGUtc3BlY1xuICpcbiAqIE9uY2UgYSByZWZlcmVuY2UgaW1wbGVtZW50YXRpb24gb2YgdGhlIHNwZWMgaXMgYXZhaWxhYmxlLCBzd2l0Y2ggdG8gaXQuXG4gKi9cbmV4cG9ydCBjbGFzcyBFdmVudEVtaXR0ZXI8VD4gZXh0ZW5kcyBTdWJqZWN0PFQ+IHtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfaXNBc3luYzogYm9vbGVhbjtcblxuICAvKipcbiAgICogQ3JlYXRlcyBhbiBpbnN0YW5jZSBvZiBbRXZlbnRFbWl0dGVyXSwgd2hpY2ggZGVwZW5kaW5nIG9uIFtpc0FzeW5jXSxcbiAgICogZGVsaXZlcnMgZXZlbnRzIHN5bmNocm9ub3VzbHkgb3IgYXN5bmNocm9ub3VzbHkuXG4gICAqL1xuICBjb25zdHJ1Y3Rvcihpc0FzeW5jOiBib29sZWFuID0gdHJ1ZSkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5faXNBc3luYyA9IGlzQXN5bmM7XG4gIH1cblxuICBlbWl0KHZhbHVlOiBUKSB7IHN1cGVyLm5leHQodmFsdWUpOyB9XG5cbiAgLyoqXG4gICAqIEBkZXByZWNhdGVkIC0gdXNlIC5lbWl0KHZhbHVlKSBpbnN0ZWFkXG4gICAqL1xuICBuZXh0KHZhbHVlOiBhbnkpIHsgc3VwZXIubmV4dCh2YWx1ZSk7IH1cblxuICBzdWJzY3JpYmUoZ2VuZXJhdG9yT3JOZXh0PzogYW55LCBlcnJvcj86IGFueSwgY29tcGxldGU/OiBhbnkpOiBhbnkge1xuICAgIGxldCBzY2hlZHVsZXJGbjtcbiAgICBsZXQgZXJyb3JGbiA9IChlcnI6IGFueSkgPT4gbnVsbDtcbiAgICBsZXQgY29tcGxldGVGbiA9ICgpID0+IG51bGw7XG5cbiAgICBpZiAoZ2VuZXJhdG9yT3JOZXh0ICYmIHR5cGVvZiBnZW5lcmF0b3JPck5leHQgPT09ICdvYmplY3QnKSB7XG4gICAgICBzY2hlZHVsZXJGbiA9IHRoaXMuX2lzQXN5bmMgPyAodmFsdWUpID0+IHsgc2V0VGltZW91dCgoKSA9PiBnZW5lcmF0b3JPck5leHQubmV4dCh2YWx1ZSkpOyB9IDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICh2YWx1ZSkgPT4geyBnZW5lcmF0b3JPck5leHQubmV4dCh2YWx1ZSk7IH07XG5cbiAgICAgIGlmIChnZW5lcmF0b3JPck5leHQuZXJyb3IpIHtcbiAgICAgICAgZXJyb3JGbiA9IHRoaXMuX2lzQXN5bmMgPyAoZXJyKSA9PiB7IHNldFRpbWVvdXQoKCkgPT4gZ2VuZXJhdG9yT3JOZXh0LmVycm9yKGVycikpOyB9IDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZXJyKSA9PiB7IGdlbmVyYXRvck9yTmV4dC5lcnJvcihlcnIpOyB9O1xuICAgICAgfVxuXG4gICAgICBpZiAoZ2VuZXJhdG9yT3JOZXh0LmNvbXBsZXRlKSB7XG4gICAgICAgIGNvbXBsZXRlRm4gPSB0aGlzLl9pc0FzeW5jID8gKCkgPT4geyBzZXRUaW1lb3V0KCgpID0+IGdlbmVyYXRvck9yTmV4dC5jb21wbGV0ZSgpKTsgfSA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKCkgPT4geyBnZW5lcmF0b3JPck5leHQuY29tcGxldGUoKTsgfTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgc2NoZWR1bGVyRm4gPSB0aGlzLl9pc0FzeW5jID8gKHZhbHVlKSA9PiB7IHNldFRpbWVvdXQoKCkgPT4gZ2VuZXJhdG9yT3JOZXh0KHZhbHVlKSk7IH0gOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHZhbHVlKSA9PiB7IGdlbmVyYXRvck9yTmV4dCh2YWx1ZSk7IH07XG5cbiAgICAgIGlmIChlcnJvcikge1xuICAgICAgICBlcnJvckZuID1cbiAgICAgICAgICAgIHRoaXMuX2lzQXN5bmMgPyAoZXJyKSA9PiB7IHNldFRpbWVvdXQoKCkgPT4gZXJyb3IoZXJyKSk7IH0gOiAoZXJyKSA9PiB7IGVycm9yKGVycik7IH07XG4gICAgICB9XG5cbiAgICAgIGlmIChjb21wbGV0ZSkge1xuICAgICAgICBjb21wbGV0ZUZuID1cbiAgICAgICAgICAgIHRoaXMuX2lzQXN5bmMgPyAoKSA9PiB7IHNldFRpbWVvdXQoKCkgPT4gY29tcGxldGUoKSk7IH0gOiAoKSA9PiB7IGNvbXBsZXRlKCk7IH07XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHN1cGVyLnN1YnNjcmliZShzY2hlZHVsZXJGbiwgZXJyb3JGbiwgY29tcGxldGVGbik7XG4gIH1cbn1cblxuLy8gdG9kbyhyb2J3b3JtYWxkKTogdHMyZGFydCBzaG91bGQgaGFuZGxlIHRoaXMgcHJvcGVybHlcbmV4cG9ydCBjbGFzcyBPYnNlcnZhYmxlPFQ+IGV4dGVuZHMgUnhPYnNlcnZhYmxlPFQ+IHtcbiAgbGlmdDxULCBSPihvcGVyYXRvcjogT3BlcmF0b3I8VCwgUj4pOiBPYnNlcnZhYmxlPFQ+IHtcbiAgICBjb25zdCBvYnNlcnZhYmxlID0gbmV3IE9ic2VydmFibGUoKTtcbiAgICBvYnNlcnZhYmxlLnNvdXJjZSA9IHRoaXM7XG4gICAgb2JzZXJ2YWJsZS5vcGVyYXRvciA9IG9wZXJhdG9yO1xuICAgIHJldHVybiBvYnNlcnZhYmxlO1xuICB9XG59XG4iXX0=