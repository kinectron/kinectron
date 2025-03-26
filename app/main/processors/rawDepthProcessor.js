// main/processors/rawDepthProcessor.js
import { BaseFrameProcessor } from './baseProcessor.js';
import { KinectConstants } from '../kinectController.js';
import { testPackUnpack } from '../utils/dataTestUtils.js';

// Flag to enable/disable pack/unpack testing
const ENABLE_PACK_UNPACK_TEST = false;

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

      // Calculate dimensions for the packed format (half width)
      const originalWidth = KinectConstants.RAW_DEPTH.WIDTH;
      const originalHeight = KinectConstants.RAW_DEPTH.HEIGHT;
      const packedWidth = Math.ceil(originalWidth / 2);

      // Variables to store test values at specific indices
      let testValue1000 = null;
      let testValue2000 = null;
      let testValue3000 = null;

      // Create an output buffer with half the number of pixels
      const processedData = new Uint8ClampedArray(
        packedWidth * originalHeight * 4,
      );

      // Pack two depth values into each RGBA pixel
      for (let y = 0; y < originalHeight; y++) {
        for (let x = 0; x < originalWidth; x += 2) {
          const srcIdx1 = y * originalWidth + x;
          const srcIdx2 = srcIdx1 + 1;
          const destIdx = (y * packedWidth + Math.floor(x / 2)) * 4;

          // Get first depth value
          const depth1 = depthData[srcIdx1];

          // Get second depth value (or 0 if we're at the edge)
          const depth2 =
            x + 1 < originalWidth ? depthData[srcIdx2] : 0;

          // Store test values at specific indices
          if (srcIdx1 === 1000) testValue1000 = depth1;
          if (srcIdx1 === 2000) testValue2000 = depth1;
          if (srcIdx1 === 3000) testValue3000 = depth1;

          // Store first depth value in R and G channels
          processedData[destIdx] = depth1 & 0xff; // Lower 8 bits in R
          processedData[destIdx + 1] = depth1 >> 8; // Upper 8 bits in G

          // Store second depth value in B and A channels
          processedData[destIdx + 2] = depth2 & 0xff; // Lower 8 bits in B
          processedData[destIdx + 3] = depth2 >> 8; // Upper 8 bits in A
        }
      }

      // Log the test values
      console.log('Test values before packing:', {
        'Value at index 1000': testValue1000,
        'Value at index 2000': testValue2000,
        'Value at index 3000': testValue3000,
      });

      // Run pack/unpack test if enabled
      if (ENABLE_PACK_UNPACK_TEST) {
        const testIndices = {
          1000: testValue1000,
          2000: testValue2000,
          3000: testValue3000,
        };

        const dimensions = {
          originalWidth,
          packedWidth,
          height: originalHeight,
        };

        testPackUnpack(
          depthData,
          processedData,
          dimensions,
          testIndices,
        );
      }

      return {
        imageData: {
          data: processedData,
          width: packedWidth,
          height: originalHeight,
          isPacked: true, // Add metadata to indicate this is packed data
          originalWidth: originalWidth,
          testValues: {
            index1000: testValue1000,
            index2000: testValue2000,
            index3000: testValue3000,
          },
        },
      };
    } catch (error) {
      return this.handleError(error, 'raw depth frame processing');
    }
  }
}
