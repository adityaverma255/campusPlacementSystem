import { useState } from 'react';
import { AuthService } from '../services/auth.service';

const LoginPage = ({ onLogin }: { onLogin: (user: any) => void }) => {
    const [email, setEmail] = useState('');
    const [role, setRole] = useState<'STUDENT' | 'COMPANY'>('STUDENT');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        const user = AuthService.login(email, role);
        onLogin(user);
    };

    return (
        <div className="login-container fade-in" style={{
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--bg-color)'
        }}>
            <div className="glass-card" style={{ width: '400px', padding: '3rem', textAlign: 'center' }}>
                <div className="logo" style={{ marginBottom: '2rem' }}>
                    <span className="logo-icon">▲</span>
                    <span className="logo-text" style={{ fontSize: '1.5rem' }}>ELITE PLACEMENTS</span>
                </div>

                <h2 style={{ marginBottom: '2rem' }}>Welcome Back</h2>

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ textAlign: 'left' }}>
                        <label>Login As</label>
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                            <button
                                type="button"
                                className={role === 'STUDENT' ? 'active' : 'secondary'}
                                onClick={() => setRole('STUDENT')}
                                style={{ flex: 1 }}
                            >
                                Student
                            </button>
                            <button
                                type="button"
                                className={role === 'COMPANY' ? 'active' : 'secondary'}
                                onClick={() => setRole('COMPANY')}
                                style={{ flex: 1 }}
                            >
                                Company
                            </button>
                        </div>
                    </div>

                    <div style={{ textAlign: 'left' }}>
                        <label>Email Address</label>
                        <input
                            type="email"
                            className="glass-card"
                            style={{ width: '100%', marginTop: '0.5rem', padding: '1rem' }}
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" style={{ marginTop: '1rem', padding: '1rem' }}>
                        Sign In to Portal
                    </button>
                </form>

                <p style={{ marginTop: '2rem', fontSize: '0.85rem', opacity: 0.6 }}>
                    Demo Credentials: Any email works.
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
