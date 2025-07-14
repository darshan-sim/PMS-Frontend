import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { DriveService } from '../../../services/drive.service';

@Component({
  selector: 'app-drive-view',
  imports: [
    CommonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
  ],
  templateUrl: './drive-view.component.html',
  styleUrl: './drive-view.component.css',
})
export class DriveViewComponent {
  private driveService = inject(DriveService);

  jobDrive$ = this.driveService.jobDrive$;

  editMode = false;

  updatedDriveDate() {
    throw new Error('Method not implemented.');
  }

  toggleEditMode(currentDate: Date) {
    this.editMode = true;
  }

  cancelEdit() {
    this.editMode = false;
    // this.updatedDriveDate = null;
  }
}
