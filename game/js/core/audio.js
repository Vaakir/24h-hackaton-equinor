export class AudioManager {
    constructor() {
        this.sounds = new Map();
        this.music = new Map();
        this.currentMusic = null;
        this.isMuted = false;
        this.musicVolume = 0.3;
        this.soundVolume = 0.5;

        this.context = new (window.AudioContext)();
        this.masterGain = this.context.createGain();
        this.masterGain.connect(this.context.destination);

        this.musicGain = this.context.createGain();
        this.soundGain = this.context.createGain();

        this.musicGain.connect(this.masterGain);
        this.soundGain.connect(this.masterGain);

        this.setMusicVolume(this.musicVolume);
        this.setSoundVolume(this.soundVolume);
    }

    async loadSound(key, url) {
        try {
            const response = await fetch(url);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await this.context.decodeAudioData(arrayBuffer);
            this.sounds.set(key, audioBuffer);
        } catch (error) {
            console.error(`Error loading sound ${key}:`, error);
        }
    }

    async loadMusic(key, url) {
        try {
            const response = await fetch(url);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await this.context.decodeAudioData(arrayBuffer);
            this.music.set(key, audioBuffer);
        } catch (error) {
            console.error(`Error loading music ${key}:`, error);
        }
    }

    playSound(key) {
        if (this.isMuted) return;

        const buffer = this.sounds.get(key);
        if (buffer) {
            const source = this.context.createBufferSource();
            source.buffer = buffer;
            source.connect(this.soundGain);
            source.start(0);
        }
    }

    playMusic(key, loop = true) {
        if (this.currentMusic) {
            this.stopMusic();
        }

        const buffer = this.music.get(key);
        if (buffer) {
            const source = this.context.createBufferSource();
            source.buffer = buffer;
            source.loop = loop;
            source.connect(this.musicGain);
            source.start(0);
            this.currentMusic = source;
        }
    }

    stopMusic() {
        if (this.currentMusic) {
            this.currentMusic.stop();
            this.currentMusic = null;
        }
    }

    setMusicVolume(value) {
        this.musicVolume = Math.max(0, Math.min(1, value));
        this.musicGain.gain.value = this.musicVolume;
    }

    setSoundVolume(value) {
        this.soundVolume = Math.max(0, Math.min(1, value));
        this.soundGain.gain.value = this.soundVolume;
    }

    mute() {
        this.isMuted = true;
        this.masterGain.gain.value = 0;
    }

    unmute() {
        this.isMuted = false;
        this.masterGain.gain.value = 1;
    }

    resumeAudioContext() {
        if (this.context.state === 'suspended') {
            this.context.resume();
        }
    }
}
