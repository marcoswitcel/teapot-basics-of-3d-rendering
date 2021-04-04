export default class App {
    /**
     * @param {Object} param0 
     */    
    constructor({ width, height, canvasElement, fullscreen }) {
        this.fullscreen = !!fullscreen;

        if (this.fullscreen) {
            this.updateWidthHeight();
        } else {
            this.width = width;    
            this.height = height;
        }


        this.acquireCanvas(canvasElement);
    }
    
    acquireCanvas(canvasElement) {
        if (canvasElement instanceof HTMLCanvasElement) {
            this.view = canvasElement;
        } else {
            let canvas = document.createElement('canvas');

            canvas.setAttribute('width', this.width);
            canvas.setAttribute('height', this.height);

            document.body.appendChild(canvas);
        }
    }

    updateWidthHeight() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
    }

}