// main/ipcHandler.js
import { ipcMain } from 'electron';
import KinectAzure from 'kinect-azure';
import {
  KinectConstants,
  KinectOptions,
} from './kinectController.js';

export class IpcHandler {
  constructor(kinectController) {
    this.kinectController = kinectController;
    this.activeStreams = new Set();
  }

  initialize() {
    this.setupKinectHandlers();
    this.setupColorStreamHandlers();
    this.setupDepthStreamHandlers();
    this.setupRawDepthStreamHandlers();
    this.setupBodyTrackingHandlers();
    this.setupKeyStreamHandlers();
    this.setupDepthKeyStreamHandlers();
    this.setupRGBDStreamHandlers();
    this.setupStopStreamHandler();
  }

  setupKinectHandlers() {
    ipcMain.handle('initialize-kinect', async () => {
      try {
        return this.kinectController.initialize();
      } catch (error) {
        console.error('Kinect initialization error:', error);
        throw error;
      }
    });

    ipcMain.handle('close-kinect', async () => {
      try {
        await this.kinectController.close();
        return true;
      } catch (error) {
        console.error('Error closing Kinect:', error);
        throw error;
      }
    });
  }

  setupColorStreamHandlers() {
    ipcMain.handle('start-color-stream', async (event) => {
      try {
        const success = this.kinectController.startColorCamera();
        if (success) {
          this.activeStreams.add('color');
          this.kinectController.startListening((data) => {
            if (data.colorImageFrame) {
              const processedData = this.processColorFrame(
                data.colorImageFrame,
              );
              if (processedData) {
                event.sender.send('color-frame', processedData);
              }
            }
          });
        }
        return success;
      } catch (error) {
        console.error('Error starting color stream:', error);
        throw error;
      }
    });
  }

  setupDepthStreamHandlers() {
    ipcMain.handle('start-depth-stream', async (event) => {
      try {
        const success = this.kinectController.startDepthCamera();
        if (success) {
          this.activeStreams.add('depth');
          const depthRange = this.kinectController.getDepthModeRange(
            KinectOptions.DEPTH.depth_mode,
          );

          this.kinectController.startListening((data) => {
            if (data.depthImageFrame) {
              const processedData = this.processDepthFrame(
                data.depthImageFrame,
                depthRange,
              );
              event.sender.send('depth-frame', {
                imageData: processedData,
                width: KinectConstants.DEPTH.WIDTH,
                height: KinectConstants.DEPTH.HEIGHT,
              });
            }
          });
        }
        return success;
      } catch (error) {
        console.error('Error starting depth stream:', error);
        throw error;
      }
    });
  }

  setupRawDepthStreamHandlers() {
    ipcMain.handle('start-raw-depth-stream', async (event) => {
      try {
        const success = this.kinectController.startRawDepthCamera();
        if (success) {
          this.activeStreams.add('raw-depth');
          this.kinectController.startListening((data) => {
            if (data.depthImageFrame) {
              const processedData = this.processRawDepthFrame(
                data.depthImageFrame,
              );
              event.sender.send('raw-depth-frame', {
                imageData: processedData,
                width: KinectConstants.RAW_DEPTH.WIDTH,
                height: KinectConstants.RAW_DEPTH.HEIGHT,
              });
            }
          });
        }
        return success;
      } catch (error) {
        console.error('Error starting raw depth stream:', error);
        throw error;
      }
    });
  }

  setupBodyTrackingHandlers() {
    ipcMain.handle('start-body-tracking', async (event) => {
      try {
        const success = this.kinectController.startBodyTracking();
        if (success) {
          this.activeStreams.add('skeleton');
          this.kinectController.startListening((data) => {
            if (data.bodyFrame && data.bodyFrame.numBodies > 0) {
              const processedData = this.processBodyFrame(
                data.bodyFrame,
              );
              event.sender.send('body-frame', processedData);
            }
          });
        }
        return success;
      } catch (error) {
        console.error('Error starting body tracking:', error);
        throw error;
      }
    });
  }

  setupKeyStreamHandlers() {
    ipcMain.handle('start-key-stream', async (event) => {
      try {
        const success = this.kinectController.startKeyCamera();
        if (success) {
          this.activeStreams.add('key');
          // Wait a short time for the body tracker to initialize
          setTimeout(() => {
            this.kinectController.startListening((data) => {
              if (data.colorImageFrame) {
                if (data.bodyFrame?.bodyIndexMapToColorImageFrame) {
                  const processedData = this.processKeyFrame(
                    data.colorImageFrame,
                    data.bodyFrame.bodyIndexMapToColorImageFrame,
                  );
                  if (processedData) {
                    event.sender.send('key-frame', processedData);
                  }
                }
              }
            });
          }, 1000); // Wait 1 second for tracker initialization
        }
        return success;
      } catch (error) {
        console.error('Error starting key stream:', error);
        throw error;
      }
    });
  }

