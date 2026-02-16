import { useState, useMemo } from 'react';
import './App.css';
import './index.css';

import StudentDashboard from './components/StudentDashboard';
import CompanyPortal from './components/CompanyPortal';
import { PlacementService } from './services/placement.service';
import { mockDrives } from './mockData';

function App() {
  const [role, setRole] = useState<'STUDENT' | 'COMPANY'>('STUDENT');

  const service = useMemo(() => {
    const s = new PlacementService();
    mockDrives.forEach(d => s.createDrive(d));
    return s;
  }, []);

  return (
    <div className="app-container">
      <nav className="navbar glass-card">
        <div className="logo">
          <span className="logo-icon">▲</span>
          <span className="logo-text">ELITE PLACEMENTS</span>
        </div>

        <div className="role-switcher">
          <button
            className={role === 'STUDENT' ? 'active' : ''}
            onClick={() => setRole('STUDENT')}
          >
            Student View
          </button>
          <button
            className={role === 'COMPANY' ? 'active' : ''}
            onClick={() => setRole('COMPANY')}
          >
            Company Portal
          </button>
        </div>
      </nav>

      <main className="main-content">
        {role === 'STUDENT' ? (
          <StudentDashboard service={service} />
        ) : (
          <CompanyPortal service={service} />
        )}
      </main>

      <footer className="footer">
        <p>© 2026 Elite Placements • All-in-One Recruitment Solution</p>
      </footer>
    </div>
  );
}

export default App;
