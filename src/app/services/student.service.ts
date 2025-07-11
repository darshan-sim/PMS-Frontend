import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { BatchVerifyStudentsRequest, Student, StudentUpdateRequest } from '../types/student.types';
import { HttpParams } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, shareReplay, tap, throwError } from 'rxjs';
import { ApiResponse } from '../types/api-response.types';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private api = inject(ApiService);

  getStudent(id: string): Observable<ApiResponse<Student>> {
    return this.api.get<Student>(`student/${id}`);
  }

  getStudents(page: number = 1, pageSize: number = 5): Observable<ApiResponse<Student[]>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    return this.api.get<Student[]>('student/placement-cell', params).pipe(shareReplay(1));
  }

  updateStudent(id: string, updateData: StudentUpdateRequest): Observable<ApiResponse<Student>> {
    return this.api.put<Student, StudentUpdateRequest>(`student/${id}`, updateData);
  }

  deleteStudent(id: string): Observable<ApiResponse<null>> {
    return this.api.delete<null>(`student/${id}`);
  }

  batchVerifyStudents(
    data: BatchVerifyStudentsRequest
  ): Observable<ApiResponse<{ count: number }>> {
    return this.api.post<{ count: number }, BatchVerifyStudentsRequest>(
      'student/batch-verify',
      data
    );
  }
}
