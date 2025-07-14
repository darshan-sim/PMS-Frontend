import { Component, inject } from '@angular/core';
import { ToastService } from '../../../services/toast.service';
import { JobService } from '../../../services/job.service';
import { AsyncPipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-view-job',
  imports: [CommonModule, AsyncPipe],
  templateUrl: './view-job.component.html',
  styleUrl: './view-job.component.css',
})
export class ViewJobComponent {
  toastService = inject(ToastService);
  jobService = inject(JobService);
  jobRequest$ = this.jobService.jobRequest$;
}
