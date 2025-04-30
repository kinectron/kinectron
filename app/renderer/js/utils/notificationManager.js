/**
 * NotificationManager - A reusable notification system for the Kinectron application
 *
 * This class provides a centralized way to display notifications to the user,
 * including modal dialogs for critical errors and status indicators.
 */
export class NotificationManager {
  constructor() {
    // Singleton pattern
    if (NotificationManager.instance) {
      return NotificationManager.instance;
    }

    NotificationManager.instance = this;

    // Initialize properties
    this.modalVisible = false;
    this.statusIndicator = null;
    this.initialized = false;

    // Initialize the modal immediately or when the DOM is loaded
    this.initializeModal();
  }

  /**
   * Initialize the modal dialog elements and event listeners
   * @private
   */
  initializeModal() {
    // Check if document is already loaded
    if (
      document.readyState === 'complete' ||
      document.readyState === 'interactive'
    ) {
      this._setupModalElements();
    } else {
      // Wait for DOM to be fully loaded
      document.addEventListener('DOMContentLoaded', () => {
        this._setupModalElements();
      });
    }
  }

  /**
   * Set up modal elements and event listeners
   * @private
   */
  _setupModalElements() {
    try {
      // Get modal elements
      this.modal = document.getElementById('notification-modal');
      this.modalTitle = document.getElementById('modal-title');
      this.modalMessage = document.getElementById('modal-message');
      this.modalDetails = document.getElementById('modal-details');
      this.modalActions = document.getElementById('modal-actions');
      this.modalCloseBtn = document.getElementById('modal-close');

      if (!this.modal) {
        console.error('Modal element not found in the DOM');
        return;
      }

      // Add event listeners
      if (this.modalCloseBtn) {
        this.modalCloseBtn.addEventListener('click', () =>
          this.hideModal(),
        );
      }

      // Close modal when clicking outside (optional)
      this.modal.addEventListener('click', (event) => {
        if (event.target === this.modal) {
          this.hideModal();
        }
      });

      this.initialized = true;
      console.log(
        'NotificationManager: Modal elements initialized successfully',
      );
    } catch (error) {
      console.error(
        'NotificationManager: Error initializing modal elements:',
        error,
      );
    }
  }

  /**
   * Ensure modal elements are initialized
   * @private
   * @returns {boolean} Whether initialization was successful
   */
  _ensureInitialized() {
    if (!this.initialized) {
      console.log(
        'NotificationManager: Modal not yet initialized, attempting initialization now',
      );
      this._setupModalElements();
    }
    return this.initialized;
  }

  /**
   * Show a modal dialog with the specified options
   * @param {Object} options - Modal options
   * @param {string} options.type - Type of notification ('error', 'warning', 'info', 'success')
   * @param {string} options.title - Modal title
   * @param {string} options.message - Main message
   * @param {string[]} [options.details] - Array of detailed points to display as a list
   * @param {Object[]} [options.actions] - Array of action buttons
   * @param {string} options.actions[].label - Button label
   * @param {Function} options.actions[].callback - Button click callback
   * @param {string} [options.actions[].type] - Button type ('primary', 'secondary', 'danger')
   */
  showModal(options) {
    // Ensure modal elements are initialized
    if (!this._ensureInitialized()) {
      console.error('Modal elements could not be initialized');
      // Fallback to console notification
      console.warn(
        'NOTIFICATION:',
        options.title,
        '-',
        options.message,
      );
      if (options.details) {
        console.warn('Details:', options.details);
      }
      return;
    }

    // Set modal content
    this.modalTitle.textContent = options.title || '';
    this.modalMessage.textContent = options.message || '';

    // Set modal type class
    this.modal.className = 'notification-modal';
    if (options.type) {
      this.modal.classList.add(`notification-${options.type}`);
    }

    // Clear previous details
    this.modalDetails.innerHTML = '';

    // Add details if provided
    if (options.details && options.details.length > 0) {
      const list = document.createElement('ul');
      options.details.forEach((detail) => {
        const item = document.createElement('li');
        item.textContent = detail;
        list.appendChild(item);
      });
      this.modalDetails.appendChild(list);
    }

    // Clear previous actions
    this.modalActions.innerHTML = '';

    // Add close button
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.className = 'modal-btn modal-btn-secondary';
    closeButton.addEventListener('click', () => this.hideModal());
    this.modalActions.appendChild(closeButton);

    // Add custom action buttons if provided
    if (options.actions && options.actions.length > 0) {
      options.actions.forEach((action) => {
        if (action.label === 'Close') return; // Skip if it's a close button (we already added one)

        const button = document.createElement('button');
        button.textContent = action.label;
        button.className = `modal-btn modal-btn-${
          action.type || 'primary'
        }`;
        button.addEventListener('click', () => {
          if (typeof action.callback === 'function') {
            action.callback();
          }
        });
        this.modalActions.appendChild(button);
      });
    }

    // Show the modal
    this.modal.style.display = 'flex';
    this.modalVisible = true;
  }

  /**
   * Hide the modal dialog
   */
  hideModal() {
    // Ensure modal elements are initialized
    if (!this._ensureInitialized()) {
      console.error('Modal elements could not be initialized');
      return;
    }

    if (this.modal) {
      this.modal.style.display = 'none';
      this.modalVisible = false;
    }
  }

  /**
   * Show a Kinect initialization error modal with troubleshooting steps
   * @param {string} errorMessage - The specific error message
   */
  showKinectInitError(errorMessage) {
    this.showModal({
      type: 'error',
      title: 'Kinect Not Connected',
      message: errorMessage || 'Failed to initialize Kinect device.',
      details: [
        'Check that your Kinect is properly connected to your computer via USB',
        'Ensure the Kinect power supply is connected and the power light is on',
        'Verify that the Azure Kinect SDK is properly installed',
        'Try unplugging and reconnecting the Kinect',
        'Restart your computer if the issue persists',
        'Click "Open Kinect" button to try again after connecting your device',
      ],
      actions: [], // No additional actions, just the default close button
    });
  }

  /**
   * Update the status indicator
   * @param {string} status - Status type ('connected', 'disconnected', 'error')
   * @param {string} message - Status message
   */
  updateStatus(status, message) {
    const statusElement = document.getElementById('server-status');
    if (statusElement) {
      // Remove all status classes
      statusElement.classList.remove(
        'connected',
        'disconnected',
        'error',
      );

      // Add the appropriate class
      statusElement.classList.add(status);

      // Update the text
      statusElement.textContent = message || status;
    }
  }

  // Future expansion for toast notifications
  /*
  showToast(options) {
    // Implementation for toast notifications
  }
  */

  // Future expansion for different notification types
  /*
  showWarning(message, details) {
    // Implementation for warning notifications
  }
  
  showInfo(message, details) {
    // Implementation for info notifications
  }
  
  showSuccess(message, details) {
    // Implementation for success notifications
  }
  */
}

// Create and export a singleton instance
export const notificationManager = new NotificationManager();
