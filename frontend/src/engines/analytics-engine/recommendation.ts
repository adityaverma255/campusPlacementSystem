import { StudentProfile, PlacementDrive } from '../../domain/models';

export interface Recommendation {
    driveId: string;
    matchScore: number;
    explanation: string;
}

export class RecommendationEngine {
    /**
     * SECTION 5: Personalized Drive Recommendation
     */
    static recommend(student: StudentProfile, drives: PlacementDrive[]): Recommendation[] {
        return drives.map(drive => {
            const skillOverlap = drive.description.toLowerCase().match(new RegExp(student.skills.join('|'), 'gi'))?.length || 0;
            const matchScore = (skillOverlap / Math.max(student.skills.length, 1)) * 100;

            return {
                driveId: drive.id,
                matchScore: parseFloat(matchScore.toFixed(0)),
                explanation: `Match score of ${matchScore.toFixed(0)}% based on your skills in ${student.skills.join(', ')} overlapping with the job description.`
            };
        }).sort((a, b) => b.matchScore - a.matchScore);
    }
}
