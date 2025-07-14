import { Component, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { EligibilityCriteriaService } from '../../services/eligibility-criteria.service';
import { AsyncPipe } from '@angular/common';
import { CommonPageLayoutComponent } from '../../shared/common-page-layout/common-page-layout.component';
import { AsideSlotDirective } from '../../shared/directives/aside-slot.directive';
import { HeadSlotDirective } from '../../shared/directives/head-slot.directive';
import { CriteriaListComponent } from './criteria-list/criteria-list.component';
import { MODE } from '../../types/common.types';
import { CriteriaOperationsComponent } from './criteria-operations/criteria-operations.component';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ToastComponent } from "../../shared/components/toast/toast.component";

@Component({
  selector: 'app-criteria',
  imports: [
    MatCardModule,
    CommonPageLayoutComponent,
    AsideSlotDirective,
    HeadSlotDirective,
    CriteriaListComponent,
    CriteriaOperationsComponent,
    ToastComponent
],
  animations: [
    trigger('fadeSlide', [
      transition(':enter', [
        style({ transform: 'translateY(20px)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateY(0)', opacity: 1 })),
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ transform: 'translateY(20px)', opacity: 0 })),
      ]),
    ]),
  ],
  templateUrl: './criteria.component.html',
  styleUrl: './criteria.component.css',
})
export class CriteriaComponent implements OnInit {
  eligibilityCriteriaService = inject(EligibilityCriteriaService);

  mode = this.eligibilityCriteriaService.mode;

  ngOnInit(): void {}
  onCreate() {
    this.eligibilityCriteriaService.setMode(MODE.CREATE);
    this.eligibilityCriteriaService.setSelectedCriteriaId(null);
  }
  onViewAll() {
    this.eligibilityCriteriaService.setMode(MODE.VIEW_ALL);
  }
}
