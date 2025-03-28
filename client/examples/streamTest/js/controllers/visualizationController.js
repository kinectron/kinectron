/**
 * VisualizationController
 * Manages visualization strategies for different stream types
 */
class VisualizationController {
  constructor() {
    // Cache DOM elements
    this.elements = {
      canvasContainer: document.getElementById('canvas-container'),
      threeContainer: document.getElementById('three-container'),
    };

    // Visualization state
    this.p5Canvas = null;
    this.threeVisualizer = null;

    // Initialize visualizers
    this._initializeVisualizers();
  }

  /**
   * Initialize the controller
   * @returns {VisualizationController} - The initialized controller instance
   */
  static initialize() {
    const controller = new VisualizationController();
    return controller;
  }

  /**
   * Initialize visualizers
   * @private
   */
  _initializeVisualizers() {
    // Initialize Three.js visualizer
    this.threeVisualizer = ThreeVisualizer.initialize();

    // Initialize P5 visualizer
    this.p5Visualizer = P5Visualizer.initialize();

    // Show p5 canvas by default
    this.showP5Canvas();
  }

  /**
   * Show p5 canvas and hide Three.js canvas
   */
  showP5Canvas() {
    if (this.elements.canvasContainer) {
      this.elements.canvasContainer.style.display = 'block';
    }

    if (this.elements.threeContainer) {
      this.elements.threeContainer.style.display = 'none';
    }
  }

  /**
   * Show Three.js canvas and hide p5 canvas
   */
  showThreeCanvas() {
    if (this.elements.canvasContainer) {
      this.elements.canvasContainer.style.display = 'none';
    }

    if (this.elements.threeContainer) {
      this.elements.threeContainer.style.display = 'block';
    }

    // Initialize Three.js if not already initialized
    if (!this.threeVisualizer.isInitialized()) {
      this.threeVisualizer.initialize();
    }
  }

  /**
   * Resize p5 canvas
   * @param {number} width - Canvas width
   * @param {number} height - Canvas height
   */
  resizeP5Canvas(width, height) {
    if (this.p5Visualizer) {
      this.p5Visualizer.resizeCanvas(width, height);
    }
  }

  /**
   * Clear p5 canvas
   */
  clearP5Canvas() {
    if (this.p5Visualizer) {
      this.p5Visualizer.clearCanvas();
    }
  }

  /**
   * Display color frame on p5 canvas
   * @param {Object} frame - Color frame data
   */
  displayColorFrame(frame) {
    if (this.p5Visualizer) {
      this.p5Visualizer.displayColorFrame(frame);
    } else {
      console.warn('P5Visualizer not initialized');
    }
  }

  /**
   * Display depth frame on p5 canvas
   * @param {Object} frame - Depth frame data
   */
  displayDepthFrame(frame) {
    if (this.p5Visualizer) {
      this.p5Visualizer.displayDepthFrame(frame);
    } else {
      console.warn('P5Visualizer not initialized');
    }
  }

  /**
   * Update point cloud with depth values
   * @param {Uint16Array} depthValues - Raw depth values
   */
  updatePointCloud(depthValues) {
    if (this.threeVisualizer) {
      this.threeVisualizer.updatePointCloud(depthValues);
    }
  }
}
