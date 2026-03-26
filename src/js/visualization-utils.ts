import { SCALES, Philosophy } from './utils.js';

// Types
export interface SpectrumData {
    [key: string]: { A: number; B: number };
}

// Calculate collectivism score (0 = individualist, 1 = collectivist)
export function calculateCollectivismScore(philosophy: Philosophy): number {
    let collectiveScore = 0;
    let totalCount = 0;

    const collectiveScales = new Set([
        'rel_ancestors', 'rel_parents', 'rel_siblings', 'rel_spouse', 'rel_progeny',
        'oth_neighborhood', 'oth_metro', 'oth_province', 'oth_nation',
        'sys_faith', 'sys_government', 'sys_alliances', 'sys_humankind'
    ]);

    const individualScales = new Set([
        'self_mind', 'self_tissue', 'self_body', 'sys_occupation'
    ]);

    philosophy.answers.forEach(answer => {
        const aIsCollective = collectiveScales.has(answer.scaleA);
        const bIsCollective = collectiveScales.has(answer.scaleB);

        if (answer.preference === 'A') {
            collectiveScore += aIsCollective ? 1 : (bIsCollective ? -1 : 0);
        } else if (answer.preference === 'B') {
            collectiveScore += bIsCollective ? 1 : (aIsCollective ? -1 : 0);
        }
        totalCount++;
    });

    // Normalize to 0-1 range
    return (collectiveScore / (totalCount * 2)) + 0.5;
}

// Calculate relative importance score (0-1 based on how diverse the preferences are)
export function calculateImportanceVariance(philosophy: Philosophy, scaleId: string): number {
    const relevantAnswers = philosophy.answers.filter(
        a => a.scaleA === scaleId || a.scaleB === scaleId
    );

    if (relevantAnswers.length === 0) return 0.5;

    let score = 0;
    relevantAnswers.forEach(answer => {
        if (answer.preference === 'neutral') {
            score += 0.5;
        } else if ((answer.scaleA === scaleId && answer.preference === 'A') ||
                   (answer.scaleB === scaleId && answer.preference === 'B')) {
            score += 1;
        }
    });

    return score / relevantAnswers.length;
}

// Build a preference matrix from spectrum data
export function buildPreferenceMatrix(
    spectrum: SpectrumData,
    scaleIds: string[]
): number[][] {
    const matrix: number[][] = Array(scaleIds.length)
        .fill(null)
        .map(() => Array(scaleIds.length).fill(0));

    for (const [key, data] of Object.entries(spectrum)) {
        const parts = key.split('_vs_');
        if (parts.length === 2) {
            const [scaleAId, scaleBId] = parts;
            const aIdx = scaleIds.indexOf(scaleAId);
            const bIdx = scaleIds.indexOf(scaleBId);

            if (aIdx !== -1 && bIdx !== -1) {
                const specData = data as { A: number; B: number };
                const total = specData.A + specData.B;
                if (total > 0) {
                    const ratio = specData.A / total;
                    matrix[aIdx][bIdx] = ratio;
                    matrix[bIdx][aIdx] = 1 - ratio;
                }
            }
        }
    }

    return matrix;
}

// Calculate dominance of each scale (how often it's preferred)
export function calculateDominance(
    spectrum: SpectrumData,
    scaleIds: string[]
): { [scaleId: string]: number } {
    const wins: { [key: string]: number } = {};
    const totals: { [key: string]: number } = {};

    scaleIds.forEach((id) => {
        wins[id] = 0;
        totals[id] = 0;
    });

    for (const [key, data] of Object.entries(spectrum)) {
        const parts = key.split('_vs_');
        if (parts.length === 2) {
            const [scaleAId, scaleBId] = parts;
            const specData = data as { A: number; B: number };
            const total = specData.A + specData.B;

            if (total > 0) {
                if (scaleAId in wins) totals[scaleAId] += total;
                if (scaleBId in wins) totals[scaleBId] += total;

                if (specData.A > specData.B && scaleAId in wins) {
                    wins[scaleAId]++;
                } else if (specData.B > specData.A && scaleBId in wins) {
                    wins[scaleBId]++;
                }
            }
        }
    }

    const dominance: { [key: string]: number } = {};
    scaleIds.forEach((id) => {
        dominance[id] = totals[id] > 0 ? wins[id] / totals[id] : 0;
    });

    return dominance;
}

// Color utilities for visualization
export function getScaleCategoryColor(category: string): string {
    const colors: { [key: string]: string } = {
        self: '#5b7fa6',
        relatives: '#7d9fc1',
        others: '#a0b9d4',
        systems: '#6b8ba3'
    };
    return colors[category] || '#95a5a6';
}

export function getHeatColor(value: number): string {
    // value: 0 = cold, 1 = hot
    const hue = (1 - value) * 240; // 240 to 0 (blue to red)
    return `hsl(${hue}, 100%, 50%)`;
}

// Force-directed graph layout (simple spring simulation)
export interface GraphNode {
    id: string;
    label: string;
    x: number;
    y: number;
    vx: number;
    vy: number;
    category: string;
}

export interface GraphEdge {
    source: string;
    target: string;
    weight: number;
}

export function initializeGraphLayout(
    scaleIds: string[],
    scaleNames: { [id: string]: string },
    categories: { [id: string]: string }
): GraphNode[] {
    const width = 800;
    const height = 600;

    return scaleIds.map((id, i) => {
        const angle = (i / scaleIds.length) * Math.PI * 2;
        const radius = 200;

        return {
            id,
            label: scaleNames[id],
            x: width / 2 + radius * Math.cos(angle),
            y: height / 2 + radius * Math.sin(angle),
            vx: 0,
            vy: 0,
            category: categories[id] || 'other'
        };
    });
}

export function simulateLayout(
    nodes: GraphNode[],
    edges: GraphEdge[],
    iterations: number = 50
): GraphNode[] {
    const K = 50; // Optimal distance
    const repulsion = 200;
    const damping = 0.8;

    for (let iter = 0; iter < iterations; iter++) {
        // Reset forces
        nodes.forEach((node) => {
            node.vx = 0;
            node.vy = 0;
        });

        // Repulsive forces (all pairs)
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[j].x - nodes[i].x;
                const dy = nodes[j].y - nodes[i].y;
                const distance = Math.sqrt(dx * dx + dy * dy) || 0.1;
                const force = repulsion / (distance * distance);

                nodes[i].vx -= (force * dx) / distance;
                nodes[i].vy -= (force * dy) / distance;
                nodes[j].vx += (force * dx) / distance;
                nodes[j].vy += (force * dy) / distance;
            }
        }

        // Attractive forces (connected edges)
        edges.forEach((edge) => {
            const source = nodes.find((n) => n.id === edge.source);
            const target = nodes.find((n) => n.id === edge.target);

            if (source && target) {
                const dx = target.x - source.x;
                const dy = target.y - source.y;
                const distance = Math.sqrt(dx * dx + dy * dy) || 0.1;
                const force = ((distance - K) * edge.weight) / distance;

                source.vx += (force * dx) / distance;
                source.vy += (force * dy) / distance;
                target.vx -= (force * dx) / distance;
                target.vy -= (force * dy) / distance;
            }
        });

        // Apply velocities with damping
        nodes.forEach((node) => {
            node.x += node.vx * damping;
            node.y += node.vy * damping;
        });
    }

    return nodes;
}
