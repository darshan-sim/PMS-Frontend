import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { map, Observable } from 'rxjs';
import { ApiResponse } from '../types/api-response.types';
import { Branch, Degree, PlacementCellInfoItem } from '../types/common.types';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  private api = inject(ApiService);

  getBranches(): Observable<Branch[]> {
    return this.api.get<Branch[]>('branches').pipe(map(res => res.data));
  }

  getDegrees(): Observable<Degree[]> {
    return this.api.get<Degree[]>('degrees').pipe(map(res => res.data));
  }

  getPlacementCellsList(): Observable<ApiResponse<PlacementCellInfoItem[]>> {
    return this.api.get<PlacementCellInfoItem[]>('placement_cells_list');
  }

  // Method to get detailed placement cell information
  getPlacementCellDetails(id: string): Observable<ApiResponse<PlacementCellInfoItem>> {
    return this.api.get<PlacementCellInfoItem>(`placement_cell_info/${id}`);
  }

  getFormControl<T extends string = string>(form: FormGroup, controlName: T): FormControl {
    return form.get(controlName) as FormControl;
  }
}
