import { Degree } from './common.types';
import { EligibilityCriteria } from './eligibility-criteria.type';

export const JobType = {
  full_time: 'FULL TIME',
  part_time: 'PART TIME',
  internship: 'INTERNSHIP',
};

export const JobRequestStatus = {
  active: 'ACTIVE',
  closed: 'CLOSE',
};

export interface JobRequestStats {
  totalJobRequest: number;
  jobRequestSend: {
    total: number;
    status: {
      status: string;
      count: number;
    }[];
  };
}

export interface JobRequest {
  jobRequestId: string;
  title: string;
  description: string;
  salary: string;
  stipend: string | null;
  location: string;
  jobType: typeof JobType;
  status: typeof JobRequestStatus;
  allowAllDegrees: boolean;
  eligibilityCriteriaId: string;
  eligibilityCriteria: EligibilityCriteria;
  allowedDegrees: Degree[];
}
