/**
 * DebugController
 * Handles debug panel, logging, and debug flags
 */ class DebugController {
    constructor(){
        // Cache DOM elements
        this.elements = {
            debugInfo: document.getElementById('debugInfo'),
            debugToggle: document.getElementById('debugToggle'),
            debugPerformance: document.getElementById('debugPerformance'),
            debugData: document.getElementById('debugData'),
            debugPeer: document.getElementById('debugPeer'),
            debugFrames: document.getElementById('debugFrames'),
            debugHandlers: document.getElementById('debugHandlers'),
            debugNetwork: document.getElementById('debugNetwork')
        };
        // Bind methods to maintain 'this' context
        this.addDebugInfo = this.addDebugInfo.bind(this);
        this.clearDebugInfo = this.clearDebugInfo.bind(this);
        this.toggleDebug = this.toggleDebug.bind(this);
        this.togglePerformanceDebug = this.togglePerformanceDebug.bind(this);
        this.toggleDataDebug = this.toggleDataDebug.bind(this);
        this.togglePeerDebug = this.togglePeerDebug.bind(this);
        this.toggleFramesDebug = this.toggleFramesDebug.bind(this);
        this.toggleHandlersDebug = this.toggleHandlersDebug.bind(this);
        this.toggleNetworkDebug = this.toggleNetworkDebug.bind(this);
        // Set up event listeners
        this._setupEventListeners();
    }
    /**
   * Initialize the controller
   * @returns {DebugController} - The initialized controller instance
   */ static initialize() {
        const controller = new DebugController();
        return controller;
    }
    /**
   * Set up event listeners for debug controls
   * @private
   */ _setupEventListeners() {
        // Expose methods to window for button access
        window.clearDebugInfo = this.clearDebugInfo;
        window.toggleDebug = this.toggleDebug;
        window.togglePerformanceDebug = this.togglePerformanceDebug;
        window.toggleDataDebug = this.toggleDataDebug;
        window.togglePeerDebug = this.togglePeerDebug;
        window.toggleFramesDebug = this.toggleFramesDebug;
        window.toggleHandlersDebug = this.toggleHandlersDebug;
        window.toggleNetworkDebug = this.toggleNetworkDebug;
        // Set initial state - check if any debug flags are enabled
        const anyDebugEnabled = Object.keys(window.DEBUG).some((key)=>typeof window.DEBUG[key] === 'boolean' && window.DEBUG[key]);
        if (this.elements.debugToggle) this.elements.debugToggle.checked = anyDebugEnabled;
        if (this.elements.debugPerformance) {
            this.elements.debugPerformance.checked = window.DEBUG.PERFORMANCE;
            this.elements.debugPerformance.disabled = !anyDebugEnabled;
        }
        if (this.elements.debugData) {
            this.elements.debugData.checked = window.DEBUG.DATA;
            this.elements.debugData.disabled = !anyDebugEnabled;
        }
        if (this.elements.debugPeer) {
            this.elements.debugPeer.checked = window.DEBUG.PEER;
            this.elements.debugPeer.disabled = !anyDebugEnabled;
        }
        if (this.elements.debugFrames) {
            this.elements.debugFrames.checked = window.DEBUG.FRAMES;
            this.elements.debugFrames.disabled = !anyDebugEnabled;
        }
        if (this.elements.debugHandlers) {
            this.elements.debugHandlers.checked = window.DEBUG.HANDLERS;
            this.elements.debugHandlers.disabled = !anyDebugEnabled;
        }
        if (this.elements.debugNetwork) {
            this.elements.debugNetwork.checked = window.DEBUG.NETWORK;
            this.elements.debugNetwork.disabled = !anyDebugEnabled;
        }
    }
    /**
   * Add a message to the debug info panel
   * @param {string} message - The message to add
   * @param {boolean} isEssential - Whether the message is essential (shown even when debugging is disabled)
   */ addDebugInfo(message, isEssential = false) {
        // Only log essential messages or when any debugging is enabled
        const anyDebugEnabled = Object.keys(window.DEBUG).some((key)=>typeof window.DEBUG[key] === 'boolean' && window.DEBUG[key]);
        if (!isEssential && !anyDebugEnabled) return; // Skip non-essential logs when debugging is disabled
        if (this.elements.debugInfo) {
            const timestamp = new Date().toLocaleTimeString();
            const entry = document.createElement('div');
            entry.innerHTML = `<strong>${timestamp}</strong>: ${message}`;
            this.elements.debugInfo.appendChild(entry);
            // Scroll to bottom
            this.elements.debugInfo.scrollTop = this.elements.debugInfo.scrollHeight;
        }
    }
    /**
   * Clear the debug info panel
   */ clearDebugInfo() {
        if (this.elements.debugInfo) this.elements.debugInfo.innerHTML = '';
    }
    /**
   * Toggle master debug flag
   * @param {boolean} enabled - Whether debug should be enabled
   */ toggleDebug(enabled) {
        if (enabled) window.DEBUG.enableAll();
        else window.DEBUG.disableAll();
        // Update UI elements
        const debugElements = [
            'debugPerformance',
            'debugData',
            'debugPeer',
            'debugFrames',
            'debugHandlers',
            'debugNetwork'
        ];
        debugElements.forEach((elementId)=>{
            const element = this.elements[elementId];
            if (element) {
                element.disabled = !enabled;
                element.checked = enabled;
            }
        });
        this.addDebugInfo(`Debug logging ${enabled ? 'enabled' : 'disabled'}`, true);
    }
    /**
   * Toggle performance debug flag
   * @param {boolean} enabled - Whether performance debugging should be enabled
   */ togglePerformanceDebug(enabled) {
        window.DEBUG.PERFORMANCE = enabled;
        this.addDebugInfo(`Performance logging ${enabled ? 'enabled' : 'disabled'}`, true);
    }
    /**
   * Toggle data debug flag
   * @param {boolean} enabled - Whether data debugging should be enabled
   */ toggleDataDebug(enabled) {
        window.DEBUG.DATA = enabled;
        this.addDebugInfo(`Data integrity logging ${enabled ? 'enabled' : 'disabled'}`, true);
    }
    /**
   * Toggle peer connection debug flag
   * @param {boolean} enabled - Whether peer connection debugging should be enabled
   */ togglePeerDebug(enabled) {
        window.DEBUG.PEER = enabled;
        this.addDebugInfo(`Peer connection logging ${enabled ? 'enabled' : 'disabled'}`, true);
    }
    /**
   * Toggle frames debug flag
   * @param {boolean} enabled - Whether frames debugging should be enabled
   */ toggleFramesDebug(enabled) {
        window.DEBUG.FRAMES = enabled;
        this.addDebugInfo(`Frames logging ${enabled ? 'enabled' : 'disabled'}`, true);
    }
    /**
   * Toggle handlers debug flag
   * @param {boolean} enabled - Whether handlers debugging should be enabled
   */ toggleHandlersDebug(enabled) {
        window.DEBUG.HANDLERS = enabled;
        this.addDebugInfo(`Handlers logging ${enabled ? 'enabled' : 'disabled'}`, true);
    }
    /**
   * Toggle network debug flag
   * @param {boolean} enabled - Whether network debugging should be enabled
   */ toggleNetworkDebug(enabled) {
        window.DEBUG.NETWORK = enabled;
        this.addDebugInfo(`Network logging ${enabled ? 'enabled' : 'disabled'}`, true);
    }
}

//# sourceMappingURL=index.badb8b01.js.map
