import { useState, useMemo } from 'react';
import { mockDrives, mockStudent } from '../mockData';
import type { PlacementDrive } from '../domain/models';
import { DriveStatus } from '../domain/models';
import type { EligibilityRule, Operator } from '../engines/rule-engine/types';
import { PlacementService } from '../services/placement.service';

const CompanyPortal = ({ service }: { service: PlacementService }) => {
    const [drives, setDrives] = useState<PlacementDrive[]>(mockDrives);
    const [isCreating, setIsCreating] = useState(false);
    const [activeDriveId, setActiveDriveId] = useState<string | null>(null);

    // New Drive State
    const [newDrive, setNewDrive] = useState<Partial<PlacementDrive>>({
        companyId: 'NEW_ORG',
        roleTitle: '',
        description: '',
        eligibilityRules: [],
        selectionRounds: [
            { id: 'R1', name: 'Aptitude', order: 1 },
            { id: 'R2', name: 'Technical', order: 2 }
        ],
        status: DriveStatus.OPEN
    });

    const addRule = () => {
        const rule: EligibilityRule = {
            id: `RULE_${Date.now()}`,
            field: 'cgpa',
            operator: 'gte',
            value: 7.0,
            label: 'New Rule'
        };
        setNewDrive({ ...newDrive, eligibilityRules: [...(newDrive.eligibilityRules || []), rule] });
    };

    const handleCreate = () => {
        const drive = { ...newDrive, id: `DRIVE_${Date.now()}` } as PlacementDrive;
        service.createDrive(drive);
        setDrives([drive, ...drives]);
        setIsCreating(false);
    };

    const activeDrive = useMemo(() => drives.find(d => d.id === activeDriveId), [drives, activeDriveId]);
    const applications = useMemo(() => activeDriveId ? service.getEligibleStudents(activeDriveId) : [], [activeDriveId, service]);

    if (activeDriveId && activeDrive) {
        return (
            <div className="fade-in">
                <button className="secondary" style={{ marginBottom: '1rem' }} onClick={() => setActiveDriveId(null)}>← Back to Dashboard</button>
                <div className="glass-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem' }}>
                        <h2>{activeDrive.roleTitle} - Candidate Management</h2>
                        <button
                            className="secondary"
                            onClick={() => {
                                applications.forEach(app => {
                                    const pendingRound = app.roundProgress.find(r => r.status === 'PENDING');
                                    if (pendingRound) service.updateRoundStatus(app.id, pendingRound.roundId, 'PASSED', 'Bulk Shortlist');
                                });
                                setDrives([...drives]);
                            }}
                        >
                            Advance All to Next Round
                        </button>
                    </div>
                    <div style={{ marginTop: '2rem' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--glass-border)' }}>
                                    <th style={{ padding: '1rem' }}>Candidate</th>
                                    <th style={{ padding: '1rem' }}>Status</th>
                                    <th style={{ padding: '1rem' }}>Progress</th>
                                    <th style={{ padding: '1rem' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {applications.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} style={{ padding: '2rem', textAlign: 'center' }}>No candidates yet.</td>
                                    </tr>
                                ) : (
                                    applications.map(app => (
                                        <tr key={app.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                            <td style={{ padding: '1rem' }}>
                                                <p style={{ fontWeight: 600 }}>{mockStudent.name}</p>
                                                <p style={{ fontSize: '0.75rem', opacity: 0.7 }}>{app.studentId}</p>
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                <span className="tag" style={{ background: 'var(--primary)', color: 'white' }}>{app.currentStatus}</span>
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                <div style={{ display: 'flex', gap: '4px' }}>
                                                    {app.roundProgress.map((r, i) => (
                                                        <div key={i} title={r.roundId} style={{
                                                            width: '12px', height: '12px', borderRadius: '2px',
                                                            background: r.status === 'PASSED' ? 'var(--success)' : (r.status === 'FAILED' ? 'var(--error)' : 'var(--glass-border)')
                                                        }} />
                                                    ))}
                                                </div>
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                    {app.roundProgress.some(r => r.status === 'PENDING') && (
                                                        <button
                                                            className="tag"
                                                            style={{ background: 'var(--success)', border: 'none', cursor: 'pointer' }}
                                                            onClick={() => {
                                                                const pendingRound = app.roundProgress.find(r => r.status === 'PENDING');
                                                                if (pendingRound) {
                                                                    service.updateRoundStatus(app.id, pendingRound.roundId, 'PASSED', 'Automated Pass');
                                                                    setActiveDriveId(activeDriveId); // Force re-render
                                                                    setDrives([...drives]); // Force re-render
                                                                }
                                                            }}
                                                        >
                                                            Advance
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>Recruiter Hub</h1>
                <button onClick={() => setIsCreating(!isCreating)}>
                    {isCreating ? 'Cancel' : '+ Create Placement Drive'}
                </button>
            </div>

            {isCreating ? (
                <div className="glass-card fade-in">
                    <h2>Create Selection Drive</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1.5rem' }}>
                        <div>
                            <label>Role Title</label>
                            <input
                                className="glass-card"
                                style={{ width: '100%', marginTop: '0.5rem', padding: '0.5rem' }}
                                placeholder="e.g. SDE-1"
                                onChange={e => setNewDrive({ ...newDrive, roleTitle: e.target.value })}
                            />
                        </div>
                        <div>
                            <label>Company ID</label>
                            <input
                                className="glass-card"
                                style={{ width: '100%', marginTop: '0.5rem', padding: '0.5rem' }}
                                defaultValue="NEW_ORG"
                                onChange={e => setNewDrive({ ...newDrive, companyId: e.target.value })}
                            />
                        </div>
                    </div>

                    <div style={{ marginTop: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3>Eligibility Rules</h3>
                            <button className="secondary" onClick={addRule}>+ Add Rule</button>
                        </div>

                        <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {newDrive.eligibilityRules?.map((rule, idx) => (
                                <div key={rule.id} className="glass-card" style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '1rem' }}>
                                    <select
                                        style={{ background: 'var(--glass-bg)', color: 'white', border: 'none' }}
                                        onChange={e => {
                                            const rules = [...(newDrive.eligibilityRules || [])];
                                            rules[idx].field = e.target.value;
                                            setNewDrive({ ...newDrive, eligibilityRules: rules });
                                        }}
                                    >
                                        <option value="cgpa">CGPA</option>
                                        <option value="backlog_count">Backlogs</option>
                                        <option value="graduation_year">Grad Year</option>
                                    </select>

                                    <select
                                        style={{ background: 'var(--glass-bg)', color: 'white', border: 'none' }}
                                        onChange={e => {
                                            const rules = [...(newDrive.eligibilityRules || [])];
                                            rules[idx].operator = e.target.value as Operator;
                                            setNewDrive({ ...newDrive, eligibilityRules: rules });
                                        }}
                                    >
                                        <option value="gte">&gt;=</option>
                                        <option value="lte">&lt;=</option>
                                        <option value="eq">==</option>
                                    </select>

                                    <input
                                        type="number"
                                        style={{ background: 'var(--glass-bg)', color: 'white', border: 'none', width: '60px' }}
                                        onChange={e => {
                                            const rules = [...(newDrive.eligibilityRules || [])];
                                            rules[idx].value = parseFloat(e.target.value);
                                            setNewDrive({ ...newDrive, eligibilityRules: rules });
                                        }}
                                    />

                                    <button
                                        className="secondary"
                                        style={{ marginLeft: 'auto', padding: '0.2rem 0.5rem' }}
                                        onClick={() => {
                                            const rules = newDrive.eligibilityRules?.filter(r => r.id !== rule.id);
                                            setNewDrive({ ...newDrive, eligibilityRules: rules });
                                        }}
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button style={{ marginTop: '2.5rem', width: '100%', background: 'var(--success)' }} onClick={handleCreate}>
                        Launch Drive & Start Accepting Applications
                    </button>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {drives.map(drive => (
                        <div key={drive.id} className="glass-card fade-in">
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <span className="tag tag-success">{drive.status}</span>
                                <span style={{ color: 'var(--secondary)', fontSize: '0.8rem' }}>{drive.id}</span>
                            </div>
                            <h3>{drive.roleTitle}</h3>
                            <p style={{ fontSize: '0.85rem', margin: '0.5rem 0' }}>{drive.eligibilityRules.length} Rules Attached</p>
                            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                                <button className="secondary" style={{ flex: 1 }}>Edit Drive</button>
                                <button
                                    className="secondary"
                                    style={{ flex: 1, border: '1px solid var(--primary)' }}
                                    onClick={() => setActiveDriveId(drive.id)}
                                >
                                    Candidates
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CompanyPortal;
