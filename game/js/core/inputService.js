import { Vector } from "../utils/vector.js";

class InputService {
    constructor(canvasElement){
        this.mouse = {
            button: 0,
            screenPos: new Vector(),
            dx:0,
            dy:0,
            scroll:0,
        };
        this.onMouseMove = null;
        this.onClick = null;
        this.onScroll = null;

        canvasElement.addEventListener("mousedown", (e)=>{
            this.mouse.button = e.buttons;
            if(this.onClick) this.onClick(this.mouse);
            e.preventDefault();
        });
        
        canvasElement.addEventListener("mouseup", (e)=>{
            this.mouse.button = e.buttons;
            e.preventDefault();
        });

        const onMouseWheel = (e)=>{
            this.mouse.scroll = e.deltaY;
            if(this.onScroll) this.onScroll(this.mouse);
        }
        if(window.onwheel !== undefined) {
            window.addEventListener('wheel', onMouseWheel)
        } else if(window.onmousewheel !== undefined) {
            window.addEventListener('mousewheel', onMouseWheel)
        } else {
            console.warn("unsupported browser");
        }

        canvasElement.addEventListener("mousemove", (e)=>{
            this.mouse.dx = e.clientX - this.mouse.screenPos.x;
            this.mouse.dy = e.clientY - this.mouse.screenPos.y;
            this.mouse.screenPos.x = e.clientX;
            this.mouse.screenPos.y = e.clientY;
            if(this.onMouseMove) this.onMouseMove(this.mouse);
            e.preventDefault();
        });
    }
}

export { InputService }