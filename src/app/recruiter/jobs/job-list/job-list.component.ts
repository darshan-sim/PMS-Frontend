import { Component, inject, OnInit } from '@angular/core';
import { JobService } from '../../../services/job.service';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MODE } from '../../../types/common.types';
import { JobType, JobTypeTsType } from '../../../types/job-request.types';
import { StatsCardComponent } from '../../../shared/components/stats-card/stats-card.component';
import { animate, style, transition, trigger } from '@angular/animations';
import { CardIconDirective } from '../../../shared/directives/card-icon.directive';

@Component({
  selector: 'app-job-list',
  imports: [
    CommonModule,
    AsyncPipe,
    MatTableModule,
    MatPaginator,
    StatsCardComponent,
    CardIconDirective,
  ],
  animations: [
    trigger('fadeSlide', [
      transition(':enter', [
        style({ transform: 'translateY(3rem)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateY(0)', opacity: 1 })),
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ transform: 'translateY(3rem)', opacity: 0 })),
      ]),
    ]),
  ],
  templateUrl: './job-list.component.html',
  styleUrl: './job-list.component.css',
})
export class JobListComponent implements OnInit {
  onDelete(arg0: any, arg1: any) {
    throw new Error('Method not implemented.');
  }

  private jobService = inject(JobService);

  page = 0;
  pageSize = 10;
  length = 0;

  jobRequests$ = this.jobService.jobRequests$;
  jobRequestStats$ = this.jobService.jobRequestStats$;

  displayedColumns = [
    'title',
    'description',
    'salary',
    'jobType',
    'status',
    'allowAllDegrees',
    'action',
  ];

  onPageEvent(e: PageEvent) {
    this.page = e.pageIndex + 1;
    this.getAllJobRequests();
  }

  getAllJobRequests() {
    this.jobService
      .getAllJobRequest(this.page, this.pageSize)
      .pipe(
        tap(res => {
          if (res.pagination) {
            this.length = res.pagination.total;
          }
        }),
        catchError(error => {
          return throwError(() => error);
        })
      )
      .subscribe(res => {});
    this.jobService.getJobRequestStats().subscribe();
  }

  ngOnInit(): void {
    this.getAllJobRequests();
  }

  jobType(type: JobTypeTsType) {
    return JobType[type];
  }

  onView(id: string) {
    console.log({ id });
    if (!id) {
      return;
    }
    this.jobService.setMode(MODE.VIEW);
    this.jobService.getJobRequestById(id).subscribe();
  }
}
