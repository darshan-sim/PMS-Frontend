import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { JobService } from '../../../services/job.service';
import { map, Observable } from 'rxjs';
import { JobTarget } from '../../../types/job-target.types';
import { PlacementCellService } from '../../../services/placement-cell.service';
import { ToastService } from '../../../services/toast.service';
import { PlacementCellJobRequestStats } from '../../../types/placement-cell.types';
import { JobDriveCreateDto } from '../../../types/job-drive.types';
import { DriveService } from '../../../services/drive.service';

@Component({
  selector: 'app-drive-create',
  imports: [
    CommonModule,
    AsyncPipe,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './drive-create.component.html',
  styleUrl: './drive-create.component.css',
})
export class DriveCreateComponent {
  postedJob$ = new Observable<JobTarget[]>();
  placementCellService = inject(PlacementCellService);
  toastService = inject(ToastService);
  jobService = inject(JobService);
  driveService = inject(DriveService);
  placementCellStats$ = new Observable<PlacementCellJobRequestStats[]>();
  selectedDriveDates = new Map<string, Date | null>();

  postedJobs$ = new Observable<JobTarget[]>();

  ngOnInit(): void {
    this.postedJobs$ = this.jobService.getPostedJobs('approved').pipe(map(res => res.data));
  }

  onDateChange(jobTargetId: string, date: Date | null) {
    this.selectedDriveDates.set(jobTargetId, date ?? null);
  }

  createDrive(job: JobTarget) {
    const driveDate = this.selectedDriveDates.get(job.jobTargetId);

    if (!driveDate) {
      alert('Please select a valid drive date first.');
      return;
    }

    const dto: JobDriveCreateDto = {
      placementCellId: job.placementCell.placementCellId,
      jobTargetId: job.jobTargetId,
      driveDate,
    };

    this.driveService.createJobDrive(dto).subscribe({
      next: res => {
        this.toastService.show(res.message, 'success');
        this.selectedDriveDates.delete(job.jobTargetId);
      },
      error: err => {
        this.toastService.show(err.error.data.driveDate, 'success');
        alert('Failed to create drive');
      },
    });
  }
}
