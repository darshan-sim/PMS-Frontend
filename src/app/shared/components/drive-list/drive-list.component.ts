import { AsyncPipe, CommonModule, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { DriveService } from '../../../services/drive.service';
import { catchError, tap, throwError } from 'rxjs';
import { MODE } from '../../../types/common.types';
import { JobDriveStatus } from '../../../types/job-drive.types';

@Component({
  selector: 'app-drive-list',
  imports: [CommonModule, MatTableModule, MatPaginatorModule, AsyncPipe, DatePipe],
  templateUrl: './drive-list.component.html',
  styleUrl: './drive-list.component.css',
})
export class DriveListComponent {
  private driveService = inject(DriveService);
  page = 0;
  pageSize = 10;
  length = 0;

  jobDrives$ = this.driveService.jobDrives$;

  displayedColumns = ['jobPost', 'driveDate', 'status', 'placementCellId', 'action'];

  ngOnInit(): void {
    this.getAllJobDrives();
  }

  onPageEvent(e: PageEvent) {
    this.page = e.pageIndex + 1;
    this.getAllJobDrives();
  }

  getAllJobDrives() {
    // Optional: If you want pagination later, add query params to the backend
    this.driveService
      .getAllJobDrives(this.page, this.pageSize)
      .pipe(
        tap(res => {
          if (res.pagination) {
            this.length = res.pagination.total;
          } else {
            this.length = res.data.length;
          }
        }),
        catchError(error => throwError(() => error))
      )
      .subscribe();
  }

  onView(id: string) {
    if (!id) return;
    this.driveService.setMode(MODE.VIEW);
    this.driveService.getJobDriveById(id).subscribe();
  }

  statusLabel(status: JobDriveStatus): string {
    return {
      planned: 'Planned',
      ongoing: 'Ongoing',
      paused: 'Paused',
      canceled: 'Canceled',
      completed: 'Completed',
    }[status];
  }
}
