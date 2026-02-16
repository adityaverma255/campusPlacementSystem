import { useState, useMemo } from 'react';
import { mockStudent } from '../mockData';
import type { PlacementDrive } from '../domain/models';
import { DriveStatus } from '../domain/models';
import { PlacementService } from '../services/placement.service';
import { AnalyticsEngine } from '../engines/analytics-engine/evaluator';

const CompanyPortal = ({ service }: { service: PlacementService }) => {
    // Load existing drives from service instead of just mock
    const [drives, setDrives] = useState<PlacementDrive[]>(service.getApplicationsForDrive('').length > 0 ? [] : []);
    const [isCreating, setIsCreating] = useState(false);
    const [activeDriveId, setActiveDriveId] = useState<string | null>(null);
    const [showLogs, setShowLogs] = useState(false);

    // Initial load workaround for demo
    useMemo(() => {
        // This is a hack for the demo to show existing drives in the portal state
        setDrives(service.getApplicationsForDrive('').map(a => service.getDrive(a.driveId)!).filter((v, i, a) => v && a.findIndex(t => (t.id === v.id)) === i));
    }, [service]);

    const [newDrive, setNewDrive] = useState<Partial<PlacementDrive>>({
        companyId: 'COMP_001',
        companyName: 'TechNova Solutions',
        roleTitle: '',
        description: '',
        requiredSkills: [],
        eligibilityRules: [],
        scoringWeights: [
            { attribute: 'cgpa', weight: 0.6 },
            { attribute: 'skills', weight: 0.4 }
        ],
        selectionRounds: [
            { id: 'Round_1', name: 'Aptitude', order: 1 },
            { id: 'Round_2', name: 'Technical', order: 2 }
        ],
        status: DriveStatus.OPEN,
        version: 1,
        isFrozen: false
    });

    const handleCreate = () => {
        const drive = { ...newDrive, id: `DRIVE_${Date.now()}` } as PlacementDrive;
        service.createDrive(drive);
        setDrives([drive, ...drives]);
        setIsCreating(false);
    };

    const activeDrive = useMemo(() => {
        // Check service first, then local state
        return service.getDrive(activeDriveId || '') || drives.find(d => d.id === activeDriveId);
    }, [drives, activeDriveId, service]);

    const applications = useMemo(() => activeDriveId ? service.getApplicationsForDrive(activeDriveId) : [], [activeDriveId, service]);

    const funnel = useMemo(() => AnalyticsEngine.getFunnel(applications), [applications]);

    if (activeDriveId && activeDrive) {
        return (
            <div className="fade-in">
                <button className="secondary" style={{ marginBottom: '1rem' }} onClick={() => setActiveDriveId(null)}>← Back to Dashboard</button>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.5rem' }}>
                    <div className="glass-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <div>
                                <h2>{activeDrive.roleTitle} @ {activeDrive.companyName}</h2>
                                <p style={{ opacity: 0.6 }}>Candidate Tracking & Ranking</p>
                            </div>
                            <button className="secondary" onClick={() => setShowLogs(!showLogs)}>
                                {showLogs ? 'Hide Audit Logs' : 'View Governance Logs'}
                            </button>
                        </div>

                        {showLogs && (
                            <div className="glass-card" style={{ marginBottom: '1.5rem', background: 'rgba(0,0,0,0.2)', fontSize: '0.8rem' }}>
                                <h3>Governance Audit Trail</h3>
                                <div style={{ maxHeight: '200px', overflowY: 'auto', marginTop: '1rem' }}>
                                    {service.getGovernance().getAuditLogs(activeDrive.id).map(log => (
                                        <div key={log.id} style={{ padding: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                            <span style={{ color: 'var(--primary)' }}>[{log.timestamp}]</span> {log.action} by {log.actor}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--glass-border)' }}>
                                    <th style={{ padding: '1rem' }}>Candidate</th>
                                    <th style={{ padding: '1rem' }}>Composite Score</th>
                                    <th style={{ padding: '1rem' }}>Status</th>
                                    <th style={{ padding: '1rem' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {applications.sort((a, b) => (b.compositeScore || 0) - (a.compositeScore || 0)).map(app => (
                                    <tr key={app.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                        <td style={{ padding: '1rem' }}>
                                            <p style={{ fontWeight: 600 }}>{mockStudent.name}</p>
                                            <p style={{ fontSize: '0.75rem', opacity: 0.6 }}>{app.id}</p>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <div style={{ width: '100px', height: '8px', background: 'var(--glass-bg)', borderRadius: '4px' }}>
                                                    <div style={{ width: `${app.compositeScore}%`, height: '100%', background: 'var(--primary)', borderRadius: '4px' }}></div>
                                                </div>
                                                <span>{app.compositeScore?.toFixed(1)}%</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <span className="tag" style={{ background: app.currentStatus === 'ELIGIBLE' ? 'var(--success)' : 'var(--primary)' }}>{app.currentStatus}</span>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <button className="tag" onClick={() => service.shortlistCandidates(activeDrive.id || '', [app.studentId])}>Shortlist</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="glass-card side-analytics">
                        <h3>Funnel Intelligence</h3>
                        <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {Object.entries(funnel).map(([key, val]) => (
                                <div key={key} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ opacity: 0.7 }}>{key}</span>
                                    <span style={{ fontWeight: 600 }}>{val}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>Corporate Command Center</h1>
                <button onClick={() => setIsCreating(!isCreating)}>
                    {isCreating ? 'Exit Form' : '+ Create Enterprise Drive'}
                </button>
            </div>

            {isCreating ? (
                <div className="glass-card fade-in">
                    <h2>Configuration: Enterprise Hiring Drive</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1.5rem' }}>
                        <div>
                            <label>Role</label>
                            <input className="glass-card" style={{ width: '100%', padding: '0.5rem', color: 'white' }} placeholder="Lead Software Engineer" onChange={e => setNewDrive({ ...newDrive, roleTitle: e.target.value })} />
                        </div>
                        <div>
                            <label>Required Skills (Comma separated)</label>
                            <input className="glass-card" style={{ width: '100%', padding: '0.5rem', color: 'white' }} placeholder="React, Node.js, Python" onChange={e => setNewDrive({ ...newDrive, requiredSkills: e.target.value.split(',').map(s => s.trim()) })} />
                        </div>
                        <div style={{ gridColumn: 'span 2' }}>
                            <label>Description</label>
                            <textarea className="glass-card" style={{ width: '100%', padding: '0.5rem', color: 'white', minHeight: '100px' }} placeholder="Drive description..." onChange={e => setNewDrive({ ...newDrive, description: e.target.value })} />
                        </div>
                    </div>

                    <button style={{ marginTop: '2.5rem', width: '100%', background: 'var(--primary)' }} onClick={handleCreate}>
                        Initialize & Version Drive
                    </button>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                    {drives.map(drive => (
                        <div key={drive.id} className="glass-card drive-card">
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span className="tag" style={{ border: '1px solid var(--primary)' }}>v{drive.version || 1.0}</span>
                                <span style={{ opacity: 0.5 }}>{drive.companyName}</span>
                            </div>
                            <h3 style={{ marginTop: '1rem' }}>{drive.roleTitle}</h3>
                            <div style={{ display: 'flex', gap: '0.25rem', marginTop: '0.5rem' }}>
                                {drive.requiredSkills?.map(s => <span key={s} className="tag secondary" style={{ fontSize: '0.6rem' }}>{s}</span>)}
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
                                <button className="secondary" style={{ flex: 1 }} onClick={() => setActiveDriveId(drive.id)}>Recruit Dashboard</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CompanyPortal;
