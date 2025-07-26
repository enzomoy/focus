import { Timestamp } from 'firebase/firestore';

export interface User {
    id: string;
    email: string;
    displayName?: string;
    createdAt: Timestamp;
}

export interface Session {
    id: string;
    userId: string;
    startTime: Timestamp;
    endTime?: Timestamp;
    duration: number; // en minutes
    type: 'work' | 'shortBreak' | 'longBreak';
    completed: boolean;
    createdAt: Timestamp;
}

export interface Preset {
    id: string;
    userId: string;
    name: string;
    workDuration: number; // en minutes
    shortBreakDuration: number;
    longBreakDuration: number;
    cycles: number;
    isDefault?: boolean;
    createdAt: Timestamp;
}

export interface UserSettings {
    theme: 'light' | 'dark' | 'system';
    soundEnabled: boolean;
    defaultPresetId?: string;
    currentStreak: number;
    lastSessionDate?: Timestamp;
}

export interface TimerState {
    isRunning: boolean;
    isPaused: boolean;
    currentTime: number; // en secondes
    currentCycle: number;
    currentPhase: 'work' | 'shortBreak' | 'longBreak';
    preset: Preset;
}