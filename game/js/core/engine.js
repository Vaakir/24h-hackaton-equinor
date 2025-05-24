export class Engine {
    constructor(renderer, grid) {
        this.paused = true;
        this.lastUpdate = performance.now();
        this.renderer = renderer;
        this.systems = new Map();
        this.grid = grid;
        this.factors = {
            "sun":1,
            "wind":1,
            "coal":1,
            "util":1
        };
    }

    addSystem(name, system) {
        this.systems.set(name, system);
    }

    update(deltaTime) {
        let gameState = this.getGameState();
        for (const system of this.systems) {
            system[1].update(gameState, deltaTime);
        }
    }

    gameLoop(timeStamp) {
        const deltaTime = timeStamp - this.lastUpdate;

        if (!this.paused) {
            this.update(deltaTime);
        }

        this.renderer.render(this.getGameState(deltaTime));

        this.lastUpdate = timeStamp;
        requestAnimationFrame(this.gameLoop.bind(this));
    }
    start() {
        console.log("Engine starting...");
        this.paused = false;
        this.lastUpdate = performance.now();
        this.gameLoop(performance.now());
    }

    getGameState() {
        return {
            grid: this.grid,
            time: this.lastUpdate,
            stateRecords: this.systems.get("StateRecorder").records,
            lightIntensity: this.systems.get("SimTime")?this.systems.get("SimTime").lightIntensity:0,
            factors: this.factors,
            funds: this.systems.get("LevelingSystem").funds
        };
    }
}