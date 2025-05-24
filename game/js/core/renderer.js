import {Viewport} from "./viewport.js";
import {Vector} from "../utils/vector.js";
import {TilesetManager} from "./tilsetManager.js";
class Renderer {
    constructor(canvas) {
        this.canvas = canvas;

        // Get the device pixel ratio
        this.pixelRatio = window.devicePixelRatio || 1;

        // Set the canvas size in display pixels
        const displayWidth = window.innerWidth - 10;
        const displayHeight = window.innerHeight - 10;

        this.canvas.width = displayWidth * this.pixelRatio;
        this.canvas.height = displayHeight * this.pixelRatio;

        this.canvas.style.width = `${displayWidth}px`;
        this.canvas.style.height = `${displayHeight}px`;

        this.viewport = new Viewport(displayWidth, displayHeight);
        this.ctx = canvas.getContext("2d", {
            alpha: false,
            antialias: false
        });

        this.ctx.scale(this.pixelRatio, this.pixelRatio);

        this.ctx.imageSmoothingEnabled = false;

        this.GRID_COLOR = '#fff';
        this.GRID_LINE_WIDTH = 2;
        this.tilesetManager = new TilesetManager();
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    resize(width, height) {
        this.ctx.save();

        const displayWidth = width;
        const displayHeight = height;

        this.canvas.width = displayWidth * this.pixelRatio;
        this.canvas.height = displayHeight * this.pixelRatio;

        this.canvas.style.width = `${displayWidth}px`;
        this.canvas.style.height = `${displayHeight}px`;

        this.ctx.scale(this.pixelRatio, this.pixelRatio);

        this.ctx.imageSmoothingEnabled = false;

        this.viewport.displayWidth = displayWidth;
        this.viewport.displayHeight = displayHeight;

        this.ctx.restore();
    }

    render(gameState) {
        this.clear();
        this.renderTiles(gameState.grid, gameState.time);
        this.renderGrid();
        this.overlayNight(gameState.lightIntensity);
        // console.log(gameState);
        this.renderGraphs(gameState.stateRecords);
        // Buildings
        this.renderLevelingSystem(gameState.factors["profitable"], gameState.funds);
    }
    overlayNight(light){
        let overlayOpacity = 1-light;
        this.ctx.fillStyle = `rgba(0,0,0,${overlayOpacity})`;
        this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);
    }

    renderTiles(grid, time) {
        // Get visible area of the grid
        const topLeft = this.viewport.screenToGrid(new Vector(0, 0));
        const bottomRight = this.viewport.screenToGrid(new Vector(this.canvas.width, this.canvas.height));

        const startX = Math.floor(topLeft.x - 1);
        const startY = Math.floor(topLeft.y - 1);
        const endX = Math.ceil(bottomRight.x + 1);
        const endY = Math.ceil(bottomRight.y + 1);

        // Iterate through visible cells
        for (let y = startY; y <= endY; y++) {
            for (let x = startX; x <= endX; x++) {
                const cell = grid.getCell(x, y);
                if (!cell) continue;
                this.renderCell(cell,x,y, time);
            }
        }
    }


    renderGrid() {

        this.ctx.strokeStyle = this.GRID_COLOR;
        this.ctx.lineWidth = this.GRID_LINE_WIDTH / this.viewport.scale; // Scale line width

        const topLeft = this.viewport.screenToGrid(new Vector(0, 0));
        const bottomRight = this.viewport.screenToGrid(new Vector(this.canvas.width, this.canvas.height));

        const startX = Math.floor(topLeft.x - 1);
        const startY = Math.floor(topLeft.y - 1);
        const endX = Math.ceil(bottomRight.x + 1);
        const endY = Math.ceil(bottomRight.y + 1);

        for (let x = startX; x <= endX; x++) {
            const startPoint = this.viewport.gridToScreen(new Vector(x, startY));
            const endPoint = this.viewport.gridToScreen(new Vector(x, endY));
            this.ctx.beginPath();
            this.ctx.moveTo(startPoint.x, startPoint.y);
            this.ctx.lineTo(endPoint.x, endPoint.y);
            this.ctx.stroke();
        }

        for (let y = startY; y <= endY; y++) {
            const startPoint = this.viewport.gridToScreen(new Vector(startX, y));
            const endPoint = this.viewport.gridToScreen(new Vector(endX, y));

            this.ctx.beginPath();
            this.ctx.moveTo(startPoint.x, startPoint.y);
            this.ctx.lineTo(endPoint.x, endPoint.y);
            this.ctx.stroke();
        }
    }
    renderPanel(x,y,w,h, outlineWidth = 3) {
        // Fill the panel
        this.ctx.fillStyle = "rgba(226, 219, 213, 0.9)";
        this.ctx.fillRect(x, y, w, h);
    
        // Draw the outline
        this.ctx.lineWidth = outlineWidth;
        this.ctx.strokeStyle = "rgb(71, 51, 55)";
        this.ctx.strokeRect(x, y, w, h);
    }

