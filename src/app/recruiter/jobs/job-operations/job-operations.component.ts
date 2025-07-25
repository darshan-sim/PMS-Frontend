import { Component, effect, inject, input, OnInit, signal } from '@angular/core';
import { JobService } from '../../../services/job.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { shareReplay, tap } from 'rxjs';
import {
  JobRequest,
  JobRequestStatus,
  JobRequestStatusType,
  JobRequestUpdate,
  JobType,
  JobTypeTsType,
} from '../../../types/job-request.types';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { SharedInputComponent } from '../../../shared/components/shared-input/shared-input.component';
import { ValidationErrorsComponent } from '../../../shared/components/validation-errors/validation-errors.component';
import { defaultValidationMessages } from '../../../types/validation.types';
import { MODE, SelectOption } from '../../../types/common.types';
import { DropdownAutocompleteComponentComponent } from '../../../shared/components/dropdown-autocomplete/dropdown-autocomplete.component';
import { EligibilityCriteriaService } from '../../../services/eligibility-criteria.service';
import { CommonService } from '../../../services/common.service';
import { ToastService } from '../../../services/toast.service';
import { ToastComponent } from '../../../shared/components/toast/toast.component';
import { CommonPageLayoutComponent } from '../../../shared/common-page-layout/common-page-layout.component';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-job-operations',
  imports: [
    AsyncPipe,
    CommonModule,
    ReactiveFormsModule,
    SharedInputComponent,
    ValidationErrorsComponent,
    DropdownAutocompleteComponentComponent,
    ToastComponent,
    CommonPageLayoutComponent,
  ],
  templateUrl: './job-operations.component.html',
  styleUrl: './job-operations.component.css',
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
export class JobOperationsComponent {
  private jobService = inject(JobService);
  private eligibilityCriteriaService = inject(EligibilityCriteriaService);
  private toastService = inject(ToastService);
  private commonService = inject(CommonService);
  jobRequest$ = this.jobService.jobRequest$;

  jobRequestData: JobRequest | null = null;
  validationMessages = defaultValidationMessages;
  mode = this.jobService.mode;
  isEditMode = this.mode() !== MODE.VIEW_ALL && this.mode() !== MODE.VIEW;

  constructor() {
    effect(() => {
      this.mode();
      if (this.mode() === MODE.CREATE) {
        this.jobRequestForm.reset();
      }
      if (this.mode() === MODE.CREATE || this.mode() === MODE.UPDATE) {
        this.isEditMode = true;
      } else {
        this.isEditMode = false;
      }
    });
  }

  jobTypeOptions = signal<SelectOption[]>([
    { label: 'full_time', value: 'full_time', select: true },
    { label: 'part_time', value: 'part_time' },
    { label: 'internship', value: 'internship' },
  ]);

  statusOptions = signal<SelectOption[]>([
    { label: 'active', value: 'active', select: true },
    { label: 'closed', value: 'closed' },
  ]);

  criteriaOptions: SelectOption[] = [];
  degreeOptions: SelectOption[] = [];

