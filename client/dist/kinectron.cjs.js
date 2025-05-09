import $dnBli$peerjs from "peerjs";

/**
 * @fileoverview Main entry point for the Kinectron client library
 * @version 1.0.0
 */ 
/**
 * Base class for ngrok-related errors
 */ class $2e128d167289b877$export$1f153bdfce7cff1b extends Error {
    /**
   * @param {string} message - Error message
   * @param {Object} details - Additional error details
   */ constructor(message, details = {}){
        super(message);
        this.name = 'NgrokError';
        this.details = details;
        this.timestamp = new Date().toISOString();
        this.troubleshooting = [
            'Verify the ngrok tunnel is running',
            'Check if the ngrok URL is correct',
            'Ensure the Kinectron application is running'
        ];
    }
}
class $2e128d167289b877$export$4166255d9634c9ec extends $2e128d167289b877$export$1f153bdfce7cff1b {
    constructor(message, details = {}){
        super(message, {
            ...details,
            type: 'connection_error'
        });
        this.name = 'NgrokConnectionError';
        this.troubleshooting = [
            'Check if the ngrok tunnel is still active',
            'Verify your internet connection',
            'Try restarting the ngrok tunnel',
            'Ensure no firewall is blocking the connection'
        ];
    }
}
class $2e128d167289b877$export$f8c51391769a899a extends $2e128d167289b877$export$1f153bdfce7cff1b {
    constructor(message, details = {}){
        super(message, {
            ...details,
            type: 'timeout_error'
        });
        this.name = 'NgrokTimeoutError';
        this.troubleshooting = [
            'The connection attempt timed out',
            'Check your internet connection speed',
            'Verify the Kinectron server is running',
            'Try increasing the connection timeout'
        ];
    }
}
class $2e128d167289b877$export$824c682561d91b13 extends $2e128d167289b877$export$1f153bdfce7cff1b {
    constructor(message, details = {}){
        super(message, {
            ...details,
            type: 'validation_error'
        });
        this.name = 'NgrokValidationError';
        this.troubleshooting = [
            'Ensure the URL includes "ngrok-free.app"',
            'Copy the URL directly from the Kinectron application',
            'Make sure to include the full domain name'
        ];
    }
}
const $2e128d167289b877$export$724281d238664ba = {
    INVALID_URL: {
        code: 'NGROK_001',
        message: 'Invalid ngrok URL format'
    },
    CONNECTION_FAILED: {
        code: 'NGROK_002',
        message: 'Failed to establish ngrok connection'
    },
    CONNECTION_TIMEOUT: {
        code: 'NGROK_003',
        message: 'Connection attempt timed out'
    },
    TUNNEL_CLOSED: {
        code: 'NGROK_004',
        message: 'Ngrok tunnel was closed'
    },
    SERVER_UNREACHABLE: {
        code: 'NGROK_005',
        message: 'Unable to reach Kinectron server'
    }
};


/**
 * Validates a ngrok URL format
 * @param {string} url - The URL to validate
 * @throws {NgrokValidationError} If URL is invalid
 */ function $b33dfacdbc4dd018$var$validateNgrokUrl(url) {
    if (!url.includes('ngrok-free.app')) throw new (0, $2e128d167289b877$export$824c682561d91b13)((0, $2e128d167289b877$export$724281d238664ba).INVALID_URL.message, {
        code: (0, $2e128d167289b877$export$724281d238664ba).INVALID_URL.code,
        url: url,
        reason: 'URL must include ngrok-free.app domain'
    });
}
const $b33dfacdbc4dd018$export$d9abfac191d6fb15 = {
    host: '127.0.0.1',
    port: 9001,
    path: '/',
    secure: false,
    debug: 3,
    role: 'default',
    // For local connections, we don't need STUN/TURN servers
    // This matches the original kinectron implementation
    config: {
        iceServers: [],
        sdpSemantics: 'unified-plan'
    }
};
const $b33dfacdbc4dd018$export$ed3bb69bb836b297 = 'kinectron';
function $b33dfacdbc4dd018$export$fb6f4b3558343497(config) {
    if (!config) return $b33dfacdbc4dd018$export$d9abfac191d6fb15;
    // Handle ngrok addresses
    if (typeof config === 'string' && config.includes('ngrok')) try {
        $b33dfacdbc4dd018$var$validateNgrokUrl(config);
        return {
            host: config,
            port: '443',
            path: '/',
            secure: true,
            debug: 3,
            config: {
                iceServers: [],
                sdpSemantics: 'unified-plan'
            }
        };
    } catch (error) {
        // Add connection context to validation errors
        if (error instanceof (0, $2e128d167289b877$export$824c682561d91b13)) {
            error.details.context = 'peer_config_validation';
            error.details.timestamp = new Date().toISOString();
        }
        throw error;
    }
    // Handle IP addresses or custom configs
    if (typeof config === 'string') return {
        ...$b33dfacdbc4dd018$export$d9abfac191d6fb15,
        host: config
    };
    // Handle full custom config objects
    return {
        ...$b33dfacdbc4dd018$export$d9abfac191d6fb15,
        ...config
    };
}


