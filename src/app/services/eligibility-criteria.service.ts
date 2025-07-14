import { computed, inject, Injectable, signal } from '@angular/core';
import { EligibilityCriteria, EligibilityCriteriaCreate, EligibilityCriteriaSelectionList } from '../types/eligibility-criteria.type';
import { Observable } from 'rxjs';
import { ApiResponse } from '../types/api-response.types';
import { ApiService } from './api.service';
import { MODE } from '../types/common.types';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class EligibilityCriteriaService {
  apiService = inject(ApiService);
  private _mode = signal<MODE>(MODE.VIEW_ALL);
  private _selectedCriteriaId = signal<string | null>(null);
  mode = computed(() => this._mode());
  selectedCriteriaId = computed(() => this._selectedCriteriaId());

  getAllEligibilityCriteria(
    page: number,
    pageSize: number
  ): Observable<ApiResponse<EligibilityCriteria[]>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    return this.apiService.get<EligibilityCriteria[]>('eligibility-criteria', params);
  }

  getAllEligibilityCriteriaSelectionList(): Observable<
    ApiResponse<EligibilityCriteriaSelectionList[]>
  > {
    return this.apiService.get<EligibilityCriteria[]>('eligibility-criteria/selection-list');
  }

  create(
    eligibilityCriteria: EligibilityCriteriaCreate
  ): Observable<ApiResponse<EligibilityCriteria>> {
    return this.apiService.post<EligibilityCriteria, EligibilityCriteriaCreate>(
      'eligibility-criteria',
      eligibilityCriteria
    );
  }

  update(
    eligibilityCriteria: EligibilityCriteriaCreate
  ): Observable<ApiResponse<EligibilityCriteria>> {
    return this.apiService.put<EligibilityCriteria, EligibilityCriteriaCreate>(
      `eligibility-criteria/${this._selectedCriteriaId()}`,
      eligibilityCriteria
    );
  }

  delete(id: string): Observable<ApiResponse<null>> {
    return this.apiService.delete<null>(`eligibility-criteria/${id}`);
  }

  getEligibilityCriteriaById(id: string): Observable<ApiResponse<EligibilityCriteria>> {
    return this.apiService.get<EligibilityCriteria>(`eligibility-criteria/${id}`);
  }

  setMode(mode: MODE) {
    this._mode.set(mode);
  }

  setSelectedCriteriaId(id: string | null) {
    this._selectedCriteriaId.set(id);
  }
}
