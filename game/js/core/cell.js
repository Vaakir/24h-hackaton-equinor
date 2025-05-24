import {Vector} from "../utils/vector.js";

class Cell {
    constructor(x, y, acceptsElectricity = false) {
        this.x = x;
        this.y = y;
        this.acceptsElectricity = acceptsElectricity;
        this.electricityLevel = 0;
        this.electricityGeneration = 0;
        this.profitable = 0;
        this.type = cells.GRASS;

        this.tileOffset = new Vector();
    }

    setType(type) {
        this.type = type;
        // this.electricityLevel = 0;
        let prefab = config["cells"][type];
        this.electricityGeneration = prefab.electricityGeneration;
        this.acceptsElectricity = prefab.acceptsElectricity;
        this.profitable = prefab.profitable;
    }
}

const cells = Object.freeze({
    GRASS: "Grass",
    FOREST: "Forest",
    WINDMILL: "Windmill",
    CABLE: "Cable",
    CITY: "City",
});

export {cells};
export {Cell};