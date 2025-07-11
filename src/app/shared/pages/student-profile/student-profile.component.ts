import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { SharedInputComponent } from '../../components/shared-input/shared-input.component';
import { ValidationErrorsComponent } from '../../components/validation-errors/validation-errors.component';
import { DropdownAutocompleteComponentComponent } from '../../components/dropdown-autocomplete/dropdown-autocomplete.component';
import {
  Component,
  inject,
  input,
  OnChanges,
  OnInit,
  resource,
  signal,
  ViewChild,
} from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { StudentService } from '../../../services/student.service';
import { ToastService } from '../../../services/toast.service';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Student, StudentUpdateRequest } from '../../../types/student.types';
import { ToastComponent } from '../../components/toast/toast.component';
import { defaultValidationMessages } from '../../../types/validation.types';
import { AuthService } from '../../../services/auth.service';
import { CommonService } from '../../../services/common.service';
import { SelectOption } from '../../../types/common.types';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedInputComponent,
    ValidationErrorsComponent,
    DropdownAutocompleteComponentComponent,
    ToastComponent,
    MatSlideToggleModule,
    MatDividerModule,
  ],
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.css'],
})
export class StudentProfileComponent implements OnInit {
  readonly studentId = input.required<string>();
  private studentService = inject(StudentService);
  private toastService = inject(ToastService);
  private authService = inject(AuthService);
  private commonService = inject(CommonService);
  private studentData: Student | null = null;
  private router = inject(Router);

  validationMessages = {
    ...defaultValidationMessages,
    diplomaOrTwelfthPercentage: 'Either add diploma or twelfth percentage(most recent one)',
  };
  isEditMode = signal<boolean>(true);

  placementDegree$ = new Observable<SelectOption<string>[]>();

  @ViewChild('twelfthPercentageInput')
  twelfthPercentageInputComponent!: SharedInputComponent;
  @ViewChild('diplomaPercentageInput')
  diplomaPercentageInputComponent!: SharedInputComponent;

