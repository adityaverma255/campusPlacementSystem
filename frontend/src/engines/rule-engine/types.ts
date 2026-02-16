export type Operator = 'gte' | 'lte' | 'eq' | 'neq' | 'in' | 'contains_all' | 'contains_any';

export interface EligibilityRule {
    id: string;
    field: string;
    operator: Operator;
    value: any;
    label?: string; // e.g., "Minimum CGPA"
}

export interface RuleEvaluationResult {
    ruleId: string;
    field: string;
    operator: Operator;
    expectedValue: any;
    actualValue: any;
    passed: boolean;
    explanation: string;
}

export interface EligibilityResult {
    isEligible: boolean;
    evaluations: RuleEvaluationResult[];
}
