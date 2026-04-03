import type { AnalysisResult } from './AnalysisEngine';

export interface SavedSession {
    id: string;
    userId: string;
    date: number;
    text: string;
    analysis: AnalysisResult;
}

export class SessionService {
    private static KEY = 'vi_notes_sessions';

    static getSessions(userId: string): SavedSession[] {
        const all = localStorage.getItem(this.KEY);
        if (!all) return [];
        const sessions: SavedSession[] = JSON.parse(all);
        return sessions.filter((s: SavedSession) => s.userId === userId).sort((a: SavedSession, b: SavedSession) => b.date - a.date);
    }

    static saveSession(userId: string, text: string, analysis: AnalysisResult): SavedSession {
        const all = localStorage.getItem(this.KEY);
        const sessions: SavedSession[] = all ? JSON.parse(all) : [];
        const session: SavedSession = {
            id: crypto.randomUUID(),
            userId,
            date: Date.now(),
            text,
            analysis
        };
        sessions.push(session);
        localStorage.setItem(this.KEY, JSON.stringify(sessions));
        return session;
    }
}