/**
 * Represents a client-side ngrok connection state error
 */ class $9ba1754323587406$export$37c12b0d5395ed1f extends Error {
    constructor(message, details = {}){
        super(message);
        this.name = 'NgrokClientError';
        this.details = details;
        this.timestamp = new Date().toISOString();
        this.troubleshooting = [
            'Check if the ngrok tunnel is running',
            'Verify the URL is correct',
            'Ensure the Kinectron application is running'
        ];
    }
}
class $9ba1754323587406$export$575c13c422fb6041 {
    /**
   * Available connection states
   */ static STATES = {
        DISCONNECTED: 'disconnected',
        VALIDATING: 'validating',
        CONNECTING: 'connecting',
        CONNECTED: 'connected',
        RECONNECTING: 'reconnecting',
        ERROR: 'error'
    };
    /**
   * Valid state transitions
   */ static VALID_TRANSITIONS = {
        [$9ba1754323587406$export$575c13c422fb6041.STATES.DISCONNECTED]: [
            $9ba1754323587406$export$575c13c422fb6041.STATES.VALIDATING,
            $9ba1754323587406$export$575c13c422fb6041.STATES.CONNECTING
        ],
        [$9ba1754323587406$export$575c13c422fb6041.STATES.VALIDATING]: [
            $9ba1754323587406$export$575c13c422fb6041.STATES.CONNECTING,
            $9ba1754323587406$export$575c13c422fb6041.STATES.ERROR
        ],
        [$9ba1754323587406$export$575c13c422fb6041.STATES.CONNECTING]: [
            $9ba1754323587406$export$575c13c422fb6041.STATES.CONNECTED,
            $9ba1754323587406$export$575c13c422fb6041.STATES.RECONNECTING,
            $9ba1754323587406$export$575c13c422fb6041.STATES.ERROR,
            $9ba1754323587406$export$575c13c422fb6041.STATES.CONNECTING
        ],
        [$9ba1754323587406$export$575c13c422fb6041.STATES.CONNECTED]: [
            $9ba1754323587406$export$575c13c422fb6041.STATES.DISCONNECTED,
            $9ba1754323587406$export$575c13c422fb6041.STATES.RECONNECTING,
            $9ba1754323587406$export$575c13c422fb6041.STATES.ERROR,
            $9ba1754323587406$export$575c13c422fb6041.STATES.CONNECTED
        ],
        [$9ba1754323587406$export$575c13c422fb6041.STATES.RECONNECTING]: [
            $9ba1754323587406$export$575c13c422fb6041.STATES.CONNECTED,
            $9ba1754323587406$export$575c13c422fb6041.STATES.CONNECTING,
            $9ba1754323587406$export$575c13c422fb6041.STATES.ERROR
        ],
        [$9ba1754323587406$export$575c13c422fb6041.STATES.ERROR]: [
            $9ba1754323587406$export$575c13c422fb6041.STATES.DISCONNECTED,
            $9ba1754323587406$export$575c13c422fb6041.STATES.CONNECTING
        ]
    };
    constructor(){
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
                    samples: []
                },
                connectionQuality: 'unknown',
                reconnects: {
                    count: 0,
                    lastAttempt: null
                },
                errors: {
                    total: 0,
                    byType: {}
                }
            }
        };
        // Event handlers
        this.handlers = {
            stateChange: new Set(),
            error: new Set(),
            metrics: new Set()
        };
    }
    /**
   * Add event listener
   * @param {string} event - Event type
   * @param {Function} handler - Event handler
   */ on(event, handler) {
        if (this.handlers[event]) this.handlers[event].add(handler);
    }
    /**
   * Remove event listener
   * @param {string} event - Event type
   * @param {Function} handler - Event handler
   */ off(event, handler) {
        if (this.handlers[event]) this.handlers[event].delete(handler);
    }
    /**
   * Emit event to handlers
   * @private
   * @param {string} event - Event type
   * @param {*} data - Event data
   */ _emit(event, data) {
        if (this.handlers[event]) this.handlers[event].forEach((handler)=>handler(data));
    }
    /**
   * Get current state
   * @returns {string} Current state
   */ getState() {
        return this.currentState;
    }
    /**
   * Get state metadata
   * @returns {Object} State metadata
   */ getMetadata() {
        return {
            ...this.metadata,
            currentState: this.currentState,
            uptime: this._calculateUptime()
        };
    }
    /**
   * Update connection metrics
   * @param {Object} metrics - New metrics
   */ updateMetrics(metrics) {
        // Update latency
        if (metrics.latency !== undefined) {
            this.metadata.metrics.latency.current = metrics.latency;
            this.metadata.metrics.latency.samples.push({
                value: metrics.latency,
                timestamp: new Date()
            });
            // Keep last 10 samples
            if (this.metadata.metrics.latency.samples.length > 10) this.metadata.metrics.latency.samples.shift();
            // Calculate average
            this.metadata.metrics.latency.average = this.metadata.metrics.latency.samples.reduce((sum, sample)=>sum + sample.value, 0) / this.metadata.metrics.latency.samples.length;
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
   */ setState(newState, details = {}) {
        if (!this._isValidTransition(newState)) throw new $9ba1754323587406$export$37c12b0d5395ed1f(`Invalid state transition from ${this.currentState} to ${newState}`, {
            from: this.currentState,
            to: newState,
            details: details
        });
        const oldState = this.currentState;
        this.currentState = newState;
        this.metadata.lastStateChange = new Date();
        // Update metadata based on state
        if (newState === $9ba1754323587406$export$575c13c422fb6041.STATES.CONNECTED) {
            if (!this.metadata.startTime) this.metadata.startTime = new Date();
        } else if (newState === $9ba1754323587406$export$575c13c422fb6041.STATES.RECONNECTING) {
            this.metadata.metrics.reconnects.count++;
            this.metadata.metrics.reconnects.lastAttempt = new Date();
        }
        // Emit state change event
        this._emit('stateChange', {
            from: oldState,
            to: newState,
            timestamp: this.metadata.lastStateChange,
            details: details
        });
    }
    /**
   * Record an error
   * @param {Error} error - Error to record
   * @param {Object} context - Error context
   */ recordError(error, context = {}) {
        const errorRecord = {
            name: error.name,
            message: error.message,
            timestamp: new Date(),
            context: context,
            state: this.currentState
        };
        // Add to error history (keep last 10)
        this.metadata.errorHistory.unshift(errorRecord);
        if (this.metadata.errorHistory.length > 10) this.metadata.errorHistory.pop();
        // Update error metrics
        this.metadata.metrics.errors.total++;
        this.metadata.metrics.errors.byType[error.name] = (this.metadata.metrics.errors.byType[error.name] || 0) + 1;
        // Emit error event
        this._emit('error', errorRecord);
    }
    /**
   * Reset state to initial values
   */ reset() {
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
                    samples: []
                },
                connectionQuality: 'unknown',
                reconnects: {
                    count: 0,
                    lastAttempt: null
                },
                errors: {
                    total: 0,
                    byType: {}
                }
            }
        };
    }
    /**
   * Calculate connection uptime
   * @private
   * @returns {number} Uptime in milliseconds
   */ _calculateUptime() {
        if (!this.metadata.startTime || this.currentState !== $9ba1754323587406$export$575c13c422fb6041.STATES.CONNECTED) return 0;
        return Date.now() - this.metadata.startTime.getTime();
    }
    /**
   * Update connection quality based on metrics
   * @private
   */ _updateConnectionQuality() {
        const avgLatency = this.metadata.metrics.latency.average;
        const recentErrors = this.metadata.errorHistory.filter((e)=>Date.now() - new Date(e.timestamp).getTime() < 60000).length;
        if (recentErrors > 2) this.metadata.metrics.connectionQuality = 'poor';
        else if (avgLatency > 1000) // 1 second
        this.metadata.metrics.connectionQuality = 'unstable';
        else if (avgLatency > 500) // 500ms
        this.metadata.metrics.connectionQuality = 'fair';
        else this.metadata.metrics.connectionQuality = 'good';
    }
    /**
   * Check if state transition is valid
   * @private
   * @param {string} newState - State to transition to
   * @returns {boolean} Whether transition is valid
   */ _isValidTransition(newState) {
        // Allow any initial state transition
        if (this.currentState === null) return true;
        const validNextStates = $9ba1754323587406$export$575c13c422fb6041.VALID_TRANSITIONS[this.currentState];
        return validNextStates && validNextStates.includes(newState);
    }
}