  studentProfileForm = new FormGroup(
    {
      // Basic student fields
      fullName: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.maxLength(255)],
      }),
      cgpa: new FormControl<number | null>(null, {
        validators: [Validators.min(0), Validators.max(10), Validators.required],
      }),
      bachelorsGpa: new FormControl<number | null>(null, {
        validators: [Validators.min(0), Validators.max(10), Validators.required],
      }),
      tenthPercentage: new FormControl<number | null>(null, {
        validators: [Validators.min(0), Validators.max(100), Validators.required],
      }),
      twelfthPercentage: new FormControl<number | null>(null, {
        validators: [Validators.min(0), Validators.max(100)],
      }),
      diplomaPercentage: new FormControl<number | null>(null, {
        validators: [Validators.min(0), Validators.max(100)],
      }),
      backlogs: new FormControl<number | null>(null, {
        validators: [Validators.min(0), Validators.required],
      }),
      liveBacklogs: new FormControl<number | null>(null, {
        validators: [Validators.min(0), Validators.required],
      }),
      enrollmentNumber: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.maxLength(50)],
      }),
      placementStatus: new FormControl<boolean>(false, {
        nonNullable: true,
      }),
      isVerifiedByPlacementCell: new FormControl(false, {
        nonNullable: true,
      }),
      degreeId: new FormControl('', {
        nonNullable: true,
      }),
      placementCellName: new FormControl(
        { value: '', disabled: true },
        {
          nonNullable: true,
        }
      ),
    },
    {
      validators: this.diplomaOrTwelfthPercentage('diplomaPercentage', 'twelfthPercentage'),
    }
  );

  diplomaOrTwelfthPercentage(diplomaControl: string, twelfthControl: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const diplomaPercentage = control.get(diplomaControl)?.value;
      const twelfthPercentage = control.get(twelfthControl)?.value;
      if ((diplomaPercentage && twelfthPercentage) || (!diplomaPercentage && !twelfthPercentage)) {
        return { InvalidDiplomaOrTwelfthPercentage: true };
      }
      return null;
    };
  }

  canEdit(field: string) {
    if (!this.isEditMode()) return false;
    const role = this.authService.currentUser()?.role;
    if (role === 'placement_cell') return true;
    if (role === 'recruiter') return false;
    if (field === 'twelfthPercentage' && this.diplomaPercentageControl.value) return false;
    if (field === 'diplomaPercentage' && this.twelfthPercentageControl.value) return false;
    if (this.studentData?.isVerifiedByPlacementCell) return false;
    const allowedEditFieldsByStudent = [
      'fullName',
      'cgpa',
      'bachelorsGpa',
      'tenthPercentage',
      'twelfthPercentage',
      'diplomaPercentage',
      'backlogs',
      'liveBacklogs',
    ];
    return allowedEditFieldsByStudent.indexOf(field) >= 0;
  }

  ngOnInit(): void {
    // Initialize the form
    this.initializeForm();
    this.isEditMode.set(false);
    this.twelfthPercentageControl.valueChanges.subscribe(val => {
      if (!this.isEditMode()) {
        this.diplomaPercentageInputComponent.readonly = true;
        return;
      }
      if (val && this.diplomaPercentageControl.enabled) {
        this.diplomaPercentageControl.disable({ emitEvent: false });
        this.diplomaPercentageControl.setValue(null, { emitEvent: false });
        this.diplomaPercentageInputComponent.readonly = true;
      } else if (!val) {
        this.diplomaPercentageControl.enable({ emitEvent: false });
        this.diplomaPercentageInputComponent.readonly = false;
      }
    });
    this.diplomaPercentageControl.valueChanges.subscribe(val => {
      if (!this.isEditMode()) {
        this.twelfthPercentageInputComponent.readonly = true;
        return;
      }
      if (val && this.diplomaPercentageControl.disabled) {
        this.twelfthPercentageControl.disable({ emitEvent: false });
        this.twelfthPercentageControl.setValue(null, { emitEvent: false });
      } else if (!val) {
        this.twelfthPercentageControl.enable({ emitEvent: false });
        this.twelfthPercentageInputComponent.readonly = false;
      }
    });
  }

  private initializeForm(): void {
    this.studentService
      .getStudent(this.studentId())
      .pipe(
        catchError(error =>
          throwError(() => {
            if (error.status === 404) {
              this.router.navigate(['404']);
            }
          })
        )
      )
      .subscribe(response => {
        this.studentData = response.data;
        this.resetForm();
      });
  }

  private resetForm() {
    const student = this.studentData;
    if (!student) {
      return;
    }
    const studentFormData = {
      fullName: student.fullName,
      cgpa: student.cgpa,
      bachelorsGpa: student.bachelorsGpa,
      tenthPercentage: student.tenthPercentage,
      twelfthPercentage: student.twelfthPercentage,
      diplomaPercentage: student.diplomaPercentage,
      backlogs: student.backlogs,
      liveBacklogs: student.liveBacklogs,
      enrollmentNumber: student.enrollmentNumber,
      placementStatus: student.placementStatus,
      isVerifiedByPlacementCell: student.isVerifiedByPlacementCell,
      degreeId: student.degree.name,
      placementCellId: student.placement_cell.placementCellId,
      placementCellName: student.placement_cell.placementCellName,
    };
    this.studentProfileForm.patchValue(studentFormData);
    this.placementDegree$ = this.commonService
      .getPlacementCellDetails(student.placement_cell.placementCellId)
      .pipe(
        catchError(error => throwError(() => error)),
        map(response => {
          const placementCell = response.data;
          return placementCell.placementCellDegrees.map(degree => ({
            value: degree.degreeId,
            label: degree.name,
            select: student.degree.degreeId === degree.degreeId,
          }));
        })
      );
  }

  onEdit(): void {
    if (
      this.authService.currentUser()?.role !== 'placement_cell' &&
      this.studentData?.isVerifiedByPlacementCell
    ) {
      return;
    }
    this.isEditMode.set(true);
    this.toastService.show('Edit mode enabled', 'info');
  }

  /**
   * Cancels any edits and reverts form to its last‐loaded state.
   */
  onCancel(): void {
    this.resetForm();
    this.isEditMode.set(false);
    this.toastService.show('Edit cancelled', 'warning');
  }

  onSubmit(): void {
    if (this.studentProfileForm.invalid) {
      this.toastService.show('Please fill all required fields correctly', 'error');
      return;
    }
    if (!this.studentProfileForm.touched) {
      this.toastService.show(`You haven't made any changes`, 'warning');
      return;
    }
    const role = this.authService.currentUser()?.role;
    if (!role) {
      return;
    }
    const formValue = this.studentProfileForm.getRawValue();
    if (formValue.degreeId === this.studentData?.degree.name) {
      formValue.degreeId = this.studentData.degree.degreeId;
    }
    const studentUpdateRequest: StudentUpdateRequest = {
      fullName: formValue.fullName,
      ...(role === 'placement_cell' && { enrollmentNumber: formValue.enrollmentNumber }),
      ...(formValue.cgpa && { cgpa: +formValue.cgpa }),
      ...(formValue.bachelorsGpa && { bachelorsGpa: +formValue.bachelorsGpa }),
      ...(formValue.tenthPercentage && { tenthPercentage: +formValue.tenthPercentage }),
      ...(formValue.twelfthPercentage && { twelfthPercentage: +formValue.twelfthPercentage }),
      ...(formValue.diplomaPercentage && { diplomaPercentage: +formValue.diplomaPercentage }),
      ...(formValue.backlogs && { backlogs: +formValue.backlogs }),
      ...(formValue.liveBacklogs && { liveBacklogs: +formValue.liveBacklogs }),
      placementStatus: formValue.placementStatus,
      isVerifiedByPlacementCell: formValue.isVerifiedByPlacementCell,
      ...(formValue.degreeId && { degreeId: formValue.degreeId }),
    };
    this.studentService
      .updateStudent(this.studentId(), studentUpdateRequest)
      .pipe(catchError(error => throwError(() => console.log(error))))
      .subscribe({
        next: response => {
          this.studentData = response.data;
          this.resetForm();
          this.isEditMode.set(false);
          this.toastService.show(response.message, 'success');
        },
        error: error => {
          console.log(error);
        },
      });
  }

  onDegreeSelected(degreeId: string): void {
    // Find by strict comparison
    this.degreeControl.setValue(degreeId);
  }

  // // Form control getters
  get fullNameControl() {
    return this.studentProfileForm.controls['fullName'];
  }

  get enrollmentNumberControl() {
    return this.studentProfileForm.controls['enrollmentNumber'];
  }

  get cgpaControl() {
    return this.studentProfileForm.controls['cgpa'];
  }

  get bachelorsGpaControl() {
    return this.studentProfileForm.controls['bachelorsGpa'];
  }

  get tenthPercentageControl() {
    return this.studentProfileForm.controls['tenthPercentage'];
  }

  get twelfthPercentageControl() {
    return this.studentProfileForm.controls['twelfthPercentage'];
  }

  get diplomaPercentageControl() {
    return this.studentProfileForm.controls['diplomaPercentage'];
  }

  get backlogsControl() {
    return this.studentProfileForm.controls['backlogs'];
  }

  get liveBacklogsControl() {
    return this.studentProfileForm.controls['liveBacklogs'];
  }

  get placementStatusControl() {
    return this.studentProfileForm.controls['placementStatus'];
  }

  get isVerifiedByPlacementCellControl() {
    return this.studentProfileForm.controls['isVerifiedByPlacementCell'];
  }

  get degreeControl() {
    return this.studentProfileForm.controls['degreeId'];
  }

  get studentDegree() {
    return this.studentData?.degree.degreeId ?? null;
  }

  get diplomaOrTwelfthPercentageError() {
    return this.studentProfileForm.hasError('InvalidDiplomaOrTwelfthPercentage');
  }

  get placementStatusValue() {
    return this.placementStatusControl.value;
  }

  get allowEditProfile() {
    return (
      this.authService.currentUser()?.role === 'placement_cell' ||
      !this.studentData?.isVerifiedByPlacementCell
    );
  }
}
