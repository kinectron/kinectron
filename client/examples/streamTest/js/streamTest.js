/**
 * Main controller for the Kinectron Stream Test application
 * Orchestrates all modules and handles initialization
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize debug controller first
  const debug = DebugController.initialize();

  // Initialize UI controller
  const ui = UIController.initialize();

  // Initialize visualization controller
  const visualization = VisualizationController.initialize();

  // Initialize metrics controller with p5Visualizer from visualization controller
  const metrics = MetricsController.initialize({
    p5Visualizer: visualization.p5Visualizer,
  });

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
