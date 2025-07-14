import { Component, inject, signal } from '@angular/core';
import { JobTarget, JobTargetStatus } from '../../types/job-target.types';
import { map, Observable } from 'rxjs';
import { PlacementCellService } from '../../services/placement-cell.service';
import { ToastService } from '../../services/toast.service';
import { JobService } from '../../services/job.service';
import { PlacementCellJobRequestStats } from '../../types/placement-cell.types';
import { AsyncPipe, CommonModule } from '@angular/common';
import { CommonPageLayoutComponent } from '../../shared/common-page-layout/common-page-layout.component';
import { AsideSlotDirective } from '../../shared/directives/aside-slot.directive';
import { HeadSlotDirective } from '../../shared/directives/head-slot.directive';
import { ViewJobComponent } from './view-job/view-job.component';
import { ToastComponent } from '../../shared/components/toast/toast.component';

@Component({
  selector: 'app-jobs',
  imports: [
    CommonModule,
    AsyncPipe,
    CommonPageLayoutComponent,
    AsideSlotDirective,
    HeadSlotDirective,
    ViewJobComponent,
    ToastComponent,
  ],
  templateUrl: './jobs.component.html',
  styleUrl: './jobs.component.css',
})
export class JobsComponent {
  postedJob$ = new Observable<JobTarget[]>();
  placementCellService = inject(PlacementCellService);
  toastService = inject(ToastService);
  jobService = inject(JobService);
  placementCellStats$ = new Observable<PlacementCellJobRequestStats[]>();
  postedJobs$ = new Observable<JobTarget[]>();
  viewJobRequest = false;

  ngOnInit(): void {
    this.postedJobs$ = this.jobService.getPostedJobs().pipe(map(res => res.data));
  }

  onViewJobRequest(id: string, jobTargetId: string) {
    this.jobService
      .getJobRequestById(id)
      .pipe(map(res => res.data))
      .subscribe();
    this.viewJobRequest = true;
  }

  onViewAll() {
    this.viewJobRequest = false;
  }

  onRejectJobTarget(id: string) {
    const data = {
      status: JobTargetStatus.rejected,
    };
    this.jobService.updateJobPost(id, data).subscribe(res => {
      this.toastService.show(res.message, 'success');
      this.postedJobs$ = this.jobService.getPostedJobs().pipe(map(res => res.data));
    });
  }

  onAcceptJobTarget(id: string) {
    const data = {
      status: JobTargetStatus.approved,
    };
    this.jobService.updateJobPost(id, data).subscribe(res => {
      this.toastService.show(res.message, 'success');
      this.postedJobs$ = this.jobService.getPostedJobs().pipe(map(res => res.data));
    });
  }
}
