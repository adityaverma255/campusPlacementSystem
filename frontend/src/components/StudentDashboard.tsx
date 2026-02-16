import { useState, useMemo } from 'react';
import type { StudentProfile, Application } from '../domain/models';
import { mockStudent, mockDrives } from '../mockData';
import { RuleEvaluator } from '../engines/rule-engine/evaluator';
import { PlacementService } from '../services/placement.service';

const StudentDashboard = ({ service }: { service: PlacementService }) => {
    const [profile, setProfile] = useState<StudentProfile>(mockStudent);
    const [activeTab, setActiveTab] = useState<'EXPLORE' | 'MY_APPLICATIONS'>('EXPLORE');
    const [applications, setApplications] = useState<Application[]>([]);
    const [editingProfile, setEditingProfile] = useState(false);

    const handleApply = (driveId: string) => {
        const app = service.applyToDrive(profile, driveId);
        setApplications(prev => [...prev, app]);
        setActiveTab('MY_APPLICATIONS');
    };

    const currentEvaluations = useMemo(() => {
        return mockDrives.reduce((acc, drive) => {
            acc[drive.id] = RuleEvaluator.evaluate(profile, drive.eligibilityRules);
            return acc;
        }, {} as Record<string, any>);
    }, [profile]);

    return (
        <div className="fade-in">
            {/* Profile Ribbon */}
            <div className="glass-card" style={{ marginBottom: '2rem', borderLeft: '4px solid var(--primary)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h3 style={{ marginBottom: '0.25rem' }}>{profile.name} <span style={{ fontWeight: 400, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>({profile.branch})</span></h3>
                        <p style={{ fontSize: '0.85rem' }}>
                            CGPA: <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{profile.cgpa}</span> |
                            Backlogs: <span style={{ color: profile.backlog_count > 0 ? 'var(--error)' : 'var(--success)' }}>{profile.backlog_count}</span>
                        </p>
                    </div>
                    <button className="secondary" onClick={() => setEditingProfile(!editingProfile)}>
                        {editingProfile ? 'Close Editor' : 'Edit Profile'}
                    </button>
                </div>

                {editingProfile && (
                    <div style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1rem' }}>
                        <div>
                            <label style={{ fontSize: '0.75rem', display: 'block', marginBottom: '0.4rem' }}>CGPA</label>
                            <input
                                type="number"
                                step="0.1"
                                value={profile.cgpa}
                                onChange={e => setProfile({ ...profile, cgpa: parseFloat(e.target.value) || 0 })}
                                style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'white', padding: '0.5rem', borderRadius: '4px', width: '100%' }}
                            />
                        </div>
                        <div>
                            <label style={{ fontSize: '0.75rem', display: 'block', marginBottom: '0.4rem' }}>Backlog Count</label>
                            <input
                                type="number"
                                value={profile.backlog_count}
                                onChange={e => setProfile({ ...profile, backlog_count: parseInt(e.target.value) || 0 })}
                                style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'white', padding: '0.5rem', borderRadius: '4px', width: '100%' }}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem', borderBottom: '1px solid var(--glass-border)' }}>
                <div
                    onClick={() => setActiveTab('EXPLORE')}
                    style={{
                        padding: '1rem 0.5rem', borderBottom: activeTab === 'EXPLORE' ? '2px solid var(--primary)' : 'none',
                        cursor: 'pointer', opacity: activeTab === 'EXPLORE' ? 1 : 0.6
                    }}
                >
                    Explore Drives
                </div>
                <div
                    onClick={() => setActiveTab('MY_APPLICATIONS')}
                    style={{
                        padding: '1rem 0.5rem', borderBottom: activeTab === 'MY_APPLICATIONS' ? '2px solid var(--primary)' : 'none',
                        cursor: 'pointer', opacity: activeTab === 'MY_APPLICATIONS' ? 1 : 0.6
                    }}
                >
                    My Applications ({applications.length})
                </div>
            </div>

            {/* Content */}
            {activeTab === 'EXPLORE' ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                    {mockDrives.map(drive => {
                        const evalResult = currentEvaluations[drive.id];
                        const isApplied = applications.some(a => a.driveId === drive.id);

                        return (
                            <div key={drive.id} className="glass-card fade-in" style={{ display: 'flex', flexDirection: 'column' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span className="tag tag-success">Active</span>
                                    <span style={{ color: '#818cf8', fontWeight: 600 }}>{drive.companyId}</span>
                                </div>
                                <h3>{drive.roleTitle}</h3>
                                <p style={{ margin: '0.75rem 0', fontSize: '0.85rem', flexGrow: 1 }}>{drive.description}</p>

                                <div style={{ marginTop: '1rem', padding: '0.75rem', borderRadius: '8px', background: 'rgba(0,0,0,0.15)', fontSize: '0.8rem' }}>
                                    <h4 style={{ color: evalResult.isEligible ? '#4ade80' : '#f87171', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        {evalResult.isEligible ? '✓ Eligible' : '✗ Not Eligible'}
                                    </h4>
                                    {evalResult.evaluations.map((e: any, idx: number) => (
                                        <div key={idx} style={{ marginBottom: '0.25rem', opacity: e.passed ? 0.7 : 1, color: e.passed ? 'white' : '#fca5a5' }}>
                                            {e.passed ? '・' : '×'} {e.explanation}
                                        </div>
                                    ))}
                                </div>

                                <button
                                    disabled={!evalResult.isEligible || isApplied}
                                    onClick={() => handleApply(drive.id)}
                                    style={{ marginTop: '1.25rem', width: '100%', background: isApplied ? 'var(--glass-bg)' : (evalResult.isEligible ? 'var(--success)' : 'var(--glass-bg)') }}
                                >
                                    {isApplied ? 'Application Submitted' : (evalResult.isEligible ? 'Apply Now' : 'Ineligible')}
                                </button>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {applications.length === 0 ? (
                        <div className="glass-card" style={{ textAlign: 'center', padding: '4rem' }}>
                            <p>You haven't applied to any drives yet.</p>
                        </div>
                    ) : (
                        applications.map(app => {
                            const drive = mockDrives.find(d => d.id === app.driveId);
                            return (
                                <div key={app.id} className="glass-card fade-in">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <h4 style={{ color: 'var(--primary)' }}>{drive?.companyId}</h4>
                                            <h3>{drive?.roleTitle}</h3>
                                        </div>
                                        <div className="tag" style={{ background: 'var(--primary)', color: 'white' }}>{app.currentStatus}</div>
                                    </div>

                                    {/* Progress Matrix */}
                                    <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                                        {app.roundProgress.map((round, idx) => (
                                            <div key={round.roundId} style={{ flex: 1, textAlign: 'center' }}>
                                                <div style={{
                                                    height: '4px', background: round.status === 'PASSED' ? 'var(--success)' : (round.status === 'FAILED' ? 'var(--error)' : 'var(--glass-border)'),
                                                    marginBottom: '0.5rem', borderRadius: '2px'
                                                }} />
                                                <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>Round {idx + 1}</span>
                                                <p style={{ fontSize: '0.8rem', fontWeight: 500 }}>{drive?.selectionRounds.find(r => r.id === round.roundId)?.name}</p>

                                                {round.status === 'PENDING' && (
                                                    <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.25rem', justifyContent: 'center' }}>
                                                        <button
                                                            onClick={() => {
                                                                service.updateRoundStatus(app.id, round.roundId, 'PASSED', 'Good job!');
                                                                // Force state refresh for demo
                                                                setApplications(prev => prev.map(a => a.id === app.id ? { ...service.getApplicationById(app.id)! } : a));
                                                            }}
                                                            style={{ padding: '0.2rem 0.4rem', fontSize: '0.6rem', background: 'var(--success)' }}
                                                        >
                                                            ✓
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                service.updateRoundStatus(app.id, round.roundId, 'FAILED', 'Try harder!');
                                                                setApplications(prev => prev.map(a => a.id === app.id ? { ...service.getApplicationById(app.id)! } : a));
                                                            }}
                                                            style={{ padding: '0.2rem 0.4rem', fontSize: '0.6rem', background: 'var(--error)' }}
                                                        >
                                                            ✕
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>
            )}
        </div>
    );
};

export default StudentDashboard;