  setupDepthKeyStreamHandlers() {
    ipcMain.handle('start-depth-key-stream', async (event) => {
      try {
        const success = this.kinectController.startDepthKeyCamera();
        if (success) {
          this.activeStreams.add('depth-key');
          this.kinectController.startListening((data) => {
            if (
              data.depthImageFrame &&
              data.bodyFrame?.bodyIndexMapImageFrame
            ) {
              const processedData = this.processDepthKeyFrame(
                data.depthImageFrame,
                data.bodyFrame.bodyIndexMapImageFrame,
              );
              event.sender.send('depth-key-frame', processedData);
            }
          });
        }
        return success;
      } catch (error) {
        console.error('Error starting depth key stream:', error);
        throw error;
      }
    });
  }

  setupRGBDStreamHandlers() {
    ipcMain.handle('start-rgbd-stream', async (event) => {
      try {
        const success = this.kinectController.startRGBDCamera();
        if (success) {
          this.activeStreams.add('rgbd');
          const depthRange = this.kinectController.getDepthModeRange(
            KinectOptions.RGBD.depth_mode,
          );

          this.kinectController.startListening((data) => {
            if (data.depthImageFrame && data.colorToDepthImageFrame) {
              const processedData = this.processRGBDFrame(
                data.depthImageFrame,
                data.colorToDepthImageFrame,
                depthRange,
              );
              event.sender.send('rgbd-frame', processedData);
            }
          });
        }
        return success;
      } catch (error) {
        console.error('Error starting RGBD stream:', error);
        throw error;
      }
    });
  }

  setupStopStreamHandler() {
    ipcMain.handle('stop-stream', async (event, streamType) => {
      try {
        if (this.activeStreams.has(streamType)) {
          await this.kinectController.stopListening();
          await this.kinectController.stopCameras();
          this.activeStreams.delete(streamType);
        }
        return true;
      } catch (error) {
        console.error(`Error stopping ${streamType} stream:`, error);
        throw error;
      }
    });
  }

  // Helper function to map values from one range to another
  mapRange(value, inMin, inMax, outMin, outMax) {
    return (
      ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin
    );
  }

  // Helper function to create a Blob URL from buffer data
  createBlobUrl(buffer, mimeType) {
    const blob = new Blob([buffer], { type: mimeType });
    return URL.createObjectURL(blob);
  }

  processColorFrame(frame) {
    try {
      // Create a copy of the buffer to avoid memory issues
      const bufferCopy = Buffer.from(frame.imageData);
      const processedData = new Uint8ClampedArray(bufferCopy.length);

      // Convert BGRA to RGBA
      for (let i = 0; i < bufferCopy.length; i += 4) {
        processedData[i] = bufferCopy[i + 2]; // R = B
        processedData[i + 1] = bufferCopy[i + 1]; // G = G
        processedData[i + 2] = bufferCopy[i]; // B = R
        processedData[i + 3] = bufferCopy[i + 3]; // A = A
      }

      return {
        imageData: {
          data: processedData,
          width: KinectConstants.COLOR.WIDTH,
          height: KinectConstants.COLOR.HEIGHT,
        },
      };
    } catch (error) {
      console.error('Error processing color frame:', error);
      return null;
    }
  }

  processDepthFrame(frame, depthRange) {
    try {
      const depthData = new Uint16Array(frame.imageData.buffer);
      const processedData = new Uint8ClampedArray(
        depthData.length * 4,
      );

      for (let i = 0; i < depthData.length; i++) {
        const pixelValue = depthData[i];
        const normalizedValue = Math.floor(
          this.mapRange(
            pixelValue,
            depthRange.min,
            depthRange.max,
            255,
            0,
          ),
        );

        const index = i * 4;
        processedData[index] = normalizedValue; // R
        processedData[index + 1] = normalizedValue; // G
        processedData[index + 2] = normalizedValue; // B
        processedData[index + 3] = 255; // A
      }

      const imageData = {
        data: processedData,
        width: KinectConstants.DEPTH.WIDTH,
        height: KinectConstants.DEPTH.HEIGHT,
      };

      return imageData;
    } catch (error) {
      console.error('Error processing depth frame:', error);
      return null;
    }
  }

  processRawDepthFrame(frame) {
    try {
      const depthData = new Uint16Array(frame.imageData.buffer);
      const processedData = new Uint8ClampedArray(
        depthData.length * 4,
      );

      for (let i = 0; i < depthData.length; i++) {
        const depth = depthData[i];
        const index = i * 4;

        // Store 16-bit depth value in R and G channels (8 bits each)
        processedData[index] = depth & 0xff; // Lower 8 bits
        processedData[index + 1] = depth >> 8; // Upper 8 bits
        processedData[index + 2] = 0; // Not used
        processedData[index + 3] = 255; // Alpha
      }

      return {
        data: processedData,
        width: KinectConstants.RAW_DEPTH.WIDTH,
        height: KinectConstants.RAW_DEPTH.HEIGHT,
      };
    } catch (error) {
      console.error('Error processing raw depth frame:', error);
      return null;
    }
  }

