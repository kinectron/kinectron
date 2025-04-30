// main/kinectController.js
import KinectAzure from 'kinect-azure';

// Define all Kinect Azure constants we need
export const KinectConstants = {
  COLOR: {
    WIDTH: 1280,
    HEIGHT: 720,
  },
  DEPTH: {
    WIDTH: 640,
    HEIGHT: 576,
  },
  RAW_DEPTH: {
    WIDTH: 320,
    HEIGHT: 288,
  },
  RGBD: {
    WIDTH: 512,
    HEIGHT: 512,
  },
};

// Define default configuration options
export const KinectOptions = {
  COLOR: {
    color_resolution: KinectAzure.K4A_COLOR_RESOLUTION_720P,
    color_format: KinectAzure.K4A_IMAGE_FORMAT_COLOR_BGRA32,
    camera_fps: KinectAzure.K4A_FRAMES_PER_SECOND_15,
  },
  DEPTH: {
    depth_mode: KinectAzure.K4A_DEPTH_MODE_NFOV_UNBINNED,
    camera_fps: KinectAzure.K4A_FRAMES_PER_SECOND_15,
  },
  RAW_DEPTH: {
    depth_mode: KinectAzure.K4A_DEPTH_MODE_NFOV_2X2BINNED,
    camera_fps: KinectAzure.K4A_FRAMES_PER_SECOND_15,
  },
  BODY: {
    depth_mode: KinectAzure.K4A_DEPTH_MODE_NFOV_UNBINNED,
    color_resolution: KinectAzure.K4A_COLOR_RESOLUTION_720P,
    camera_fps: KinectAzure.K4A_FRAMES_PER_SECOND_30,
  },
  KEY: {
    depth_mode: KinectAzure.K4A_DEPTH_MODE_NFOV_UNBINNED,
    color_format: KinectAzure.K4A_IMAGE_FORMAT_COLOR_BGRA32,
    color_resolution: KinectAzure.K4A_COLOR_RESOLUTION_720P,
    include_body_index_map: true,
    camera_fps: KinectAzure.K4A_FRAMES_PER_SECOND_15,
  },
  DEPTH_KEY: {
    depth_mode: KinectAzure.K4A_DEPTH_MODE_NFOV_2X2BINNED,
    include_body_index_map: true,
    camera_fps: KinectAzure.K4A_FRAMES_PER_SECOND_15,
  },
  RGBD: {
    depth_mode: KinectAzure.K4A_DEPTH_MODE_WFOV_2X2BINNED,
    color_format: KinectAzure.K4A_IMAGE_FORMAT_COLOR_BGRA32,
    color_resolution: KinectAzure.K4A_COLOR_RESOLUTION_720P,
    camera_fps: KinectAzure.K4A_FRAMES_PER_SECOND_15,
    include_color_to_depth: true,
    synchronized_images_only: true,
    processing_mode: KinectAzure.K4A_PROCESSING_MODE_GPU,
  },
};

export class KinectController {
  constructor() {
    this.kinect = null;
    this.isListening = false;
  }

  initialize() {
    try {
      // If Kinect instance exists, always close it and try again
      if (this.kinect) {
        console.log(
          'KinectController: Closing existing Kinect instance to reinitialize',
        );
        try {
          this.kinect.close();
        } catch (closeError) {
          console.warn(
            'KinectController: Error closing existing instance (may be normal):',
            closeError,
          );
        }
        this.kinect = null;
      }

      console.log(
        'KinectController: Creating new KinectAzure instance',
      );
      this.kinect = new KinectAzure();

      console.log('KinectController: Calling kinect.open()');
      const result = this.kinect.open();

      console.log(
        'KinectController: kinect.open() returned:',
        result,
      );

      if (result) {
        console.log(
          'KinectController: Kinect initialized successfully',
        );
        return { success: true };
      } else {
        console.warn(
          'KinectController: kinect.open() returned false',
        );
        return {
          success: false,
          error: 'Failed to open Kinect device',
        };
      }
    } catch (error) {
      console.error('Failed to initialize Kinect:', error);
      return { success: false, error: error.message };
    }
  }

