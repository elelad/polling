import { PollingService } from '../../services/polling.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  isDone = false;

  constructor(private pollingService: PollingService) {
  }

  ngOnInit(): void {
    this.pollingService.restartPolling$.subscribe(d => {
      if (d.length > 0) {
        this.isDone = true;
        setTimeout(() => {
          this.isDone = false;
        }, 2000);
      }
    });
  }

}