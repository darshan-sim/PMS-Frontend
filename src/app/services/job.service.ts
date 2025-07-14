import { computed, inject, Injectable, signal } from '@angular/core';
import { ApiService } from './api.service';
import { BehaviorSubject, Observable, shareReplay, tap } from 'rxjs';
import { ApiResponse } from '../types/api-response.types';
import { JobRequest, JobRequestStats, JobRequestUpdate } from '../types/job-request.types';
import { HttpParams } from '@angular/common/http';
import { MODE } from '../types/common.types';
import {
  JobTarget,
  JobTargetCreateDto,
  JobTargetSingleResponse,
  JobTargetStatusType,
  JobTargetUpdateStatusDto,
} from '../types/job-target.types';

@Injectable({
  providedIn: 'root',
})
export class JobService {
  apiService = inject(ApiService);

  private jobRequestsSubject$ = new BehaviorSubject<JobRequest[]>([]);
  jobRequests$ = this.jobRequestsSubject$.asObservable();

  private jobRequestSubject$ = new BehaviorSubject<JobRequest | null>(null);
  jobRequest$ = this.jobRequestSubject$.asObservable();

  private jobRequestStatsSubject$ = new BehaviorSubject<JobRequestStats | null>(null);
  jobRequestStats$ = this.jobRequestStatsSubject$.asObservable();

  private _mode = signal<MODE>(MODE.VIEW_ALL);
  mode = computed(() => this._mode());

  getAllJobRequest(page: number, pageSize: number): Observable<ApiResponse<JobRequest[]>> {
    const params = new HttpParams();
    params.set('page', page.toString());
    params.set('page-size', pageSize.toString());
    return this.apiService.get<JobRequest[]>('job-request', params).pipe(
      tap(res => this.jobRequestsSubject$.next(res.data)),
      shareReplay(1)
    );
  }

  getJobRequestStats(): Observable<ApiResponse<JobRequestStats>> {
    return this.apiService.get<JobRequestStats>('job-request/stats').pipe(
      tap(res => {
        this.jobRequestStatsSubject$.next(res.data);
      }),
      shareReplay(1)
    );
  }

  getJobRequestById(id: string): Observable<ApiResponse<JobRequest>> {
    console.log({ id });
    return this.apiService.get<JobRequest>(`job-request/${id}`).pipe(
      tap(res => {
        this.jobRequestSubject$.next(res.data);
      }),
      shareReplay(1)
    );
  }

  updateJobRequest(id: string, jobRequest: JobRequestUpdate): Observable<ApiResponse<JobRequest>> {
    return this.apiService.put<JobRequest, JobRequestUpdate>(`job-request/${id}`, jobRequest).pipe(
      tap(res => {
        this.jobRequestSubject$.next(res.data);
      }),
      shareReplay(1)
    );
  }

  createJobRequest(jobRequest: JobRequestUpdate): Observable<ApiResponse<JobRequest>> {
    return this.apiService.post<JobRequest, JobRequestUpdate>(`job-request/`, jobRequest).pipe(
      tap(res => {
        this.jobRequestSubject$.next(res.data);
      }),
      shareReplay(1)
    );
  }

  createJobTarget(
    jobTargetCreateDto: JobTargetCreateDto
  ): Observable<ApiResponse<JobTargetSingleResponse>> {
    return this.apiService
      .post<JobTargetSingleResponse, JobTargetCreateDto>(`job-target/`, jobTargetCreateDto)
      .pipe(shareReplay(1));
  }

  getPostedJobs(filterStatus?: JobTargetStatusType): Observable<ApiResponse<JobTarget[]>> {
    let params = new HttpParams();
    if (filterStatus) {
      params = params.set('status', filterStatus);
    }
    return this.apiService.get<JobTarget[]>(`job-target/`, params).pipe(shareReplay(1));
  }

  updateJobPost(
    id: string,
    jobTargetUpdateStatusDto: JobTargetUpdateStatusDto
  ): Observable<ApiResponse<JobTargetUpdateStatusDto>> {
    return this.apiService
      .put<JobTargetUpdateStatusDto>(`job-target/${id}`, jobTargetUpdateStatusDto)
      .pipe(shareReplay(1));
  }

  setMode(mode: MODE) {
    this._mode.set(mode);
  }
}
