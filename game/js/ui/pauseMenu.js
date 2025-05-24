class PauseMenu {
    constructor(engine, audioManager) {
        this.engine = engine;
        this.audioManager = audioManager;
        this.overlay = document.getElementById('pauseOverlay')
        this.setupEventListeners();
        this.setupVolumeControls();
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.togglePause();
            }
        });

        const resumeButton = document.getElementById('resumeButton');
        resumeButton.addEventListener('click', this.togglePause.bind(this));
        const quitToMenuButton = document.getElementById('quitButton');
        quitToMenuButton.addEventListener('click', this.quitToMenu);
    }

    setupVolumeControls() {
        const musicSlider = document.getElementById('musicVolume');
        const sfxSlider = document.getElementById('sfxVolume');

        musicSlider.addEventListener('input', (e) => {
            const volume = e.target.value / 100;
            this.audioManager.setMusicVolume(volume);
        });

        sfxSlider.addEventListener('input', (e) => {
            const volume = e.target.value / 100;
            this.audioManager.setSoundVolume(volume);
        });


    }

    pause() {
        this.overlay.style.display = 'flex';
        this.audioManager.playMusic('pause', true);
    }

    unPause() {
        this.overlay.style.display = 'none';
        this.audioManager.playMusic('background', true);
    }

    quitToMenu() {
        window.location.reload();

    }

    togglePause() {
        this.engine.paused = !this.engine.paused;
        if (this.engine.paused) {
            this.pause();
        } else {
            this.unPause();
        }
    }
}

export { PauseMenu };