  startColorCamera(options = {}) {
    console.log(
      'KinectController: startColorCamera called with options:',
      options,
    );
    try {
      const cameraOptions = {
        ...KinectOptions.COLOR,
        ...options,
      };

      console.log(
        'KinectController: Starting cameras with options:',
        cameraOptions,
      );

      // Check if cameras are already running
      try {
        console.log(
          'KinectController: Stopping cameras first to ensure clean start',
        );
        this.kinect.stopCameras();
        console.log('KinectController: Cameras stopped successfully');
      } catch (stopError) {
        console.warn(
          'KinectController: Error stopping cameras (may be normal if not started):',
          stopError,
        );
      }

      // Start the cameras
      this.kinect.startCameras(cameraOptions);
      console.log(
        'KinectController: Color cameras started successfully',
      );

      return true;
    } catch (error) {
      console.error(
        'KinectController: Failed to start color camera:',
        error,
      );
      return false;
    }
  }

  startDepthCamera(options = {}) {
    console.log(
      'KinectController: startDepthCamera called with options:',
      options,
    );
    try {
      const depthOptions = {
        ...KinectOptions.DEPTH,
        ...options,
      };

      console.log(
        'KinectController: Starting depth camera with options:',
        depthOptions,
      );

      // Check if cameras are already running
      try {
        console.log(
          'KinectController: Stopping cameras first to ensure clean start',
        );
        this.kinect.stopCameras();
        console.log('KinectController: Cameras stopped successfully');
      } catch (stopError) {
        console.warn(
          'KinectController: Error stopping cameras (may be normal if not started):',
          stopError,
        );
      }

      // Start the cameras
      this.kinect.startCameras(depthOptions);
      console.log(
        'KinectController: Depth camera started successfully',
      );

      // Get depth mode range for debugging
      const depthRange = this.kinect.getDepthModeRange(
        depthOptions.depth_mode,
      );
      console.log(
        'KinectController: Depth range for current mode:',
        depthRange,
      );

      return true;
    } catch (error) {
      console.error(
        'KinectController: Failed to start depth camera:',
        error,
      );
      return false;
    }
  }

  startRawDepthCamera(options = {}) {
    console.log(
      'KinectController: startRawDepthCamera called with options:',
      options,
    );
    try {
      const rawDepthOptions = {
        ...KinectOptions.RAW_DEPTH,
        ...options,
      };

      console.log(
        'KinectController: Starting raw depth camera with options:',
        rawDepthOptions,
      );

      // Check if cameras are already running
      try {
        console.log(
          'KinectController: Stopping cameras first to ensure clean start',
        );
        this.kinect.stopCameras();
        console.log('KinectController: Cameras stopped successfully');
      } catch (stopError) {
        console.warn(
          'KinectController: Error stopping cameras (may be normal if not started):',
          stopError,
        );
      }

      // Start the cameras
      this.kinect.startCameras(rawDepthOptions);
      console.log(
        'KinectController: Raw depth camera started successfully',
      );

      // Get depth mode range for debugging
      const depthRange = this.kinect.getDepthModeRange(
        rawDepthOptions.depth_mode,
      );
      console.log(
        'KinectController: Depth range for current mode:',
        depthRange,
      );

      return true;
    } catch (error) {
      console.error(
        'KinectController: Failed to start raw depth camera:',
        error,
      );
      return false;
    }
  }

  startBodyTracking(options = {}) {
    try {
      this.kinect.startCameras({ ...KinectOptions.BODY, ...options });
      this.kinect.createTracker();
      return true;
    } catch (error) {
      console.error('Failed to start body tracking:', error);
      return false;
    }
  }

