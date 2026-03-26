import {
    generateQuestions,
    saveDraft,
    loadDraft,
    clearDraft,
    submitPhilosophy,
    SCALES,
    Scale
} from '../utils.js';

export function renderSpectralPage(
    container: HTMLElement,
    onSubmit: () => void,
    onBack: () => void
): void {
    const page = document.createElement('div');
    page.className = 'spectral-page fade-in';

    const allQuestions = generateQuestions();
    // Split macro and granular questions
    const macroQuestions = allQuestions.filter(q => q.isMacro);
    const visibleQuestions = macroQuestions.length > 0 ? macroQuestions : allQuestions.slice(0, Math.min(20, allQuestions.length));
    const draft = loadDraft() || { initialAnswer: 'yes', answers: {}, philosophyTitle: '' };

    let currentQuestionIndex = 0;
    let showingMore = false;

    // Header
    const header = document.createElement('div');
    header.className = 'spectral-header';

    const title = document.createElement('h1');
    title.textContent = 'Your Philosophy';

    const progressInfo = document.createElement('div');
    progressInfo.className = 'progress-info';
    updateProgressInfo();

    header.appendChild(title);
    header.appendChild(progressInfo);
    page.appendChild(header);

    // Main container
    const container2 = document.createElement('div');
    container2.className = 'spectral-container';

    // Left sidebar - questions list
    const leftSidebar = document.createElement('div');
    leftSidebar.className = 'sidebar-questions';

    function updateQuestionLinks(): void {
        leftSidebar.innerHTML = '';
        const display = showingMore ? allQuestions : visibleQuestions;
        display.forEach((q, idx) => {
            const link = document.createElement('div');
            link.className = 'question-link';
            if (idx === currentQuestionIndex) link.classList.add('active');
            if (draft.answers[q.id]) link.classList.add('answered');

            const label = q.isMacro ? `${q.scaleA.category} vs ${q.scaleB.category}` : `${q.scaleA.name.split(' ')[0]} vs ${q.scaleB.name.split(' ')[0]}`;
            link.textContent = label;
            link.title = `${q.scaleA.name} vs ${q.scaleB.name}`;
            link.addEventListener('click', () => {
                currentQuestionIndex = idx;
                renderQuestion();
            });

            leftSidebar.appendChild(link);
        });

        if (!showingMore && allQuestions.length > visibleQuestions.length) {
            const moreBtn = document.createElement('button');
            moreBtn.className = 'show-more-btn';
            moreBtn.style.width = '100%';
            moreBtn.style.marginTop = '1rem';
            moreBtn.textContent = `${allQuestions.length - visibleQuestions.length} more detailed questions`;
            moreBtn.addEventListener('click', () => {
                showingMore = true;
                updateQuestionLinks();
                renderQuestion();
            });
            leftSidebar.appendChild(moreBtn);
        }
    }

    updateQuestionLinks();

    // Center - current question
    const centerContent = document.createElement('div');
    centerContent.className = 'question-card';

    // Right sidebar - stats
    const rightSidebar = document.createElement('div');

    // Render initial question
    function renderQuestion(): void {
        centerContent.innerHTML = '';

        const display = showingMore ? allQuestions : visibleQuestions;
        const question = display[currentQuestionIndex];

        if (!question) return;

        const answer = draft.answers[question.id];

        const questionTitle = document.createElement('h2');
        questionTitle.textContent = `Which is more important to you?`;

        centerContent.appendChild(questionTitle);

        // Build comparison
        const comparison = document.createElement('div');
        comparison.className = 'comparison-slider';

        // Scale A
        const scaleALabel = document.createElement('div');
        scaleALabel.style.marginBottom = '1rem';
        const badgeA = document.createElement('span');
        badgeA.className = `scale-badge ${question.scaleA.category}`;
        const labelA = document.createElement('label');
        labelA.style.marginLeft = '0.5rem';
        labelA.textContent = question.scaleA.name;
        scaleALabel.appendChild(badgeA);
        scaleALabel.appendChild(labelA);

        // Scale B
        const scaleBLabel = document.createElement('div');
        scaleBLabel.style.marginBottom = '1rem';
        const badgeB = document.createElement('span');
        badgeB.className = `scale-badge ${question.scaleB.category}`;
        const labelB = document.createElement('label');
        labelB.style.marginLeft = '0.5rem';
        labelB.textContent = question.scaleB.name;
        scaleBLabel.appendChild(badgeB);
        scaleBLabel.appendChild(labelB);

        // Slider
        const sliderLabels = document.createElement('div');
        sliderLabels.className = 'slider-labels';
        sliderLabels.innerHTML = `<span>More important</span><span>Neutral</span><span>More important</span>`;

        const sliderTrack = document.createElement('div');
        sliderTrack.className = 'slider-track';

        const sliderThumb = document.createElement('div');
        sliderThumb.className = 'slider-thumb';

        // Calculate initial position based on saved answer
        let sliderValue = 50; // neutral
        if (answer) {
            if (answer.preference === 'A') sliderValue = 25;
            else if (answer.preference === 'B') sliderValue = 75;
        }
        sliderThumb.style.left = sliderValue + '%';

        // Slider interaction
        let isDragging = false;

        function updateSlider(e: MouseEvent | TouchEvent): void {
            if (!isDragging) return;

            const rect = sliderTrack.getBoundingClientRect();
            let x = 0;

            if (e instanceof MouseEvent) {
                x = e.clientX - rect.left;
            } else if (e instanceof TouchEvent) {
                x = e.touches[0].clientX - rect.left;
            }

            sliderValue = Math.max(0, Math.min(100, (x / rect.width) * 100));
            sliderThumb.style.left = sliderValue + '%';

            // Determine preference
            if (sliderValue < 40) {
                draft.answers[question.id] = { scaleA: question.scaleA.id, scaleB: question.scaleB.id, preference: 'A' };
            } else if (sliderValue > 60) {
                draft.answers[question.id] = { scaleA: question.scaleA.id, scaleB: question.scaleB.id, preference: 'B' };
            } else {
                draft.answers[question.id] = { scaleA: question.scaleA.id, scaleB: question.scaleB.id, preference: 'neutral' };
            }

            saveDraft(draft);
            updateProgressInfo();
            updateQuestionLinks();
        }

        sliderTrack.addEventListener('mousedown', () => {
            isDragging = true;
        });
        sliderTrack.addEventListener('touchstart', () => {
            isDragging = true;
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
        document.addEventListener('touchend', () => {
            isDragging = false;
        });

        document.addEventListener('mousemove', updateSlider);
        document.addEventListener('touchmove', updateSlider);

        sliderTrack.addEventListener('click', (e) => {
            isDragging = true;
            updateSlider(e as MouseEvent);
            isDragging = false;
        });

        sliderTrack.appendChild(sliderThumb);

        comparison.appendChild(scaleALabel);
        comparison.appendChild(sliderLabels);
        comparison.appendChild(sliderTrack);
        comparison.appendChild(scaleBLabel);

        centerContent.appendChild(comparison);
    }

    function updateProgressInfo(): void {
        const answeredCount = Object.keys(draft.answers).length;
        const display = showingMore ? allQuestions : visibleQuestions;
        progressInfo.innerHTML = `Progress: <span class="required">${answeredCount}</span>/${display.length} answered (need at least 3 to submit)`;
    }

    function updateQuestionLinksold(): void {
        const display = showingMore ? allQuestions : visibleQuestions;
        leftSidebar.querySelectorAll('.question-link').forEach((link, idx) => {
            link.classList.toggle('active', idx === currentQuestionIndex);
            link.classList.toggle('answered', !!draft.answers[display[idx]?.id]);
        });
    }

    // Controls
    const controls = document.createElement('div');
    controls.className = 'spectral-controls';

    const prevBtn = document.createElement('button');
    prevBtn.textContent = '← Previous';
    prevBtn.addEventListener('click', () => {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            renderQuestion();
            updateQuestionLinks();
        }
    });

    const backBtn = document.createElement('button');
    backBtn.textContent = 'Back to Landing';
    backBtn.style.background = 'var(--text-light)';
    backBtn.addEventListener('click', onBack);

    const nextBtn = document.createElement('button');
    nextBtn.textContent = 'Next →';
    nextBtn.addEventListener('click', () => {
        const display = showingMore ? allQuestions : visibleQuestions;
        if (currentQuestionIndex < display.length - 1) {
            currentQuestionIndex++;
            renderQuestion();
            updateQuestionLinks();
        }
    });

    const submitBtn = document.createElement('button');
    submitBtn.textContent = 'Submit & View Spectrum';
    submitBtn.style.background = 'var(--secondary)';
    submitBtn.addEventListener('click', async () => {
        const answeredCount = Object.keys(draft.answers).length;
        if (answeredCount < 3) {
            alert('Please answer at least 3 questions before submitting.');
            return;
        }

        // Get philosophy title
        const title = prompt('Give your philosophy a title (optional)', 'My Philosophy');

        if (title !== null) {
            draft.philosophyTitle = title || 'Unnamed Philosophy';

            // Submit to backend
            await submitPhilosophy({
                title: draft.philosophyTitle,
                timestamp: Date.now(),
                answers: Object.values(draft.answers)
            });

            clearDraft();
            onSubmit();
        }
    });

    controls.appendChild(prevBtn);
    controls.appendChild(backBtn);
    controls.appendChild(nextBtn);
    controls.appendChild(submitBtn);

    container2.appendChild(leftSidebar);
    container2.appendChild(centerContent);
    container2.appendChild(rightSidebar);

    page.appendChild(container2);
    page.appendChild(controls);

    // Initial render
    renderQuestion();
    updateQuestionLinks();

    container.appendChild(page);
}
