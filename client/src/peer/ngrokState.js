/**
 * Represents a client-side ngrok connection state error
 */
export class NgrokClientError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = 'NgrokClientError';
    this.details = details;
    this.timestamp = new Date().toISOString();
    this.troubleshooting = [
      'Check if the ngrok tunnel is running',
      'Verify the URL is correct',
      'Ensure the Kinectron application is running',
    ];
  }
}

/**
 * Manages client-side ngrok connection state and metrics
 */
export class NgrokClientState {
  /**
   * Available connection states
   */
  static STATES = {
    DISCONNECTED: 'disconnected',
    VALIDATING: 'validating',
    CONNECTING: 'connecting',
    CONNECTED: 'connected',
    RECONNECTING: 'reconnecting',
    ERROR: 'error',
  };

  /**
   * Valid state transitions
   */
  static VALID_TRANSITIONS = {
    [NgrokClientState.STATES.DISCONNECTED]: [
      NgrokClientState.STATES.VALIDATING,
      NgrokClientState.STATES.CONNECTING,
    ],
    [NgrokClientState.STATES.VALIDATING]: [
      NgrokClientState.STATES.CONNECTING,
      NgrokClientState.STATES.ERROR,
    ],
    [NgrokClientState.STATES.CONNECTING]: [
      NgrokClientState.STATES.CONNECTED,
      NgrokClientState.STATES.RECONNECTING,
      NgrokClientState.STATES.ERROR,
      NgrokClientState.STATES.CONNECTING, // Allow re-entering connecting state
    ],
    [NgrokClientState.STATES.CONNECTED]: [
      NgrokClientState.STATES.DISCONNECTED,
      NgrokClientState.STATES.RECONNECTING,
      NgrokClientState.STATES.ERROR,
      NgrokClientState.STATES.CONNECTED, // Allow self-transition to refresh state
    ],
    [NgrokClientState.STATES.RECONNECTING]: [
      NgrokClientState.STATES.CONNECTED,
      NgrokClientState.STATES.CONNECTING,
      NgrokClientState.STATES.ERROR,
    ],
    [NgrokClientState.STATES.ERROR]: [
      NgrokClientState.STATES.DISCONNECTED,
      NgrokClientState.STATES.CONNECTING,
    ],
  };

  constructor() {
    this.currentState = null; // Start with no state
    this.metadata = {
      url: null,
      startTime: null,
      lastStateChange: new Date(),
      errorHistory: [],
      metrics: {
        latency: {
          current: 0,
          average: 0,
          samples: [],
        },
        connectionQuality: 'unknown',
        reconnects: {
          count: 0,
          lastAttempt: null,
        },
        errors: {
          total: 0,
          byType: {},
        },
      },
    };

    // Event handlers
    this.handlers = {
      stateChange: new Set(),
      error: new Set(),
      metrics: new Set(),
    };
  }

  /**
   * Add event listener
   * @param {string} event - Event type
   * @param {Function} handler - Event handler
   */
  on(event, handler) {
    if (this.handlers[event]) {
      this.handlers[event].add(handler);
    }
  }

  /**
   * Remove event listener
   * @param {string} event - Event type
   * @param {Function} handler - Event handler
   */
  off(event, handler) {
    if (this.handlers[event]) {
      this.handlers[event].delete(handler);
    }
  }

  /**
   * Emit event to handlers
   * @private
   * @param {string} event - Event type
   * @param {*} data - Event data
   */
  _emit(event, data) {
    if (this.handlers[event]) {
      this.handlers[event].forEach((handler) => handler(data));
    }
  }

  /**
   * Get current state
   * @returns {string} Current state
   */
  getState() {
    return this.currentState;
  }

  /**
   * Get state metadata
   * @returns {Object} State metadata
   */
  getMetadata() {
    return {
      ...this.metadata,
      currentState: this.currentState,
      uptime: this._calculateUptime(),
    };
  }