  startKeyCamera(options = {}) {
    try {
      // Configure for both body tracking and color
      const keyOptions = {
        depth_mode: KinectAzure.K4A_DEPTH_MODE_NFOV_UNBINNED,
        color_resolution: KinectAzure.K4A_COLOR_RESOLUTION_720P,
        color_format: KinectAzure.K4A_IMAGE_FORMAT_COLOR_BGRA32,
        camera_fps: KinectAzure.K4A_FRAMES_PER_SECOND_15,
        synchronized_images_only: true,
        include_depth_to_color: true,
        include_body_index_map: true,
        processing_mode: KinectAzure.K4A_PROCESSING_MODE_GPU,
        ...options,
      };

      // Start cameras with combined configuration
      this.kinect.startCameras(keyOptions);

      // Initialize body tracker after cameras are started
      this.kinect.createTracker({
        sensor_orientation:
          KinectAzure.K4ABT_SENSOR_ORIENTATION_DEFAULT,
        processing_mode:
          KinectAzure.K4ABT_TRACKER_PROCESSING_MODE_GPU,
        gpu_device_id: 0,
      });

      return true;
    } catch (error) {
      console.error('Failed to start key camera:', error);
      return false;
    }
  }

  startDepthKeyCamera(options = {}) {
    try {
      const depthMode = KinectAzure.K4A_DEPTH_MODE_NFOV_2X2BINNED;
      const depthKeyOptions = {
        depth_mode: depthMode,
        include_body_index_map: true,
        camera_fps: KinectAzure.K4A_FRAMES_PER_SECOND_15,
        ...options,
      };

      this.kinect.startCameras(depthKeyOptions);
      this.kinect.createTracker();
      return true;
    } catch (error) {
      console.error('Failed to start depth key camera:', error);
      return false;
    }
  }

  startRGBDCamera(options = {}) {
    try {
      this.kinect.startCameras({
        ...KinectOptions.RGBD,
        ...options,
      });
      return true;
    } catch (error) {
      console.error('Failed to start RGBD camera:', error);
      return false;
    }
  }

  startListening(callback) {
    if (this.isListening) {
      console.warn(
        'KinectController: Already listening for Kinect data',
      );
      return false;
    }

    if (!callback) {
      console.error(
        'KinectController: No callback provided to startListening',
      );
      return false;
    }

    try {
      console.log(
        'KinectController: Starting to listen for Kinect frames',
      );

      // Create a frame counter for debugging
      let frameCount = 0;
      let lastLogTime = Date.now();
      let depthFrameCount = 0;
      let colorFrameCount = 0;

      this.isListening = true;
      this.kinect.startListening((data) => {
        // Track frame types for statistics
        frameCount++;
        if (data.depthImageFrame) depthFrameCount++;
        if (data.colorImageFrame) colorFrameCount++;

        // Log frame statistics every 5 seconds
        const now = Date.now();
        if (now - lastLogTime >= 5000) {
          console.log(
            `KinectController: Frame stats (5s): ${frameCount} total (${depthFrameCount} depth, ${colorFrameCount} color)`,
          );

          // Reset counters
          frameCount = 0;
          depthFrameCount = 0;
          colorFrameCount = 0;
          lastLogTime = now;
        }

        // Call the original callback
        callback(data);
      });

      console.log(
        'KinectController: Successfully started listening for Kinect frames',
      );
      return true;
    } catch (error) {
      console.error(
        'KinectController: Failed to start listening:',
        error,
      );
      this.isListening = false;
      return false;
    }
  }

  async stopListening() {
    if (!this.isListening) return;

    try {
      await this.kinect.stopListening();
      this.isListening = false;
    } catch (error) {
      console.error('Error stopping Kinect listening:', error);
    }
  }

  async stopCameras() {
    try {
      await this.stopListening();
      if (this.kinect) {
        // Always try to destroy tracker first to ensure clean shutdown
        try {
          this.kinect.destroyTracker();
        } catch (error) {
          // Ignore error if no tracker was created
        }
        this.kinect.stopCameras();
      }
    } catch (error) {
      console.error('Error stopping cameras:', error);
    }
  }

  getDepthModeRange(depthMode) {
    return this.kinect.getDepthModeRange(depthMode);
  }

  async close() {
    try {
      await this.stopListening();
      if (this.kinect) {
        // Always try to destroy tracker first to ensure clean shutdown
        try {
          this.kinect.destroyTracker();
        } catch (error) {
          // Ignore error if no tracker was created
        }
        this.kinect.stopCameras();
        this.kinect.close();
        this.kinect = null;
      }
    } catch (error) {
      console.error('Error closing Kinect:', error);
    }
  }
}
