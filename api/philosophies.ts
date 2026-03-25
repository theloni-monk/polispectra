import { VercelRequest, VercelResponse } from '@vercel/node';
import { getRedis } from '../lib';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const redis = await getRedis();

        // Get recent philosophy IDs
        const userIds = (await redis.lrange('philosophies:recent', 0, 49)) as string[];

        // Fetch each philosophy
        const philosophies = [];
        for (const userId of userIds) {
            const data = await redis.get(`philosophy:${userId}`);
            if (data) {
                philosophies.push(JSON.parse(data as string));
            }
        }

        res.setHeader('Access-Control-Allow-Origin', '*');
        return res.status(200).json(philosophies);
    } catch (error) {
        console.error('Fetch philosophies error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
