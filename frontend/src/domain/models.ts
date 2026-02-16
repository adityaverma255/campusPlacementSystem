/**
 * domain/models.ts
 */
import type { EligibilityRule } from '../engines/rule-engine/types';

export interface StudentProfile {
    id: string;
    name: string;
    email: string;
    cgpa: number;
    branch: string;
    graduation_year: number;
    backlog_count: number;
    skills: string[]; // e.g. ["Python", "Java", "React"]
    resume_url: string;
}

export enum DriveStatus {
    OPEN = 'OPEN',
    CLOSED = 'CLOSED'
}

export interface SelectionRound {
    id: string;
    name: string;
    order: number;
    slots?: ScheduleSlot[];
}

export interface WeightConfig {
    attribute: string;
    weight: number; // 0 to 1
}

export interface PreScreeningQuestion {
    id: string;
    text: string;
    type: 'MCQ' | 'BOOL' | 'NUMERIC';
    options?: string[];
    expectedValue: any;
}

export interface ScheduleSlot {
    id: string;
    startTime: string;
    endTime: string;
    isBooked: boolean;
    candidateId?: string;
}

export interface AuditLog {
    id: string;
    timestamp: string;
    actor: string;
    action: string;
    targetId: string;
    metadata: any;
}

export interface PlacementDrive {
    id: string;
    companyId: string;
    companyName: string; // Added
    roleTitle: string;
    description: string;
    requiredSkills: string[]; // Added
    eligibilityRules: EligibilityRule[];
    selectionRounds: SelectionRound[];
    status: DriveStatus;

    scoringWeights?: WeightConfig[];
    screeningQuestions?: PreScreeningQuestion[];

    version: number;
    isFrozen: boolean;
}

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
    scheduledSlotId?: string;
}

export interface ScoreBreakdown {
    attribute: string;
    score: number;
    weight: number;
    weightedScore: number;
    explanation: string;
}

export interface Application {
    id: string;
    studentId: string;
    driveId: string;
    currentStatus: ApplicationStatus;

    eligibilityExplanation?: any;
    scoringExplanation?: ScoreBreakdown[];
    screeningExplanation?: string[];

    roundProgress: RoundStatus[];
    screeningResponses?: Record<string, any>;
    compositeScore?: number;

    versionAppliedTo: number;
}
