const SECONDS_PER_DAY = 3600 * 24;

export class WeatherSystem {
    constructor(secondsPerGameDay = 60 * 1){
        this.timeOfDay = SECONDS_PER_DAY / 4; // Start at dawn
        this.day = 100;
        this.realToGameTime = SECONDS_PER_DAY / secondsPerGameDay;
        this.lightIntensity = 0;
    }
    
    update(gameState, dt){
        this.timeOfDay += dt*0.001 * this.realToGameTime;
        if(this.timeOfDay > SECONDS_PER_DAY){
            this.timeOfDay -= SECONDS_PER_DAY;
            this.day += 1;
        }

        // Calculate the light intensity
        let p = this.getDayProgress();
        this.lightIntensity = Math.sin(p*Math.PI*2)*0.4+0.6;
        gameState.factors["time"] = {"day":this.day, "p":p};
        gameState.factors["timeofday"] = p;

        // Lerp wind and temperature
        let dayIndex = this.day;
        let floatingTarget = (dayIndex + p) * 24;
        let baseIndex = Math.floor(floatingTarget);
        p = floatingTarget-baseIndex;
        let thisHour = config["weather"][baseIndex];
        let nextHour = config["weather"][baseIndex+1];
        function get(hour, column, def=0){
            return hour[column] ? hour[column] : def
        }
        gameState.factors["wind"] = get(nextHour,"wind_speed")*p+(1-p)*get(thisHour,"wind_speed");
        gameState.factors["temperature"] = get(nextHour,"temperature")*p+(1-p)*get(thisHour,"temperature");
        
        // Approximate the light intensity with temperature for seasonal differences
        gameState.factors["sun"] = this.lightIntensity + gameState.factors["temperature"]*0.04;

        // Lerp city consumption rate
        gameState.factors["cityConsumption"] = config["consumption"][baseIndex+1]*p+(1-p)*config["consumption"][baseIndex];
    }

    getDayProgress(){
        return this.timeOfDay / SECONDS_PER_DAY;
    }
}