    renderGraphs(stateRecords) {

        // Function and constants
        function normalize(value, min, max) {
            // returns a value from 0 to 1, all values will
            // be scaled based on the timeseries (max, min) values
            return (value - min) / (max - min);
        }

        const bgPaddingX = 20;
        const bgPaddingY = 20;

        this.ctx.lineWidth = 1;
        let graphKeys = Object.keys(stateRecords);
        let y = 250;
        for (let i = 0; i < graphKeys.length; i++) {
            const values = stateRecords[graphKeys[i]];

    
            // Draw background
            this.ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
            this.ctx.fillRect(
                50 - bgPaddingX,
                y - bgPaddingY,
                250 + bgPaddingX * 2,
                50 + bgPaddingY * 2);

            // Plot title
            this.ctx.font = `12px Arial`;
            this.ctx.beginPath();
            this.ctx.fillStyle = "white";
            this.ctx.fillText(graphKeys[i],
                50, //+ 0.5 * timeseries.width - ((timeseries.name.length) * 16)/2, // 16 is fontsize
                y - bgPaddingY/3,
                250);
            this.ctx.fill();
    
            this.ctx.strokeStyle = "white";
            this.ctx.beginPath();
            let x = 50;
            let j = Math.max(0,values.length-4000);
            let dx = 250/(values.length-j-1);
            const maxValue = Math.max(...values.slice(j)); // Only consider the last items
            const minValue = Math.min(...values.slice(j));
            for (; j < values.length; j++) {
                const lineY = y + 50 * normalize(values[j], maxValue, minValue);
                this.ctx.lineTo(x, lineY);
                x+=dx;
            }
            this.ctx.stroke();
            
            // Write last value
            let writeY = y + 50 * normalize(values[j-1], maxValue, minValue); // Recalc last value of graph
            this.ctx.font = `12px Arial`;
            this.ctx.beginPath();
            this.ctx.fillStyle = "white";
            this.ctx.fillText(Math.round(values[j-1]*100)/100,
                250+30, //+ 0.5 * timeseries.width - ((timeseries.name.length) * 16)/2, // 16 is fontsize
                writeY - bgPaddingY/3,
                250);
            this.ctx.fill();

            y += 100; 
        }
    }
    renderLevelingSystem(profitable, funds) {
        let gdp = profitable * 6.75;
        let maxFunds = 500; // Maximum scale for both bars
        let barMaxWidth = 300; // Maximum bar width
    
        this.ctx.lineWidth = 1;
        this.ctx.font = `12px Arial`;
        
        // Center position for bars
        let barX = 30;//(this.canvas.width - barMaxWidth) / 2.5;
        let barY_GDP = 20;  // Y position for GDP bar
        let barY_Funds = 50; // Y position for Funds bar
        let barHeight = 20;
        
        this.ctx.beginPath();
    
        // --- GDP BAR ---
        this.ctx.fillStyle = "#333"; // Background
        this.ctx.fillRect(barX, barY_GDP, barMaxWidth, barHeight);
        
        let barWidthGDP = Math.min((gdp / maxFunds) * barMaxWidth, barMaxWidth);
        this.ctx.fillStyle = "#4CAF50"; // Green for GDP
        this.ctx.fillRect(barX, barY_GDP, barWidthGDP, barHeight);
        
        this.ctx.fillStyle = "white";
        let gdpText = `GDP: ${Math.round(gdp)}`;
        let gdpTextWidth = this.ctx.measureText(gdpText).width;
        this.ctx.fillText(gdpText, 30, barY_GDP + 15);
    
        // --- FUNDS BAR ---
        this.ctx.fillStyle = "#333"; // Background
        this.ctx.fillRect(barX, barY_Funds, barMaxWidth, barHeight);
        
        maxFunds = 50000; // Maximum scale for both bars
        let barWidthFunds = Math.min((funds / maxFunds) * barMaxWidth, barMaxWidth);
        this.ctx.fillStyle = "#2196F3"; // Blue for funds
        this.ctx.fillRect(barX, barY_Funds, barWidthFunds, barHeight);
        
        this.ctx.fillStyle = "white";
        let fundsText = `Funds: ${Math.round(funds)}`;
        let fundsTextWidth = this.ctx.measureText(fundsText).width;
        this.ctx.fillText(fundsText, 30, barY_Funds + 15);
    
        this.ctx.fill();
    }
    
    

    renderCell(cell, x,y, time) {
        const screenPos = this.viewport.gridToScreen(new Vector(x, y));
        const sourceRect = this.tilesetManager.getTileSourceRect(cell, x, y, time);

        // Use the cell size from viewport for rendered size
        const cellSize = this.viewport.getCellSize();
        this.ctx.drawImage(
            this.tilesetManager.tileset,
            sourceRect.x,
            sourceRect.y,
            sourceRect.width,
            sourceRect.height,
            screenPos.x,
            screenPos.y,
            cellSize,
            cellSize
        );
    }

}



export { Renderer };