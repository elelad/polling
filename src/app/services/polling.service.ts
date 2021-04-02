import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { delay, filter, map, share, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { EventStatus } from '../model';

@Injectable({
  providedIn: 'root',
})
export class PollingService {

  private readonly _idsForPolling: BehaviorSubject<(string | number)[]> = new BehaviorSubject<(string | number)[]>([]);
  public readonly idsForPolling$ = this._idsForPolling.asObservable();

  public readonly restartPolling$ = this.idsForPolling$.pipe(
    delay(1000),
    filter(() => this._idsForPolling.value.length > 0), // if no ids in polling array
    switchMap(() => this.pollingRequest()),
    map((optimizationResponse: any) => {
      const currentIdsForOptimizationPolling = [...this._idsForPolling.value];
      console.log(currentIdsForOptimizationPolling);
      const done = [];
      const idsToRemove = [];
      for (const responseItem of optimizationResponse) {
        if (currentIdsForOptimizationPolling.includes(responseItem.id)) {
          if (+responseItem.status === EventStatus.done) {
            done.push(responseItem);
            idsToRemove.push(responseItem.id);
            console.log('removing', responseItem.id, 'from polling');
          }
        }
      }
      const newForPollingArray = this._idsForPolling.value.filter(id => !idsToRemove.includes(id));
      this._idsForPolling.next(newForPollingArray);
      return { done, inProgress: newForPollingArray };
    }),
    share(),
  );

  constructor(private http: HttpClient) {
  }

  pollingRequest(): Observable<any> {
    const fileNumber = Math.floor(Math.random() * 10);
    return this.http.get('/assets/mock/' + fileNumber + '.json');
  }

  addIdToPolling(ids: number[]): void {
    console.log('adding', ids, 'to polling');
    const idsForPollingArray = [...this._idsForPolling.value];
    const uniqueNewArray = Array.from(new Set([...idsForPollingArray, ...ids]));
    this._idsForPolling.next(uniqueNewArray);
  }

  removeIdFromPolling(id: number): void {
    if (this._idsForPolling.value.includes(id)) {
      const idsForPollingArray = this._idsForPolling.value.filter(i => i !== id);
      console.log('removing', id, 'from polling');
      this._idsForPolling.next(idsForPollingArray);
    }
  }
}
