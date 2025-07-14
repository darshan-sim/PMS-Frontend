export type EligibilityCriteria = {
  criteriaId: string;
  name: string;
  minCgpa: number | null;
  minBachelorsGpa: number | null;
  minTenthPercentage: number | null;
  minTwelfthPercentage: number | null;
  minDiplomaPercentage: number | null;
  maxBacklogs: number | null;
  maxLiveBacklogs: number | null;
};

export type EligibilityCriteriaSelectionList = Pick<EligibilityCriteria, 'criteriaId' | 'name'>;

export type EligibilityCriteriaCreate = {
  name: string;
  minCgpa?: number;
  minBachelorsGpa?: number;
  minTenthPercentage?: number;
  minTwelfthPercentage?: number;
  minDiplomaPercentage?: number;
  maxBacklogs?: number;
  maxLiveBacklogs?: number;
};
