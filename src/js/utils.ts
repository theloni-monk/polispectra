// Types
export type ScaleCategory = 'self' | 'relatives' | 'others' | 'systems';

export interface Scale {
    id: string;
    name: string;
    category: ScaleCategory;
}

export interface Answer {
    scaleA: string;
    scaleB: string;
    preference: 'A' | 'B' | 'neutral';
}

export interface Philosophy {
    answers: Answer[];
    title: string;
    timestamp: number;
}

export interface DraftState {
    initialAnswer?: 'yes' | 'no';
    answers: { [questionId: string]: Answer };
    philosophyTitle: string;
}

// All scales in order
export const SCALES: Scale[] = [
    // Self
    { id: 'self_mind', name: 'The Mind', category: 'self' },
    { id: 'self_tissue', name: 'The Tissue', category: 'self' },
    { id: 'self_body', name: 'The Body', category: 'self' },

    // Relatives
    { id: 'rel_ancestors', name: 'Ancestors (Grandparents+)', category: 'relatives' },
    { id: 'rel_parents', name: 'Your Parents', category: 'relatives' },
    { id: 'rel_siblings', name: 'Siblings & Cousins', category: 'relatives' },
    { id: 'rel_spouse', name: 'Spouse & Chosen Family', category: 'relatives' },
    { id: 'rel_progeny', name: 'Progeny & Adoptive', category: 'relatives' },

    // Others
    { id: 'oth_neighborhood', name: 'Neighborhood', category: 'others' },
    { id: 'oth_metro', name: 'Metropolitan Area', category: 'others' },
    { id: 'oth_province', name: 'Province', category: 'others' },
    { id: 'oth_nation', name: 'Nation', category: 'others' },

    // Systems
    { id: 'sys_occupation', name: 'Your Occupation', category: 'systems' },
    { id: 'sys_faith', name: 'Your Faith', category: 'systems' },
    { id: 'sys_government', name: 'Your Government', category: 'systems' },
    { id: 'sys_alliances', name: 'International Alliances', category: 'systems' },
    { id: 'sys_humankind', name: 'Humankind', category: 'systems' },
    { id: 'sys_planet', name: 'Your Planet', category: 'systems' }
];

// Generate pairwise comparison questions with macro-first hierarchy
export function generateQuestions(): Array<{ id: string; scaleA: Scale; scaleB: Scale; isMacro: boolean }> {
    const macroQuestions: Array<{ id: string; scaleA: Scale; scaleB: Scale; isMacro: boolean }> = [];
    const granularQuestions: Array<{ id: string; scaleA: Scale; scaleB: Scale; isMacro: boolean }> = [];

    // First, generate macro comparisons (categories vs categories)
    const categories: ScaleCategory[] = ['self', 'relatives', 'others', 'systems'];
    for (let i = 0; i < categories.length; i++) {
        for (let j = i + 1; j < categories.length; j++) {
            const scaleA = SCALES.find(s => s.category === categories[i])!;
            const scaleB = SCALES.find(s => s.category === categories[j])!;
            macroQuestions.push({
                id: `macro_${scaleA.id}_vs_${scaleB.id}`,
                scaleA,
                scaleB,
                isMacro: true
            });
        }
    }

    // Then generate granular questions (all other pairwise comparisons)
    for (let i = 0; i < SCALES.length; i++) {
        for (let j = i + 1; j < SCALES.length; j++) {
            const scaleA = SCALES[i];
            const scaleB = SCALES[j];
            // Skip if this is a macro comparison (comparing first of each category)
            if (macroQuestions.some(q => q.id === `macro_${scaleA.id}_vs_${scaleB.id}`)) {
                continue;
            }
            granularQuestions.push({
                id: `${scaleA.id}_vs_${scaleB.id}`,
                scaleA,
                scaleB,
                isMacro: false
            });
        }
    }

    // Shuffle granular questions but keep macro first
    return [...macroQuestions, ...shuffleQuestions(granularQuestions)];
}

// Shuffle questions intelligently to avoid consecutive pairs comparing the same scales
function shuffleQuestions(questions: Array<{ id: string; scaleA: Scale; scaleB: Scale; isMacro: boolean }>): Array<{ id: string; scaleA: Scale; scaleB: Scale; isMacro: boolean }> {
    const shuffled: Array<{ id: string; scaleA: Scale; scaleB: Scale; isMacro: boolean }> = [];
    const remaining = [...questions];

    while (remaining.length > 0) {
        if (shuffled.length === 0) {
            const idx = Math.floor(Math.random() * remaining.length);
            shuffled.push(remaining[idx]);
            remaining.splice(idx, 1);
        } else {
            const lastQ = shuffled[shuffled.length - 1];
            const lastScales = new Set([lastQ.scaleA.id, lastQ.scaleB.id]);

            let foundIdx = -1;
            for (let i = 0; i < remaining.length; i++) {
                const q = remaining[i];
                const sharesScale = lastScales.has(q.scaleA.id) || lastScales.has(q.scaleB.id);
                if (!sharesScale) {
                    foundIdx = i;
                    break;
                }
            }

            if (foundIdx === -1) {
                foundIdx = Math.floor(Math.random() * remaining.length);
            }

            shuffled.push(remaining[foundIdx]);
            remaining.splice(foundIdx, 1);
        }
    }

    return shuffled;
}

