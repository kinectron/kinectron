/**
 * P5Visualizer
 * Handles p5.js visualization for color and depth streams
 */ class P5Visualizer {
    constructor(){
        // p5.js canvas
        this.canvas = null;
        // Visualization state
        this.isActive = false;
        this.frameCount = 0;
        // Constants
        this.AZURE_COLOR_WIDTH = 1280;
        this.AZURE_COLOR_HEIGHT = 720;
        this.AZURE_DEPTH_WIDTH = 640;
        this.AZURE_DEPTH_HEIGHT = 576;
        this.DISPLAY_SCALE = 0.5;
    }
    /**
   * Initialize the visualizer
   * @returns {P5Visualizer} - The initialized visualizer instance
   */ static initialize() {
        const visualizer = new P5Visualizer();
        visualizer._setupP5();
        return visualizer;
    }
    /**
   * Set up p5.js canvas and sketch
   * @private
   */ _setupP5() {
        // Define p5.js sketch
        const sketch = (p)=>{
            p.setup = ()=>{
                // Create canvas
                this.canvas = p.createCanvas(this.AZURE_COLOR_WIDTH * this.DISPLAY_SCALE, this.AZURE_COLOR_HEIGHT * this.DISPLAY_SCALE);
                this.canvas.parent('canvas-container');
                p.pixelDensity(1);
                p.background(255);
            };
            p.draw = ()=>{
                // Draw frame count in corner if stream is active
                if (this.isActive) {
                    p.fill(0);
                    p.textSize(14);
                    p.text(`Frames: ${this.frameCount}`, 10, 20);
                }
            };
        };
        // Create new p5 instance
        new p5(sketch);
    }
    /**
   * Resize canvas
   * @param {number} width - Canvas width
   * @param {number} height - Canvas height
   */ resizeCanvas(width, height) {
        if (window.resizeCanvas) {
            window.resizeCanvas(width, height);
            window.background(255);
        }
    }
    /**
   * Clear canvas
   */ clearCanvas() {
        if (window.background) window.background(255);
    }
    /**
   * Display color frame
   * @param {Object} frame - Color frame data
   */ displayColorFrame(frame) {
        if (window.loadImage) window.loadImage(frame.src, (loadedImage)=>{
            // Clear canvas
            window.background(255);
            // Draw the image
            window.image(loadedImage, 0, 0, window.width, window.height);
            // Update frame count
            this.frameCount++;
            if (window.DEBUG.RAW_DEPTH) console.log(`Color image drawn: ${loadedImage.width}x${loadedImage.height}`);
        });
    }
    /**
   * Display depth frame
   * @param {Object} frame - Depth frame data
   */ displayDepthFrame(frame) {
        if (window.loadImage && frame.src) window.loadImage(frame.src, (loadedImage)=>{
            // Clear canvas
            window.background(255);
            // Draw the image
            window.image(loadedImage, 0, 0, window.width, window.height);
            // Update frame count
            this.frameCount++;
            if (window.DEBUG.RAW_DEPTH) console.log(`Depth image drawn: ${loadedImage.width}x${loadedImage.height}`);
        }, (err)=>{
            console.error(`Error loading depth image: ${err}`);
        });
        else console.warn('No frame.src available to load depth image');
    }
    /**
   * Set active state
   * @param {boolean} active - Whether the visualizer is active
   */ setActive(active) {
        this.isActive = active;
        if (!active) this.frameCount = 0;
    }
}

//# sourceMappingURL=streamTest.ff118588.js.map
