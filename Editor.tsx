import { useRef, useEffect, useState } from 'react';
import { SessionTracker } from '../core/SessionTracker';
import { Play, Square, RotateCcw } from 'lucide-react';

interface EditorProps {
    tracker: SessionTracker;
    onSessionStateChange: (isRecording: boolean) => void;
}

export const Editor: React.FC<EditorProps> = ({ tracker, onSessionStateChange }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [text, setText] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        onSessionStateChange(isRecording);
    }, [isRecording, onSessionStateChange]);

    const handleStart = () => {
        setText('');
        tracker.startSession();
        setIsRecording(true);
        if (textareaRef.current) {
            textareaRef.current.focus();
        }
    };

    const handleStop = () => {
        setIsRecording(false);
    };

    const handleReset = () => {
        setIsRecording(false);
        setText('');
        tracker.clear();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (!isRecording) return;
        // Ignore paste shortcut keys, we'll handle actual paste event
        if (e.ctrlKey || e.metaKey) return;
        tracker.recordKey(e.key, false);
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
        if (!isRecording) return;
        tracker.recordKey('Paste', true);
        
        // Let's add multiple fake keystrokes to represent a paste for the analyzer
        const pastedText = e.clipboardData.getData('text');
        for(let i = 0; i < pastedText.length; i++) {
             // Paste keys without pauses
             // We do this immediately to show up in log, but mark as paste
             tracker.recordKey(pastedText[i], true);
        }
    };

    return (
        <div className="glass-panel editor-container">
            <div className="editor-header">
                <div>
                    <h2>Write</h2>
                    <p>Type normally. The session tracker will analyze your behavior in real-time.</p>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    {isRecording ? (
                         <div className="status-badge recording">
                            <span style={{width: 8, height: 8, borderRadius: '50%', background: 'currentColor'}}></span>
                            Recording...
                        </div>
                    ) : (
                        <div className="status-badge" style={{color: 'var(--text-muted)', borderColor: 'var(--panel-border)'}}>
                            Ready
                        </div>
                    )}
                   
                    {!isRecording ? (
                         <button className="btn btn-primary" onClick={handleStart}>
                             <Play size={16} /> Start Session
                         </button>
                    ) : (
                         <button className="btn" style={{color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.3)'}} onClick={handleStop}>
                             <Square size={16} /> Stop Recording
                         </button>
                    )}
                     <button className="btn" onClick={handleReset} title="Reset">
                        <RotateCcw size={16} />
                    </button>
                </div>
            </div>
            
            <textarea
                ref={textareaRef}
                className="editor-textarea"
                placeholder={isRecording ? "Start typing here..." : "Start a session to begin writing..."}
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                onPaste={handlePaste}
                disabled={!isRecording && text.length === 0}
            />
        </div>
    );
};