// LocalStorage utilities
export function saveDraft(draft: DraftState): void {
    localStorage.setItem('polispectra_draft', JSON.stringify(draft));
}

export function loadDraft(): DraftState | null {
    const stored = localStorage.getItem('polispectra_draft');
    return stored ? JSON.parse(stored) : null;
}

export function clearDraft(): void {
    localStorage.removeItem('polispectra_draft');
}

// Dummy backend API
export async function submitPhilosophy(philosophy: Philosophy): Promise<string> {
    // Dummy backend - simulate API call
    console.log('Submitting philosophy:', philosophy);
    return new Promise((resolve) => {
        setTimeout(() => {
            const userId = `user_${Math.random().toString(36).substr(2, 9)}`;
            resolve(userId);
        }, 500);
    });
}

export async function getPhilosophies(): Promise<Philosophy[]> {
    // Dummy backend - return sample data + canonical examples
    return new Promise((resolve) => {
        setTimeout(() => {
            const canonicalExamples: Philosophy[] = [
                {
                    title: 'Communitarian',
                    timestamp: Date.now() - 100000,
                    answers: [
                        { scaleA: 'self_mind', scaleB: 'sys_humankind', preference: 'B' },
                        { scaleA: 'self_body', scaleB: 'rel_parents', preference: 'B' },
                        { scaleA: 'rel_siblings', scaleB: 'oth_nation', preference: 'B' },
                        { scaleA: 'self_mind', scaleB: 'rel_parents', preference: 'B' },
                        { scaleA: 'oth_metro', scaleB: 'sys_faith', preference: 'A' },
                        { scaleA: 'self_mind', scaleB: 'sys_government', preference: 'B' },
                    ]
                },
                {
                    title: 'Individualist',
                    timestamp: Date.now() - 50000,
                    answers: [
                        { scaleA: 'self_mind', scaleB: 'sys_humankind', preference: 'A' },
                        { scaleA: 'self_body', scaleB: 'rel_parents', preference: 'A' },
                        { scaleA: 'rel_siblings', scaleB: 'oth_nation', preference: 'A' },
                        { scaleA: 'self_mind', scaleB: 'rel_parents', preference: 'A' },
                        { scaleA: 'oth_metro', scaleB: 'sys_faith', preference: 'A' },
                        { scaleA: 'self_mind', scaleB: 'sys_government', preference: 'A' },
                    ]
                },
                {
                    title: 'Traditional Values',
                    timestamp: Date.now() - 30000,
                    answers: [
                        { scaleA: 'self_mind', scaleB: 'sys_faith', preference: 'B' },
                        { scaleA: 'sys_faith', scaleB: 'oth_nation', preference: 'B' },
                        { scaleA: 'rel_parents', scaleB: 'sys_government', preference: 'B' },
                        { scaleA: 'rel_ancestors', scaleB: 'sys_occupation', preference: 'B' },
                        { scaleA: 'sys_faith', scaleB: 'self_body', preference: 'B' },
                    ]
                },
                {
                    title: 'Secular Cosmopolitan',
                    timestamp: Date.now() - 10000,
                    answers: [
                        { scaleA: 'sys_humankind', scaleB: 'sys_faith', preference: 'A' },
                        { scaleA: 'oth_nation', scaleB: 'sys_humankind', preference: 'B' },
                        { scaleA: 'sys_government', scaleB: 'sys_faith', preference: 'A' },
                        { scaleA: 'sys_alliances', scaleB: 'oth_nation', preference: 'B' },
                        { scaleA: 'self_mind', scaleB: 'sys_faith', preference: 'A' },
                    ]
                }
            ];

            const otherExamples: Philosophy[] = [
                {
                    title: 'Collectivist',
                    timestamp: Date.now() - 10000,
                    answers: SCALES.slice(0, 10).map((scale, i) => ({
                        scaleA: scale.id,
                        scaleB: SCALES[(i + 5) % SCALES.length].id,
                        preference: (i % 2 === 0 ? 'B' : 'A') as 'A' | 'B'
                    }))
                },
                {
                    title: 'Libertarian',
                    timestamp: Date.now() - 5000,
                    answers: SCALES.slice(0, 10).map((scale, i) => ({
                        scaleA: scale.id,
                        scaleB: SCALES[(i + 5) % SCALES.length].id,
                        preference: (i % 2 === 0 ? 'A' : 'B') as 'A' | 'B'
                    }))
                }
            ];

            resolve([...canonicalExamples, ...otherExamples]);
        }, 300);
    });
}

export async function getSpectrum(): Promise<any> {
    // Dummy backend - return aggregated data
    return new Promise((resolve) => {
        setTimeout(() => {
            const spectrum: { [key: string]: { [key: string]: number } } = {};
            for (let i = 0; i < SCALES.length; i++) {
                for (let j = i + 1; j < SCALES.length; j++) {
                    const key = `${SCALES[i].id}_vs_${SCALES[j].id}`;
                    spectrum[key] = {
                        A: Math.floor(Math.random() * 100),
                        B: Math.floor(Math.random() * 100)
                    };
                }
            }
            resolve(spectrum);
        }, 300);
    });
}
