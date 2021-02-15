import { Component, OnInit } from '@angular/core';
import { EventsService } from '../../services/events.service';
import { PollingService } from '../../services/polling.service';
import { shareReplay } from 'rxjs/operators';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.scss'],
})
export class AddEventComponent implements OnInit {

  constructor(private eventsService: EventsService, private pollingService: PollingService) {
  }

  ngOnInit(): void {
    this.pollingService.restartPolling$.pipe(shareReplay()).subscribe();
  }

  addEvent(name: string): boolean {
    this.eventsService.addEvent(name);
    return false;
  }

}
