import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CalEvent, idGen } from '../model';
import { PollingService } from './polling.service';

@Injectable({
  providedIn: 'root',
})
export class EventsService {

  private _events: BehaviorSubject<CalEvent[]> = new BehaviorSubject<CalEvent[]>([{ id: 10, name: 'first', status: 'done' }]);
  public events: Observable<CalEvent[]> = this._events.asObservable();

  constructor(private pollingService: PollingService) {
  }

  addEvent(name: string): void {
    const events = [...this._events.value];
    const id = idGen.next().value;
    events.push({ name, id, status: 'processing' });
    this.pollingService.addIdToPolling([id]);
    this._events.next(events);
  }

  removeEvent(id): void {
    const events = this._events.value.filter(e => e.id !== id);
    this._events.next(events);
    this.pollingService.removeIdFromPolling(id);
  }

  updateEvent(event: CalEvent): void {
    const currentEvents = [...this._events.value];
    currentEvents.find(e => event.id === e.id).status = event.status;
    this._events.next(currentEvents);
  }
}
