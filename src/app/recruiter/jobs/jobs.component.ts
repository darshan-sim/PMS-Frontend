import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonPageLayoutComponent } from '../../shared/common-page-layout/common-page-layout.component';
import { AsideSlotDirective } from '../../shared/directives/aside-slot.directive';
import { HeadSlotDirective } from '../../shared/directives/head-slot.directive';
import { StatsCardComponent } from '../../shared/components/stats-card/stats-card.component';
import { animate, style, transition, trigger } from '@angular/animations';
import { JobService } from '../../services/job.service';
import { JobListComponent } from './job-list/job-list.component';
import { MODE } from '../../types/common.types';
import { JobViewComponent } from './job-view/job-view.component';

@Component({
  selector: 'app-jobs',
  standalone: true,
  imports: [
    CommonModule,
    CommonPageLayoutComponent,
    AsideSlotDirective,
    HeadSlotDirective,
    StatsCardComponent,
    JobListComponent,
    JobViewComponent,
  ],
  templateUrl: './jobs.component.html',
  styleUrl: './jobs.component.css',
  styles: [],
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
})
export class JobsComponent implements OnInit {
  private jobService = inject(JobService);
  mode = this.jobService.mode;

  onViewAll() {
    throw new Error('Method not implemented.');
  }

  onCreate() {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {}
}
