import { renderLandingPage } from './pages/landing.js';
import { renderSpectralPage } from './pages/spectral.js';
import { renderVisualizationPage } from './pages/visualization.js';
import { DraftState, loadDraft } from './utils.js';

type PageName = 'landing' | 'spectral' | 'visualization';

class Router {
    private currentPage: PageName = 'landing';
    private appElement: HTMLElement;

    constructor() {
        this.appElement = document.getElementById('app')!;
        this.init();
    }

    private init(): void {
        // Check if there's a draft in progress
        const draft = loadDraft();
        if (draft && draft.initialAnswer) {
            this.goto('spectral');
        } else {
            this.goto('landing');
        }

        // Handle browser back/forward
        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.page) {
                this.goto(e.state.page, false);
            }
        });
    }

    goto(page: PageName, pushState: boolean = true): void {
        this.currentPage = page;

        if (pushState) {
            window.history.pushState({ page }, '', `#${page}`);
        }

        this.appElement.innerHTML = '';

        switch (page) {
            case 'landing':
                renderLandingPage(this.appElement, () => this.goto('spectral'));
                break;
            case 'spectral':
                renderSpectralPage(
                    this.appElement,
                    () => this.goto('visualization'),
                    () => this.goto('landing')
                );
                break;
            case 'visualization':
                renderVisualizationPage(
                    this.appElement,
                    () => {
                        // Reset and go back to landing
                        this.goto('landing');
                    },
                    () => this.goto('spectral')
                );
                break;
        }
    }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new Router();
    });
} else {
    new Router();
}
