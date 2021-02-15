import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { delay, filter, map, share, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PollingService {

  private idsForPolling = [];
  private readonly _restartPolling$: Subject<void> = new Subject();
  public readonly restartPolling$ = this._restartPolling$.asObservable().pipe(
    delay(1000),
    filter(() => this.idsForPolling.length > 0), // if no ids in polling array
    filter(() => this._restartPolling$.observers.length > 0), // if no one listening
    switchMap(() => this.pollingRequest()),
    map((optimizationResponse: any) => {
      const currentIdsForOptimizationPolling = [...this.idsForPolling];
      console.log(currentIdsForOptimizationPolling);
      const done = [];
      const idsToRemove = [];
      for (const responseItem of optimizationResponse) {
        if (currentIdsForOptimizationPolling.includes(responseItem.id)) {
          if (responseItem.status === 'done') {
            done.push(responseItem);
            idsToRemove.push(responseItem.id);
            console.log('removing', responseItem.id, 'from polling');
          }
        }
      }
      const newForPollingArray = this.idsForPolling.filter(id => !idsToRemove.includes(id));
      this.idsForPolling = [...newForPollingArray];
      this._restartPolling$.next();
      return done;
    }),
    share(),
  );

  constructor(private http: HttpClient) {
  }

  pollingRequest(): Observable<any> {
    const fileNumber = Math.floor(Math.random() * 10);
    return this.http.get('/assets/mock/' + fileNumber + '.json'); // { ids: this.idsForPolling}
  }

  addIdToPolling(ids: number[]): void {
    console.log('adding', ids, 'to polling');
    const idsForPollingArray = [...this.idsForPolling];
    const needRestart = (!idsForPollingArray.length);
    const uniqueNewArray = Array.from(new Set([...idsForPollingArray, ...ids]));
    this.idsForPolling = [...uniqueNewArray];
    if (needRestart) {
      this._restartPolling$.next();
    }
  }

  removeIdFromPolling(id: number): void {
    if (this.idsForPolling.includes(id)) {
      const idsForPollingArray = this.idsForPolling.filter(i => i !== id);
      console.log('removing', id, 'from polling');
      this.idsForPolling = [...idsForPollingArray];
      this._restartPolling$.next();
    }
  }
}
