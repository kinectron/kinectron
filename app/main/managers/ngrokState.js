// main/managers/ngrokState.js

/**
 * Represents a state transition error
 */
export class NgrokStateError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = 'NgrokStateError';
    this.details = details;
  }
}

/**
 * Manages ngrok connection state and metadata
 */
export class NgrokState {
  /**
   * Available ngrok connection states
   */
  static STATES = {
    DISCONNECTED: 'disconnected',
    INITIALIZING: 'initializing',
    CONNECTING: 'connecting',
    CONNECTED: 'connected',
    ERROR: 'error',
  };

  /**
   * Valid state transitions
   */
  static VALID_TRANSITIONS = {
    [NgrokState.STATES.DISCONNECTED]: [
      NgrokState.STATES.INITIALIZING,
    ],
    [NgrokState.STATES.INITIALIZING]: [
      NgrokState.STATES.CONNECTING,
      NgrokState.STATES.ERROR,
    ],
    [NgrokState.STATES.CONNECTING]: [
      NgrokState.STATES.CONNECTED,
      NgrokState.STATES.ERROR,
    ],
    [NgrokState.STATES.CONNECTED]: [
      NgrokState.STATES.DISCONNECTED,
      NgrokState.STATES.ERROR,
    ],
    [NgrokState.STATES.ERROR]: [NgrokState.STATES.DISCONNECTED],
  };

  constructor() {
    this.currentState = NgrokState.STATES.DISCONNECTED;
    this.metadata = {
      url: null,
      startTime: null,
      lastStateChange: new Date(),
      errorHistory: [],
      tunnelConfig: null,
      metrics: {
        uptime: 0,
        reconnectCount: 0,
        lastHealthCheck: null,
        errors: {
          total: 0,
          byType: {},
        },
      },
    };
  }

  /**
   * Get the current state
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
   * Validate and perform state transition
   * @param {string} newState - State to transition to
   * @param {Object} details - Additional transition details
   * @throws {NgrokStateError} If transition is invalid
   */
  setState(newState, details = {}) {
    if (!this._isValidTransition(newState)) {
      throw new NgrokStateError(
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
    if (newState === NgrokState.STATES.CONNECTED) {
      if (!this.metadata.startTime) {
        this.metadata.startTime = new Date();
      }
    } else if (newState === NgrokState.STATES.DISCONNECTED) {
      this.metadata.url = null;
    }

    // Return transition details
    return {
      from: oldState,
      to: newState,
      timestamp: this.metadata.lastStateChange,
      details,
    };
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
  }

  /**
   * Update tunnel configuration
   * @param {Object} config - Tunnel configuration
   */
  setTunnelConfig(config) {
    this.metadata.tunnelConfig = {
      ...config,
      timestamp: new Date(),
    };
  }

  /**
   * Record a health check
   * @param {Object} status - Health check status
   */
  recordHealthCheck(status) {
    this.metadata.metrics.lastHealthCheck = {
      timestamp: new Date(),
      status,
    };
  }

  /**
   * Get error history
   * @returns {Array} Error history
   */
  getErrorHistory() {
    return this.metadata.errorHistory;
  }

  /**
   * Reset state to initial values
   */
  reset() {
    this.currentState = NgrokState.STATES.DISCONNECTED;
    this.metadata = {
      url: null,
      startTime: null,
      lastStateChange: new Date(),
      errorHistory: [],
      tunnelConfig: null,
      metrics: {
        uptime: 0,
        reconnectCount: 0,
        lastHealthCheck: null,
        errors: {
          total: 0,
          byType: {},
        },
      },
    };
  }

  /**
   * Calculate current uptime
   * @private
   * @returns {number} Uptime in milliseconds
   */
  _calculateUptime() {
    if (
      !this.metadata.startTime ||
      this.currentState !== NgrokState.STATES.CONNECTED
    ) {
      return 0;
    }
    return Date.now() - this.metadata.startTime.getTime();
  }

  /**
   * Check if state transition is valid
   * @private
   * @param {string} newState - State to transition to
   * @returns {boolean} Whether transition is valid
   */
  _isValidTransition(newState) {
    const validNextStates =
      NgrokState.VALID_TRANSITIONS[this.currentState];
    return validNextStates && validNextStates.includes(newState);
  }
}
