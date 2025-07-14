export enum JobTargetStatus {
  pending = 'pending',
  approved = 'approved',
  rejected = 'rejected',
}
export interface JobTargetCreateDto {
  placementCellId: string;
  jobRequestId: string;
}

export interface JobTargetCreateBatchDto {
  placementCellIds: string[];
  jobRequestId: string;
}

export interface JobTargetUpdateStatusDto {
  status: JobTargetStatus;
}

export interface JobTargetListResponse {
  data: JobTargetListResponse[];
  message: string;
  success: boolean;
}

export interface JobTargetSingleResponse {
  data: JobTargetListResponse;
  message: string;
  success: boolean;
}

export interface JobTarget {
  jobTargetId: string;
  status: JobTargetStatus;
  createdAt: string | null;

  placementCell: {
    placementCellId: string;
    placementCellName: string;
  };

  recruiter: {
    recruiterId: string;
    companyName: string;
  };

  jobRequest: {
    jobRequestId: string;
    title: string;
  };
}
