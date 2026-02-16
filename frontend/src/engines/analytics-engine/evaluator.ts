import { Application, StudentProfile } from '../../domain/models';

export interface BiasReport {
    attribute: string;
    distribution: Record<string, number>;
    isDisproportionate: boolean;
    recommendation?: string;
}

export class AnalyticsEngine {
    /**
     * SECTION 6: Funnel Intelligence
     */
    static getFunnel(applications: Application[]): Record<string, number> {
        const stats: Record<string, number> = {};
        applications.forEach(app => {
            stats[app.currentStatus] = (stats[app.currentStatus] || 0) + 1;
        });
        return stats;
    }

    /**
     * SECTION 7: Bias Detection (Fairness Monitoring)
     */
    static detectBias(applications: Application[], students: StudentProfile[], attribute: 'branch' | 'graduation_year'): BiasReport {
        const distribution: Record<string, number> = {};
        const rejectionCounts: Record<string, number> = {};

        applications.forEach(app => {
            const student = students.find(s => s.id === app.studentId);
            if (!student) return;

            const attrValue = (student as any)[attribute];
            distribution[attrValue] = (distribution[attrValue] || 0) + 1;

            if (app.currentStatus === 'REJECTED' || app.currentStatus === 'NOT_ELIGIBLE') {
                rejectionCounts[attrValue] = (rejectionCounts[attrValue] || 0) + 1;
            }
        });

        // Simple Disproportionate Impact calculation (if rejection rate for any group > 80%)
        let isDisproportionate = false;
        Object.keys(rejectionCounts).forEach(key => {
            const rate = rejectionCounts[key] / distribution[key];
            if (rate > 0.8 && distribution[key] > 5) isDisproportionate = true;
        });

        return {
            attribute,
            distribution,
            isDisproportionate,
            recommendation: isDisproportionate
                ? `High rejection rate detected for ${attribute}. Review eligibility rules for hidden biases.`
                : `Distribution for ${attribute} appears fair.`
        };
    }
}
