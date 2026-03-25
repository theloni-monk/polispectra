import { VercelRequest, VercelResponse } from '@vercel/node';
import { getRedis } from '../lib';

// List of all scale comparisons (this should match the frontend SCALES)
const SCALE_IDS = [
    'self_mind', 'self_tissue', 'self_body',
    'rel_ancestors', 'rel_parents', 'rel_siblings', 'rel_spouse', 'rel_progeny',
    'oth_neighborhood', 'oth_metro', 'oth_province', 'oth_nation',
    'sys_occupation', 'sys_faith', 'sys_government', 'sys_alliances', 'sys_humankind', 'sys_planet'
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const redis = await getRedis();

        const spectrum: { [key: string]: { A: number; B: number } } = {};

        // Generate all pairwise comparisons
        for (let i = 0; i < SCALE_IDS.length; i++) {
            for (let j = i + 1; j < SCALE_IDS.length; j++) {
                const comparisonKey = `comparison:${SCALE_IDS[i]}_vs_${SCALE_IDS[j]}`;
                const stats = await redis.hgetall(comparisonKey);

                spectrum[`${SCALE_IDS[i]}_vs_${SCALE_IDS[j]}`] = {
                    A: parseInt((stats?.A as string) || '0'),
                    B: parseInt((stats?.B as string) || '0')
                };
            }
        }

        res.setHeader('Access-Control-Allow-Origin', '*');
        return res.status(200).json(spectrum);
    } catch (error) {
        console.error('Fetch spectrum error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
