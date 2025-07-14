import { Branch, Degree } from './common.types';

export interface PlacementCell {
  branch: Branch;
  placementCellName: string;
  placementCellEmail: string;
  website: string;
  placementCellDegrees: Degree[];
  placementCellDomains: string[];
}

// export type PlacementCellUpdatePayload = { branchId: string, degrees: Degree[] } & Pick<
//   PlacementCell,
//   'placementCellName' | 'placementCellEmail' | 'domains' | 'website'
// >;

export interface PlacementCellUpdateRequest {
  placementCellName?: string;
  placementCellEmail?: string;
  website?: string;
  branchId?: string;
  domains?: string[];
  degrees?: string[];
}

export interface PlacementCellJobRequestStats {
  placementCellId: string;
  placementCellName: string;
  branch: Branch;
  totalStudents: number;
  totalDegrees: number;
  domains: string[];
  degrees: Degree[];
}
