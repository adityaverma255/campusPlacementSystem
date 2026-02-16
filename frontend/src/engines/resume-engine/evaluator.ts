export interface ParsedResume {
    skills: string[];
    experienceYears: number;
    confidence: number;
    explanation: string;
}

export class ResumeEngine {
    /**
     * SECTION 2: Resume Intelligence
     * Mocks a resume parsing pipeline.
     */
    static parse(content: string): ParsedResume {
        const skills: string[] = [];
        if (content.toLowerCase().includes('react')) skills.push('React');
        if (content.toLowerCase().includes('typescript')) skills.push('TypeScript');
        if (content.toLowerCase().includes('node')) skills.push('Node.js');
        if (content.toLowerCase().includes('python')) skills.push('Python');

        const confidence = 0.85 + Math.random() * 0.1;

        return {
            skills,
            experienceYears: content.match(/\d+ years/g) ? parseInt(content.match(/\d+/g)![0]) : 0,
            confidence: parseFloat(confidence.toFixed(2)),
            explanation: `Skills ${skills.join(', ')} detected with ${confidence.toFixed(2)} confidence based on keyword mapping.`
        };
    }
}
