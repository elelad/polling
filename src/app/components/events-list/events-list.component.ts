import { Component, OnDestroy, OnInit } from '@angular/core';
import { CalEvent } from '../../model';
import { EventsService } from '../../services/events.service';
import { PollingService } from '../../services/polling.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


@Component({
  selector: 'app-events-list',
  templateUrl: './events-list.component.html',
  styleUrls: ['./events-list.component.scss'],
})
export class EventsListComponent implements OnInit, OnDestroy {
  events: CalEvent[];

  private destroy: Subject<void> = new Subject<void>();

  constructor(public eventsService: EventsService, private pollingService: PollingService) {
  }

  ngOnInit(): void {
    this.pollingService.pollingListener$
      .pipe(takeUntil(this.destroy))
      .subscribe(events => {
        if (events.done.length) {
          for (const e of events.done) {
            this.eventsService.updateEvent(e);
          }
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

}
