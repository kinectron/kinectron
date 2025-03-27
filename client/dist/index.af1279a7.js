/**
 * MetricsController
 * Handles performance metrics, frame rates, and statistics
 */ class MetricsController {
    constructor(){
        // Metrics state
        this.frameCount = 0;
        this.lastFrameTime = 0;
        this.frameRates = [];
        this.lastFrameTimestamp = 0;
        this.frameLatencies = [];
        this.isStreamActive = false;
        // Bind methods to maintain 'this' context
        this.resetMetrics = this.resetMetrics.bind(this);
        this.updateFrameMetrics = this.updateFrameMetrics.bind(this);
        this.calculateMetrics = this.calculateMetrics.bind(this);
        this.getAverageFrameRate = this.getAverageFrameRate.bind(this);
        this.getAverageLatency = this.getAverageLatency.bind(this);
        // Start metrics calculation interval
        this.metricsInterval = setInterval(this.calculateMetrics, 1000);
    }
    /**
   * Initialize the controller
   * @returns {MetricsController} - The initialized controller instance
   */ static initialize() {
        const controller = new MetricsController();
        return controller;
    }
    /**
   * Reset all metrics
   */ resetMetrics() {
        this.frameCount = 0;
        this.lastFrameTime = Date.now();
        this.frameRates = [];
        this.frameLatencies = [];
        this.isStreamActive = true;
    }
    /**
   * Update metrics based on a new frame
   * @param {Object} frame - The frame data
   */ updateFrameMetrics(frame) {
        // Update frame count
        this.frameCount++;
        const now = Date.now();
        // Calculate frame rate every second
        if (now - this.lastFrameTime >= 1000) {
            const fps = this.frameCount / ((now - this.lastFrameTime) / 1000);
            this.frameRates.push(fps);
            if (this.frameRates.length > 10) this.frameRates.shift(); // Keep last 10 readings
            this.frameCount = 0;
            this.lastFrameTime = now;
        }
        // Calculate frame latency
        if (frame.timestamp) {
            const latency = now - frame.timestamp;
            this.frameLatencies.push(latency);
            if (window.DEBUG.RAW_DEPTH && window.DEBUG.PERFORMANCE) console.log(`Frame latency: ${latency}ms`);
        }
        // Track last frame timestamp for jitter calculation
        this.lastFrameTimestamp = now;
    }
    /**
   * Calculate metrics (called on interval)
   */ calculateMetrics() {
        if (!this.isStreamActive) return;
        // Update UI with frame rate
        const p5FrameRate = window.frameRate ? window.frameRate().toFixed(0) : 0;
        const actualFrameRate = this.getAverageFrameRate().toFixed(1);
        // Update frame rate display
        const frameRateElement = document.getElementById('frameRate');
        if (frameRateElement) frameRateElement.textContent = `Frame Rate: ${p5FrameRate} fps (p5.js) / ${actualFrameRate} fps (actual)`;
    }
    /**
   * Get the average frame rate
   * @returns {number} - The average frame rate
   */ getAverageFrameRate() {
        if (this.frameRates.length === 0) return 0;
        return this.frameRates.reduce((a, b)=>a + b, 0) / this.frameRates.length;
    }
    /**
   * Get the average latency
   * @returns {string} - The average latency in milliseconds
   */ getAverageLatency() {
        if (this.frameLatencies.length === 0) return '0';
        const avgLatency = this.frameLatencies.reduce((a, b)=>a + b, 0) / this.frameLatencies.length;
        return avgLatency.toFixed(1);
    }
    /**
   * Clean up resources when no longer needed
   */ dispose() {
        if (this.metricsInterval) clearInterval(this.metricsInterval);
    }
}

//# sourceMappingURL=index.af1279a7.js.map
