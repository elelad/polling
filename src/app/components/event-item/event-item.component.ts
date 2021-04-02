import { Component, Input, OnInit } from '@angular/core';
import { CalEvent, EventStatus } from '../../model';
import { EventsService } from '../../services/events.service';

@Component({
  selector: 'app-event-item',
  templateUrl: './event-item.component.html',
  styleUrls: ['./event-item.component.scss'],
})
export class EventItemComponent implements OnInit {

  @Input() event: CalEvent;

  eventStatus = EventStatus;

  constructor(private eventsService: EventsService) {
  }

  ngOnInit(): void {
  }

  remove(): void {
    this.eventsService.removeEvent(this.event.id);
  }

}
