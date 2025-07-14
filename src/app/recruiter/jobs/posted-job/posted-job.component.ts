import { Component, inject, OnInit, signal } from '@angular/core';
import { map, Observable } from 'rxjs';
import { isCorrectStatus, JobTarget, JobTargetStatusType } from '../../../types/job-target.types';
import { PlacementCellService } from '../../../services/placement-cell.service';
import { ToastService } from '../../../services/toast.service';
import { JobService } from '../../../services/job.service';
import { PlacementCellJobRequestStats } from '../../../types/placement-cell.types';
import { AsyncPipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-posted-job',
  imports: [CommonModule, AsyncPipe],
  templateUrl: './posted-job.component.html',
  styleUrl: './posted-job.component.css',
})
export class PostedJobComponent implements OnInit {
  postedJob$ = new Observable<JobTarget[]>();
  placementCellService = inject(PlacementCellService);
  toastService = inject(ToastService);
  jobService = inject(JobService);
  placementCellStats$ = new Observable<PlacementCellJobRequestStats[]>();

  postedJobs$ = new Observable<JobTarget[]>();
  selectedStatusForFilter = signal<JobTargetStatusType | undefined>(undefined);

  ngOnInit(): void {
    this.postedJobs$ = this.jobService.getPostedJobs().pipe(map(res => res.data));
  }

  onFilterSelected(status: string) {
    const currentStatus = this.selectedStatusForFilter();
    if (currentStatus === status) {
      this.selectedStatusForFilter.set(undefined);
      this.postedJobs$ = this.jobService.getPostedJobs().pipe(map(res => res.data));
      return;
    }
    if (!isCorrectStatus(status)) {
      return;
    }
    this.selectedStatusForFilter.set(status);
    this.postedJobs$ = this.jobService.getPostedJobs(status).pipe(map(res => res.data));
  }
}
