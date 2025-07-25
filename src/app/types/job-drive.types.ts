export type JobDrive = {
  jobDriveId: string;
  recruiter: {
    recruiterId: string;
    companyName: string;
  };
  status: JobDriveStatus;
  driveDate: Date;
  createdAt: Date;
  selectionRoundIds: string[];

  placementCell: {
    placementCellId: string;
    placementCellName: string;
  };

  jobRequest: {
    jobRequestId: string;
    title: string;
    eligibilityCriteriaId: string;
  };
};

export enum JobDriveStatus {
  PLANNED = 'planned',
  ONGOING = 'ongoing',
  PAUSED = 'paused',
  CANCELED = 'canceled',
  COMPLETED = 'completed',
}

export type JobDriveCreateDto = {
  placementCellId: string;
  jobTargetId: string;
  status?: JobDriveStatus;
  driveDate: Date | null;
};

export type JobDriveUpdateDto = {
  status?: JobDriveStatus;
  driveDate: Date | string;
};
