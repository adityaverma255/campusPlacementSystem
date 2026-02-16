import { PreScreeningQuestion } from '../../domain/models';

export interface ScreeningResult {
    passed: boolean;
    explanations: string[];
}

export class ScreeningEngine {
    /**
     * Evaluates candidate responses against drive's pre-screening questions.
     */
    static evaluate(questions: PreScreeningQuestion[], responses: Record<string, any>): ScreeningResult {
        let passed = true;
        const explanations: string[] = [];

        questions.forEach(q => {
            const answer = responses[q.id];
            const isMatch = answer === q.expectedValue;

            if (!isMatch) {
                passed = false;
                explanations.push(`Failed on question "${q.text}". Expected "${q.expectedValue}" but got "${answer}".`);
            } else {
                explanations.push(`Met requirements for "${q.text}".`);
            }
        });

        return { passed, explanations };
    }
}
