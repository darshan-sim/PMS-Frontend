import { Component, inject, input, OnInit } from '@angular/core';
import { JobRequest } from '../../../types/job-request.types';
import { map, Observable } from 'rxjs';
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
