// main/processors/rawDepthProcessor.js
import { BaseFrameProcessor } from './baseProcessor.js';
import { KinectConstants } from '../kinectController.js';

/**
 * Processes raw depth frames from the Kinect
 */
export class RawDepthFrameProcessor extends BaseFrameProcessor {
  /**
   * Process a raw depth frame from the Kinect
   * @param {Object} frame Raw depth frame data
   * @returns {Object} Processed raw depth frame data
   */
  processFrame(frame) {
    try {
      if (!frame?.imageData?.buffer) {
        throw new Error('Invalid frame data');
      }

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
        imageData: {
          data: processedData,
          width: KinectConstants.RAW_DEPTH.WIDTH,
          height: KinectConstants.RAW_DEPTH.HEIGHT,
        },
      };
    } catch (error) {
      return this.handleError(error, 'raw depth frame processing');
    }
  }
}
