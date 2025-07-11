import { computed, inject, Injectable, signal } from '@angular/core';
import { ApiService } from './api.service';
import { BehaviorSubject, Observable, shareReplay, tap } from 'rxjs';
import { ApiResponse } from '../types/api-response.types';
import { JobRequest, JobRequestStats, JobType } from '../types/job-request.types';
import { HttpParams } from '@angular/common/http';
import { MODE } from '../types/common.types';

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

  _mode = signal<MODE>(MODE.VIEW_ALL);
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
    return this.apiService.get<JobRequest>(`job-request/${id}`).pipe(
      tap(res => {
        this.jobRequestSubject$.next(res.data);
      }),
      shareReplay(1)
    );
  }

  setMode(mode: MODE) {
    this._mode.set(mode);
  }
}
