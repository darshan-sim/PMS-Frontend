import { Component, inject } from '@angular/core';
import { EligibilityCriteriaService } from '../../../services/eligibility-criteria.service';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { EligibilityCriteria } from '../../../types/eligibility-criteria.type';
import { AsyncPipe, CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MODE } from '../../../types/common.types';

@Component({
  selector: 'app-criteria-list',
  imports: [AsyncPipe, CommonModule, MatPaginatorModule, MatTableModule, MatPaginatorModule],
  templateUrl: './criteria-list.component.html',
  styleUrl: './criteria-list.component.css',
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
export class CriteriaListComponent {

  eligibilityCriteriaService = inject(EligibilityCriteriaService);
  allEligibilityCriteria$ = new Observable<EligibilityCriteria[]>();
  length: number = 0;
  pageSize: number = 10;
  page: number = 1;

  displayedColumns = [
    'name',
    'minCgpa',
    'minBachelorsGpa',
    'minTenthPercentage',
    'minTwelfthPercentage',
    'minDiplomaPercentage',
    'maxBacklogs',
    'maxLiveBacklogs',
    'action',
  ];

  ngOnInit(): void {
    this.getAllEligibilityCriteria();
  }

  onPageEvent(e: PageEvent) {

    this.page = e.pageIndex + 1;
    this.getAllEligibilityCriteria();
  }

  getAllEligibilityCriteria() {
    this.allEligibilityCriteria$ = this.eligibilityCriteriaService
      .getAllEligibilityCriteria(this.page, this.pageSize)
      .pipe(
        catchError(error => throwError(() => error)),
        tap(res => {
          if (res.pagination?.total) this.length = res.pagination?.total;
          if (res.pagination?.pageSize) this.pageSize = res.pagination?.pageSize;
        }),
        map(res => res.data)
      );
  }

  onView(criteriaId: string) {
    this.eligibilityCriteriaService.setSelectedCriteriaId(criteriaId);
    this.eligibilityCriteriaService.setMode(MODE.VIEW);
  }

  onDelete(criteriaId: string, name: string) {
    const confirmDelete = confirm(`Are you sure you want to delete this criteria ${name}`);
    if (confirmDelete) {
      this.eligibilityCriteriaService
        .delete(criteriaId)
        .pipe(
          catchError(error => {
            return throwError(() => {
              console.log(error);
            });
          })
        )
        .subscribe(() => {
          this.getAllEligibilityCriteria();
        });
    }
  }
}