  jobRequestForm = new FormGroup(
    {
      title: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required],
      }),

      description: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required],
      }),

      salary: new FormControl<number>(0, {
        nonNullable: true,
        validators: [Validators.required],
      }),

      stipend: new FormControl<number | null>(null, []),

      location: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required],
      }),

      jobType: new FormControl<JobTypeTsType>('full_time', {
        nonNullable: true,
        validators: [Validators.required],
      }),

      status: new FormControl<JobRequestStatusType>('active', {
        nonNullable: true,
        validators: [Validators.required],
      }),

      eligibilityCriteriaId: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required],
      }),

      allowAllDegrees: new FormControl<boolean>(false, {
        nonNullable: true,
      }),

      allowedDegrees: new FormControl<string[] | null>(null),
    },
    {
      validators: this.atLeastOneDegree('allowAllDegrees', 'allowedDegrees'),
    }
  );

  atLeastOneDegree(
    allowAllDegreesControlName: string,
    allowedDegreesControlName: string
  ): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const allowAllDegrees = control.get(allowAllDegreesControlName)?.value;
      const allowedDegrees = control.get(allowedDegreesControlName)?.value;
      if (!allowAllDegrees && (!allowedDegrees || allowedDegrees?.length === 0))
        return { allowedDegrees: true };
      return null;
    };
  }

  ngOnInit(): void {
    this.jobRequest$
      .pipe(
        tap(res => {
          this.jobRequestData = res;
          this.reset();
        })
      )
      .subscribe();

    this.jobRequestForm.valueChanges.subscribe();

    this.eligibilityCriteriaService
      .getAllEligibilityCriteriaSelectionList()
      .pipe(
        tap(res => {
          res.data.forEach(criteria => {
            const option: SelectOption = {
              label: criteria.name,
              value: criteria.criteriaId,
            };
            if (this.jobRequestData?.eligibilityCriteriaId === criteria.criteriaId) {
              option.select = true;
            }
            this.criteriaOptions.push(option);
          });
        })
      )
      .subscribe();
    this.commonService
      .getDegrees()
      .pipe(
        tap(degrees => {
          degrees.forEach(degree => {
            const option: SelectOption = {
              label: degree.name,
              value: degree.degreeId,
            };
            this.degreeOptions.push(option);
          });
        })
      )
      .subscribe();
  }

  reset() {
    if (!this.jobRequestData) {
      return;
    }

    const formData = {
      title: this.jobRequestData.title,
      description: this.jobRequestData.description,
      salary: this.jobRequestData.salary,
      location: this.jobRequestData.location,
      jobType: this.jobRequestData.jobType,
      status: this.jobRequestData.status,
      eligibilityCriteriaId: this.jobRequestData.eligibilityCriteria.name, //display the name instead of id
      allowAllDegrees: this.jobRequestData.allowAllDegrees,
      allowedDegrees: this.jobRequestData.allowedDegrees
        ? this.jobRequestData.allowedDegrees.map(deg => deg.name)
        : null,
    };

    this.statusOptions.update(statusOptions =>
      statusOptions.map(option => {
        option.select = option.value === formData.status;
        return option;
      })
    );

    this.jobTypeOptions.update(jobTypeOptions =>
      jobTypeOptions.map(option => {
        option.select = option.value === formData.jobType;
        return option;
      })
    );

    this.jobRequestForm.patchValue(formData);
  }

  onEdit() {
    this.jobService.setMode(MODE.UPDATE);
  }

  onStatusChange(status: string) {
    this.statusControl.setValue(status);
    this.statusOptions.update(statusOptions =>
      statusOptions.map(option => {
        option.select = option.value === status;
        return option;
      })
    );
  }

  onJobTypeChange(jobType: string) {
    this.jobTypeControl.setValue(jobType);
    this.jobTypeOptions.update(jobTypeOptions =>
      jobTypeOptions.map(option => {
        option.select = option.value === jobType;
        return option;
      })
    );
  }

  onRemoveDegree(degreeName: string) {
    const degree = this.degreeOptions.find(d => d.label === degreeName);
    if (!degree) return;
    const oldAllowedDegree = this.allowedDegreesControl.value || [];
    const filteredAllowedDegree = oldAllowedDegree.filter(degree => degree !== degreeName);
    this.allowedDegreesControl.setValue(filteredAllowedDegree);
    // if (!filteredAllowedDegree.length) this.jobRequestForm.setErrors({ allowedDegrees: true });
    // this.allowedDegreesControl.setValue(filteredAllowedDegree);
  }

  onDegreeAdded(id: string) {
    const degree = this.degreeOptions.find(d => d.value === id)?.label;
    if (!degree) return;
    const oldAllowedDegree = this.allowedDegreesControl.value || [];
    if (!oldAllowedDegree.includes(degree)) oldAllowedDegree.push(degree);
    this.allowedDegreesControl.setValue(oldAllowedDegree);
  }

  onCancel() {
    this.reset();
    this.jobService.setMode(MODE.VIEW);
    console.log(this.mode());
  }

  onReset() {
    this.reset();
  }

  setDegreeIdFromName(degreeName: string[]) {
    if (!degreeName) return;
    const degreeIdes: string[] = [];
    this.degreeOptions.forEach(degree => {
      if (degreeName.includes(degree.label)) {
        degreeIdes.push(degree.value);
      }
    });
    return degreeIdes;
  }

  onSubmit() {
    if (this.jobRequestForm.invalid) {
      this.jobRequestForm.markAllAsTouched();
      this.jobRequestForm.markAsDirty();
      this.toastService.show('Please fill all required fields correctly', 'error');
      return;
    }

    const rowData = this.jobRequestForm.getRawValue();

    console.log({ rowData });

    const jobRequest: JobRequestUpdate = {
      title: rowData.title,
      description: rowData.description,
      salary: +rowData.salary,
      ...(rowData.stipend && { stipend: +rowData.stipend }),
      location: rowData.location,
      jobType: rowData.jobType,
      status: rowData.status,
      allowAllDegrees: rowData.allowAllDegrees,
      eligibilityCriteriaId: rowData.eligibilityCriteriaId,
      ...(!rowData.allowAllDegrees &&
        rowData.allowedDegrees && { allowedDegrees: rowData.allowedDegrees }),
    };
    //convert eligibilityCriteriaId form name if not already
    if (jobRequest.eligibilityCriteriaId === this.jobRequestData?.eligibilityCriteria.name)
      jobRequest.eligibilityCriteriaId = this.jobRequestData?.eligibilityCriteriaId;
    //convert degreeId form name if not already
    if (jobRequest.allowedDegrees) {
      jobRequest.allowedDegrees = this.setDegreeIdFromName(jobRequest.allowedDegrees);
    }
    if (this.mode() === MODE.UPDATE && this.jobRequestData) {
      this.jobService
        .updateJobRequest(this.jobRequestData.jobRequestId, jobRequest)
        .subscribe(res => {
          this.jobRequestData = res.data;
          this.toastService.show(res.message, 'success')
          this.jobService.setMode(MODE.VIEW);
        });
    } else if (this.mode() === MODE.CREATE) {
      this.jobService.createJobRequest(jobRequest).subscribe(res => {
        this.toastService.show(res.message, 'success')
        this.jobRequestData = res.data;
        this.jobService.setMode(MODE.VIEW);
      });
    } else {
      console.log('none');
    }
  }

  setError(errors: Record<string, string>) {
    Object.keys(errors).forEach(key => {
      const formControlForError = this.jobRequestForm.get(key);
      if (formControlForError) {
        formControlForError.setErrors({ server: errors[key] });
        //{name: 'Name already exists'}
      } else {
        const existingErrors = this.jobRequestForm.errors || {};
        this.jobRequestForm.setErrors({ ...existingErrors, key: errors[key] });
      }
    });
    this.jobRequestForm.markAsTouched();
    this.jobRequestForm.markAsDirty();
  }

  isJobType(type: string): type is JobTypeTsType {
    console.log(type);
    return type in JobType;
  }

  isJobRequestStatus(status: string): status is JobRequestStatusType {
    console.log(status);
    return status in JobRequestStatus;
  }

  get titleControl(): FormControl<string> {
    return this.jobRequestForm.get('title') as FormControl<string>;
  }

  get descriptionControl(): FormControl<string> {
    return this.jobRequestForm.get('description') as FormControl<string>;
  }

  get salaryControl(): FormControl<number | null> {
    return this.jobRequestForm.get('salary') as FormControl<number | null>;
  }

  get locationControl(): FormControl<string> {
    return this.jobRequestForm.get('location') as FormControl<string>;
  }

  get jobTypeControl(): FormControl<string> {
    return this.jobRequestForm.get('jobType') as FormControl<string>;
  }

  get statusControl(): FormControl<string> {
    return this.jobRequestForm.get('status') as FormControl<string>;
  }

  get eligibilityCriteriaIdControl(): FormControl<string> {
    return this.jobRequestForm.get('eligibilityCriteriaId') as FormControl<string>;
  }

  get allowAllDegreesControl(): FormControl<boolean> {
    return this.jobRequestForm.get('allowAllDegrees') as FormControl<boolean>;
  }

  get allowedDegreesControl(): FormControl<string[] | null> {
    return this.jobRequestForm.get('allowedDegrees') as FormControl<string[] | null>;
  }

  get showAllowedDegrees() {
    if (!this.jobRequestForm.touched) return false;
    if (this.jobRequestForm.getError('allowedDegrees')) return true;

    const control = this.allowAllDegreesControl;
    return control && control.invalid && (control.dirty || control.touched);
  }
}