/**
 * Debug configuration for Kinectron client
 * Controls logging output for different components
 */ const $172470ba888aa9b2$export$3f32c2013f0dcc1e = {
    // Master switches for components
    FRAMES: false,
    HANDLERS: false,
    PEER: false,
    // Specific logging categories
    PERFORMANCE: false,
    DATA: false,
    NETWORK: false,
    // Helper method to enable all logs
    enableAll: function() {
        Object.keys(this).forEach((key)=>{
            if (typeof this[key] === 'boolean') this[key] = true;
        });
    },
    // Helper method to disable all logs
    disableAll: function() {
        Object.keys(this).forEach((key)=>{
            if (typeof this[key] === 'boolean') this[key] = false;
        });
    }
};
const $172470ba888aa9b2$export$bef1f36f5486a6a3 = {
    // Always log errors regardless of debug flags
    error: function(message, ...args) {
        console.error(message, ...args);
    },
    // Always log warnings regardless of debug flags
    warn: function(message, ...args) {
        console.warn(message, ...args);
    },
    // Always log info messages regardless of debug flags
    info: function(message, ...args) {
        console.log(message, ...args);
    },
    // Only log if the specified debug flag is enabled
    debug: function(flag, message, ...args) {
        if ($172470ba888aa9b2$export$3f32c2013f0dcc1e[flag]) console.debug(`[${flag}] ${message}`, ...args);
    },
    // Only log frame-related messages if FRAMES flag is enabled
    frame: function(message, ...args) {
        if ($172470ba888aa9b2$export$3f32c2013f0dcc1e.FRAMES) console.debug(`[FRAMES] ${message}`, ...args);
    },
    // Only log handler-related messages if HANDLERS flag is enabled
    handler: function(message, ...args) {
        if ($172470ba888aa9b2$export$3f32c2013f0dcc1e.HANDLERS) console.debug(`[HANDLERS] ${message}`, ...args);
    },
    // Only log peer-related messages if PEER flag is enabled
    peer: function(message, ...args) {
        if ($172470ba888aa9b2$export$3f32c2013f0dcc1e.PEER) console.debug(`[PEER] ${message}`, ...args);
    },
    // Only log performance-related messages if PERFORMANCE flag is enabled
    performance: function(message, ...args) {
        if ($172470ba888aa9b2$export$3f32c2013f0dcc1e.PERFORMANCE) console.debug(`[PERFORMANCE] ${message}`, ...args);
    },
    // Only log data-related messages if DATA flag is enabled
    data: function(message, ...args) {
        if ($172470ba888aa9b2$export$3f32c2013f0dcc1e.DATA) console.debug(`[DATA] ${message}`, ...args);
    },
    // Only log network-related messages if NETWORK flag is enabled
    network: function(message, ...args) {
        if ($172470ba888aa9b2$export$3f32c2013f0dcc1e.NETWORK) console.debug(`[NETWORK] ${message}`, ...args);
    }
};


