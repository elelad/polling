import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CalEvent, EventStatus, idGen } from '../model';
import { PollingService } from './polling.service';

@Injectable({
  providedIn: 'root',
})
export class EventsService {

  private _events: BehaviorSubject<CalEvent[]> = new BehaviorSubject<CalEvent[]>([{ id: 10, name: 'first', status: EventStatus.done }]);
  public events: Observable<CalEvent[]> = this._events.asObservable();

  constructor(private pollingService: PollingService) {
  }

  addEvent(name: string): void {
    const events = [...this._events.value];
    const id = idGen.next().value;
    events.push({ name, id, status: EventStatus.processing });
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
    currentEvents.map(e => {
      if (event.id === e.id) {
        e.status = event.status;
      }
      return e;
    });
    this._events.next(currentEvents);
  }
}
