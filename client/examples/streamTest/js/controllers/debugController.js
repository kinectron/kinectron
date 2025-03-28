/**
 * DebugController
 * Handles debug panel, logging, and debug flags
 */
class DebugController {
  constructor() {
    // Cache DOM elements
    this.elements = {
      debugInfo: document.getElementById('debugInfo'),
      debugToggle: document.getElementById('debugToggle'),
      debugPerformance: document.getElementById('debugPerformance'),
      debugData: document.getElementById('debugData'),
      debugPeer: document.getElementById('debugPeer'),
    };

    // Bind methods to maintain 'this' context
    this.addDebugInfo = this.addDebugInfo.bind(this);
    this.clearDebugInfo = this.clearDebugInfo.bind(this);
    this.toggleDebug = this.toggleDebug.bind(this);
    this.togglePerformanceDebug =
      this.togglePerformanceDebug.bind(this);
    this.toggleDataDebug = this.toggleDataDebug.bind(this);
    this.togglePeerDebug = this.togglePeerDebug.bind(this);

    // Set up event listeners
    this._setupEventListeners();
  }

  /**
   * Initialize the controller
   * @returns {DebugController} - The initialized controller instance
   */
  static initialize() {
    const controller = new DebugController();
    return controller;
  }

  /**
   * Set up event listeners for debug controls
   * @private
   */
  _setupEventListeners() {
    // Expose methods to window for button access
    window.clearDebugInfo = this.clearDebugInfo;
    window.toggleDebug = this.toggleDebug;
    window.togglePerformanceDebug = this.togglePerformanceDebug;
    window.toggleDataDebug = this.toggleDataDebug;
    window.togglePeerDebug = this.togglePeerDebug;

    // Set initial state
    if (this.elements.debugToggle) {
      this.elements.debugToggle.checked = window.DEBUG.RAW_DEPTH;
    }

    if (this.elements.debugPerformance) {
      this.elements.debugPerformance.checked =
        window.DEBUG.PERFORMANCE;
      this.elements.debugPerformance.disabled =
        !window.DEBUG.RAW_DEPTH;
    }

    if (this.elements.debugData) {
      this.elements.debugData.checked = window.DEBUG.DATA;
      this.elements.debugData.disabled = !window.DEBUG.RAW_DEPTH;
    }

    if (this.elements.debugPeer) {
      this.elements.debugPeer.checked = window.DEBUG.PEER;
      this.elements.debugPeer.disabled = !window.DEBUG.RAW_DEPTH;
    }
  }

  /**
   * Add a message to the debug info panel
   * @param {string} message - The message to add
   * @param {boolean} isEssential - Whether the message is essential (shown even when debugging is disabled)
   */
  addDebugInfo(message, isEssential = false) {
    // Only log essential messages or when debugging is enabled
    if (!isEssential && !window.DEBUG.RAW_DEPTH) {
      return; // Skip non-essential logs when debugging is disabled
    }

    if (this.elements.debugInfo) {
      const timestamp = new Date().toLocaleTimeString();
      const entry = document.createElement('div');
      entry.innerHTML = `<strong>${timestamp}</strong>: ${message}`;
      this.elements.debugInfo.appendChild(entry);

      // Scroll to bottom
      this.elements.debugInfo.scrollTop =
        this.elements.debugInfo.scrollHeight;
    }
  }

  /**
   * Clear the debug info panel
   */
  clearDebugInfo() {
    if (this.elements.debugInfo) {
      this.elements.debugInfo.innerHTML = '';
    }
  }

  /**
   * Toggle master debug flag
   * @param {boolean} enabled - Whether debug should be enabled
   */
  toggleDebug(enabled) {
    window.DEBUG.RAW_DEPTH = enabled;

    if (this.elements.debugPerformance) {
      this.elements.debugPerformance.disabled = !enabled;
    }

    if (this.elements.debugData) {
      this.elements.debugData.disabled = !enabled;
    }

    if (this.elements.debugPeer) {
      this.elements.debugPeer.disabled = !enabled;
    }

    if (!enabled) {
      window.DEBUG.PERFORMANCE = false;
      window.DEBUG.DATA = false;
      window.DEBUG.PEER = false;

      if (this.elements.debugPerformance) {
        this.elements.debugPerformance.checked = false;
      }

      if (this.elements.debugData) {
        this.elements.debugData.checked = false;
      }

      if (this.elements.debugPeer) {
        this.elements.debugPeer.checked = false;
      }
    }

    this.addDebugInfo(
      `Debug logging ${enabled ? 'enabled' : 'disabled'}`,
      true,
    );
  }

  /**
   * Toggle performance debug flag
   * @param {boolean} enabled - Whether performance debugging should be enabled
   */
  togglePerformanceDebug(enabled) {
    window.DEBUG.PERFORMANCE = enabled;
    this.addDebugInfo(
      `Performance logging ${enabled ? 'enabled' : 'disabled'}`,
      true,
    );
  }

  /**
   * Toggle data debug flag
   * @param {boolean} enabled - Whether data debugging should be enabled
   */
  toggleDataDebug(enabled) {
    window.DEBUG.DATA = enabled;
    this.addDebugInfo(
      `Data integrity logging ${enabled ? 'enabled' : 'disabled'}`,
      true,
    );
  }

  /**
   * Toggle peer connection debug flag
   * @param {boolean} enabled - Whether peer connection debugging should be enabled
   */
  togglePeerDebug(enabled) {
    window.DEBUG.PEER = enabled;
    this.addDebugInfo(
      `Peer connection logging ${enabled ? 'enabled' : 'disabled'}`,
      true,
    );
  }
}
