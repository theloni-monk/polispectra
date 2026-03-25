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

// Generate pairwise comparison questions
export function generateQuestions(): Array<{ id: string; scaleA: Scale; scaleB: Scale }> {
    const questions: Array<{ id: string; scaleA: Scale; scaleB: Scale }> = [];

    for (let i = 0; i < SCALES.length; i++) {
        for (let j = i + 1; j < SCALES.length; j++) {
            const scaleA = SCALES[i];
            const scaleB = SCALES[j];
            questions.push({
                id: `${scaleA.id}_vs_${scaleB.id}`,
                scaleA,
                scaleB
            });
        }
    }

    return questions;
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
    // Dummy backend - return sample data
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                {
                    title: 'Collectivist',
                    timestamp: Date.now() - 10000,
                    answers: SCALES.slice(0, 10).map((scale, i) => ({
                        scaleA: scale.id,
                        scaleB: SCALES[(i + 5) % SCALES.length].id,
                        preference: i % 2 === 0 ? 'A' : 'B'
                    }))
                },
                {
                    title: 'Individualist',
                    timestamp: Date.now() - 5000,
                    answers: SCALES.slice(0, 10).map((scale, i) => ({
                        scaleA: scale.id,
                        scaleB: SCALES[(i + 5) % SCALES.length].id,
                        preference: i % 2 === 0 ? 'B' : 'A'
                    }))
                }
            ]);
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
