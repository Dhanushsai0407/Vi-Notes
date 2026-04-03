import { SessionService } from '../core/SessionService';
import type { SavedSession } from '../core/SessionService';
import { AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface SessionHistoryProps {
    userId: string;
}

export const SessionHistory = ({ userId }: SessionHistoryProps) => {
    const sessions = SessionService.getSessions(userId);

    const getStatusColor = (score: number) => {
        if (score >= 80) return 'var(--accent)';
        if (score >= 50) return 'var(--warning)';
        return 'var(--danger)';
    };

    if (sessions.length === 0) {
        return (
            <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                <Clock size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                <h3>No History Found</h3>
                <p>You haven't saved any writing sessions yet.</p>
            </div>
        );
    }

    return (
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ marginBottom: '24px' }}>
                <h2>Your Saved Sessions</h2>
                <p>Review the authenticity analyses of your past documents.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto', paddingRight: '8px' }}>
                {sessions.map((session: SavedSession) => {
                    const color = getStatusColor(session.analysis.confidenceScore);
                    const isAuthentic = session.analysis.confidenceScore >= 80;

                    return (
                        <div key={session.id} style={{ 
                            background: 'rgba(0,0,0,0.2)', 
                            border: '1px solid var(--panel-border)', 
                            borderRadius: '12px', 
                            padding: '24px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '16px'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                    {new Date(session.date).toLocaleString()}
                                </div>
                                <div className="status-badge" style={{ background: `${color}20`, color: color, borderColor: `${color}40`, padding: '6px 14px' }}>
                                    {isAuthentic ? <CheckCircle size={14}/> : <AlertTriangle size={14}/>}
                                    Score: {session.analysis.confidenceScore}%
                                </div>
                            </div>
                            
                            <div style={{ 
                                background: 'rgba(255,255,255,0.02)', 
                                padding: '16px', 
                                borderRadius: '8px',
                                fontSize: '0.95rem',
                                color: 'var(--text-main)',
                                fontStyle: 'italic',
                                maxHeight: '100px',
                                overflow: 'hidden',
                                position: 'relative'
                            }}>
                                "{session.text.substring(0, 300)}{session.text.length > 300 ? '...' : ''}"
                                {session.text.length > 300 && (
                                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40px', background: 'linear-gradient(to top, rgba(20,20,30,0.8), transparent)' }}></div>
                                )}
                            </div>

                            <div style={{ display: 'flex', gap: '24px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                <div><strong style={{ color: '#fff' }}>CPM:</strong> {session.analysis.cpm}</div>
                                <div><strong style={{ color: '#fff' }}>Pastes:</strong> {session.analysis.pasteCount} chunks</div>
                                <div><strong style={{ color: '#fff' }}>Revisions:</strong> {session.analysis.revisionRatio}%</div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
