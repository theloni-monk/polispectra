import { saveDraft } from '../utils.js';

export function renderLandingPage(
    container: HTMLElement,
    onContinue: () => void
): void {
    const page = document.createElement('div');
    page.className = 'landing-page fade-in';

    const content = document.createElement('div');
    content.className = 'landing-content';

    const description = document.createElement('p');
    description.innerHTML =
        'Help us understand how you prioritize the different forces in your life. ' +
        'Your responses are anonymous and will be aggregated to visualize collective political sentiment.';

    const question = document.createElement('div');
    question.className = 'landing-question';

    const questionTitle = document.createElement('h2');
    questionTitle.textContent = 'Are you more important than the world?';

    const buttons = document.createElement('div');
    buttons.className = 'answer-buttons';

    const yesBtn = document.createElement('button');
    yesBtn.className = 'answer-btn yes';
    yesBtn.textContent = 'Yes, I am';
    yesBtn.addEventListener('click', () => {
        saveDraft({ initialAnswer: 'yes', answers: {}, philosophyTitle: '' });
        onContinue();
    });

    const noBtn = document.createElement('button');
    noBtn.className = 'answer-btn no';
    noBtn.textContent = 'No, the world is';
    noBtn.addEventListener('click', () => {
        saveDraft({ initialAnswer: 'no', answers: {}, philosophyTitle: '' });
        onContinue();
    });

    buttons.appendChild(yesBtn);
    buttons.appendChild(noBtn);

    question.appendChild(questionTitle);
    question.appendChild(buttons);

    content.appendChild(description);
    content.appendChild(question);

    const title = document.createElement('h1');
    title.textContent = 'Polispectra';

    page.appendChild(title);
    page.appendChild(content);
    container.appendChild(page);
}
