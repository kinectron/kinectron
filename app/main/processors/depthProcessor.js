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
    console.log('DepthProcessor: Processing depth frame');
    try {
      if (!frame?.imageData?.buffer || !depthRange) {
        console.error(
          'DepthProcessor: Invalid frame data or depth range:',
          {
            hasFrame: !!frame,
            hasImageData: !!frame?.imageData,
            hasBuffer: !!frame?.imageData?.buffer,
            hasDepthRange: !!depthRange,
          },
        );
        throw new Error('Invalid frame data or depth range');
      }

      console.log(
        'DepthProcessor: Frame data valid, processing depth frame with dimensions:',
        frame.width_pixels || KinectConstants.DEPTH.WIDTH,
        'x',
        frame.height_pixels || KinectConstants.DEPTH.HEIGHT,
        'depth range:',
        depthRange,
      );

      const depthData = new Uint16Array(frame.imageData.buffer);
      console.log(
        'DepthProcessor: Depth data array created, length:',
        depthData.length,
      );

      // Log some sample depth values for debugging
      const sampleValues = [];
      for (let i = 0; i < Math.min(5, depthData.length); i++) {
        sampleValues.push(depthData[i]);
      }
      console.log(
        'DepthProcessor: Sample depth values:',
        sampleValues,
      );

      const processedData = new Uint8ClampedArray(
        depthData.length * 4,
      );
      console.log(
        'DepthProcessor: Created processed data array with length:',
        processedData.length,
      );

      // Process the depth data
      let minValue = Number.MAX_VALUE;
      let maxValue = 0;
      let validPixels = 0;
      let invalidPixels = 0;

      for (let i = 0; i < depthData.length; i++) {
        const pixelValue = depthData[i];

        // Track statistics
        if (pixelValue > 0) {
          minValue = Math.min(minValue, pixelValue);
          maxValue = Math.max(maxValue, pixelValue);
          validPixels++;
        } else {
          invalidPixels++;
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

      console.log('DepthProcessor: Frame statistics:', {
        minDepth: minValue,
        maxDepth: maxValue,
        validPixels,
        invalidPixels,
        totalPixels: depthData.length,
      });

      const result = {
        imageData: {
          data: processedData,
          width: KinectConstants.DEPTH.WIDTH,
          height: KinectConstants.DEPTH.HEIGHT,
        },
      };

      console.log(
        'DepthProcessor: Successfully processed depth frame',
      );
      return result;
    } catch (error) {
      console.error(
        'DepthProcessor: Error processing depth frame:',
        error,
      );
      return this.handleError(error, 'depth frame processing');
    }
  }
}
