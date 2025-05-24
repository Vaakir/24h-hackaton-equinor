class ElectricitySystem {
    constructor(grid){
        this.grid = grid;
    }

    applyActivation(activationType, envfacKey,gameState, rate, fac){
        switch(activationType){
            case "linear": return rate * fac;
            case "cubic": return rate * fac*fac*fac;
            case "duck": return rate * (Math.sin(fac *Math.PI*3)+4*fac*(1-fac*fac));
            case "fuel":
                // This activation also depletes the resource!!
                let amount = Math.min(gameState.factors[envfacKey],rate);
                amount = Math.max(amount, 0);
                gameState.factors[envfacKey] -= amount;
                return amount;
        }
    }
    
    update(gameState, dt){
        gameState.factors["production"] = 0; // Reset live production factor
        gameState.factors["consumption"] = 0; // Reset live consumption factor
        gameState.factors["excess"] = 0; // Metric for how much electricity is in the net
        gameState.factors["profitable"] = 0; // Metric for how much work gets done

        for(let x=0; x<this.grid.width; x++){
            for(let y=0; y<this.grid.height; y++){
                let cable = this.grid.getCell(x,y);
                cable.electricityLevel *= 0.99; // Decay
                gameState.factors["excess"] += cable.electricityLevel;
                
                if(cable.electricityGeneration){
                    if(cable.electricityGeneration.rate>0){
                        // Production
                        let rate = cable.electricityGeneration.rate;
                        let produce = rate;
                        if(cable.electricityGeneration.type){
                            let fac = Math.abs(gameState.factors[cable.electricityGeneration.environmentFactor]);
                            produce = this.applyActivation(cable.electricityGeneration.type,
                                cable.electricityGeneration.environmentFactor,
                                gameState, rate, fac);
                        }
                        gameState.factors["excess"] -= cable.electricityLevel;
                        cable.electricityLevel = produce;
                        gameState.factors["production"] += produce;
                    }else{
                        // Consumption
                        if(cable.electricityLevel > 0){
                            let rate = cable.electricityGeneration.rate;
                            let consume = rate;
                            if(cable.electricityGeneration.type){
                                let fac = Math.abs(gameState.factors[cable.electricityGeneration.environmentFactor]);
                                consume = this.applyActivation(cable.electricityGeneration.type, 
                                    cable.electricityGeneration.environmentFactor,
                                    gameState, rate, fac);
                            }
                            consume = Math.max(consume,-cable.electricityLevel);
                            gameState.factors["excess"] -= cable.electricityLevel;
                            cable.electricityLevel += consume; // Since it's negative we add
                            gameState.factors["consumption"] -= consume;
                            gameState.factors["profitable"] -= (-1+consume) * cable.profitable;
                            if(cable.electricityLevel>0) cable.electricityLevel=0; // Houses cant store electricity!
                        }
                    }
                }
                if(!cable.acceptsElectricity) continue;
                
                // Cables gain power from neighbors
                let neighbors = this.grid.findConnectedCells(cable.x, cable.y);
                Object.values(neighbors).forEach(neighbor => {
                    if(neighbor==null)return;
                    let donation = neighbor.electricityLevel * 0.4; // Diffusion amount
                    cable.electricityLevel += donation;
                    neighbor.electricityLevel = Math.max(0, neighbor.electricityLevel-donation);
                });

                if(cable.electricityLevel<0)
                    cable.electricityLevel = 0;
            }
        }
    }
}

export { ElectricitySystem };