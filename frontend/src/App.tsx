import { useState, useMemo } from 'react';
import './App.css';
import './index.css';

import StudentDashboard from './components/StudentDashboard';
import CompanyPortal from './components/CompanyPortal';
import LoginPage from './components/LoginPage';
import { PlacementService } from './services/placement.service';
import { AuthService, User } from './services/auth.service';
import { mockDrives } from './mockData';

function App() {
  const [user, setUser] = useState<User | null>(AuthService.getCurrentUser());

  const service = useMemo(() => {
    const s = new PlacementService();
    // Only seed if empty
    if (s?.getApplicationsForDrive('').length === 0) {
      mockDrives.forEach(d => s.createDrive(d));
    }
    return s;
  }, []);

  const handleLogout = () => {
    AuthService.logout();
    setUser(null);
  };

  if (!user) {
    return <LoginPage onLogin={setUser} />;
  }

  return (
    <div className="app-container">
      <nav className="navbar glass-card">
        <div className="logo">
          <span className="logo-icon">▲</span>
          <span className="logo-text">ELITE PLACEMENTS</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <div className="user-info" style={{ textAlign: 'right' }}>
            <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{user.name}</p>
            <p style={{ fontSize: '0.75rem', opacity: 0.6 }}>{user.role} Portal</p>
          </div>
          <button className="secondary" onClick={handleLogout} style={{ padding: '0.5rem 1rem' }}>
            Logout
          </button>
        </div>
      </nav>

      <main className="main-content">
        {user.role === 'STUDENT' ? (
          <StudentDashboard service={service} />
        ) : (
          <CompanyPortal service={service} />
        )}
      </main>

      <footer className="footer">
        <p>© 2026 Elite Placements • Enterprise Recruitment Solution</p>
      </footer>
    </div>
  );
}

export default App;
