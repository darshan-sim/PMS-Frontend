import { Degree } from './common.types';
import { EligibilityCriteria } from './eligibility-criteria.type';

export const JobType = {
  full_time: 'FULL TIME',
  part_time: 'PART TIME',
  internship: 'INTERNSHIP',
} as const;

export const JobRequestStatus = {
  active: 'ACTIVE',
  closed: 'CLOSE',
} as const;

export type JobTypeTsType = keyof typeof JobType;
export type JobRequestStatusType = keyof typeof JobRequestStatus;

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
  salary: number;
  stipend?: string | null;
  location: string;
  jobType: JobTypeTsType;
  status: JobRequestStatusType;
  allowAllDegrees: boolean;
  eligibilityCriteriaId: string;
  eligibilityCriteria: EligibilityCriteria;
  allowedDegrees?: Degree[];
}
export interface JobRequestUpdate {
  title: string;
  description: string;
  salary: number;
  stipend?: number | null;
  location: string;
  jobType: JobTypeTsType;
  status: JobRequestStatusType;
  allowAllDegrees: boolean;
  eligibilityCriteriaId: string;
  allowedDegrees?: string[];
}
