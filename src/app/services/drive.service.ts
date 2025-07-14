import { computed, inject, Injectable, signal } from '@angular/core';
import { ApiService } from './api.service';
import { MODE } from '../types/common.types';
import { BehaviorSubject, Observable, shareReplay, tap } from 'rxjs';
import { ApiResponse } from '../types/api-response.types';
import { JobDrive, JobDriveCreateDto, JobDriveUpdateDto } from '../types/job-drive.types';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DriveService {
  private apiService = inject(ApiService);

  private jobDrivesSubject$ = new BehaviorSubject<JobDrive[]>([]);
  jobDrives$ = this.jobDrivesSubject$.asObservable();

  private jobDriveSubject$ = new BehaviorSubject<JobDrive | null>(null);
  jobDrive$ = this.jobDriveSubject$.asObservable();

  private _mode = signal<MODE>(MODE.VIEW_ALL);
  mode = computed(() => this._mode());

  getAllJobDrives(page: number, pageSize: number): Observable<ApiResponse<JobDrive[]>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    return this.apiService.get<JobDrive[]>('job-drive', params).pipe(
      tap(res => this.jobDrivesSubject$.next(res.data)),
      shareReplay(1)
    );
  }

  getJobDriveById(id: string): Observable<ApiResponse<JobDrive>> {
    return this.apiService.get<JobDrive>(`job-drive/${id}`).pipe(
      tap(res => this.jobDriveSubject$.next(res.data)),
      shareReplay(1)
    );
  }

  createJobDrive(jobDrive: JobDriveCreateDto): Observable<ApiResponse<JobDrive>> {
    return this.apiService.post<JobDrive, JobDriveCreateDto>('job-drive', jobDrive).pipe(
      tap(res => this.jobDriveSubject$.next(res.data)),
      shareReplay(1)
    );
  }

  updateJobDrive(id: string, jobDrive: JobDriveUpdateDto): Observable<ApiResponse<JobDrive>> {
    return this.apiService.put<JobDrive, JobDriveUpdateDto>(`job-drive/${id}`, jobDrive).pipe(
      tap(res => this.jobDriveSubject$.next(res.data)),
      shareReplay(1)
    );
  }

  deleteJobDrive(id: string): Observable<ApiResponse<JobDrive>> {
    return this.apiService.delete<JobDrive>(`job-drive/${id}`).pipe(
      tap(() => {
        // Optionally remove from list if you want real-time updates
        const currentList = this.jobDrivesSubject$.value;
        this.jobDrivesSubject$.next(currentList.filter(jd => jd.jobDriveId !== id));
      }),
      shareReplay(1)
    );
  }

  setMode(mode: MODE) {
    this._mode.set(mode);
  }
}
