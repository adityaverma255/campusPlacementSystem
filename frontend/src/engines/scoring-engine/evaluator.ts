import { StudentProfile, WeightConfig, ScoreBreakdown } from '../../domain/models';

export class ScoringEngine {
    /**
     * Calculates a weighted composite score for a student based on drive configuration.
     * Generates an explainable breakdown for each attribute.
     */
    static calculate(student: StudentProfile, weights: WeightConfig[]): { compositeScore: number; breakdown: ScoreBreakdown[] } {
        let totalWeightedScore = 0;
        const breakdown: ScoreBreakdown[] = [];

        weights.forEach(config => {
            const rawValue = this.getRawValue(student, config.attribute);
            const normalizedScore = this.normalize(config.attribute, rawValue);
            const weightedScore = normalizedScore * config.weight;

            totalWeightedScore += weightedScore;

            breakdown.push({
                attribute: config.attribute,
                score: normalizedScore,
                weight: config.weight,
                weightedScore: weightedScore,
                explanation: `Value "${rawValue}" for ${config.attribute} contributed ${weightedScore.toFixed(2)} to the total.`
            });
        });

        return {
            compositeScore: totalWeightedScore,
            breakdown: breakdown
        };
    }

    private static getRawValue(student: StudentProfile, attribute: string): any {
        const val = (student as any)[attribute];
        if (attribute === 'skills') return (val as string[]).length;
        return val || 0;
    }

    private static normalize(attribute: string, value: any): number {
        // Simple normalization for hackathon demo
        switch (attribute) {
            case 'cgpa': return (value / 10) * 100; // 0-100
            case 'skills': return Math.min((value / 5) * 100, 100); // Max 5 skills for 100%
            case 'backlog_count': return Math.max(100 - (value * 25), 0); // 0 backlogs = 100, 4+ = 0
            default: return typeof value === 'number' ? value : 0;
        }
    }
}
