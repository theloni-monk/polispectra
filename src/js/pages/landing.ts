import { saveDraft } from '../utils.js';

export function renderLandingPage(
    container: HTMLElement,
    onContinue: () => void
): void {
    const page = document.createElement('div');
    page.className = 'landing-page fade-in';

    const content = document.createElement('div');
    content.className = 'landing-content';

    const title = document.createElement('h1');
    title.textContent = 'Polispectra';

    const subheading = document.createElement('div');
    subheading.className = 'landing-subheading';
    subheading.textContent = 'Understanding Personal Values';

    const description = document.createElement('p');
    description.innerHTML =
        'Explore how you prioritize the different spheres of life and meaning. ' +
        'Your responses are anonymous and help us visualize the diversity of human values.';

    const question = document.createElement('div');
    question.className = 'landing-question';

    const questionTitle = document.createElement('h2');
    questionTitle.textContent = 'To begin, consider: Are you more important than the world?';

    const buttons = document.createElement('div');
    buttons.className = 'answer-buttons';

    let selectedAnswer: 'yes' | 'no' | null = null;

    const yesBtn = document.createElement('button');
    yesBtn.className = 'answer-btn';
    yesBtn.textContent = 'I value myself';
    yesBtn.addEventListener('click', () => {
        selectedAnswer = 'yes';
        yesBtn.classList.add('selected');
        noBtn.classList.remove('selected');
        saveDraft({ initialAnswer: 'yes', answers: {}, philosophyTitle: '' });
        setTimeout(() => onContinue(), 200);
    });

    const noBtn = document.createElement('button');
    noBtn.className = 'answer-btn';
    noBtn.textContent = 'I value the world';
    noBtn.addEventListener('click', () => {
        selectedAnswer = 'no';
        noBtn.classList.add('selected');
        yesBtn.classList.remove('selected');
        saveDraft({ initialAnswer: 'no', answers: {}, philosophyTitle: '' });
        setTimeout(() => onContinue(), 200);
    });

    buttons.appendChild(yesBtn);
    buttons.appendChild(noBtn);

    question.appendChild(questionTitle);
    question.appendChild(buttons);

    content.appendChild(title);
    content.appendChild(subheading);
    content.appendChild(description);
    content.appendChild(question);

    page.appendChild(content);
    container.appendChild(page);
}
