class MainMenu {
    constructor(game) {
        this.game = game;
        this.overlay = document.getElementById('mainMenuOverlay');
        this.setupEventListeners()

    }

    setupEventListeners() {
        document.getElementById('playBtn').addEventListener('click', () => {
            this.game.addStartupCells()
            this.game.start();
            this.hide();
        });

        document.getElementById('quitBtn').addEventListener('click', () => {
            window.close();
            // Fallback:
            window.location.href = 'about:blank';
        });
    }

    show() {
        this.overlay.style.display = 'flex';
    }

    hide() {
        this.overlay.style.display = 'none';
    }
}

export { MainMenu }