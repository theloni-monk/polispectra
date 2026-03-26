import { getPhilosophies, getSpectrum, SCALES } from '../utils.js';
import {
    calculateDominance,
    buildPreferenceMatrix,
    initializeGraphLayout,
    simulateLayout,
    getScaleCategoryColor
} from '../visualization-utils.js';

export async function renderVisualizationPage(
    container: HTMLElement,
    onReset: () => void,
    onEdit: () => void
): Promise<void> {
    const page = document.createElement('div');
    page.className = 'visualization-page fade-in';

    // Header
    const header = document.createElement('div');
    header.className = 'viz-header';

    const title = document.createElement('h1');
    title.textContent = 'The Collective Spectrum';

    const subtitle = document.createElement('p');
    subtitle.textContent = 'How does your philosophy compare to others?';

    header.appendChild(title);
    header.appendChild(subtitle);
    page.appendChild(header);

    // Main container
    const vizContainer = document.createElement('div');
    vizContainer.className = 'viz-container';

    // Left: Spectrum visualization
    const spectrumCard = document.createElement('div');
    spectrumCard.className = 'viz-card';

    const spectrumTitle = document.createElement('h2');
    spectrumTitle.textContent = 'Preference Heatmap';

    spectrumCard.appendChild(spectrumTitle);

    // Create heatmap
    const spectrumData = await getSpectrum();

    // Calculate statistics
    const scaleIds = SCALES.map((s) => s.id);
    const dominance = calculateDominance(spectrumData, scaleIds);

    const heatmapContainer = document.createElement('div');
    heatmapContainer.className = 'heatmap-container';

    const heatmap = document.createElement('div');
    heatmap.className = 'heatmap';

    // Show top comparisons by dominance difference
    const entries = Object.entries(spectrumData)
        .sort(([keyA], [keyB]) => {
            const [aId1, aId2] = keyA.replace('_vs_', '|').split('|');
            const [bId1, bId2] = keyB.replace('_vs_', '|').split('|');
            const aDiff = Math.abs((dominance[aId1] || 0) - (dominance[aId2] || 0));
            const bDiff = Math.abs((dominance[bId1] || 0) - (dominance[bId2] || 0));
            return bDiff - aDiff;
        })
        .slice(0, 12);

    entries.forEach(([key, data]: [string, any]) => {
        const row = document.createElement('div');
        row.className = 'heatmap-row';

        // Parse question
        const [scaleAId, scaleBId] = key.replace('_vs_', '|').split('|');
        const scaleA = SCALES.find((s) => s.id === scaleAId);
        const scaleB = SCALES.find((s) => s.id === scaleBId);

        if (!scaleA || !scaleB) return;

        const label = document.createElement('div');
        label.className = 'heatmap-label';
        label.textContent = scaleA.name;

        const cells = document.createElement('div');
        cells.className = 'heatmap-cells';

        const total = data.A + data.B;
        const percentA = total > 0 ? (data.A / total) * 100 : 50;

        const cellA = document.createElement('div');
        cellA.className = 'heatmap-cell';
        cellA.style.background = getHeatmapColorGradient(percentA / 100);
        cellA.textContent = `${Math.round(percentA)}%`;
        cellA.title = `Chose "${scaleA.name}": ${data.A} users`;

        const cellB = document.createElement('div');
        cellB.className = 'heatmap-cell';
        cellB.style.background = getHeatmapColorGradient((100 - percentA) / 100);
        cellB.textContent = `${Math.round(100 - percentA)}%`;
        cellB.title = `Chose "${scaleB.name}": ${data.B} users`;

        cells.appendChild(cellA);
        cells.appendChild(cellB);

        row.appendChild(label);
        row.appendChild(cells);
        heatmap.appendChild(row);
    });

    heatmapContainer.appendChild(heatmap);
    spectrumCard.appendChild(heatmapContainer);

    // Add dominance rankings
    const rankingsDiv = document.createElement('div');
    rankingsDiv.style.marginTop = '2rem';
    rankingsDiv.style.padding = '1rem';
    rankingsDiv.style.background = 'var(--background)';
    rankingsDiv.style.borderRadius = '8px';

    const rankingsTitle = document.createElement('h3');
    rankingsTitle.style.marginBottom = '1rem';
    rankingsTitle.textContent = 'Most Dominant Scales';
    rankingsDiv.appendChild(rankingsTitle);

    const sorted = Object.entries(dominance)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5);

    sorted.forEach(([scaleId, dom]) => {
        const scale = SCALES.find((s) => s.id === scaleId);
        if (!scale) return;

        const item = document.createElement('div');
        item.style.display = 'flex';
        item.style.alignItems = 'center';
        item.style.marginBottom = '0.5rem';

        const bar = document.createElement('div');
        bar.style.width = '100%';
        bar.style.height = '24px';
        bar.style.background = `linear-gradient(90deg, ${getScaleCategoryColor(scale.category)}, ${getScaleCategoryColor(scale.category)}88)`;
        bar.style.borderRadius = '4px';
        bar.style.marginRight = '1rem';
        bar.style.position = 'relative';

        const barFill = document.createElement('div');
        barFill.style.width = dom * 100 + '%';
        barFill.style.height = '100%';
        barFill.style.background = getScaleCategoryColor(scale.category);
        barFill.style.borderRadius = '4px';
        barFill.style.transition = 'width 0.3s ease';

        bar.appendChild(barFill);

        const label = document.createElement('span');
        label.style.fontSize = '0.9rem';
        label.style.color = 'var(--text-dark)';
        label.style.fontWeight = '600';
        label.style.whiteSpace = 'nowrap';
        label.textContent = `${scale.name}: ${Math.round(dom * 100)}%`;

        item.appendChild(bar);
        item.appendChild(label);
        rankingsDiv.appendChild(item);
    });

    spectrumCard.appendChild(rankingsDiv);
    vizContainer.appendChild(spectrumCard);

    // Right: Philosophies list
    const philosophiesCard = document.createElement('div');
    philosophiesCard.className = 'viz-card';

    const philosophiesTitle = document.createElement('h2');
    philosophiesTitle.textContent = 'Recent Philosophies';

    philosophiesCard.appendChild(philosophiesTitle);

    const philosophiesList = document.createElement('div');
    philosophiesList.className = 'philosophies-list';

    const philosophies = await getPhilosophies();

    if (philosophies.length === 0) {
        const empty = document.createElement('p');
        empty.style.color = 'var(--text-light)';
        empty.textContent = 'No philosophies submitted yet.';
        philosophiesList.appendChild(empty);
    } else {
        philosophies.forEach((philosophy) => {
            const item = document.createElement('div');
            item.className = 'philosophy-item';

            const philosophyTitle = document.createElement('div');
            philosophyTitle.className = 'philosophy-title';
            philosophyTitle.textContent = philosophy.title;

            const meta = document.createElement('div');
            meta.className = 'philosophy-meta';
            const date = new Date(philosophy.timestamp);
            meta.textContent = `${philosophy.answers.length} comparisons • ${date.toLocaleDateString()}`;

            item.appendChild(philosophyTitle);
            item.appendChild(meta);

            philosophiesList.appendChild(item);
        });
    }

    philosophiesCard.appendChild(philosophiesList);
    vizContainer.appendChild(philosophiesCard);

    page.appendChild(vizContainer);

    // Controls
    const controls = document.createElement('div');
    controls.className = 'viz-controls';

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit Your Answers';
    editBtn.style.background = 'var(--secondary)';
    editBtn.addEventListener('click', onEdit);

    const newBtn = document.createElement('button');
    newBtn.textContent = 'Submit Another Philosophy';
    newBtn.style.background = 'var(--accent)';
    newBtn.addEventListener('click', onReset);

    controls.appendChild(editBtn);
    controls.appendChild(newBtn);

    page.appendChild(controls);

    container.appendChild(page);
}

function getHeatmapColorGradient(value: number): string {
    // value: 0 = light (low preference), 1 = dark (high preference) - neutral palette
    if (value < 0.3) return '#d4dce6'; // Light
    if (value < 0.5) return '#a0b9d4'; // Light-mid
    if (value < 0.7) return '#7d9fc1'; // Mid
    return '#5b7fa6'; // Dark
}
