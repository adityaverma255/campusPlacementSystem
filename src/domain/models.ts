/**
 * domain/user/models.ts
 */

export interface StudentProfile {
    id: string;
    name: string;
    email: string;
    cgpa: number;
    branch: string;
    graduation_year: number;
    backlog_count: number;
    skills: string[];
    resume_url: string;
}

/**
 * domain/drive/models.ts
 */
import { EligibilityRule } from '../engines/rule-engine/types';

export enum DriveStatus {
    OPEN = 'OPEN',
    CLOSED = 'CLOSED'
}

export interface SelectionRound {
    id: string;
    name: string; // e.g., "Aptitude Test"
    order: number;
}

export interface PlacementDrive {
    id: string;
    companyId: string;
    roleTitle: string;
    description: string;
    eligibilityRules: EligibilityRule[];
    selectionRounds: SelectionRound[];
    status: DriveStatus;
}

/**
 * domain/application/models.ts
 */
export enum ApplicationStatus {
    APPLIED = 'APPLIED',
    ELIGIBLE = 'ELIGIBLE',
    NOT_ELIGIBLE = 'NOT_ELIGIBLE',
    SHORTLISTED = 'SHORTLISTED',
    REJECTED = 'REJECTED',
    SELECTED = 'SELECTED'
}

export interface RoundStatus {
    roundId: string;
    status: 'PENDING' | 'PASSED' | 'FAILED';
    feedback: string;
}

export interface Application {
    id: string;
    studentId: string;
    driveId: string;
    currentStatus: ApplicationStatus;
    eligibilityExplanation?: any; // Stores the RuleEvaluationResult[]
    roundProgress: RoundStatus[];
}
