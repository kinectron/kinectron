// main/processors/depthProcessor.js
import { BaseFrameProcessor } from './baseProcessor.js';
import { KinectConstants } from '../kinectController.js';

/**
 * Processes depth frames from the Kinect
 */
export class DepthFrameProcessor extends BaseFrameProcessor {
  /**
   * Process a depth frame from the Kinect
   * @param {Object} frame Raw depth frame data
   * @param {Object} depthRange Depth range information
   * @returns {Object} Processed depth frame data
   */
  processFrame(frame, depthRange) {
    try {
      if (!frame?.imageData?.buffer || !depthRange) {
        throw new Error('Invalid frame data or depth range');
      }

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

      return {
        imageData: {
          data: processedData,
          width: KinectConstants.DEPTH.WIDTH,
          height: KinectConstants.DEPTH.HEIGHT,
        },
      };
    } catch (error) {
      return this.handleError(error, 'depth frame processing');
    }
  }
}