  processBodyFrame(frame) {
    const processed = { ...frame };
    delete processed.bodyIndexMapImageFrame;
    delete processed.bodyIndexMapToColorImageFrame;

    if (processed.bodies) {
      processed.bodies.forEach((body) => {
        if (body.skeleton) {
          body.skeleton.joints.forEach((joint) => {
            joint.colorX = joint.colorX / KinectConstants.COLOR.WIDTH;
            joint.colorY =
              joint.colorY / KinectConstants.COLOR.HEIGHT;
            joint.depthX = joint.depthX / KinectConstants.DEPTH.WIDTH;
            joint.depthY =
              joint.depthY / KinectConstants.DEPTH.HEIGHT;
          });
        }
      });
    }

    return processed;
  }

  processKeyFrame(colorFrame, bodyIndexMap) {
    try {
      const colorData = new Uint8Array(colorFrame.imageData);
      const indexData = new Uint8Array(bodyIndexMap.imageData);
      const processedData = new Uint8ClampedArray(colorData.length);
      let bodyIndexPixelIndex = 0;

      for (let i = 0; i < colorData.length; i += 4) {
        const bodyIndexValue = indexData[bodyIndexPixelIndex];

        // If this is a body (not background)
        if (
          bodyIndexValue !==
          KinectAzure.K4ABT_BODY_INDEX_MAP_BACKGROUND
        ) {
          // Convert BGRA to RGBA
          processedData[i] = colorData[i + 2]; // R
          processedData[i + 1] = colorData[i + 1]; // G
          processedData[i + 2] = colorData[i]; // B
          processedData[i + 3] = 0xff; // A
        } else {
          // Make background transparent
          processedData[i] = 0;
          processedData[i + 1] = 0;
          processedData[i + 2] = 0;
          processedData[i + 3] = 0;
        }
        bodyIndexPixelIndex++;
      }

      return {
        imageData: {
          data: processedData,
          width: KinectConstants.COLOR.WIDTH,
          height: KinectConstants.COLOR.HEIGHT,
        },
      };
    } catch (error) {
      console.error('Error processing key frame:', error);
      return null;
    }
  }

  processDepthKeyFrame(depthFrame, bodyIndexMap) {
    try {
      const depthData = new Uint16Array(depthFrame.imageData.buffer);
      const indexData = new Uint8Array(bodyIndexMap.imageData);
      const processedData = new Uint8ClampedArray(
        depthData.length * 4,
      );
      let depthPixelIndex = 0;
      let bodyPixelIndex = 0;

      for (let i = 0; i < processedData.length; i += 4) {
        const bodyIndexValue = indexData[bodyPixelIndex];

        if (
          bodyIndexValue !==
          KinectAzure.K4ABT_BODY_INDEX_MAP_BACKGROUND
        ) {
          // If this is a body pixel, store the depth value
          processedData[i] = depthData[depthPixelIndex] & 0xff; // Lower 8 bits
          processedData[i + 1] = depthData[depthPixelIndex] >> 8; // Upper 8 bits
          processedData[i + 2] = 0; // Not used
          processedData[i + 3] = 0xff; // Full opacity
        } else {
          // If this is a background pixel, make it transparent
          processedData[i] = 0;
          processedData[i + 1] = 0;
          processedData[i + 2] = 0;
          processedData[i + 3] = 0;
        }

        depthPixelIndex++;
        bodyPixelIndex++;
      }

      return {
        imageData: {
          data: processedData,
          width: KinectConstants.RAW_DEPTH.WIDTH,
          height: KinectConstants.RAW_DEPTH.HEIGHT,
        },
      };
    } catch (error) {
      console.error('Error processing depth key frame:', error);
      return null;
    }
  }

  processRGBDFrame(depthFrame, colorToDepthFrame, depthRange) {
    try {
      const depthData = new Uint16Array(depthFrame.imageData.buffer);
      const colorData = new Uint8Array(colorToDepthFrame.imageData);

      // Use color-to-depth dimensions since that's our mapped color data
      const width = colorToDepthFrame.width;
      const height = colorToDepthFrame.height;

      const processedData = new Uint8ClampedArray(width * height * 4);

      // Process each pixel in the image resolution
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const targetIndex = (y * width + x) * 4;
          const depthPixelIndex = (y * width + x) * 2;

          // Get depth value directly from depth buffer
          const depthValue = depthData[depthPixelIndex / 2];

          // Map depth to alpha channel (0-255)
          const normalizedDepth = Math.floor(
            this.mapRange(
              depthValue,
              depthRange.min,
              depthRange.max,
              255,
              0,
            ),
          );

          // Get color data from the color-to-depth mapped image
          const colorIndex = (y * width + x) * 4;

          // Convert BGRA to RGBA and use depth as alpha
          processedData[targetIndex] = colorData[colorIndex + 2]; // R
          processedData[targetIndex + 1] = colorData[colorIndex + 1]; // G
          processedData[targetIndex + 2] = colorData[colorIndex]; // B
          processedData[targetIndex + 3] = normalizedDepth; // A (depth)
        }
      }

      return {
        imageData: {
          data: processedData,
          width: depthFrame.width,
          height: depthFrame.height,
        },
      };
    } catch (error) {
      console.error('Error processing RGBD frame:', error);
      return null;
    }
  }
}