class $d9a171d677b20397$export$d84cf184fade0488 {
    /**
   * @param {string|PeerNetworkConfig} [networkConfig] - Network configuration or host address
   * @param {string} [peerId] - ID of the peer to connect to
   */ constructor(networkConfig, peerId){
        /** @private */ this.peer = null;
        /** @private */ this.connection = null;
        /** @private */ this.targetPeerId = peerId || (0, $b33dfacdbc4dd018$export$ed3bb69bb836b297);
        /** @private */ this.config = (0, $b33dfacdbc4dd018$export$fb6f4b3558343497)(networkConfig);
        /** @private */ this.messageHandlers = new Map();
        /** @private */ this.messageQueue = [];
        /** @private */ this.maxQueueSize = 100;
        /** @private */ this.lastPingTime = 0;
        /** @private */ this.pingInterval = null;
        /** @private */ this.healthCheckInterval = null;
        /** @private */ this.clientId = this.generateClientId();
        /** @private */ this.state = new (0, $9ba1754323587406$export$575c13c422fb6041)();
        // Forward state events to message handlers
        this.state.on('stateChange', (data)=>{
            const handler = this.messageHandlers.get('stateChange');
            if (handler) handler(data);
        });
        this.state.on('error', (data)=>{
            const handler = this.messageHandlers.get('error');
            if (handler) handler(data);
        });
        this.state.on('metrics', (data)=>{
            const handler = this.messageHandlers.get('metrics');
            if (handler) handler(data);
        });
        this.initialize();
    }
    /**
   * Generate a consistent client ID
   * @private
   * @returns {string} Client ID
   */ generateClientId() {
        // Generate unique ID for each instance
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substr(2, 5);
        const prefix = this.config.host?.includes('ngrok') ? 'ngrok' : 'local';
        const role = this.config.role || 'default';
        return `${prefix}-${role}-${timestamp}-${random}`;
    }
    /**
   * Get current connection state
   * @returns {Object} Current state information
   */ getState() {
        return this.state.getMetadata();
    }
    /**
   * Initialize the peer connection with enhanced reliability
   * @private
   */ initialize() {
        try {
            if (this.peer) {
                console.warn('Peer already initialized');
                return;
            }
            if ((0, $172470ba888aa9b2$export$3f32c2013f0dcc1e).PEER) console.log('Initializing peer with config:', this.config);
            // Check if this is an ngrok connection
            const isNgrok = typeof this.config.host === 'string' && this.config.host.includes('ngrok');
            if (isNgrok) {
                // Set state to validating for ngrok connections
                this.state.setState((0, $9ba1754323587406$export$575c13c422fb6041).STATES.VALIDATING);
                // Validate ngrok URL format
                if (!this.config.host.includes('ngrok-free.app')) throw new (0, $9ba1754323587406$export$37c12b0d5395ed1f)('Invalid ngrok URL format', {
                    url: this.config.host,
                    reason: 'URL must include ngrok-free.app domain'
                });
            }
            // Create peer instance with consistent ID
            this.peer = new (0, $dnBli$peerjs)(this.clientId, {
                ...this.config,
                // Basic reliability options
                reliable: true,
                retries: 2,
                timeout: isNgrok ? 5000 : 3000,
                debug: 0
            });
            // Move to connecting state (skip validation for local connections)
            if (!isNgrok) this.state.setState((0, $9ba1754323587406$export$575c13c422fb6041).STATES.CONNECTING);
            this.setupPeerEventHandlers();
            this.startHealthCheck();
        } catch (error) {
            console.error('Peer initialization error:', error);
            this.handleError(error);
            this.state.setState((0, $9ba1754323587406$export$575c13c422fb6041).STATES.ERROR, {
                error: error.message,
                context: 'initialization'
            });
        }
    }
    /**
   * Set up event handlers for the peer instance
   * @private
   */ setupPeerEventHandlers() {
        this.peer.on('open', (id)=>{
            if ((0, $172470ba888aa9b2$export$3f32c2013f0dcc1e).PEER) console.log('My peer ID is:', id);
            // Already in CONNECTING state, proceed with connection
            this.connect();
        });
        this.peer.on('error', (error)=>{
            console.error('Peer connection error:', error);
            // Handle ID taken error by generating new ID
            if (error.type === 'unavailable-id') {
                if ((0, $172470ba888aa9b2$export$3f32c2013f0dcc1e).PEER) console.log('Client ID taken, generating new ID');
                this.clientId = this.generateClientId();
                this._cleanup(false);
                this.initialize();
                return;
            }
            this.handleError(error);
            // Set error state
            this.state.setState((0, $9ba1754323587406$export$575c13c422fb6041).STATES.ERROR, {
                error: error.message,
                type: error.type
            });
            // Attempt reconnection if appropriate
            if (this.shouldAttemptReconnection(error)) this._handleReconnection(error);
        });
        this.peer.on('disconnected', ()=>{
            if ((0, $172470ba888aa9b2$export$3f32c2013f0dcc1e).PEER) console.log('Peer disconnected from server');
            this.state.setState((0, $9ba1754323587406$export$575c13c422fb6041).STATES.DISCONNECTED, {
                reason: 'peer_disconnected'
            });
            this._handleReconnection({
                type: 'disconnected'
            });
        });
    }
    /**
   * Start health check interval
   * @private
   */ startHealthCheck() {
        // Clear any existing intervals
        if (this.healthCheckInterval) clearInterval(this.healthCheckInterval);
        if (this.pingInterval) clearInterval(this.pingInterval);
        // Start health check
        this.healthCheckInterval = setInterval(()=>{
            if (this.state.getState() === (0, $9ba1754323587406$export$575c13c422fb6041).STATES.CONNECTED && this.connection) this.checkConnectionHealth();
        }, 10000);
        // Start ping interval
        this.pingInterval = setInterval(()=>{
            if (this.state.getState() === (0, $9ba1754323587406$export$575c13c422fb6041).STATES.CONNECTED && this.connection?.open) this.sendPing();
        }, 5000);
    }
    /**
   * Check connection health
   * @private
   */ async checkConnectionHealth() {
        if (!this.connection?.open) {
            console.warn('Connection appears dead, attempting recovery');
            await this.handleConnectionFailure();
            return;
        }
        // Check last ping time
        const timeSinceLastPing = Date.now() - this.lastPingTime;
        if (timeSinceLastPing > 15000) {
            // No ping response for 15 seconds
            console.warn('No ping response, connection may be dead');
            await this.handleConnectionFailure();
        }
        // Update connection metrics
        this.state.updateMetrics({
            latency: timeSinceLastPing,
            timestamp: new Date()
        });
    }
    /**
   * Send ping to peer
   * @private
   */ sendPing() {
        try {
            this.connection.send({
                event: 'ping',
                data: {
                    timestamp: Date.now()
                }
            });
        } catch (error) {
            console.error('Failed to send ping:', error);
        }
    }
    /**
   * Handle connection failure
   * @private
   */ async handleConnectionFailure() {
        if (this.connection) {
            try {
                this.connection.close();
            } catch (error) {
                console.error('Error closing connection:', error);
            }
            this.connection = null;
        }
        this.state.setState((0, $9ba1754323587406$export$575c13c422fb6041).STATES.RECONNECTING, {
            reason: 'connection_failure',
            timestamp: new Date()
        });
        await this._handleReconnection({
            type: 'connection_failure'
        });
    }
    /**
   * Handle errors with enhanced information
   * @private
   * @param {Error} error - The error that occurred
   */ handleError(error) {
        // Record error in state
        this.state.recordError(error, {
            type: error.type || 'server-error',
            state: this.state.getState(),
            timestamp: new Date().toISOString()
        });
        // Forward to message handler
        const handler = this.messageHandlers.get('error');
        if (handler) {
            const errorInfo = {
                status: 'error',
                error: this._getErrorMessage(error),
                details: {
                    type: error.type || 'server-error',
                    state: this.state.getState(),
                    timestamp: new Date().toISOString()
                }
            };
            handler(errorInfo);
        }
    }
    /**
   * Get user-friendly error message
   * @private
   * @param {Error} error - The error object
   * @returns {string} User-friendly error message
   */ _getErrorMessage(error) {
        const errorMessages = {
            network: 'Network error - Could not connect to peer server',
            'invalid-id': 'Invalid ID - The peer ID is invalid or already taken',
            'unavailable-id': 'ID Unavailable - The peer ID is already taken',
            'browser-incompatible': 'Browser Incompatible - WebRTC is not supported',
            'connection-failure': 'Connection failed - Unable to establish or maintain connection',
            disconnected: 'Disconnected - Lost connection to peer server'
        };
        return errorMessages[error.type] || error.message || 'Peer connection error';
    }
    /**
   * Determine if reconnection should be attempted
   * @private
   * @param {Error} error - The error that occurred
   * @returns {boolean} Whether to attempt reconnection
   */ shouldAttemptReconnection(error) {
        // Don't reconnect for certain error types
        const fatalErrors = [
            'browser-incompatible',
            'invalid-id',
            'invalid-key'
        ];
        if (fatalErrors.includes(error.type)) return false;
        return this.state.getMetadata().metrics.reconnects.count < 3;
    }
    /**
   * Set connection timeout with enhanced retry logic
   * @private
   */ _setConnectionTimeout() {
        const timeoutDuration = 15000; // 15 second timeout for ngrok connections
        setTimeout(()=>{
            if (this.state.getState() !== (0, $9ba1754323587406$export$575c13c422fb6041).STATES.CONNECTED) {
                if ((0, $172470ba888aa9b2$export$3f32c2013f0dcc1e).PEER) console.log('Connection attempt timed out');
                if (this.shouldAttemptReconnection({
                    type: 'timeout'
                })) this._handleReconnection({
                    type: 'timeout'
                });
                else this.handleError({
                    type: 'timeout',
                    message: 'Connection timeout - Max attempts reached'
                });
            }
        }, timeoutDuration);
    }
    /**
   * Handle reconnection logic with improved retry strategy
   * @private
   * @param {Error} error - The error that triggered reconnection
   */ async _handleReconnection(error) {
        // Update state to reconnecting
        this.state.setState((0, $9ba1754323587406$export$575c13c422fb6041).STATES.RECONNECTING, {
            error: error.message,
            attempt: this.state.getMetadata().metrics.reconnects.count + 1
        });
        // Use exponential backoff with jitter
        const baseDelay = Math.min(2000 * Math.pow(1.5, this.state.getMetadata().metrics.reconnects.count), 15000);
        const jitter = baseDelay * 0.2 * (Math.random() * 2 - 1);
        const delay = Math.max(2000, baseDelay + jitter);
        if ((0, $172470ba888aa9b2$export$3f32c2013f0dcc1e).PEER) console.log(`Attempting reconnection ${this.state.getMetadata().metrics.reconnects.count + 1} of 3 in ${Math.round(delay)}ms`);
        // Wait for delay
        await new Promise((resolve)=>setTimeout(resolve, delay));
        if (this.state.getState() === (0, $9ba1754323587406$export$575c13c422fb6041).STATES.RECONNECTING) {
            if ((0, $172470ba888aa9b2$export$3f32c2013f0dcc1e).PEER) console.log('Attempting to reconnect...');
            // Clean up existing resources
            await this._cleanup(false);
            // Only try to reconnect if we haven't exceeded max attempts
            if (this.shouldAttemptReconnection(error)) {
                // Move back to connecting state
                this.state.setState((0, $9ba1754323587406$export$575c13c422fb6041).STATES.CONNECTING);
                this.initialize();
            } else {
                if ((0, $172470ba888aa9b2$export$3f32c2013f0dcc1e).PEER) console.log('Max reconnection attempts reached');
                this.state.setState((0, $9ba1754323587406$export$575c13c422fb6041).STATES.ERROR, {
                    error: 'Maximum reconnection attempts reached',
                    type: 'max_retries'
                });
            }
        }
    }
    /**
   * Clean up resources
   * @private
   * @param {boolean} [isClosing=true] - Whether this is a final cleanup
   */ async _cleanup(isClosing = true) {
        // Clean up existing peer
        if (this.peer) {
            this.peer.destroy();
            this.peer = null;
        }
        // Clean up existing connection
        if (this.connection) {
            this.connection.close();
            this.connection = null;
        }
        // Clear intervals if doing final cleanup
        if (isClosing) {
            if (this.healthCheckInterval) {
                clearInterval(this.healthCheckInterval);
                this.healthCheckInterval = null;
            }
            if (this.pingInterval) {
                clearInterval(this.pingInterval);
                this.pingInterval = null;
            }
        }
    }
    /**
   * Connect to target peer with enhanced reliability
   */ connect() {
        try {
            // Check if we already have a connection
            if (this.peer.connections[this.targetPeerId]?.length > 0) {
                const existingConn = this.peer.connections[this.targetPeerId][0];
                if (existingConn.open) {
                    if ((0, $172470ba888aa9b2$export$3f32c2013f0dcc1e).PEER) console.log('Reusing existing connection');
                    this.connection = existingConn;
                    this.setupConnectionHandlers();
                    return;
                }
            }
            // Create new connection
            if ((0, $172470ba888aa9b2$export$3f32c2013f0dcc1e).PEER) console.log('Creating new connection to:', this.targetPeerId);
            this.connection = this.peer.connect(this.targetPeerId, {
                reliable: true,
                serialization: 'binary'
            });
            this.setupConnectionHandlers();
            this._setConnectionTimeout();
        } catch (error) {
            console.error('Error establishing connection:', error);
            this._handleReconnection(error);
        }
    }
    /**
   * Set up handlers for the peer connection
   * @private
   */ setupConnectionHandlers() {
        this.connection.on('open', ()=>{
            if ((0, $172470ba888aa9b2$export$3f32c2013f0dcc1e).PEER) console.log('Connected to peer:', this.targetPeerId);
            // Update state - Note: NgrokClientState allows connected->connected transition
            // to handle multiple data channels opening on the same connection
            this.state.setState((0, $9ba1754323587406$export$575c13c422fb6041).STATES.CONNECTED, {
                peerId: this.targetPeerId,
                timestamp: new Date()
            });
            // Process any queued messages
            this.processMessageQueue();
            // Emit ready event
            const handler = this.messageHandlers.get('ready');
            if (handler) handler({
                status: 'connected',
                peerId: this.targetPeerId,
                state: this.state.getState(),
                timestamp: new Date().toISOString()
            });
        });
        this.connection.on('data', (data)=>{
            if (data.event === 'pong') {
                this.lastPingTime = Date.now();
                // Update latency metrics
                const latency = Date.now() - data.data.timestamp;
                this.state.updateMetrics({
                    latency: latency
                });
                return;
            }
            if ((0, $172470ba888aa9b2$export$3f32c2013f0dcc1e).PEER) console.log('Received data from peer:', data);
            this.handleIncomingData(data);
        });
        this.connection.on('close', ()=>{
            if ((0, $172470ba888aa9b2$export$3f32c2013f0dcc1e).PEER) console.log('Peer connection closed');
            if (!this._isClosing) {
                this.state.setState((0, $9ba1754323587406$export$575c13c422fb6041).STATES.DISCONNECTED, {
                    reason: 'connection_closed'
                });
                this._handleReconnection({
                    type: 'connection_closed'
                });
            }
        });
        this.connection.on('error', (error)=>{
            console.error('Data connection error:', error);
            this.state.setState((0, $9ba1754323587406$export$575c13c422fb6041).STATES.ERROR, {
                error: error.message,
                type: error.type
            });
            this.handleError(error);
            this._handleReconnection(error);
        });
    }
    /**
   * Handle incoming data from peer with enhanced error handling
   * @private
   * @param {Object} data - Data received from peer
   * @param {string} data.event - Event type
   * @param {*} data.data - Event data
   */ handleIncomingData(data) {
        try {
            if ((0, $172470ba888aa9b2$export$3f32c2013f0dcc1e).PEER) console.log('PeerConnection: Received event:', data.event, 'with data:', data.data);
            // First, try to find a specific handler for this event
            const handler = this.messageHandlers.get(data.event);
            if (handler) {
                if ((0, $172470ba888aa9b2$export$3f32c2013f0dcc1e).PEER) console.log('PeerConnection: Found specific handler for event:', data.event);
                handler({
                    ...data.data,
                    timestamp: Date.now(),
                    state: this.state.getState()
                });
            } else {
                if ((0, $172470ba888aa9b2$export$3f32c2013f0dcc1e).PEER) console.log('PeerConnection: No specific handler for event:', data.event, 'forwarding to data handler');
                // If no specific handler is found, forward the event to the data handler
                // This ensures all events are forwarded to the Kinectron class
                const dataHandler = this.messageHandlers.get('data');
                // if (data.event === 'bodyFrame') debugger;
                if (dataHandler) dataHandler(data);
                else console.warn('PeerConnection: No data handler found for event:', data.event);
            }
        } catch (error) {
            console.error('Error handling incoming data:', error);
            this.handleError({
                type: 'data_handling_error',
                message: 'Error processing received data',
                originalError: error
            });
        }
    }
    /**
   * Process queued messages
   * @private
   */ async processMessageQueue() {
        while(this.messageQueue.length > 0 && this.state.getState() === (0, $9ba1754323587406$export$575c13c422fb6041).STATES.CONNECTED){
            const message = this.messageQueue.shift();
            try {
                await this.send(message.event, message.data);
            } catch (error) {
                console.error('Failed to send queued message:', error);
                // Re-queue message if connection is still open
                if (this.state.getState() === (0, $9ba1754323587406$export$575c13c422fb6041).STATES.CONNECTED && this.messageQueue.length < this.maxQueueSize) this.messageQueue.push(message);
            }
        }
    }
    /**
   * Register a handler for a specific event type with validation
   * @param {string} event - Event type to handle
   * @param {Function} handler - Handler function for the event
   */ on(event, handler) {
        if (typeof handler !== 'function') throw new Error('Handler must be a function');
        this.messageHandlers.set(event, handler);
    }
    /**
   * Send data to peer with enhanced reliability
   * @param {string} event - Event type
   * @param {*} data - Data to send
   * @returns {Promise<void>}
   */ async send(event, data) {
        return new Promise((resolve, reject)=>{
            if (this.state.getState() !== (0, $9ba1754323587406$export$575c13c422fb6041).STATES.CONNECTED || !this.connection?.open) {
                // Queue message if not connected
                if (this.messageQueue.length < this.maxQueueSize) {
                    this.messageQueue.push({
                        event: event,
                        data: data
                    });
                    resolve(); // Resolve since message was queued
                } else reject(new Error('Message queue full'));
                return;
            }
            try {
                const message = {
                    event: event,
                    data: data,
                    timestamp: Date.now()
                };
                const timeout = setTimeout(()=>{
                    reject(new Error('Send timeout'));
                }, 5000);
                this.connection.send(message);
                clearTimeout(timeout);
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }
    /**
   * Close the peer connection with graceful shutdown
   */ async close() {
        this._isClosing = true;
        // Send shutdown message if possible
        if (this.connection?.open) try {
            await this.send('shutdown', {
                reason: 'client_close'
            });
        } catch (error) {
            console.error('Error sending shutdown message:', error);
        }
        // Clean up resources
        await this._cleanup(true);
        // Reset state
        this.state.reset();
        this.messageQueue = [];
        this._isClosing = false;
    }
    /**
   * Check if peer is connected
   * @returns {boolean} Connection status
   */ isConnected() {
        return this.state.getState() === (0, $9ba1754323587406$export$575c13c422fb6041).STATES.CONNECTED && this.connection?.open;
    }
}




/**
 * Stream handler factory functions
 */ /**
 * Utility functions for processing image data from different streams
 */ 
function $c92e2967a059e4c5$export$6bfa04708e643828(frameData, callback) {
    // Check for both imagedata and imageData formats
    const imagedata = frameData.imagedata || frameData.imageData;
    if (!frameData || !imagedata) {
        (0, $172470ba888aa9b2$export$bef1f36f5486a6a3).warn('Invalid frame data received:', frameData);
        return;
    }
    const { width: width, height: height } = imagedata;
    // Create a canvas to convert image data to a data URL
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;
    try {
        // Check if data is a string (data URL)
        if (typeof imagedata.data === 'string') {
            (0, $172470ba888aa9b2$export$bef1f36f5486a6a3).data('Processing image data from data URL');
            $c92e2967a059e4c5$export$708bda43d64f1409(imagedata.data, width, height, (src)=>{
                // Call the user callback with processed frame
                callback({
                    src: src,
                    width: width,
                    height: height,
                    raw: imagedata,
                    timestamp: frameData.timestamp || Date.now()
                });
            }, (err)=>{
                (0, $172470ba888aa9b2$export$bef1f36f5486a6a3).error('Error loading image from data URL:', err);
                // Try to call callback anyway with the raw data
                callback({
                    src: imagedata.data,
                    width: width,
                    height: height,
                    raw: imagedata,
                    timestamp: frameData.timestamp || Date.now()
                });
            });
        } else {
            (0, $172470ba888aa9b2$export$bef1f36f5486a6a3).data('Processing image data from raw pixel data');
            // Handle raw pixel data
            const pixelData = $c92e2967a059e4c5$export$3f12cadb607c10de(imagedata.data);
            const imgData = new ImageData(pixelData, width, height);
            // Put the image data on the canvas
            ctx.putImageData(imgData, 0, 0);
            // Convert to data URL for easy display
            const src = canvas.toDataURL('image/jpeg');
            // Call the user callback with processed frame
            callback({
                src: src,
                width: width,
                height: height,
                raw: imagedata,
                timestamp: frameData.timestamp || Date.now()
            });
        }
    } catch (error) {
        (0, $172470ba888aa9b2$export$bef1f36f5486a6a3).error('Error processing frame:', error);
        (0, $172470ba888aa9b2$export$bef1f36f5486a6a3).error('Frame data:', imagedata);
    }
}
function $c92e2967a059e4c5$export$708bda43d64f1409(dataUrl, width, height, onSuccess, onError) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;
    // Create an image from the data URL
    const img = new Image();
    img.onload = ()=>{
        // Draw the image to the canvas
        ctx.drawImage(img, 0, 0, width, height);
        // Use the original data URL
        onSuccess(dataUrl);
    };
    // Set error handler
    img.onerror = (err)=>{
        if (onError) onError(err);
    };
    // Start loading the image
    img.src = dataUrl;
}
function $c92e2967a059e4c5$export$3f12cadb607c10de(data) {
    if (data instanceof Uint8ClampedArray) return data;
    else if (data instanceof Uint8Array) return new Uint8ClampedArray(data);
    else if (Array.isArray(data)) return new Uint8ClampedArray(data);
    else // Handle case where data is an object (e.g., from JSON)
    return new Uint8ClampedArray(Object.values(data));
}



function $1a8022f63b997ce5$export$1a5215a6a049f7d8(streamType, callback) {
    return (data)=>{
        // Extract the actual frame data
        const frameData = data.data || data;
        (0, $172470ba888aa9b2$export$bef1f36f5486a6a3).handler(`Frame handler for ${streamType} received:`, frameData);
        // Check for both imagedata and imageData formats
        const hasImageData = frameData.imagedata || frameData.imageData;
        // Only process frames with matching name
        if (frameData.name === streamType && hasImageData) {
            // Normalize the data structure to ensure imagedata exists
            if (frameData.imageData && !frameData.imagedata) frameData.imagedata = frameData.imageData;
            // Process the image data
            $c92e2967a059e4c5$export$6bfa04708e643828(frameData, callback);
        } else (0, $172470ba888aa9b2$export$bef1f36f5486a6a3).warn(`Received frame event but it's not a valid ${streamType} frame:`, 'name=', frameData.name, 'has imagedata=', !!(frameData.imagedata || frameData.imageData));
    };
}
function $1a8022f63b997ce5$export$e4d1bd1c23c09b9e(callback, unpackFunction) {
    return (data)=>{
        if (data && data.imagedata) // Process the data regardless of isPacked flag
        // The new implementation always unpacks the data
        unpackFunction(data.imagedata, data.width, data.height, data.width, data.testValues).then((depthValues)=>{
            // Call the callback with the unpacked data
            callback({
                ...data,
                depthValues: depthValues,
                timestamp: data.timestamp || Date.now()
            });
        }).catch((error)=>{
            (0, $172470ba888aa9b2$export$bef1f36f5486a6a3).error('Error unpacking raw depth data:', error);
            // Still call the callback with the original data
            callback({
                ...data,
                error: 'Failed to unpack depth data: ' + error.message,
                timestamp: data.timestamp || Date.now()
            });
        });
        else if (data && data.rawDepthData) // Legacy format - raw depth data is already in a usable format
        callback({
            ...data,
            timestamp: data.timestamp || Date.now()
        });
        else {
            (0, $172470ba888aa9b2$export$bef1f36f5486a6a3).warn('Received raw depth frame with invalid data format:', data);
            callback({
                ...data,
                error: 'Invalid data format',
                timestamp: data.timestamp || Date.now()
            });
        }
    };
}
function $1a8022f63b997ce5$export$2105b7696d7712ee(callback) {
    (0, $172470ba888aa9b2$export$bef1f36f5486a6a3).handler('Creating body handler with callback:', callback);
    return (eventData)=>{
        const bodyData = eventData.data;
        if (bodyData && bodyData.bodies) // Body data is already in a usable format (array of body objects)
        // Just add timestamp and pass it through
        callback({
            bodies: bodyData.bodies,
            timestamp: bodyData.timestamp || Date.now(),
            floorClipPlane: bodyData.floorClipPlane,
            trackingId: bodyData.trackingId
        });
    };
}
function $1a8022f63b997ce5$export$334c6911e6336aba(callback) {
    return (data)=>{
        if (data && data.frames) {
            // Process each frame based on its type
            const processedFrames = {};
            // Process each frame in the multiframe data
            Object.entries(data.frames).forEach(([type, frameData])=>{
                if (frameData.imagedata) {
                    // For image-based frames, convert to data URL
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    const { width: width, height: height } = frameData.imagedata;
                    canvas.width = width;
                    canvas.height = height;
                    // Create ImageData object from the raw data
                    const imgData = new ImageData($c92e2967a059e4c5$export$3f12cadb607c10de(frameData.imagedata.data), width, height);
                    // Put the image data on the canvas
                    ctx.putImageData(imgData, 0, 0);
                    // Convert to data URL
                    processedFrames[type] = {
                        src: canvas.toDataURL('image/jpeg'),
                        width: width,
                        height: height,
                        raw: frameData.imagedata
                    };
                } else // For non-image data (like body tracking), pass through
                processedFrames[type] = frameData;
            });
            // Call the user callback with processed frames
            callback({
                frames: processedFrames,
                timestamp: data.timestamp || Date.now()
            });
        }
    };
}


class $a7992a25f18f1d6e$export$9369465eba7492ab {
    constructor(networkConfig){
        this.peer = new (0, $d9a171d677b20397$export$d84cf184fade0488)(networkConfig);
        this.messageHandlers = new Map();
        this.state = null;
        // Set up event handlers
        this.peer.on('ready', (data)=>{
            this.state = data.state;
            const handler = this.messageHandlers.get('ready');
            if (handler) handler(data);
        });
        this.peer.on('error', (error)=>{
            const handler = this.messageHandlers.get('error');
            if (handler) handler(error);
        });
        // Handle state changes
        this.peer.on('stateChange', (data)=>{
            this.state = data.to;
            const handler = this.messageHandlers.get('stateChange');
            if (handler) handler(data);
        });
        // Handle metrics updates
        this.peer.on('metrics', (data)=>{
            const handler = this.messageHandlers.get('metrics');
            if (handler) handler(data);
        });
        // Handle incoming data
        this.peer.on('data', (data)=>{
            const { event: event, data: eventData } = data;
            const handler = this.messageHandlers.get(event);
            if (handler) // if (event === 'bodyFrame') debugger;
            handler(eventData);
            else (0, $172470ba888aa9b2$export$bef1f36f5486a6a3).warn('Kinectron: No handler found for event:', event);
        });
    }
    // Event registration
    on(event, callback) {
        this.messageHandlers.set(event, callback);
    }
    // Get current state
    getState() {
        return this.peer.getState();
    }
    // Check if connected
    isConnected() {
        return this.state === (0, $9ba1754323587406$export$575c13c422fb6041).STATES.CONNECTED;
    }
    // Set Kinect type (azure or windows)
    setKinectType(kinectType) {
        if (!this.isConnected()) {
            (0, $172470ba888aa9b2$export$bef1f36f5486a6a3).warn('Cannot set Kinect type: not connected');
            return;
        }
        this.send('setkinect', kinectType);
    }
    // Initialize Kinect
    initKinect(callback) {
        if (!this.isConnected()) {
            (0, $172470ba888aa9b2$export$bef1f36f5486a6a3).warn('Cannot initialize Kinect: not connected');
            return Promise.reject(new Error('Cannot initialize Kinect: not connected'));
        }
        // Create a promise that resolves when we get the kinectInitialized event
        const initPromise = new Promise((resolve, reject)=>{
            // Set up a one-time handler for the initialization response
            const handler = (data)=>{
                // Normalize the success value to handle nested structure
                let isSuccess = false;
                if (data.success && typeof data.success === 'object' && data.success.success === true) isSuccess = true;
                else if (typeof data.success === 'boolean' && data.success === true) isSuccess = true;
                // Create a normalized result object
                const normalizedResult = {
                    success: isSuccess,
                    alreadyInitialized: !!data.alreadyInitialized,
                    error: data.error || null,
                    rawData: data
                };
                if (isSuccess || data.alreadyInitialized) resolve(normalizedResult);
                else reject(new Error(data.error || 'Failed to initialize Kinect'));
                // Remove the handler after it's been called
                this.messageHandlers.delete('kinectInitialized');
            };
            this.messageHandlers.set('kinectInitialized', handler);
            // Send initialization request to server
            this.send('initkinect', {});
        });
        // For backward compatibility, if a callback is provided, use it
        if (callback) initPromise.then((data)=>callback(data)).catch((error)=>callback({
                success: false,
                error: error.message
            }));
        // Return the promise for modern Promise-based usage
        return initPromise;
    }
    // Send data to peer
    send(event, data) {
        if (!this.isConnected()) {
            (0, $172470ba888aa9b2$export$bef1f36f5486a6a3).warn('Cannot send data: not connected');
            return;
        }
        this.peer.send(event, data);
    }
    // Start feed methods
    startColor(callback) {
        if (callback) // Set up frame handler to process color frames
        this.messageHandlers.set('frame', (0, $1a8022f63b997ce5$export$1a5215a6a049f7d8)('color', callback));
        this.send('feed', {
            feed: 'color'
        });
    }
    startDepth(callback) {
        if (callback) // Set up frame handler to process depth frames
        this.messageHandlers.set('frame', (0, $1a8022f63b997ce5$export$1a5215a6a049f7d8)('depth', callback));
        this.send('feed', {
            feed: 'depth'
        });
    }
    /**
   * Unpacks raw depth data from a WebP image
   * @private
   * @param {string} dataUrl - The data URL containing the depth data
   * @param {number} width - The width of the image
   * @param {number} height - The height of the image
   * @param {number} originalWidth - The original width of the depth data (not used in new implementation)
   * @param {Object} testValues - Test values to verify unpacking accuracy
   * @returns {Promise<Uint16Array>} - Promise resolving to the unpacked depth values
   */ _unpackRawDepthData(dataUrl, width, height, originalWidth, testValues) {
        // Log using the imported debug module
        if ((0, $172470ba888aa9b2$export$3f32c2013f0dcc1e).DATA) (0, $172470ba888aa9b2$export$bef1f36f5486a6a3).data('Unpacking raw depth data with dimensions:', width, 'x', height);
        return new Promise((resolve, reject)=>{
            // Create image to load the data URL
            const img = new Image();
            img.onload = ()=>{
                // Use OffscreenCanvas for efficient processing
                const canvas = new OffscreenCanvas(width, height);
                const ctx = canvas.getContext('2d');
                // Draw the image to the canvas
                ctx.drawImage(img, 0, 0);
                // Get the pixel data
                const imageData = ctx.getImageData(0, 0, width, height).data;
                // Create array for unpacked depth values
                const depthValues = new Uint16Array(width * height);
                // Process the raw depth data exactly like the app.js client code
                let j = 0;
                for(let i = 0; i < imageData.length; i += 4){
                    // Extract depth value from R and G channels
                    const depth = imageData[i + 1] << 8 | imageData[i]; // Get uint16 data from buffer
                    depthValues[j++] = depth;
                }
                // Verify test values if provided
                if (testValues && (0, $172470ba888aa9b2$export$3f32c2013f0dcc1e).DATA) {
                    const unpackedValue1000 = depthValues[1000];
                    const unpackedValue2000 = depthValues[2000];
                    const unpackedValue3000 = depthValues[3000];
                    (0, $172470ba888aa9b2$export$bef1f36f5486a6a3).data('Test values comparison:', {
                        'Index 1000': {
                            Original: testValues.index1000,
                            Unpacked: unpackedValue1000,
                            Difference: testValues.index1000 - unpackedValue1000
                        },
                        'Index 2000': {
                            Original: testValues.index2000,
                            Unpacked: unpackedValue2000,
                            Difference: testValues.index2000 - unpackedValue2000
                        },
                        'Index 3000': {
                            Original: testValues.index3000,
                            Unpacked: unpackedValue3000,
                            Difference: testValues.index3000 - unpackedValue3000
                        }
                    });
                }
                resolve(depthValues);
            };
            img.onerror = (err)=>{
                reject(new Error('Failed to load depth image: ' + err));
            };
            img.src = dataUrl;
        });
    }
    startRawDepth(callback) {
        if (callback) // Set up handler to process raw depth frames
        this.messageHandlers.set('rawDepth', (0, $1a8022f63b997ce5$export$e4d1bd1c23c09b9e)(callback, this._unpackRawDepthData.bind(this)));
        this.send('feed', {
            feed: 'raw-depth'
        });
    }
    startBodies(callback) {
        if (callback) // Set up handler to process body tracking frames
        this.messageHandlers.set('bodyFrame', (0, $1a8022f63b997ce5$export$2105b7696d7712ee)(callback));
        this.send('feed', {
            feed: 'body'
        });
    }
    startKey(callback) {
        if (callback) // Set up frame handler to process key frames
        this.messageHandlers.set('frame', (0, $1a8022f63b997ce5$export$1a5215a6a049f7d8)('key', callback));
        this.send('feed', {
            feed: 'key'
        });
    }
    startDepthKey(callback) {
        if (callback) // Set up handler to process depth key frames
        this.messageHandlers.set('depth-key', (0, $1a8022f63b997ce5$export$1a5215a6a049f7d8)('depth-key', callback));
        this.send('feed', {
            feed: 'depth-key'
        });
    }
    startRGBD(callback) {
        if (callback) // Set up frame handler to process RGBD frames
        this.messageHandlers.set('frame', (0, $1a8022f63b997ce5$export$1a5215a6a049f7d8)('rgbd', callback));
        this.send('feed', {
            feed: 'rgbd'
        });
    }
    startMultiFrame(frames, callback) {
        if (callback) // Set up handler to process multi-frame data
        this.messageHandlers.set('multiFrame', (0, $1a8022f63b997ce5$export$334c6911e6336aba)(callback));
        this.send('multi', frames);
    }
    // Stop all feeds
    stopAll() {
        this.send('feed', {
            feed: 'stop-all'
        });
    }
    // Clean up
    close() {
        this.peer.close();
        this.messageHandlers.clear();
        this.state = null;
    }
}


console.log('You are running Kinectron API version 1.0.0');
var // Export the Kinectron class as the default export
$2119817dcd5d2e7c$export$2e2bcd8739ae039 = (0, $a7992a25f18f1d6e$export$9369465eba7492ab);


export {$2119817dcd5d2e7c$export$2e2bcd8739ae039 as default};
//# sourceMappingURL=kinectron.cjs.js.map
