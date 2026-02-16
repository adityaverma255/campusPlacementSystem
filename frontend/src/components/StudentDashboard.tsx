import { useState, useEffect } from 'react';
import { mockStudent, mockDrives } from '../mockData';
import type { StudentProfile, Application } from '../domain/models';
import { PlacementService } from '../services/placement.service';
import { RecommendationEngine, Recommendation } from '../engines/analytics-engine/recommendation';

const StudentDashboard = ({ service }: { service: PlacementService }) => {
    const [profile, setProfile] = useState<StudentProfile>(mockStudent);
    const [activeTab, setActiveTab] = useState<'EXPLORE' | 'MY_APPLICATIONS' | 'RECOMMENDED'>('EXPLORE');
    const [applications, setApplications] = useState<Application[]>([]);
    const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
    const [editingProfile, setEditingProfile] = useState(false);

    useEffect(() => {
        setApplications(service.getApplicationsForDrive('').filter(a => a.studentId === profile.id));
        setRecommendations(RecommendationEngine.recommend(profile, mockDrives));
    }, [profile, service]);

    const handleApply = (driveId: string) => {
        const mockResponses = { 'Q1': 'Yes' };
        const app = service.applyToDrive(profile, driveId, mockResponses);
        setApplications(prev => [...prev, app]);
    };

    return (
        <div className="fade-in">
            <div className="glass-card profile-summary" style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <h1>Welcome, {profile.name}</h1>
                        <p style={{ opacity: 0.8 }}>{profile.branch} • Class of {profile.graduation_year}</p>
                    </div>
                    <button className="secondary" onClick={() => setEditingProfile(!editingProfile)}>
                        {editingProfile ? 'Save Profile' : 'Edit Profile'}
                    </button>
                </div>

                <div className="stats-grid" style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                    <div className="stat-item">
                        <label>CGPA</label>
                        <p>{profile.cgpa}</p>
                    </div>
                    <div className="stat-item">
                        <label>Backlogs</label>
                        <p>{profile.backlog_count}</p>
                    </div>
                    <div className="stat-item">
                        <label>Skills</label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginTop: '0.5rem' }}>
                            {profile.skills.map(s => (
                                <span key={s} className="tag secondary" style={{ fontSize: '0.7rem' }}>{s}</span>
                            ))}
                        </div>
                        {editingProfile && (
                            <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                                <input id="newSkill" placeholder="+ Skill" className="glass-card" style={{ padding: '0.2rem', width: '80px', color: 'white' }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            const val = (e.target as HTMLInputElement).value;
                                            if (val && !profile.skills.includes(val)) {
                                                setProfile({ ...profile, skills: [...profile.skills, val] });
                                                (e.target as HTMLInputElement).value = '';
                                            }
                                        }
                                    }}
                                />
                            </div>
                        )}
                    </div>
                    <div className="stat-item">
                        <label>Apps</label>
                        <p>{applications.length}</p>
                    </div>
                </div>
            </div>

            <div className="tabs" style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                <button className={`tab ${activeTab === 'EXPLORE' ? 'active' : ''}`} onClick={() => setActiveTab('EXPLORE')}>Explore Drives</button>
                <button className={`tab ${activeTab === 'RECOMMENDED' ? 'active' : ''}`} onClick={() => setActiveTab('RECOMMENDED')}>🔥 Elite Recommendations</button>
                <button className={`tab ${activeTab === 'MY_APPLICATIONS' ? 'active' : ''}`} onClick={() => setActiveTab('MY_APPLICATIONS')}>My Applications</button>
            </div>

            {activeTab === 'EXPLORE' && (
                <div className="grid">
                    {mockDrives.map(drive => (
                        <div key={drive.id} className="glass-card drive-card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span className="tag" style={{ border: '1px solid var(--primary)', fontSize: '0.7rem' }}>{drive.companyName}</span>
                            </div>
                            <h3>{drive.roleTitle}</h3>
                            <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                                {drive.requiredSkills.map(s => <span key={s} style={{ fontSize: '0.6rem', opacity: 0.6 }}>#{s}</span>)}
                            </div>
                            <p style={{ margin: '1rem 0', opacity: 0.7, fontSize: '0.85rem' }}>{drive.description}</p>
                            <div style={{ marginTop: '1rem' }}>
                                <button
                                    onClick={() => handleApply(drive.id)}
                                    disabled={applications.some(a => a.driveId === drive.id)}
                                    style={{ width: '100%' }}
                                >
                                    {applications.some(a => a.driveId === drive.id) ? 'Applied' : 'Apply Now'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'RECOMMENDED' && (
                <div className="grid">
                    {recommendations.map(rec => {
                        const drive = mockDrives.find(d => d.id === rec.driveId);
                        return (
                            <div key={rec.driveId} className="glass-card drive-card" style={{ border: '1px solid var(--primary)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <h3>{drive?.roleTitle}</h3>
                                    <span className="tag" style={{ background: 'var(--primary)' }}>{rec.matchScore}% Match</span>
                                </div>
                                <p style={{ fontSize: '0.8rem', opacity: 0.6, marginTop: '0.25rem' }}>@{drive?.companyName}</p>
                                <p style={{ margin: '1rem 0', fontSize: '0.85rem' }}>{rec.explanation}</p>
                                <button onClick={() => handleApply(rec.driveId)} style={{ width: '100%' }}>Quick Apply</button>
                            </div>
                        );
                    })}
                </div>
            )}

            {activeTab === 'MY_APPLICATIONS' && (
                <div className="applications-list" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {applications.length === 0 ? (
                        <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
                            <p>No applications found. Start exploring!</p>
                        </div>
                    ) : (
                        applications.map(app => {
                            const drive = mockDrives.find(d => d.id === app.driveId);
                            return (
                                <div key={app.id} className="glass-card application-card">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <h3 style={{ fontSize: '1.2rem' }}>{drive?.roleTitle}</h3>
                                            <p style={{ opacity: 0.6 }}>{drive?.companyName} • Applied on {new Date().toLocaleDateString()}</p>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div className="tag" style={{ background: 'var(--primary)', color: 'white' }}>{app.currentStatus}</div>
                                            {app.compositeScore && <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>Score: {app.compositeScore.toFixed(1)}%</p>}
                                        </div>
                                    </div>

                                    {app.scoringExplanation && (
                                        <div style={{ marginTop: '1rem', background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px' }}>
                                            <h4 style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>Explorable Scoring Breakdown</h4>
                                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                                {app.scoringExplanation.map((score, i) => (
                                                    <span key={i} className="tag secondary" style={{ fontSize: '0.7rem' }}>
                                                        {score.attribute}: +{score.weightedScore.toFixed(1)}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div style={{ marginTop: '1.5rem' }}>
                                        <h4 style={{ marginBottom: '1rem' }}>Transparency Feed</h4>
                                        <div className="logic-tree">
                                            {app.eligibilityExplanation?.map((res: any, idx: number) => (
                                                <div key={idx} className={`logic-branch ${res.passed ? 'passed' : 'failed'}`}>
                                                    <div className="logic-symbol">{res.passed ? '✓' : '✕'}</div>
                                                    <div className="logic-content">
                                                        <p style={{ fontWeight: 600 }}>{res.field} {res.operator} {res.expectedValue}</p>
                                                        <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>Actual: {res.actualValue} • {res.explanation}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            )}
        </div>
    );
};

export default StudentDashboard;
