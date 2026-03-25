import { VercelRequest, VercelResponse } from '@vercel/node';
import { getRedis, generateUserId, validateAnswers, getCORSHeaders, ComparisonAnswer } from '../lib';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // CORS preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).setHeader('Access-Control-Allow-Origin', '*').end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { title, answers, captchaToken } = req.body;

        // Validate input
        if (!title || typeof title !== 'string') {
            return res.status(400).json({ error: 'Title is required' });
        }

        if (!validateAnswers(answers)) {
            return res.status(400).json({ error: 'At least 3 valid answers are required' });
        }

        // TODO: Verify captcha token with hCaptcha API
        // if (captchaToken) {
        //     const captchaValid = await verifyCaptcha(captchaToken);
        //     if (!captchaValid) {
        //         return res.status(400).json({ error: 'Captcha verification failed' });
        //     }
        // }

        // Generate user ID
        const userId = generateUserId();

        // Store in Redis
        const redis = await getRedis();
        const philosophy = {
            userId,
            title,
            answers,
            timestamp: Date.now()
        };

        // Store philosophy
        await redis.set(`philosophy:${userId}`, JSON.stringify(philosophy), {
            ex: 60 * 60 * 24 * 30 // 30 days expiry
        });

        // Add to leaderboard/recent list
        await redis.lpush('philosophies:recent', userId);
        await redis.ltrim('philosophies:recent', 0, 99); // Keep last 100

        // Update statistics for each comparison
        for (const answer of answers as ComparisonAnswer[]) {
            const comparisonKey = `comparison:${answer.scaleA}_vs_${answer.scaleB}`;
            const currentStats = await redis.hgetall(comparisonKey);

            if (answer.preference === 'A') {
                await redis.hincrby(comparisonKey, 'A', 1);
            } else if (answer.preference === 'B') {
                await redis.hincrby(comparisonKey, 'B', 1);
            } else {
                await redis.hincrby(comparisonKey, 'neutral', 1);
            }
        }

        res.setHeader('Access-Control-Allow-Origin', '*');
        return res.status(200).json({
            userId,
            message: 'Philosophy submitted successfully'
        });
    } catch (error) {
        console.error('Submit error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
