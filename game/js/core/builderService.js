class BuilderService {
    constructor(grid, playerSystem, audioManager){
        this.selectedType = null;
        this.grid = grid;
        this.playerSystem = playerSystem;
        this.audioManager = audioManager;
    }
    attemptBuild(position){
        if(this.selectedType){
            let buildCost = config["cells"][this.selectedType].buildCost;
            if(this.playerSystem.funds >= buildCost){
                this.audioManager.playSound('build');
                this.grid.update(this.selectedType, position.x, position.y);
                this.playerSystem.funds -= buildCost;
            }
            this.selectedType = null;
        }
    }
}

export { BuilderService };