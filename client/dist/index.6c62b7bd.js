/**
 * UIController
 * Handles UI elements, button states, and status updates
 */ class UIController {
    constructor(){
        // Cache DOM elements
        this.elements = {
            initializeKinectBtn: document.getElementById('initializeKinectBtn'),
            startColorBtn: document.getElementById('startColorBtn'),
            startDepthBtn: document.getElementById('startDepthBtn'),
            startRawDepthBtn: document.getElementById('startRawDepthBtn'),
            stopStreamBtn: document.getElementById('stopStreamBtn'),
            connectionStatus: document.getElementById('connectionStatus'),
            streamStatus: document.getElementById('streamStatus'),
            frameRate: document.getElementById('frameRate'),
            resolution: document.getElementById('resolution'),
            debugToggle: document.getElementById('debugToggle'),
            debugPerformance: document.getElementById('debugPerformance'),
            debugData: document.getElementById('debugData'),
            debugPeer: document.getElementById('debugPeer')
        };
        // Flag to track if Kinect is initialized
        this.isKinectInitialized = false;
    }
    /**
   * Initialize the controller
   * @returns {UIController} - The initialized controller instance
   */ static initialize() {
        const controller = new UIController();
        return controller;
    }
    /**
   * Set up event handlers for UI elements
   * @param {Object} handlers - Object containing event handler functions
   */ setupEventHandlers(handlers) {
        // Initialize Kinect button
        const initializeKinectBtn = document.getElementById('initializeKinectBtn');
        if (initializeKinectBtn && handlers.initializeKinect) initializeKinectBtn.addEventListener('click', handlers.initializeKinect);
        // Stream control buttons
        if (this.elements.startColorBtn && handlers.startColorStream) this.elements.startColorBtn.addEventListener('click', handlers.startColorStream);
        if (this.elements.startDepthBtn && handlers.startDepthStream) this.elements.startDepthBtn.addEventListener('click', handlers.startDepthStream);
        if (this.elements.startRawDepthBtn && handlers.startRawDepthStream) this.elements.startRawDepthBtn.addEventListener('click', handlers.startRawDepthStream);
        if (this.elements.stopStreamBtn && handlers.stopStream) this.elements.stopStreamBtn.addEventListener('click', handlers.stopStream);
        // Debug panel buttons
        const forceEnableBtn = document.getElementById('forceEnableBtn');
        if (forceEnableBtn && handlers.forceEnableButtons) forceEnableBtn.addEventListener('click', handlers.forceEnableButtons);
        const clearDebugBtn = document.getElementById('clearDebugBtn');
        if (clearDebugBtn && handlers.clearDebugInfo) clearDebugBtn.addEventListener('click', handlers.clearDebugInfo);
        // Debug checkboxes
        if (this.elements.debugToggle && handlers.toggleDebug) this.elements.debugToggle.addEventListener('change', (e)=>handlers.toggleDebug(e.target.checked));
        if (this.elements.debugPerformance && handlers.togglePerformanceDebug) this.elements.debugPerformance.addEventListener('change', (e)=>handlers.togglePerformanceDebug(e.target.checked));
        if (this.elements.debugData && handlers.toggleDataDebug) this.elements.debugData.addEventListener('change', (e)=>handlers.toggleDataDebug(e.target.checked));
        if (this.elements.debugPeer && handlers.togglePeerDebug) this.elements.debugPeer.addEventListener('change', (e)=>handlers.togglePeerDebug(e.target.checked));
    }
    /**
   * Update connection status display
   * @param {string} status - Status message to display
   * @param {boolean} isSuccess - Whether the status represents a success state
   */ updateConnectionStatus(status, isSuccess = false) {
        if (this.elements.connectionStatus) this.elements.connectionStatus.innerHTML = isSuccess ? `<span class="success">Connection Status: ${status}</span>` : `<span class="error">Connection Status: ${status}</span>`;
    }
    /**
   * Update stream status display
   * @param {string} status - Status message to display
   * @param {boolean} isSuccess - Whether the status represents a success state
   */ updateStreamStatus(status, isSuccess = false) {
        if (this.elements.streamStatus) this.elements.streamStatus.innerHTML = isSuccess ? `<span class="success">Stream Status: ${status}</span>` : `Stream Status: ${status}`;
    }
    /**
   * Update frame rate display
   * @param {string} frameRate - Frame rate information to display
   */ updateFrameRate(frameRate) {
        if (this.elements.frameRate) this.elements.frameRate.textContent = `Frame Rate: ${frameRate}`;
    }
    /**
   * Update resolution display
   * @param {string} resolution - Resolution information to display
   */ updateResolution(resolution) {
        if (this.elements.resolution) this.elements.resolution.textContent = `Resolution: ${resolution}`;
    }
    /**
   * Enable the Initialize Kinect button
   * This is called when the peer connection is established
   */ enableInitializeKinectButton() {
        if (this.elements.initializeKinectBtn) this.elements.initializeKinectBtn.disabled = false;
    }
    /**
   * Enable stream control buttons
   * @param {boolean} force - Whether to force enable buttons regardless of Kinect initialization status
   */ enableStreamButtons(force = false) {
        // Only enable buttons if Kinect is initialized or if force is true
        if (this.isKinectInitialized || force) {
            console.log('Enabling stream buttons - Kinect initialized:', this.isKinectInitialized, 'Force:', force);
            if (this.elements.startColorBtn) this.elements.startColorBtn.disabled = false;
            if (this.elements.startDepthBtn) this.elements.startDepthBtn.disabled = false;
            if (this.elements.startRawDepthBtn) this.elements.startRawDepthBtn.disabled = false;
            if (this.elements.stopStreamBtn) this.elements.stopStreamBtn.disabled = false;
        } else console.log('Not enabling buttons - Kinect not initialized and not forced');
    }
    /**
   * Set Kinect initialization status
   * @param {boolean} status - Whether Kinect is initialized
   */ setKinectInitialized(status) {
        console.log('Setting Kinect initialized status to:', status);
        this.isKinectInitialized = status;
    }
    /**
   * Disable stream control buttons
   */ disableStreamButtons() {
        if (this.elements.startColorBtn) this.elements.startColorBtn.disabled = true;
        if (this.elements.startDepthBtn) this.elements.startDepthBtn.disabled = true;
        if (this.elements.startRawDepthBtn) this.elements.startRawDepthBtn.disabled = true;
        if (this.elements.stopStreamBtn) this.elements.stopStreamBtn.disabled = true;
    }
    /**
   * Force enable buttons (used as a fallback)
   */ forceEnableButtons() {
        console.log('Force enabling buttons');
        this.enableStreamButtons(true);
    }
    /**
   * Check if buttons are disabled
   * @returns {boolean} - True if any stream button is disabled
   */ areButtonsDisabled() {
        return this.elements.startColorBtn && this.elements.startColorBtn.disabled || this.elements.startDepthBtn && this.elements.startDepthBtn.disabled || this.elements.startRawDepthBtn && this.elements.startRawDepthBtn.disabled || this.elements.stopStreamBtn && this.elements.stopStreamBtn.disabled;
    }
    /**
   * Enable debug controls
   * @param {boolean} enabled - Whether debug is enabled
   */ enableDebugControls(enabled) {
        if (this.elements.debugPerformance) this.elements.debugPerformance.disabled = !enabled;
        if (this.elements.debugData) this.elements.debugData.disabled = !enabled;
        if (this.elements.debugPeer) this.elements.debugPeer.disabled = !enabled;
    }
}

//# sourceMappingURL=index.6c62b7bd.js.map
