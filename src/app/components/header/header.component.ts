import { PollingService } from '../../services/polling.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  isDone = false;
  isProcessing = false;

  private destroy: Subject<void> = new Subject<void>();

  constructor(public pollingService: PollingService) {
  }

  ngOnInit(): void {
    this.pollingService.pollingListener$
      .pipe(takeUntil(this.destroy))
      .subscribe(d => {
        if (d.done.length !== 0) {
          this.isDone = true;
          setTimeout(() => {
            this.isDone = false;
          }, 2000);
        }
        this.isProcessing = !!d.inProgress.length;
      });
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

}
