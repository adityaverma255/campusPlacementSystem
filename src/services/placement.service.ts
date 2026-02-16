/**
 * services/placement.service.ts
 */

import { PlacementDrive, Application, StudentProfile, ApplicationStatus } from '../domain/models';
import { RuleEvaluator } from '../engines/rule-engine/evaluator';

export class PlacementService {
    private drives: PlacementDrive[] = [];
    private applications: Application[] = [];

    createDrive(drive: PlacementDrive): PlacementDrive {
        this.drives.push(drive);
        return drive;
    }

    applyToDrive(student: StudentProfile, driveId: string): Application {
        const drive = this.drives.find(d => d.id === driveId);
        if (!drive) throw new Error('Drive not found');

        const evaluation = RuleEvaluator.evaluate(student, drive.eligibilityRules);

        const application: Application = {
            id: `APP_${Math.random().toString(36).substr(2, 9)}`,
            studentId: student.id,
            driveId: driveId,
            currentStatus: evaluation.isEligible ? ApplicationStatus.ELIGIBLE : ApplicationStatus.NOT_ELIGIBLE,
            eligibilityExplanation: evaluation.evaluations,
            roundProgress: drive.selectionRounds.map(r => ({
                roundId: r.id,
                status: 'PENDING',
                feedback: ''
            }))
        };

        this.applications.push(application);
        return application;
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
            }
        });
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
            // Check if all rounds are completed
            const allPassed = application.roundProgress.every(r => r.status === 'PASSED');
            if (allPassed) {
                application.currentStatus = ApplicationStatus.SELECTED;
            }
        }
    }

    getDrive(driveId: string): PlacementDrive | undefined {
        return this.drives.find(d => d.id === driveId);
    }
}
