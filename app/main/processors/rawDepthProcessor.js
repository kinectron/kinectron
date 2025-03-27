// main/processors/rawDepthProcessor.js
import { BaseFrameProcessor } from './baseProcessor.js';
import { KinectConstants } from '../kinectController.js';
import { testPackUnpack } from '../utils/dataTestUtils.js';
import { DEBUG } from '../utils/debug.js';

// Debug flags are now controlled by the DEBUG object in utils/debug.js

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

      // Use full original dimensions
      const originalWidth = KinectConstants.RAW_DEPTH.WIDTH;
      const originalHeight = KinectConstants.RAW_DEPTH.HEIGHT;

      // Variables to store test values at specific indices (if enabled)
      let testValue1000 = null;
      let testValue2000 = null;
      let testValue3000 = null;

      // Create an output buffer with full dimensions
      const processedData = new Uint8ClampedArray(
        originalWidth * originalHeight * 4,
      );

      // Process raw depth data exactly like the legacy code
      let j = 0;
      for (let i = 0; i < processedData.length; i += 4) {
        // Store test values at specific indices (if enabled)
        if (DEBUG.RAW_DEPTH && DEBUG.DATA) {
          const pixelIndex = i / 4;
          if (pixelIndex === 1000)
            testValue1000 = depthData[pixelIndex];
          if (pixelIndex === 2000)
            testValue2000 = depthData[pixelIndex];
          if (pixelIndex === 3000)
            testValue3000 = depthData[pixelIndex];
        }

        // Store depth value in R and G channels exactly like legacy code
        // IMPORTANT: Order matters! This must match how app.js unpacks the data
        const depth = depthData[j / 2];
        processedData[i] = depth & 0xff; // Lower 8 bits in R
        processedData[i + 1] = (depth >> 8) & 0xff; // Upper 8 bits in G
        processedData[i + 2] = 0; // B channel set to 0
        processedData[i + 3] = 0xff; // A channel set to full opacity
        j += 2;
      }

      // Log the test values (if enabled)
      if (DEBUG.RAW_DEPTH && DEBUG.DATA) {
        console.log('Test values before packing:', {
          'Value at index 1000': testValue1000,
          'Value at index 2000': testValue2000,
          'Value at index 3000': testValue3000,
        });
      }

      return {
        imageData: {
          data: processedData,
          width: originalWidth,
          height: originalHeight,
          isPacked: false, // Not using the packed format anymore
          // Include test values in the returned object (if enabled)
          ...(DEBUG.RAW_DEPTH &&
            DEBUG.DATA && {
              testValues: {
                index1000: testValue1000,
                index2000: testValue2000,
                index3000: testValue3000,
              },
            }),
        },
      };
    } catch (error) {
      return this.handleError(error, 'raw depth frame processing');
    }
  }
}
