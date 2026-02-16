/**
 * services/placement.service.ts
 */

import { PlacementDrive, Application, StudentProfile, ApplicationStatus } from '../domain/models';
import { RuleEvaluator } from '../engines/rule-engine/evaluator';
import { ScoringEngine } from '../engines/scoring-engine/evaluator';
import { ScreeningEngine } from '../engines/screening-engine/evaluator';
import { GovernanceService } from './governance.service';

export class PlacementService {
    private drives: PlacementDrive[] = [];
    private applications: Application[] = [];
    private governance = new GovernanceService();

    constructor() {
        this.loadFromStorage();
    }

    private saveToStorage(): void {
        localStorage.setItem('elite_drives', JSON.stringify(this.drives));
        localStorage.setItem('elite_applications', JSON.stringify(this.applications));
    }

    private loadFromStorage(): void {
        const d = localStorage.getItem('elite_drives');
        const a = localStorage.getItem('elite_applications');
        if (d) this.drives = JSON.parse(d);
        if (a) this.applications = JSON.parse(a);
    }

    createDrive(drive: PlacementDrive): PlacementDrive {
        const newDrive = { ...drive, version: drive.version || 1, isFrozen: false };
        this.drives.push(newDrive);
        this.governance.logAction('SYSTEM', 'DRIVE_CREATED', newDrive.id, { title: newDrive.roleTitle });
        this.saveToStorage();
        return newDrive;
    }

    applyToDrive(student: StudentProfile, driveId: string, screeningResponses: Record<string, any> = {}): Application {
        const drive = this.drives.find(d => d.id === driveId);
        if (!drive) throw new Error('Drive not found');

        // SECTION 1: Rule Evaluation (Eligibility)
        const evaluation = RuleEvaluator.evaluate(student, drive.eligibilityRules);

        // SECTION 3: Pre-Screening Evaluation
        const screeningResult = drive.screeningQuestions
            ? ScreeningEngine.evaluate(drive.screeningQuestions, screeningResponses)
            : { passed: true, explanations: [] };

        // SECTION 1: Weighted Scoring
        const scoring = drive.scoringWeights
            ? ScoringEngine.calculate(student, drive.scoringWeights)
            : { compositeScore: 0, breakdown: [] };

        let status = ApplicationStatus.ELIGIBLE;
        if (!evaluation.isEligible) status = ApplicationStatus.NOT_ELIGIBLE;
        else if (!screeningResult.passed) status = ApplicationStatus.REJECTED;

        const application: Application = {
            id: `APP_${Math.random().toString(36).substr(2, 9)}`,
            studentId: student.id,
            driveId: driveId,
            currentStatus: status,

            // Explanations (Unified)
            eligibilityExplanation: evaluation.evaluations,
            scoringExplanation: scoring.breakdown,
            screeningExplanation: screeningResult.explanations,

            compositeScore: scoring.compositeScore,
            screeningResponses,
            roundProgress: drive.selectionRounds.map(r => ({
                roundId: r.id,
                status: 'PENDING',
                feedback: ''
            })),

            // SECTION 9: Governance
            versionAppliedTo: drive.version
        };

        this.applications.push(application);
        this.governance.logAction(student.id, 'APPLICATION_SUBMITTED', application.id, { status });
        this.saveToStorage();

        // SECTION 8: Mock Notification
        this.notify(student.id, `Application status: ${status}. Score: ${scoring.compositeScore.toFixed(0)}%`);

        return application;
    }

    private notify(userId: string, message: string) {
        console.log(`[NOTIFICATION] To ${userId}: ${message}`);
    }

    getEligibleStudents(driveId: string): Application[] {
        return this.applications.filter(app =>
            app.driveId === driveId && app.currentStatus === ApplicationStatus.ELIGIBLE
        );
    }

    shortlistCandidates(driveId: string, studentIds: string[]): void {
        this.applications.forEach(app => {
            if (app.driveId === driveId && studentIds.includes(app.studentId)) {
                app.currentStatus = ApplicationStatus.SHORTLISTED;
                this.governance.logAction('RECRUITER', 'SHORTLIST_ADD', app.id, {});
            }
        });
        this.saveToStorage();
    }

    updateRoundStatus(applicationId: string, roundId: string, status: 'PASSED' | 'FAILED', feedback: string): void {
        const application = this.applications.find(app => app.id === applicationId);
        if (!application) throw new Error('Application not found');

        const round = application.roundProgress.find(r => r.roundId === roundId);
        if (!round) throw new Error('Round not found in application');

        round.status = status;
        round.feedback = feedback;

        if (status === 'FAILED') {
            application.currentStatus = ApplicationStatus.REJECTED;
        } else {
            const allPassed = application.roundProgress.every(r => r.status === 'PASSED');
            if (allPassed) {
                application.currentStatus = ApplicationStatus.SELECTED;
            }
        }

        this.governance.logAction('RECRUITER', 'ROUND_UPDATE', applicationId, { roundId, status });
        this.saveToStorage();
    }

    getDrive(driveId: string): PlacementDrive | undefined {
        return this.drives.find(d => d.id === driveId);
    }

    getApplicationsForDrive(driveId: string): Application[] {
        return this.applications.filter(app => app.driveId === driveId);
    }

    getApplicationById(id: string): Application | undefined {
        return this.applications.find(app => app.id === id);
    }

    getGovernance(): GovernanceService {
        return this.governance;
    }
}
