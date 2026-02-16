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
            { id: 'Round_1', name: 'Aptitude Test', order: 1 },
            { id: 'Round_2', name: 'Technical Interview', order: 2 }
        ],
        status: DriveStatus.OPEN,
        version: 1,
        isFrozen: false
    },
    {
        id: 'DRIVE_002',
        companyId: 'COMP_002',
        roleTitle: 'Product Manager Intern',
        description: 'Driving product strategy and user research for our core mobile app.',
        eligibilityRules: [
            { id: 'R3', field: 'cgpa', operator: 'gte', value: 8.5, label: 'High CGPA' },
            { id: 'R4', field: 'skills', operator: 'contains_any', value: ['Product Management', 'SQL'], label: 'PM Skills' }
        ],
        selectionRounds: [
            { id: 'Round_1', name: 'Case Study', order: 1 },
            { id: 'Round_2', name: 'HR Interview', order: 2 }
        ],
        status: DriveStatus.OPEN,
        version: 1,
        isFrozen: false
    }
];
