/**
 * Main controller for the Kinectron Stream Test application
 * Orchestrates all modules and handles initialization
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize all controllers
  const debug = DebugController.initialize();
  const metrics = MetricsController.initialize();
  const ui = UIController.initialize();
  const visualization = VisualizationController.initialize();

  // Initialize Kinect controller last, as it depends on other controllers
  const kinect = KinectController.initialize({
    debug,
    metrics,
    ui,
    visualization,
  });

  // Make controllers globally accessible for debugging
  window.controllers = {
    debug,
    metrics,
    ui,
    visualization,
    kinect,
  };

  console.log('Kinectron Stream Test initialized');
});