  /**
   * Update connection metrics
   * @param {Object} metrics - New metrics
   */
  updateMetrics(metrics) {
    // Update latency
    if (metrics.latency !== undefined) {
      this.metadata.metrics.latency.current = metrics.latency;
      this.metadata.metrics.latency.samples.push({
        value: metrics.latency,
        timestamp: new Date(),
      });

      // Keep last 10 samples
      if (this.metadata.metrics.latency.samples.length > 10) {
        this.metadata.metrics.latency.samples.shift();
      }

      // Calculate average
      this.metadata.metrics.latency.average =
        this.metadata.metrics.latency.samples.reduce(
          (sum, sample) => sum + sample.value,
          0,
        ) / this.metadata.metrics.latency.samples.length;
    }

    // Update connection quality based on metrics
    this._updateConnectionQuality();

    // Emit metrics update
    this._emit('metrics', this.metadata.metrics);
  }

  /**
   * Set connection state
   * @param {string} newState - New state
   * @param {Object} details - Transition details
   * @throws {NgrokClientError} If transition is invalid
   */
  setState(newState, details = {}) {
    if (!this._isValidTransition(newState)) {
      throw new NgrokClientError(
        `Invalid state transition from ${this.currentState} to ${newState}`,
        {
          from: this.currentState,
          to: newState,
          details,
        },
      );
    }

    const oldState = this.currentState;
    this.currentState = newState;
    this.metadata.lastStateChange = new Date();

    // Update metadata based on state
    if (newState === NgrokClientState.STATES.CONNECTED) {
      if (!this.metadata.startTime) {
        this.metadata.startTime = new Date();
      }
    } else if (newState === NgrokClientState.STATES.RECONNECTING) {
      this.metadata.metrics.reconnects.count++;
      this.metadata.metrics.reconnects.lastAttempt = new Date();
    }

    // Emit state change event
    this._emit('stateChange', {
      from: oldState,
      to: newState,
      timestamp: this.metadata.lastStateChange,
      details,
    });
  }

  /**
   * Record an error
   * @param {Error} error - Error to record
   * @param {Object} context - Error context
   */
  recordError(error, context = {}) {
    const errorRecord = {
      name: error.name,
      message: error.message,
      timestamp: new Date(),
      context,
      state: this.currentState,
    };

    // Add to error history (keep last 10)
    this.metadata.errorHistory.unshift(errorRecord);
    if (this.metadata.errorHistory.length > 10) {
      this.metadata.errorHistory.pop();
    }

    // Update error metrics
    this.metadata.metrics.errors.total++;
    this.metadata.metrics.errors.byType[error.name] =
      (this.metadata.metrics.errors.byType[error.name] || 0) + 1;

    // Emit error event
    this._emit('error', errorRecord);
  }

  /**
   * Reset state to initial values
   */
  reset() {
    this.currentState = null;
    this.metadata = {
      url: null,
      startTime: null,
      lastStateChange: new Date(),
      errorHistory: [],
      metrics: {
        latency: {
          current: 0,
          average: 0,
          samples: [],
        },
        connectionQuality: 'unknown',
        reconnects: {
          count: 0,
          lastAttempt: null,
        },
        errors: {
          total: 0,
          byType: {},
        },
      },
    };
  }

  /**
   * Calculate connection uptime
   * @private
   * @returns {number} Uptime in milliseconds
   */
  _calculateUptime() {
    if (
      !this.metadata.startTime ||
      this.currentState !== NgrokClientState.STATES.CONNECTED
    ) {
      return 0;
    }
    return Date.now() - this.metadata.startTime.getTime();
  }

  /**
   * Update connection quality based on metrics
   * @private
   */
  _updateConnectionQuality() {
    const avgLatency = this.metadata.metrics.latency.average;
    const recentErrors = this.metadata.errorHistory.filter(
      (e) => Date.now() - new Date(e.timestamp).getTime() < 60000, // Last minute
    ).length;

    if (recentErrors > 2) {
      this.metadata.metrics.connectionQuality = 'poor';
    } else if (avgLatency > 1000) {
      // 1 second
      this.metadata.metrics.connectionQuality = 'unstable';
    } else if (avgLatency > 500) {
      // 500ms
      this.metadata.metrics.connectionQuality = 'fair';
    } else {
      this.metadata.metrics.connectionQuality = 'good';
    }
  }

  /**
   * Check if state transition is valid
   * @private
   * @param {string} newState - State to transition to
   * @returns {boolean} Whether transition is valid
   */
  _isValidTransition(newState) {
    // Allow any initial state transition
    if (this.currentState === null) {
      return true;
    }
    const validNextStates =
      NgrokClientState.VALID_TRANSITIONS[this.currentState];
    return validNextStates && validNextStates.includes(newState);
  }
}
