import { getPhilosophies, getSpectrum, SCALES } from '../utils.js';

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
    const heatmapContainer = document.createElement('div');
    heatmapContainer.className = 'heatmap-container';

    const heatmap = document.createElement('div');
    heatmap.className = 'heatmap';

    // Show top comparisons (sample)
    const entries = Object.entries(spectrumData).slice(0, 8);

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
        cellA.style.background = getHeatmapColor(percentA);
        cellA.textContent = `${Math.round(percentA)}%`;
        cellA.title = `Chose "${scaleA.name}": ${data.A} users`;

        const cellB = document.createElement('div');
        cellB.className = 'heatmap-cell';
        cellB.style.background = getHeatmapColor(100 - percentA);
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
    newBtn.style.background = 'var(--success)';
    newBtn.addEventListener('click', onReset);

    controls.appendChild(editBtn);
    controls.appendChild(newBtn);

    page.appendChild(controls);

    container.appendChild(page);
}

function getHeatmapColor(percentage: number): string {
    if (percentage < 25) return '#ecf0f1';
    if (percentage < 50) return '#ffeaa7';
    if (percentage < 75) return '#ffb366';
    return '#ff7675';
}
