import type { EligibilityRule, EligibilityResult, RuleEvaluationResult, Operator } from './types';

export class RuleEvaluator {
    static evaluate(profile: any, rules: EligibilityRule[]): EligibilityResult {
        const evaluations: RuleEvaluationResult[] = rules.map(rule => {
            const actualValue = profile[rule.field];
            const passed = this.compare(actualValue, rule.operator, rule.value);

            return {
                ruleId: rule.id,
                field: rule.field,
                operator: rule.operator,
                expectedValue: rule.value,
                actualValue: actualValue,
                passed,
                explanation: this.generateExplanation(rule, actualValue, passed)
            };
        });

        const isEligible = evaluations.every(e => e.passed);

        return {
            isEligible,
            evaluations
        };
    }

    private static compare(actual: any, operator: Operator, expected: any): boolean {
        switch (operator) {
            case 'gte': return actual >= expected;
            case 'lte': return actual <= expected;
            case 'eq': return actual === expected;
            case 'neq': return actual !== expected;
            case 'in': return Array.isArray(expected) && expected.includes(actual);
            case 'contains_all':
                return Array.isArray(actual) && expected.every((val: any) => actual.includes(val));
            case 'contains_any':
                return Array.isArray(actual) && expected.some((val: any) => actual.includes(val));
            default: return false;
        }
    }

    private static generateExplanation(rule: EligibilityRule, actual: any, passed: boolean): string {
        const label = rule.label || rule.field;
        if (passed) {
            return `${label} is ${actual}, which meets the requirement (${rule.operator} ${rule.value})`;
        } else {
            return `${label} is ${actual}, but the requirement is ${rule.operator} ${rule.value}`;
        }
    }
}
