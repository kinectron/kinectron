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

      // Create RGBA data for image-based transmission
      // Each 16-bit depth value will be split across R and G channels
      const rgbaData = new Uint8ClampedArray(depthData.length * 4);

      // Process the depth data
      for (let i = 0; i < depthData.length; i++) {
        const depth = depthData[i];
        const rgbaIndex = i * 4;

        // Track statistics
        if (depth > 0) {
          minDepth = Math.min(minDepth, depth);
          maxDepth = Math.max(maxDepth, depth);
          validPixels++;
        } else {
          invalidPixels++;
        }

        // Store 16-bit depth value across R and G channels
        // R channel: lower 8 bits
        // G channel: upper 8 bits
        rgbaData[rgbaIndex] = depth & 0xff; // R: lower 8 bits
        rgbaData[rgbaIndex + 1] = (depth >> 8) & 0xff; // G: upper 8 bits
        rgbaData[rgbaIndex + 2] = 0; // B: unused
        rgbaData[rgbaIndex + 3] = 255; // A: fully opaque
      }

      console.log('RawDepthProcessor: Depth statistics:', {
        minDepth: minDepth === Number.MAX_VALUE ? 'none' : minDepth,
        maxDepth,
        validPixels,
        invalidPixels,
        totalPixels: width * height,
      });

      // Return the processed RGBA data
      const result = {
        imageData: {
          data: rgbaData,
          width: width,
          height: height,
        },
        stats: {
          minDepth: minDepth === Number.MAX_VALUE ? 0 : minDepth,
          maxDepth,
          validPixels,
          invalidPixels,
        },
      };

      console.log(
        'RawDepthProcessor: Returning RGBA depth data with dimensions:',
        result.imageData.width,
        'x',
        result.imageData.height,
      );
      console.log(
        'RawDepthProcessor: RGBA data type:',
        Object.prototype.toString.call(result.imageData.data),
      );
      console.log(
        'RawDepthProcessor: RGBA data length:',
        result.imageData.data.length,
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
