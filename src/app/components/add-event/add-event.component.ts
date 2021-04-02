import { Component, OnInit } from '@angular/core';
import { EventsService } from '../../services/events.service';
import { PollingService } from '../../services/polling.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.scss'],
})
export class AddEventComponent implements OnInit {

  constructor(public eventsService: EventsService) {
  }

  ngOnInit(): void {
  }

  addEvent(from: NgForm): void {
    this.eventsService.addEvent(from.value.name);
    from.setValue({ name: '' });
  }

}
