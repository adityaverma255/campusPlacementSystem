export interface User {
    id: string;
    email: string;
    role: 'STUDENT' | 'COMPANY';
    name: string;
}

export class AuthService {
    static login(email: string, role: 'STUDENT' | 'COMPANY'): User {
        const user: User = {
            id: role === 'STUDENT' ? 'STU_001' : 'COMP_001',
            email: email,
            role: role,
            name: role === 'STUDENT' ? 'Alice Smith' : 'TechNova Solutions'
        };
        localStorage.setItem('elite_user', JSON.stringify(user));
        return user;
    }

    static logout(): void {
        localStorage.removeItem('elite_user');
    }

    static getCurrentUser(): User | null {
        const user = localStorage.getItem('elite_user');
        return user ? JSON.parse(user) : null;
    }
}
