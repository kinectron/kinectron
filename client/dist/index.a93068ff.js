/**
 * P5Visualizer
 * Handles p5.js visualization for color and depth streams
 */ class P5Visualizer {
    constructor(){
        // p5.js canvas and instance
        this.canvas = null;
        this.p5Instance = null;
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
            // Store the p5 instance
            this.p5Instance = p;
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
        if (this.p5Instance) {
            this.p5Instance.resizeCanvas(width, height);
            this.p5Instance.background(255);
        }
    }
    /**
   * Clear canvas
   */ clearCanvas() {
        if (this.p5Instance) this.p5Instance.background(255);
    }
    /**
   * Display color frame
   * @param {Object} frame - Color frame data
   */ displayColorFrame(frame) {
        if (this.p5Instance && frame.src) this.p5Instance.loadImage(frame.src, (loadedImage)=>{
            // Clear canvas
            this.p5Instance.background(255);
            // Draw the image
            this.p5Instance.image(loadedImage, 0, 0, this.p5Instance.width, this.p5Instance.height);
            // Update frame count
            this.frameCount++;
            // Set active state
            this.setActive(true);
            if (window.DEBUG && window.DEBUG.RAW_DEPTH) console.log(`Color image drawn: ${loadedImage.width}x${loadedImage.height}`);
        });
        else console.warn('Cannot display color frame: p5 instance or frame source not available');
    }
    /**
   * Display depth frame
   * @param {Object} frame - Depth frame data
   */ displayDepthFrame(frame) {
        if (this.p5Instance && frame.src) this.p5Instance.loadImage(frame.src, (loadedImage)=>{
            // Clear canvas
            this.p5Instance.background(255);
            // Draw the image
            this.p5Instance.image(loadedImage, 0, 0, this.p5Instance.width, this.p5Instance.height);
            // Update frame count
            this.frameCount++;
            // Set active state
            this.setActive(true);
            if (window.DEBUG && window.DEBUG.RAW_DEPTH) console.log(`Depth image drawn: ${loadedImage.width}x${loadedImage.height}`);
        }, (err)=>{
            console.error(`Error loading depth image: ${err}`);
        });
        else console.warn('Cannot display depth frame: p5 instance or frame source not available');
    }
    /**
   * Display skeleton frame
   * @param {Object} frame - Skeleton frame data with bodies array
   */ displaySkeletonFrame(frame) {
        if (!this.p5Instance) {
            console.warn('Cannot display skeleton: p5 instance not available');
            return;
        }
        // Clear canvas
        this.p5Instance.background(255);
        // Draw skeletons if bodies exist
        if (frame.bodies && frame.bodies.length > 0) {
            // Colors for different bodies
            const colors = [
                this.p5Instance.color(255, 0, 0),
                this.p5Instance.color(0, 255, 0),
                this.p5Instance.color(0, 0, 255),
                this.p5Instance.color(255, 255, 0),
                this.p5Instance.color(0, 255, 255),
                this.p5Instance.color(255, 0, 255)
            ];
            // Draw each body
            frame.bodies.forEach((body, index)=>{
                const color = colors[index % colors.length];
                this._drawSkeleton(body, color);
            });
            // Update frame count
            this.frameCount++;
            // Set active state
            this.setActive(true);
            if (window.DEBUG && window.DEBUG.DATA) console.log(`Skeleton drawn: ${frame.bodies.length} bodies`);
        } else console.warn('No bodies in skeleton frame');
    }
    /**
   * Draw a single skeleton
   * @private
   * @param {Object} body - Body data with skeleton information
   * @param {p5.Color} color - Color to use for this skeleton
   */ _drawSkeleton(body, color) {
        if (!body.skeleton || !body.skeleton.joints) {
            console.warn('No skeleton joints in body data');
            return;
        }
        const p51 = this.p5Instance;
        const joints = body.skeleton.joints;
        // Draw joints
        p51.fill(color);
        p51.noStroke();
        joints.forEach((joint)=>{
            // Scale joint coordinates to canvas size
            const x = joint.depthX * p51.width;
            const y = joint.depthY * p51.height;
            // Draw joint
            p51.ellipse(x, y, 10, 10);
        });
        // Draw connections between joints (bone structure)
        p51.stroke(color);
        p51.strokeWeight(3);
        // Define connections (pairs of joint indices)
        const connections = [
            // Torso
            [
                0,
                1
            ],
            [
                1,
                20
            ],
            [
                20,
                2
            ],
            [
                2,
                3
            ],
            // Left arm
            [
                20,
                4
            ],
            [
                4,
                5
            ],
            [
                5,
                6
            ],
            [
                6,
                7
            ],
            [
                7,
                21
            ],
            [
                6,
                22
            ],
            // Right arm
            [
                20,
                8
            ],
            [
                8,
                9
            ],
            [
                9,
                10
            ],
            [
                10,
                11
            ],
            [
                11,
                23
            ],
            [
                10,
                24
            ],
            // Left leg
            [
                0,
                12
            ],
            [
                12,
                13
            ],
            [
                13,
                14
            ],
            [
                14,
                15
            ],
            // Right leg
            [
                0,
                16
            ],
            [
                16,
                17
            ],
            [
                17,
                18
            ],
            [
                18,
                19
            ]
        ];
        // Draw lines for connections
        connections.forEach(([i, j])=>{
            if (joints[i] && joints[j]) p51.line(joints[i].depthX * p51.width, joints[i].depthY * p51.height, joints[j].depthX * p51.width, joints[j].depthY * p51.height);
        });
    }
    /**
   * Set active state
   * @param {boolean} active - Whether the visualizer is active
   */ setActive(active) {
        this.isActive = active;
        if (!active) this.frameCount = 0;
    }
}

//# sourceMappingURL=index.a93068ff.js.map
