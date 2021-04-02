import { Component, OnInit } from '@angular/core';
import { CalEvent } from '../../model';
import { EventsService } from '../../services/events.service';
import { PollingService } from '../../services/polling.service';


@Component({
  selector: 'app-events-list',
  templateUrl: './events-list.component.html',
  styleUrls: ['./events-list.component.scss'],
})
export class EventsListComponent implements OnInit {
  events: CalEvent[];

  constructor(public eventsService: EventsService, private pollingService: PollingService) {
  }

  ngOnInit(): void {
    this.pollingService.restartPolling$.subscribe(events => {
      if (events.done.length) {
        for (const e of events.done) {
          this.eventsService.updateEvent(e);
        }
      }
    });
  }

}
