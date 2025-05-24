import {Vector} from "../utils/vector.js";

const MIN_ZOOM = 3;
const MAX_ZOOM = 25;

// Add padding to prevent completely panning away from the grid
const PADDING = 2; // Grid cells of padding

class Viewport {
    constructor(displayWidth, displayHeight) {
        this.displayWidth = displayWidth;
        this.displayHeight = displayHeight;
        this.position = new Vector();
        // The scale is the number of grid cells that fit on the screen
        this.scale = 18;

        this.gridWidth = 0;
        this.gridHeight = 0;
    }

    setGridSize(width, height) {
        this.gridWidth = width;
        this.gridHeight = height;
        this.clampPosition();
    }

    getCellSize() {
        return this.displayWidth / this.scale;
    }

    getWidth() {
        return this.scale;
    }

    getHeight() {
        return this.scale * this.displayHeight / this.displayWidth;
    }

    zoom(multiplier, cursorPos, invert = false) {
        const cursorBeforeZoom = this.screenToGrid(cursorPos);

        const oldScale = this.scale;
        if (invert) {
            this.scale /= multiplier;
        } else {
            this.scale *= multiplier;
        }
        this.scale = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, this.scale));

        if (oldScale === this.scale) return;

        const cursorAfterZoom = this.screenToGrid(cursorPos);

        this.position.x += cursorAfterZoom.x - cursorBeforeZoom.x;
        this.position.y += cursorAfterZoom.y - cursorBeforeZoom.y;

        this.clampPosition();
    }

    pan(dx, dy) {
        this.position.x += dx;
        this.position.y += dy;
        this.clampPosition();
    }

    clampPosition() {
        const visibleWidth = this.getWidth();
        const visibleHeight = this.getHeight();

        // Since adding to position moves viewport opposite to grid direction,
        // we need to invert our min/max logic
        const maxX = PADDING;  // Maximum position shows start of grid
        const maxY = PADDING;
        const minX = -(this.gridWidth - visibleWidth + PADDING);  // Minimum position shows end of grid
        const minY = -(this.gridHeight - visibleHeight + PADDING);

        this.position.x = Math.max(minX, Math.min(maxX, this.position.x));
        this.position.y = Math.max(minY, Math.min(maxY, this.position.y));
    }

    screenToGrid(point) {
        return new Vector(
            point.x / this.getCellSize() - this.position.x,
            point.y / this.getCellSize() - this.position.y
        );
    }

    gridToScreen(point) {
        return new Vector(
            (point.x + this.position.x) * this.getCellSize(),
            (point.y + this.position.y) * this.getCellSize()
        );
    }
}

export {Viewport};