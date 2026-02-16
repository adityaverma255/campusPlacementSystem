import { StudentProfile, PlacementDrive, DriveStatus } from './domain/models';

export const mockStudent: StudentProfile = {
    id: 'STU_001',
    name: 'Alice Smith',
    email: 'alice.smith@university.edu',
    cgpa: 9.2,
    branch: 'Computer Science',
    graduation_year: 2024,
    backlog_count: 0,
    skills: ['Python', 'React', 'TypeScript', 'Node.js'],
    resume_url: 'https://university.edu/resumes/alice_smith.pdf'
};

export const mockDrives: PlacementDrive[] = [
    {
        id: 'DRIVE_001',
        companyId: 'COMP_001',
        companyName: 'TechNova Solutions',
        roleTitle: 'Software Development Engineer (SDE-1)',
        description: 'Design and develop scalable web applications using modern stacks.',
        requiredSkills: ['React', 'TypeScript', 'Node.js'],
        eligibilityRules: [
            { id: 'R1', field: 'cgpa', operator: 'gte', value: 7.5, label: 'Min CGPA' },
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
        companyName: 'DataSphere AI',
        roleTitle: 'Data Engineer Intern',
        description: 'Build robust data pipelines and optimize ETL processes.',
        requiredSkills: ['Python', 'SQL', 'Spark'],
        eligibilityRules: [
            { id: 'R3', field: 'cgpa', operator: 'gte', value: 8.5, label: 'High CGPA' },
            { id: 'R4', field: 'skills', operator: 'contains_any', value: ['Python', 'SQL'], label: 'Core Skills' }
        ],
        selectionRounds: [
            { id: 'Round_1', name: 'Coding Challenge', order: 1 },
            { id: 'Round_2', name: 'Systems Interview', order: 2 }
        ],
        status: DriveStatus.OPEN,
        version: 1,
        isFrozen: false
    }
];
