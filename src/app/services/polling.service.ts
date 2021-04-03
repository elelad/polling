import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, delay, filter, map, share, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { EventStatus, PollingListenerModel, PollingResponse } from '../model';

@Injectable({
  providedIn: 'root',
})
export class PollingService {

  private readonly _idsForPolling: BehaviorSubject<(string | number)[]> = new BehaviorSubject<(string | number)[]>([]);
  public readonly idsForPolling$ = this._idsForPolling.asObservable();
  private readonly _startPolling$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public readonly pollingListener$: Observable<PollingListenerModel> = this._startPolling$.asObservable().pipe(
    delay(2000),
    filter(() => this._startPolling$.value), // value should be true to start the polling
    filter(() => this._idsForPolling.value.length > 0), // if no ids in polling array
    switchMap(() => this.postPollingRequest()),
    map((pollingResponse: PollingResponse[]) => {
      const currentIdsForPolling = [...this._idsForPolling.value];
      console.log('currentIdsForPolling:', currentIdsForPolling);
      const done: PollingResponse[] = [];
      for (const responseItem of pollingResponse) {
        const responseItemIsInPolling = currentIdsForPolling.includes(responseItem.id);
        const responseItemStatusIsDone = +responseItem.status === EventStatus.done;
        if (responseItemIsInPolling && responseItemStatusIsDone) {
          done.push(responseItem);
          this.removeIdFromPolling(responseItem.id);
        }
      }
      const needRestart = !!this._idsForPolling.value.length; // restart polling only if we still have ids in the polling array
      if (needRestart) {
        this._startPolling$.next(true);
      }
      return { done, inProgress: this._idsForPolling.value };
    }),
    share(), // share the observable between all subscribers
  );

  constructor(private http: HttpClient) {
  }

  postPollingRequest(): Observable<PollingResponse[]> {
    return this.http.post<PollingResponse[]>('https://nest-try.herokuapp.com/polling', { ids: this._idsForPolling.value })
      .pipe(
        catchError(() => {
          return of(this.mockPollingRequest(this._idsForPolling.value));
        }),
      );
  }

  addIdToPolling(ids: (string | number)[]): void {
    console.log('adding', ids, 'to polling');
    const idsForPollingArray = this._idsForPolling.value;
    const uniqueNewArray = Array.from(new Set([...idsForPollingArray, ...ids]));
    this._idsForPolling.next(uniqueNewArray);
    const needStart = (!idsForPollingArray.length); // start polling only if the polling array was empty
    if (needStart) {
      this._startPolling$.next(true);
    }
  }

  removeIdFromPolling(id: string | number): void {
    if (this._idsForPolling.value.includes(id)) {
      const idsForPollingArray = this._idsForPolling.value.filter(i => i !== id);
      console.log('removing', id, 'from polling');
      this._idsForPolling.next(idsForPollingArray);
    }
  }

  mockPollingRequest(ids: (string | number)[]): PollingResponse[] {
    const random = Math.floor(Math.random() * 10);
    const mock = [];
    for (const id of ids) {
      mock.push({
        id, status: +id === +random ? EventStatus.done : EventStatus.processing,
      });
    }
    return mock;
  }
}
