// main/processors/depthProcessor.js
import { BaseFrameProcessor } from './baseProcessor.js';
import { KinectConstants } from '../kinectController.js';
import { DEBUG, log } from '../utils/debug.js';

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
        log.error(
          'DepthProcessor: Invalid frame data or depth range',
        );
        throw new Error('Invalid frame data or depth range');
      }

      const depthData = new Uint16Array(frame.imageData.buffer);
      const processedData = new Uint8ClampedArray(
        depthData.length * 4,
      );

      // Process the depth data
      let minValue = Number.MAX_VALUE;
      let maxValue = 0;
      let validPixels = 0;

      for (let i = 0; i < depthData.length; i++) {
        const pixelValue = depthData[i];

        // Track statistics for debugging
        if (pixelValue > 0) {
          minValue = Math.min(minValue, pixelValue);
          maxValue = Math.max(maxValue, pixelValue);
          validPixels++;
        }

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

      // Log frame statistics occasionally (every 30 frames)
      if (this.frameCount === undefined) this.frameCount = 0;
      this.frameCount = (this.frameCount + 1) % 30;

      if (this.frameCount === 0) {
        log.debug('DATA', 'DepthProcessor: Frame statistics:', {
          minDepth: minValue,
          maxDepth: maxValue,
          validPixels,
          totalPixels: depthData.length,
        });
      }

      return {
        imageData: {
          data: processedData,
          width: KinectConstants.DEPTH.WIDTH,
          height: KinectConstants.DEPTH.HEIGHT,
        },
      };
    } catch (error) {
      log.error(
        'DepthProcessor: Error processing depth frame:',
        error,
      );
      return this.handleError(error, 'depth frame processing');
    }
  }
}
