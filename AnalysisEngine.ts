import type { KeyStroke } from './SessionTracker';

export interface AnalysisResult {
    cpm: number;
    pauseHistogram: { label: string, count: number }[];
    cpmHistory: { time: string, cpm: number }[];
    revisionRatio: number;
    pasteCount: number;
    confidenceScore: number;
}

export class AnalysisEngine {
    static analyze(log: KeyStroke[]): AnalysisResult {
        if (log.length === 0) return {
            cpm: 0,
            pauseHistogram: [],
            cpmHistory: [],
            revisionRatio: 0,
            pasteCount: 0,
            confidenceScore: 100
        };

        const startTime = log[0].timestamp;
        const endTime = log[log.length - 1].timestamp;
        const durationMinutes = (endTime - startTime) / 60000;
        
        // CPM (Characters per minute)
        const typedChars = log.filter(k => k.type === 'insert').length;
        const cpm = durationMinutes > 0 ? Math.round(typedChars / durationMinutes) : 0;

        // Pauses
        const buckets = [0, 0, 0, 0, 0]; // <100ms, 100-300ms, 300-1000ms, 1-3s, >3s
        log.forEach(k => {
            if (k.type === 'insert' || k.type === 'delete') {
                if (k.pauseBefore < 100) buckets[0]++;
                else if (k.pauseBefore < 300) buckets[1]++;
                else if (k.pauseBefore < 1000) buckets[2]++;
                else if (k.pauseBefore < 3000) buckets[3]++;
                else buckets[4]++;
            }
        });

        const pauseHistogram = [
            { label: '<0.1s', count: buckets[0] },
            { label: '0.1-0.3s', count: buckets[1] },
            { label: '0.3-1s', count: buckets[2] },
            { label: '1-3s', count: buckets[3] },
            { label: '>3s', count: buckets[4] },
        ];

        // CPM History over time (buckets of 5 seconds)
        const cpmHistory: { time: string, cpm: number }[] = [];
        const interval = 5000; // 5 seconds
        let currentIntervalStart = startTime;
        let charsInInterval = 0;

        log.forEach(k => {
            if (k.timestamp > currentIntervalStart + interval) {
                // Save previous interval
                const timeLabel = new Date(currentIntervalStart).toLocaleTimeString([], {minute: '2-digit', second:'2-digit'});
                cpmHistory.push({ time: timeLabel, cpm: charsInInterval * (60000 / interval) });
                
                // Move to next interval
                currentIntervalStart += interval;
                charsInInterval = 0;
            }
            if (k.type === 'insert') charsInInterval++;
        });
        
        // Push last interval
        if (charsInInterval > 0) {
             const timeLabel = new Date(currentIntervalStart).toLocaleTimeString([], {minute: '2-digit', second:'2-digit'});
             cpmHistory.push({ time: timeLabel, cpm: charsInInterval * (60000 / interval) });
        }


        // Revisions
        const deletes = log.filter(k => k.type === 'delete').length;
        const revisionRatio = typedChars > 0 ? (deletes / typedChars) * 100 : 0;

        // Pastes
        const pasteCount = log.filter(k => k.type === 'paste').length;

        // Confidence Score Logic (Heuristic for demo)
        let score = 100;
        if (cpm > 500) score -= 40; // Unnaturally fast
        if (pasteCount > 0) score -= 30 * pasteCount;
        if (revisionRatio < 1 && typedChars > 100) score -= 15; // Perfect typing is suspicious
        if (log.length > 50 && buckets[0] / log.length > 0.90) score -= 40; // Too robotic (only fast typing without pauses)

        if (log.length < 20) score = 100; // Not enough data

        return {
            cpm,
            pauseHistogram,
            cpmHistory,
            revisionRatio: parseFloat(revisionRatio.toFixed(1)),
            pasteCount,
            confidenceScore: Math.max(0, Math.min(100, score))
        };
    }
}
