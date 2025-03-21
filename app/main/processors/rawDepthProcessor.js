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
    console.log('RawDepthProcessor: Processing raw depth frame');
    try {
      if (!frame?.imageData?.buffer) {
        console.error(
          'RawDepthProcessor: Invalid frame data - missing buffer',
        );
        console.error(
          'RawDepthProcessor: Frame structure:',
          frame ? `has imageData=${!!frame.imageData}` : 'null',
        );
        throw new Error('Invalid frame data');
      }

      console.log(
        'RawDepthProcessor: Frame buffer size:',
        frame.imageData.buffer.byteLength,
      );
      console.log(
        'RawDepthProcessor: Creating Uint16Array from buffer',
      );

      // Create a copy of the depth data to avoid potential buffer issues
      const originalDepthData = new Uint16Array(
        frame.imageData.buffer,
      );
      const depthData = new Uint16Array(originalDepthData);

      console.log(
        'RawDepthProcessor: Depth data array created, length:',
        depthData.length,
      );

      // Log some sample depth values for debugging
      const sampleValues = [];
      for (let i = 0; i < Math.min(5, depthData.length); i++) {
        sampleValues.push(depthData[i]);
      }
      console.log(
        'RawDepthProcessor: Sample depth values:',
        sampleValues,
      );

      // Keep original dimensions
      const width = KinectConstants.RAW_DEPTH.WIDTH;
      const height = KinectConstants.RAW_DEPTH.HEIGHT;

      console.log(
        'RawDepthProcessor: Using original dimensions:',
        width,
        'x',
        height,
      );

      // Track min/max values for debugging
      let minDepth = Number.MAX_VALUE;
      let maxDepth = 0;
      let validPixels = 0;
      let invalidPixels = 0;

      // Calculate statistics
      for (let i = 0; i < depthData.length; i++) {
        const depth = depthData[i];

        // Track statistics
        if (depth > 0) {
          minDepth = Math.min(minDepth, depth);
          maxDepth = Math.max(maxDepth, depth);
          validPixels++;
        } else {
          invalidPixels++;
        }
      }

      console.log('RawDepthProcessor: Depth statistics:', {
        minDepth: minDepth === Number.MAX_VALUE ? 'none' : minDepth,
        maxDepth,
        validPixels,
        invalidPixels,
        totalPixels: width * height,
      });

      // Return the raw depth data directly
      const result = {
        depthData: depthData,
        width: width,
        height: height,
        stats: {
          minDepth: minDepth === Number.MAX_VALUE ? 0 : minDepth,
          maxDepth,
          validPixels,
          invalidPixels,
        },
      };

      console.log(
        'RawDepthProcessor: Returning raw depth data with dimensions:',
        result.width,
        'x',
        result.height,
      );
      console.log(
        'RawDepthProcessor: Depth data type:',
        Object.prototype.toString.call(result.depthData),
      );
      console.log(
        'RawDepthProcessor: Depth data length:',
        result.depthData.length,
      );

      return result;
    } catch (error) {
      console.error(
        'RawDepthProcessor: Error processing frame:',
        error,
      );
      return this.handleError(error, 'raw depth frame processing');
    }
  }
}
