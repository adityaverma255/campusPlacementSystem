import type { StudentProfile, PlacementDrive } from './domain/models';
import { DriveStatus } from './domain/models';

export const mockStudent: StudentProfile = {
    id: 'S101',
    name: 'Alice Smith',
    email: 'alice@example.com',
    cgpa: 8.5,
    branch: 'CSE',
    graduation_year: 2025,
    backlog_count: 0,
    skills: ['React', 'TypeScript', 'Node.js'],
    resume_url: 'http://example.com/alice_cv.pdf'
};

export const mockDrives: PlacementDrive[] = [
    {
        id: 'D001',
        companyId: 'TECH_CORP',
        roleTitle: 'Software Engineer Intern',
        description: 'Join the infrastructure team building scalable cloud solutions.',
        eligibilityRules: [
            { id: 'R1', field: 'cgpa', operator: 'gte', value: 8.0, label: 'Min CGPA' },
            { id: 'R2', field: 'backlog_count', operator: 'eq', value: 0, label: 'Zero Backlogs' }
        ],
        selectionRounds: [
            { id: 'RD1', name: 'Aptitude Test', order: 1 },
            { id: 'RD2', name: 'Technical Interview', order: 2 }
        ],
        status: DriveStatus.OPEN
    },
    {
        id: 'D002',
        companyId: 'NEBULA_AI',
        roleTitle: 'AI Research Assistant',
        description: 'Work on cutting-edge generative models and neural networks.',
        eligibilityRules: [
            { id: 'R3', field: 'cgpa', operator: 'gte', value: 8.5, label: 'Min CGPA' },
            { id: 'R4', field: 'skills', operator: 'contains_any', value: ['Python', 'PyTorch'], label: 'AI Skills' }
        ],
        selectionRounds: [
            { id: 'RD3', name: 'Math Quiz', order: 1 },
            { id: 'RD4', name: 'Research Discussion', order: 2 }
        ],
        status: DriveStatus.OPEN
    }
];
