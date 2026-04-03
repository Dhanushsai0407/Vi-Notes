import { useState } from 'react';
import { AuthService } from '../core/AuthService';
import type { User } from '../core/AuthService';
import { ShieldCheck, LogIn, UserPlus, AlertCircle } from 'lucide-react';

interface AuthProps {
    onLogin: (user: User) => void;
}

export const Auth = ({ onLogin }: AuthProps) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        
        try {
            if (!email || !password) {
                throw new Error("Fields cannot be empty.");
            }
            
            let user: User;
            if (isLogin) {
                user = AuthService.login(email, password);
            } else {
                user = AuthService.register(email, password);
            }
            onLogin(user);
        } catch (err: any) {
            setError(err.message || "An error occurred.");
        }
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', width: '100vw' }}>
            <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '40px' }}>
                
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '32px' }}>
                    <ShieldCheck size={48} color="var(--accent)" style={{ marginBottom: '16px' }} />
                    <h2 style={{ margin: 0, textAlign: 'center' }}>Vi-Notes</h2>
                    <p style={{ color: 'var(--text-muted)', margin: '8px 0 0 0' }}>Authenticity Verification</p>
                </div>

                {error && (
                    <div style={{ 
                        background: 'rgba(239, 68, 68, 0.1)', 
                        border: '1px solid rgba(239, 68, 68, 0.3)', 
                        color: 'var(--danger)', 
                        padding: '12px', 
                        borderRadius: '8px',
                        marginBottom: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '0.9rem'
                    }}>
                        <AlertCircle size={16} />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                        <label className="form-label">Email Address</label>
                        <input 
                            type="email" 
                            className="form-input" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@domain.com"
                        />
                    </div>
                    <div>
                        <label className="form-label">Password</label>
                        <input 
                            type="password" 
                            className="form-input" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                        />
                    </div>
                    
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}>
                        {isLogin ? <><LogIn size={18} /> Sign In</> : <><UserPlus size={18} /> Create Account</>}
                    </button>
                </form>

                <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    {isLogin ? "Don't have an account? " : "Already registered? "}
                    <span 
                        style={{ color: 'var(--accent)', cursor: 'pointer', fontWeight: 500 }}
                        onClick={() => { setIsLogin(!isLogin); setError(null); }}
                    >
                        {isLogin ? "Sign Up" : "Log In"}
                    </span>
                </div>
            </div>
        </div>
    );
};
