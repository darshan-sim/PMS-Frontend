import { Component, inject, OnInit, signal } from '@angular/core';
import { PlacementCellService } from '../../../services/placement-cell.service';
import { catchError, map, Observable, pipe, tap, throwError } from 'rxjs';
import { PlacementCellJobRequestStats } from '../../../types/placement-cell.types';
import { AsyncPipe, CommonModule } from '@angular/common';
import { JobRequest } from '../../../types/job-request.types';
import { JobService } from '../../../services/job.service';
import { MODE } from '../../../types/common.types';
import { ToastService } from '../../../services/toast.service';
import { ToastComponent } from '../../../shared/components/toast/toast.component';

@Component({
  selector: 'app-post-job',
  imports: [CommonModule, AsyncPipe, ToastComponent],
  templateUrl: './post-job.component.html',
  styleUrl: './post-job.component.css',
})
export class PostJobComponent implements OnInit {
  placementCellService = inject(PlacementCellService);
  toastService = inject(ToastService);
  jobService = inject(JobService);
  placementCellStats$ = new Observable<PlacementCellJobRequestStats[]>();
  jobRequests$ = new Observable<JobRequest[]>();
  selectedJobRequestId = signal<null | string>(null);

  page = 0;
  pageSize = 10;
  length = 0;

  ngOnInit(): void {
    this.placementCellStats$ = this.placementCellService
      .getPlacementCellsStatsForJobTarget()
      .pipe(map(res => res.data));
    this.jobRequests$ = this.jobService.getAllJobRequest(this.page, this.pageSize).pipe(
      tap(res => {
        if (res.pagination) {
          this.length = res.pagination.total;
        }
      }),
      map(res => res.data),
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  onSend(placementCellId: string, placementCellName: string) {
    const jobRequestId = this.selectedJobRequestId();
    console.log(placementCellId);
    if (!jobRequestId) return;
    const confirmed = confirm(
      `Are you sure you want to send job Request to placement cell ${placementCellName}`
    );
    if (confirmed) {
      const data = {
        jobRequestId,
        placementCellId,
      };
      this.jobService
        .createJobTarget(data)
        .pipe(
          catchError(error =>
            throwError(() => {
              console.log(error);
            })
          )
        )
        .subscribe(res => {
          this.toastService.show('Job Request send success fully', 'success');
        });
    }
  }

  onViewJobRequest(id: string) {
    console.log({ id });
    if (!id) {
      return;
    }
    this.jobService.setMode(MODE.VIEW);
    this.jobService.getJobRequestById(id).subscribe();
  }

  onSelectJobRequest(id: string) {
    if (this.selectedJobRequestId() === id) {
      this.selectedJobRequestId.set(null);
    } else {
      this.selectedJobRequestId.set(id);
    }
  }
}
