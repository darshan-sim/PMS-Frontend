import { Component, inject } from '@angular/core';
import { JobService } from '../../../services/job.service';
import { AsyncPipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-job-view',
  imports: [AsyncPipe, CommonModule],
  templateUrl: './job-view.component.html',
  styleUrl: './job-view.component.css',
})
export class JobViewComponent {
  jobService = inject(JobService);
  jobRequest$ = this.jobService.jobRequest$;
}
