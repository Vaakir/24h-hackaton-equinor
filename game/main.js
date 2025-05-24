import { Renderer } from "./js/core/renderer.js";
import { Engine } from "./js/core/engine.js";
import { Grid } from "./js/core/grid.js";
import { cells } from "./js/core/cell.js";
import { InputService } from "./js/core/inputService.js";
import { ElectricitySystem } from "./js/systems/electricity.js";
import { StateRecorderSystem } from "./js/systems/stateRecorder.js";
import { WeatherSystem } from "./js/systems/weather.js";
import { BuilderService } from "./js/core/builderService.js";
import { AudioManager } from "./js/core/audio.js";
import { PlayerLevelingSystem } from "./js/systems/playerLeveling.js";
import { PauseMenu } from "./js/ui/pauseMenu.js";
import { MainMenu } from "./js/ui/mainMenu.js";

const ZOOM_AMOUNT = 1.2;
populateShopPanel();
class Game {
    constructor() {
        this.audioManager = new AudioManager();
        this.initAudio().then(r => console.log('Audio initialized'));
        setupAudioUI(this.audioManager);

        this.grid = new Grid(20, 16);
        this.renderer = new Renderer(document.getElementById("gameCanvas"));
        // Scale the canvas to fit the screen

        this.viewport = this.renderer.viewport;
        this.viewport.position.x = -(this.grid.width-this.viewport.getWidth())/2;
        this.viewport.position.y = -(this.grid.height-this.viewport.getHeight())/2;
        this.viewport.setGridSize(this.grid.width, this.grid.height);
        this.inputService = new InputService(this.renderer.canvas);
        
        let levelingSystem = new PlayerLevelingSystem();
        this.builderService = new BuilderService(this.grid, levelingSystem, this.audioManager);
        
        clickBuildStructure = (type)=>{
            this.builderService.selectedType = type;
        };

        window.addEventListener("resize", this.handleResize.bind(this));


        this.inputService.onMouseMove = (mouse)=>{
            if(mouse.button==0) return;
            this.viewport.pan(
                mouse.dx / this.viewport.getCellSize(),
                mouse.dy / this.viewport.getCellSize()
            );
        }
        this.inputService.onClick = (mouse) => {
            this.builderService.attemptBuild(this.viewport.screenToGrid(mouse.screenPos).floor());
        }

        this.inputService.onScroll = (mouse) => {
            this.viewport.zoom(
                ZOOM_AMOUNT,
                mouse.screenPos,
                mouse.scroll < 0
            );
        }
        
        // this.timeseriesManager = new TimeseriesManager([
        //     new Production("Production", this.grid, 30, 200, 100, 50),
        //     new Timeseries("Capital", 30, 400, 100, 50),
        // ]);

        this.engine = new Engine(this.renderer, this.grid);
        this.pauseMenu = new PauseMenu(this.engine, this.audioManager);
        this.mainMenu = new MainMenu(this);

        let electricitySystem = new ElectricitySystem(this.grid);
        this.engine.addSystem("Electricity", electricitySystem);
        
        let weatherSystem = new WeatherSystem();
        this.engine.addSystem("SimTime", weatherSystem);
        
        let stateRecorderSystem = new StateRecorderSystem({
            "Sunshine": (state, dt) => state.factors["sun"],
            "Wind": (state, dt) => state.factors["wind"],
            // "Temperature": (state, dt) => state.factors["temperature"],
            "Production (kW)": (state, dt) => state.factors["production"],
            "Consumption (kW)": (state, dt) => state.factors["consumption"],
            "Excess": (state, dt) => state.factors["excess"],
        });
        this.engine.addSystem("StateRecorder", stateRecorderSystem);

        this.engine.addSystem("LevelingSystem", levelingSystem);

    }

    async initAudio() {
        try {
            await this.audioManager.loadMusic('background', 'assets/sounds/bgm.mp3');
            await this.audioManager.loadMusic('pause', 'assets/sounds/pause.mp3');
            await this.audioManager.loadSound('build', 'assets/sounds/build.wav');

            document.addEventListener('click', () => {
                this.audioManager.resumeAudioContext();
                this.audioManager.playMusic('background', true);
                this.audioManager.setMusicVolume(0.3);
            }, { once: true });
        } catch (error) {
            console.error('Failed to initialize audio:', error);
        }
    }

    handleResize() {
        const width = window.innerWidth - 20;
        const height = window.innerHeight - 30;
        this.renderer.resize(width, height);
    }

    start() {
        console.log("Game starting...");
        this.engine.start();
    }

    addStartupCells() {
        // Adds a windmill, a cable and a city
        // game.grid.update(cells.WINDMILL, game.grid.width/2-2, game.grid.height/2-1);
        // game.grid.update(cells.CABLE, game.grid.width/2, game.grid.height/2);
        // game.grid.update(cells.CITY, game.grid.width/2+1, game.grid.height/2-1);

        // Make a forest surrounding the map
        for(let x=0; x<this.grid.width; x++){
            for(let y=0; y<this.grid.height; y++){
                let dx = (x-this.grid.width/2)/this.grid.width*2;
                let dy = (y-this.grid.height/2)/this.grid.height*2;
                let density = dx*dx+dy*dy;
                if(density > 0.7)
                    this.grid.update(cells.FOREST, x, y);
            }
        }

    }
}

const game = new Game();

window.addEventListener("load", () => {
    game.mainMenu.show();
});

function setupAudioUI(audioManager) {
    const audioToggle = document.getElementById('audioToggle');
    const soundWaves = document.getElementById('soundWaves');

    let isMuted = false;

    audioToggle.addEventListener('click', () => {
        isMuted = !isMuted;
        if (isMuted) {
            audioManager.mute();
            soundWaves.style.display = 'none';
        } else {
            audioManager.unmute();
            soundWaves.style.display = 'block';
        }
    });
}
