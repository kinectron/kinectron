/**
 * ThreeVisualizer
 * Handles Three.js point cloud visualization for raw depth data
 */
class ThreeVisualizer {
  constructor() {
    // Three.js components
    this.renderer = null;
    this.camera = null;
    this.scene = null;
    this.controls = null;
    this.particles = null;
    this.mesh = null;
    this.colors = [];

    // Constants for depth data
    this.DEPTHWIDTH = 320;
    this.DEPTHHEIGHT = 288;
    this.numParticles = this.DEPTHWIDTH * this.DEPTHHEIGHT;

    // Initialization state
    this._initialized = false;
  }

  /**
   * Initialize the visualizer
   * @returns {ThreeVisualizer} - The initialized visualizer instance
   */
  static initialize() {
    const visualizer = new ThreeVisualizer();
    return visualizer;
  }

  /**
   * Check if Three.js has been initialized
   * @returns {boolean} - Whether Three.js has been initialized
   */
  isInitialized() {
    return this._initialized;
  }

  /**
   * Initialize Three.js components
   */
  initialize() {
    // Create renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: document.getElementById('threeCanvas'),
      alpha: 0,
      antialias: true,
      clearColor: 0x000000,
    });

    // Set renderer size to match container
    const container = document.getElementById('three-container');
    this.renderer.setSize(
      container.clientWidth,
      container.clientHeight,
    );

    // Handle window resize
    window.addEventListener('resize', () => {
      this.camera.aspect =
        container.clientWidth / container.clientHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(
        container.clientWidth,
        container.clientHeight,
      );
    });

    // Create camera with wider field of view
    this.camera = new THREE.PerspectiveCamera(
      45, // Wider field of view
      this.renderer.domElement.width /
        this.renderer.domElement.height,
      1,
      10000,
    );

    // Position camera to view the point cloud from a better angle
    this.camera.position.set(0, -100, 300);
    this.camera.lookAt(0, 0, 0);

    // Create controls with better defaults
    this.controls = new THREE.TrackballControls(
      this.camera,
      this.renderer.domElement,
    );
    this.controls.rotateSpeed = 1.5;
    this.controls.zoomSpeed = 1.2;
    this.controls.panSpeed = 0.8;
    this.controls.noZoom = false;
    this.controls.noPan = false;
    this.controls.staticMoving = true;
    this.controls.dynamicDampingFactor = 0.3;

    // Create scene with black background
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);

    // Create particles
    this._createParticles();

    // Begin render loop
    this._render();

    // Mark as initialized
    this._initialized = true;
  }

  /**
   * Create particles for depth feed
   * @private
   */
  _createParticles() {
    this.particles = new THREE.Geometry();

    // Create particles
    for (let y = 0; y < this.DEPTHHEIGHT; y++) {
      for (let x = 0; x < this.DEPTHWIDTH; x++) {
        // Calculate index
        const i = y * this.DEPTHWIDTH + x;

        // Center the point cloud
        const xPos = x - this.DEPTHWIDTH * 0.5;
        const yPos = this.DEPTHHEIGHT - y - this.DEPTHHEIGHT * 0.5;

        // Create a new three point vector with initial z=0
        const vertex = new THREE.Vector3(xPos, yPos, 0);

        // Add it to the particles
        this.particles.vertices.push(vertex);

        // Assign each particle a color based on position
        // This creates a gradient based on position
        const normalizedX = x / this.DEPTHWIDTH;
        const normalizedY = y / this.DEPTHHEIGHT;
        this.colors[i] = new THREE.Color(
          0.5 + normalizedX * 0.5, // R
          0.5 + normalizedY * 0.5, // G
          0.5, // B
        );
      }
    }

    // Give the particles their colors
    this.particles.colors = this.colors;

    // Create material for the points
    let material = new THREE.PointsMaterial({
      size: 2, // Smaller point size for better detail
      vertexColors: THREE.VertexColors,
      sizeAttenuation: true, // Points get smaller with distance
    });

    // Create the points geometry
    this.mesh = new THREE.Points(this.particles, material);

    // Add point cloud to scene
    this.scene.add(this.mesh);
  }

  /**
   * Update point cloud with depth data
   * @param {Uint16Array} depthValues - Raw depth values
   */
  updatePointCloud(depthValues) {
    if (!this.particles) return;

    // Set desired depth range
    const minDepth = 100; // Ignore values too close to 0
    const maxDepth = 6000;

    // Analyze depth values
    let validValues = [];
    let min = Number.MAX_VALUE;
    let max = 0;
    let nonZeroCount = 0;
    let zeroCount = 0;

    // First pass: collect statistics
    for (let i = 0; i < depthValues.length; i++) {
      const depth = depthValues[i];

      // Count zero vs non-zero values for debugging
      if (depth === 0) {
        zeroCount++;
      } else {
        nonZeroCount++;
      }

      if (depth >= minDepth && depth <= maxDepth) {
        validValues.push(depth);
        min = Math.min(min, depth);
        max = Math.max(max, depth);
      }
    }

    // If we don't have enough valid values, use defaults
    if (validValues.length < 100) {
      min = minDepth;
      max = maxDepth;
    }

    // Log statistics (only occasionally to avoid flooding the console)
    if (
      Math.random() < 0.05 &&
      window.DEBUG.RAW_DEPTH &&
      window.DEBUG.PERFORMANCE
    ) {
      console.group('Raw Depth Statistics');
      console.log(
        `Depth range: ${min} to ${max}, valid values: ${validValues.length}`,
      );
      console.log(
        `Zero values: ${zeroCount}, Non-zero values: ${nonZeroCount}`,
      );

      // Log a histogram of depth values (10 buckets)
      if (validValues.length > 0) {
        const bucketSize = (max - min) / 10;
        const histogram = Array(10).fill(0);

        for (const depth of validValues) {
          const bucketIndex = Math.min(
            9,
            Math.floor((depth - min) / bucketSize),
          );
          histogram[bucketIndex]++;
        }

        console.log('Depth histogram:', histogram);

        // Log some sample depth values
        const sampleSize = Math.min(20, validValues.length);
        const sampleValues = validValues.slice(0, sampleSize);
        console.log('Sample depth values:', sampleValues);
      }
      console.groupEnd();
    }

    // Camera view scale factor - adjust this to change the overall scale of the point cloud
    // This doesn't affect precision, just the visual size
    const viewScale = 0.1; // Reduced to make depth more visible

    // Second pass: update particles
    for (let y = 0; y < this.DEPTHHEIGHT; y++) {
      for (let x = 0; x < this.DEPTHWIDTH; x++) {
        const i = y * this.DEPTHWIDTH + x;
        const depth = depthValues[i];

        if (depth < minDepth || depth > maxDepth) {
          // Push the particle far away so we don't see it
          this.particles.vertices[i].z = -10000; // Use negative value to hide
        } else {
          // Use the raw depth value directly with view scaling
          // This preserves the full precision of the depth data
          this.particles.vertices[i].z = -depth * viewScale; // Negative to make closer objects appear in front

          // Update color based on depth using a more detailed gradient
          // Use the local min/max for better color distribution
          const normalizedDepth =
            max !== min ? (depth - min) / (max - min) : 0.5;

          // Use a more sophisticated color mapping
          // This creates a rainbow gradient from red (near) to violet (far)
          const hue = (1.0 - normalizedDepth) * 270; // 0 (red) to 270 (violet)
          this.colors[i].setHSL(hue / 360, 1.0, 0.5);
        }
      }
    }

    // Log some debug info about the point cloud
    if (
      Math.random() < 0.01 &&
      window.DEBUG.RAW_DEPTH &&
      window.DEBUG.DATA
    ) {
      // Only log occasionally
      // Sample a few points to check their z values
      const samplePoints = [];
      for (let i = 0; i < 5; i++) {
        const idx = Math.floor(
          Math.random() * this.particles.vertices.length,
        );
        samplePoints.push({
          index: idx,
          z: this.particles.vertices[idx].z,
          originalDepth: depthValues[idx],
        });
      }
      console.log('Sample points z-values:', samplePoints);
    }

    // Update particles
    this.particles.verticesNeedUpdate = true;
    this.particles.colorsNeedUpdate = true;
  }

  /**
   * Render three.js scene
   * @private
   */
  _render() {
    // Render the scene
    this.renderer.render(this.scene, this.camera);

    // Update the trackball controls with each scene
    this.controls.update();

    // Request anim frame
    requestAnimationFrame(() => this._render());
  }
}
