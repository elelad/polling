import { PollingService } from '../../services/polling.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  isDone = false;
  isProcessing = false;

  constructor(public pollingService: PollingService) {
  }

  ngOnInit(): void {
    this.pollingService.restartPolling$.subscribe(d => {
      if (d.done.length !== 0) {
        this.isDone = true;
        setTimeout(() => {
          this.isDone = false;
        }, 2000);
      }
      this.isProcessing = !!d.inProgress.length;
    });
  }

}
