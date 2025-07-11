import { Component, effect, inject, input, OnInit, signal } from '@angular/core';
import { MODE } from '../../../types/common.types';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { defaultValidationMessages } from '../../../types/validation.types';
import { SharedInputComponent } from '../../../shared/components/shared-input/shared-input.component';
import { ValidationErrorsComponent } from '../../../shared/components/validation-errors/validation-errors.component';
import { EligibilityCriteriaService } from '../../../services/eligibility-criteria.service';
import { ToastService } from '../../../services/toast.service';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { ApiResponse } from '../../../types/api-response.types';
import { CdkHeaderCellDef } from '@angular/cdk/table';
import { ToastComponent } from '../../../shared/components/toast/toast.component';
import { EligibilityCriteria } from '../../../types/eligibility-criteria.type';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-criteria-operations',
  imports: [ReactiveFormsModule, SharedInputComponent, ValidationErrorsComponent, ToastComponent],
  templateUrl: './criteria-operations.component.html',
  styleUrl: './criteria-operations.component.css',
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
export class CriteriaOperationsComponent implements OnInit {
  eligibilityCriteriaService = inject(EligibilityCriteriaService);
  toastService = inject(ToastService);
  eligibilityCriteriaData: EligibilityCriteria | null = null;
  eligiblyCriteriaId = this.eligibilityCriteriaService.selectedCriteriaId;
  operation = this.eligibilityCriteriaService.mode;
  validationMessages = defaultValidationMessages;

