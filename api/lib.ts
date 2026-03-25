import { Redis } from '@upstash/redis';

// Initialize Redis client
const redis = new Redis({
    url: process.env.REDIS_URL!,
    token: process.env.REDIS_TOKEN!
});

export async function getRedis(): Promise<Redis> {
    return redis;
}

// Validation utilities
export interface ComparisonAnswer {
    scaleA: string;
    scaleB: string;
    preference: 'A' | 'B' | 'neutral';
}

export interface SubmittedPhilosophy {
    userId: string;
    title: string;
    answers: ComparisonAnswer[];
    timestamp: number;
}

export function validateAnswers(answers: unknown[]): boolean {
    if (!Array.isArray(answers) || answers.length < 3) {
        return false;
    }

    return answers.every((answer: any) =>
        answer.scaleA &&
        answer.scaleB &&
        (answer.preference === 'A' || answer.preference === 'B' || answer.preference === 'neutral')
    );
}

// CORS headers
export function getCORSHeaders() {
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
    };
}

// Generate unique user ID
export function generateUserId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
