export interface KeyStroke {
  key: string;
  timestamp: number;
  type: 'insert' | 'delete' | 'navigation' | 'paste' | 'other';
  pauseBefore: number;
}

export class SessionTracker {
  private keystrokes: KeyStroke[] = [];
  private lastKeyTime: number = 0;
  private sessionStartTime: number = 0;

  startSession() {
    this.keystrokes = [];
    this.sessionStartTime = Date.now();
    this.lastKeyTime = this.sessionStartTime;
  }

  recordKey(key: string, isPaste: boolean = false) {
    if (!this.sessionStartTime) return;

    const now = Date.now();
    const pauseBefore = this.lastKeyTime ? now - this.lastKeyTime : 0;
    
    let type: KeyStroke['type'] = 'insert';
    if (isPaste) {
      type = 'paste';
    } else if (key === 'Backspace' || key === 'Delete') {
      type = 'delete';
    } else if (key.startsWith('Arrow') || key === 'Home' || key === 'End') {
      type = 'navigation';
    } else if (key.length > 1 && key !== 'Enter' && key !== 'Space') {
      type = 'other';
    }

    this.keystrokes.push({
      key,
      timestamp: now,
      type,
      pauseBefore
    });

    this.lastKeyTime = now;
  }

  getLog(): KeyStroke[] {
    return this.keystrokes;
  }

  clear() {
    this.keystrokes = [];
    this.sessionStartTime = 0;
    this.lastKeyTime = 0;
  }
}
