import { useMemo } from 'react';
import type { AnalysisResult } from '../core/AnalysisEngine';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid } from 'recharts';
import { AlertTriangle, CheckCircle, Activity, Clock, FileWarning } from 'lucide-react';

interface AnalysisDashboardProps {
    result: AnalysisResult;
    isRecording: boolean;
}

export const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ result, isRecording }) => {
    
    const statusColor = useMemo(() => {
        if (result.confidenceScore >= 80) return 'var(--accent)';
        if (result.confidenceScore >= 50) return 'var(--warning)';
        return 'var(--danger)';
    }, [result.confidenceScore]);

    return (
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h2>Authentication Analysis</h2>
                    <p>Real-time behavioral signatures</p>
                </div>
                {result.cpm > 0 && !isRecording && (
                     <div className="status-badge" style={{ background: `${statusColor}20`, color: statusColor, borderColor: `${statusColor}40`, padding: '8px 20px', fontSize: '1rem'}}>
                         {result.confidenceScore >= 80 ? <CheckCircle size={18}/> : <AlertTriangle size={18}/>}
                         Confidence: {result.confidenceScore}%
                     </div>
                )}
            </div>

            {result.cpm === 0 && !isRecording ? (
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                    Start a session and type some text to see analysis...
                </div>
            ) : (
                <div className="dashboard-grid">
                    {/* Top Metrics */}
                    <div className="glass-panel metric-card" style={{ background: 'rgba(0,0,0,0.2)'}}>
                        <div className="metric-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Activity size={16} /> Typing Speed
                        </div>
                        <div className="metric-value">
                            {result.cpm} <span className="metric-unit">CPM</span>
                        </div>
                    </div>
                    
                    <div className="glass-panel metric-card" style={{ background: 'rgba(0,0,0,0.2)'}}>
                        <div className="metric-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Clock size={16} /> Revision Ratio
                        </div>
                        <div className="metric-value">
                            {result.revisionRatio}<span className="metric-unit">%</span>
                        </div>
                    </div>

                    <div className="glass-panel metric-card" style={{ background: 'rgba(0,0,0,0.2)'}}>
                        <div className="metric-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <FileWarning size={16} /> Paste Events
                        </div>
                        <div className="metric-value">
                            {result.pasteCount}
                        </div>
                    </div>

                    <div className="glass-panel metric-card" style={{ background: 'rgba(0,0,0,0.2)'}}>
                        <div className="metric-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            Human Likelihood
                        </div>
                        <div className="metric-value" style={{ color: statusColor }}>
                            {result.confidenceScore}<span className="metric-unit">%</span>
                        </div>
                    </div>

                    {/* Charts */}
                    <div className="glass-panel chart-card full-width" style={{ background: 'rgba(0,0,0,0.2)'}}>
                        <h3 style={{ fontSize: '1rem', marginBottom: '16px', color: 'var(--text-muted)'}}>Typing Rhythm over Time</h3>
                        {result.cpmHistory.length > 0 ? (
                           <ResponsiveContainer width="100%" height={250}>
                                <AreaChart data={result.cpmHistory}>
                                    <defs>
                                        <linearGradient id="colorCpm" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.8}/>
                                            <stop offset="95%" stopColor="var(--accent)" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                    <XAxis dataKey="time" stroke="var(--text-muted)" tick={{fill: 'var(--text-muted)', fontSize: 12}} />
                                    <YAxis stroke="var(--text-muted)" tick={{fill: 'var(--text-muted)', fontSize: 12}} />
                                    <Tooltip contentStyle={{ background: 'var(--bg-color)', borderColor: 'var(--panel-border)', borderRadius: '8px' }} />
                                    <Area type="monotone" dataKey="cpm" stroke="var(--accent)" fillOpacity={1} fill="url(#colorCpm)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                           <div style={{ height: 250, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>Accumulating data...</div>
                        )}
                    </div>

                    <div className="glass-panel chart-card full-width" style={{ background: 'rgba(0,0,0,0.2)'}}>
                        <h3 style={{ fontSize: '1rem', marginBottom: '16px', color: 'var(--text-muted)'}}>Pause Distribution</h3>
                        {result.pauseHistogram.some(h => h.count > 0) ? (
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={result.pauseHistogram}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                    <XAxis dataKey="label" stroke="var(--text-muted)" tick={{fill: 'var(--text-muted)', fontSize: 12}} />
                                    <YAxis stroke="var(--text-muted)" tick={{fill: 'var(--text-muted)', fontSize: 12}} />
                                    <Tooltip cursor={{fill: 'rgba(255,255,255,0.02)'}} contentStyle={{ background: 'var(--bg-color)', borderColor: 'var(--panel-border)', borderRadius: '8px' }} />
                                    <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                           <div style={{ height: 250, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>Waiting for natural pauses...</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
