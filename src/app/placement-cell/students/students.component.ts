import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { StudentService } from '../../services/student.service';
import { Student } from '../../types/student.types';
import { map, Observable, tap } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { RouterLink } from '@angular/router';

type StudentDataSourceType = Pick<
  Student,
  'studentId' | 'enrollmentNumber' | 'degree' | 'fullName' | 'isVerifiedByPlacementCell'
>;

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [
    CommonModule,
    MatPaginatorModule,
    MatTableModule,
    MatCheckboxModule,
    MatSortModule,
    RouterLink,
  ],
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css'],
})
export class StudentsComponent implements OnInit {
  @ViewChild(MatSort) sort?: MatSort;
  private studentService = inject(StudentService);
  private students$ = new Observable<Student[]>();
  length: number = 0;
  pageSize: number = 10;
  page: number = 1;

  studentDataSource: MatTableDataSource<StudentDataSourceType> = new MatTableDataSource();

  displayedColumns = [
    'select',
    'enrollmentNumber',
    'fullName',
    'degree',
    'isVerifiedByPlacementCell',
    'actions',
  ];

  selection = new SelectionModel<StudentDataSourceType>(true, []);

  ngAfterViewInit() {
    if (this.sort) {
      this.studentDataSource.sort = this.sort;
    }
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.studentDataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.studentDataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: StudentDataSourceType): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.enrollmentNumber}`;
  }

  ngOnInit(): void {
    this.getStudentsData();
  }

  getStudentsData() {
    this.students$ = this.studentService.getStudents(this.page, this.pageSize).pipe(
      tap(res => {
        if (res.pagination?.total) this.length = res.pagination?.total;
        if (res.pagination?.pageSize) this.pageSize = res.pagination?.pageSize;
        this.studentDataSource.data = res.data.map(s => ({
          studentId: s.studentId,
          enrollmentNumber: s.enrollmentNumber,
          degree: s.degree,
          fullName: s.fullName,
          isVerifiedByPlacementCell: s.isVerifiedByPlacementCell,
        }));
      }),
      map(res => res.data)
    );
    this.students$.subscribe();
  }

  onPageEvent(e: PageEvent) {
    this.page = e.pageIndex + 1;
    this.selection.clear();
    this.getStudentsData();
  }

  onStudentBatchVerify(isVerifiedByPlacementCell: boolean) {
    if (!this.selection.selected.length) return;
    const studentIds = this.selection.selected.map(student => student.studentId);
    this.studentService
      .batchVerifyStudents({ studentIds, isVerifiedByPlacementCell })
      .subscribe(res => {
        this.selection.clear();
        this.getStudentsData();
      });
  }
}
