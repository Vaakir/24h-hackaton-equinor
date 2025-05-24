export class StateRecorderSystem {
    constructor(lambdasDict) {
        this.lambdasDict = lambdasDict;
        this.records = {};
        for(let observableName in lambdasDict)
            this.records[observableName] = []; // Initialize an empty array
    }
    
    update(gameState, deltaTime){
        for(let observableName in this.lambdasDict){
            this.records[observableName].push(this.lambdasDict[observableName](gameState, deltaTime));
        }
    }
}