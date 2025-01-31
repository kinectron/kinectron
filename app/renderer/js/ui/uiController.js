export function initializeUI() {
    const startKinectBtn = document.getElementById('start-kinect-azure');
    if (startKinectBtn) {
      startKinectBtn.addEventListener('click', initializeKinect);
    }
  
    // Initialize other UI elements...
  }
  
  async function initializeKinect() {
    try {
      const success = await window.api.initializeKinect();
      if (success) {
        console.log('Kinect initialized successfully');
        enableKinectControls();
      } else {
        console.error('Failed to initialize Kinect');
      }
    } catch (error) {
      console.error('Error initializing Kinect:', error);
    }
  }
  
  function enableKinectControls() {
    // Enable color, depth, skeleton buttons...
    document.getElementById('color').addEventListener('click', startColorStream);
    document.getElementById('depth').addEventListener('click', startDepthStream);
    // ... add other button handlers
  }
  
  async function startColorStream() {
    try {
      const success = await window.api.startColorStream();
      if (success) {
        // Update UI to show stream is active
      }
    } catch (error) {
      console.error('Error starting color stream:', error);
    }
  }