  eligibilityCriteriaForm = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),

    minCgpa: new FormControl<number | null>(null, [Validators.min(0), Validators.max(10)]),

    minBachelorsGpa: new FormControl<number | null>(null, [Validators.min(0), Validators.max(10)]),

    minTenthPercentage: new FormControl<number | null>(null, [
      Validators.min(0),
      Validators.max(100),
    ]),

    minTwelfthPercentage: new FormControl<number | null>(null, [
      Validators.min(0),
      Validators.max(100),
    ]),

    minDiplomaPercentage: new FormControl<number | null>(null, [
      Validators.min(0),
      Validators.max(100),
    ]),

    maxBacklogs: new FormControl<number | null>(null, [Validators.min(0), Validators.max(50)]),

    maxLiveBacklogs: new FormControl<number | null>(null, [Validators.min(0), Validators.max(50)]),
  });

  ngOnInit(): void {
    if (this.operation() !== MODE.CREATE) {
      this.loadEligibilityCriteria();
    }
  }
  constructor() {
    effect(() => {
      const operation = this.operation();
      if (operation === MODE.CREATE) {
        this.eligibilityCriteriaForm.reset();
      }
    });
  }

  loadEligibilityCriteria() {
    const id = this.eligiblyCriteriaId();
    if (!id) {
      return;
    }
    this.eligibilityCriteriaService
      .getEligibilityCriteriaById(id)
      .pipe(catchError(error => throwError(() => console.log(error))))
      .subscribe(res => {
        this.eligibilityCriteriaData = res.data;
        this.resetForm();
      });
  }

  resetForm() {
    if (!this.eligibilityCriteriaData) {
      return;
    }
    this.eligibilityCriteriaForm.patchValue(this.eligibilityCriteriaData);
    this.eligibilityCriteriaService.setMode(MODE.VIEW);
  }

  onCreate() {
    if (this.eligibilityCriteriaForm.invalid) {
      this.eligibilityCriteriaForm.markAllAsTouched();
      this.eligibilityCriteriaForm.markAsDirty();
      this.toastService.show('Please fill all required fields correctly', 'error');
      return;
    }
    if (!this.eligibilityCriteriaForm.touched) {
      this.toastService.show(`You haven't made any changes`, 'warning');
      return;
    }
    const rowData = this.eligibilityCriteriaForm.getRawValue();
    const eligibilityCriteria = {
      ...(rowData && { name: rowData.name }),
      ...(rowData?.minCgpa && { minCgpa: +rowData.minCgpa }),
      ...(rowData?.minBachelorsGpa && { minBachelorsGpa: +rowData.minBachelorsGpa }),
      ...(rowData?.minTenthPercentage && {
        minTenthPercentage: +rowData.minTenthPercentage,
      }),
      ...(rowData?.minTwelfthPercentage && {
        minTwelfthPercentage: +rowData.minTwelfthPercentage,
      }),
      ...(rowData?.minDiplomaPercentage && {
        minDiplomaPercentage: +rowData.minDiplomaPercentage,
      }),
      ...(rowData?.maxBacklogs && { maxBacklogs: +rowData.maxBacklogs }),
      ...(rowData?.maxLiveBacklogs && { maxLiveBacklogs: +rowData.maxLiveBacklogs }),
    };
    this.eligibilityCriteriaService
      .create(eligibilityCriteria)
      .pipe(
        catchError(error => {
          return throwError(() => {
            this.setError(error.error.data);
          });
        })
      )
      .subscribe(res => res.data);
  }

  onEdit() {
    this.eligibilityCriteriaService.setMode(MODE.UPDATE);
  }

  onCancel() {
    this.resetForm();
    this.eligibilityCriteriaService.setMode(MODE.VIEW);
  }

  onSubmit() {
    if (this.eligibilityCriteriaForm.invalid) {
      this.eligibilityCriteriaForm.markAllAsTouched();
      this.eligibilityCriteriaForm.markAsDirty();
      this.toastService.show('Please fill all required fields correctly', 'error');
      return;
    }
    if (!this.eligibilityCriteriaForm.touched) {
      this.toastService.show(`You haven't made any changes`, 'warning');
      return;
    }

    const rowData = this.eligibilityCriteriaForm.getRawValue();

    const eligibilityCriteria = {
      ...(rowData && { name: rowData.name }),
      ...(rowData?.minCgpa && { minCgpa: +rowData.minCgpa }),
      ...(rowData?.minBachelorsGpa && { minBachelorsGpa: +rowData.minBachelorsGpa }),
      ...(rowData?.minTenthPercentage && {
        minTenthPercentage: +rowData.minTenthPercentage,
      }),
      ...(rowData?.minTwelfthPercentage && {
        minTwelfthPercentage: +rowData.minTwelfthPercentage,
      }),
      ...(rowData?.minDiplomaPercentage && {
        minDiplomaPercentage: +rowData.minDiplomaPercentage,
      }),
      ...(rowData?.maxBacklogs && { maxBacklogs: +rowData.maxBacklogs }),
      ...(rowData?.maxLiveBacklogs && { maxLiveBacklogs: +rowData.maxLiveBacklogs }),
    };
    if (this.operation() === MODE.UPDATE) {
      if (!this.eligiblyCriteriaId()) {
        this.toastService.show(`Unable to find eligibly criteria id`, 'error');
        return;
      }
      this.eligibilityCriteriaService
        .update(eligibilityCriteria)
        .pipe(
          catchError(error => {
            return throwError(() => {
              this.setError(error.error.data);
            });
          })
        )
        .subscribe(res => {
          this.eligibilityCriteriaData = res.data;
          this.eligibilityCriteriaService.setMode(MODE.VIEW);
        });
    } else if (this.operation() === MODE.CREATE) {
      this.eligibilityCriteriaService
        .create(eligibilityCriteria)
        .pipe(
          catchError(error => {
            return throwError(() => {
              this.setError(error.error.data);
            });
          })
        )
        .subscribe(res => {
          this.eligibilityCriteriaData = res.data;
          this.eligibilityCriteriaService.setMode(MODE.VIEW);
        });
    }
  }

  setError(errors: Record<string, string>) {
    Object.keys(errors).forEach(key => {
      const formControlForError = this.eligibilityCriteriaForm.get(key);
      if (formControlForError) {
        formControlForError.setErrors({ server: errors[key] });
        //{name: 'Name already exists'}
      } else {
        const existingErrors = this.eligibilityCriteriaForm.errors || {};
        this.eligibilityCriteriaForm.setErrors({ ...existingErrors, key: errors[key] });
      }
    });
    this.eligibilityCriteriaForm.markAsTouched();
    this.eligibilityCriteriaForm.markAsDirty();
  }

  get nameControl() {
    return this.eligibilityCriteriaForm.controls['name'];
  }

  get minCgpaControl() {
    return this.eligibilityCriteriaForm.controls['minCgpa'];
  }

  get minBachelorsGpaControl() {
    return this.eligibilityCriteriaForm.controls['minBachelorsGpa'];
  }

  get minTenthPercentageControl() {
    return this.eligibilityCriteriaForm.controls['minTenthPercentage'];
  }

  get minTwelfthPercentageControl() {
    return this.eligibilityCriteriaForm.controls['minTwelfthPercentage'];
  }

  get minDiplomaPercentageControl() {
    return this.eligibilityCriteriaForm.controls['minDiplomaPercentage'];
  }

  get maxBacklogsControl() {
    return this.eligibilityCriteriaForm.controls['maxBacklogs'];
  }

  get maxLiveBacklogsControl() {
    return this.eligibilityCriteriaForm.controls['maxLiveBacklogs'];
  }
  get isEditMode() {
    return this.operation() !== MODE.VIEW && this.operation() !== MODE.VIEW_ALL;
  }
}
