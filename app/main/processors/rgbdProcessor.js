// main/processors/rgbdProcessor.js
import { BaseFrameProcessor } from './baseProcessor.js';
import { KinectConstants } from '../kinectController.js';

/**
 * Processes RGBD frames from the Kinect
 */
export class RGBDFrameProcessor extends BaseFrameProcessor {
  /**
   * Process an RGBD frame from the Kinect
   * @param {Object} depthFrame Raw depth frame data
   * @param {Object} colorToDepthFrame Color mapped to depth frame data
   * @param {Object} depthRange Depth range information
   * @returns {Object} Processed RGBD frame data
   */
  processFrame(depthFrame, colorToDepthFrame, depthRange) {
    try {
      if (
        !depthFrame?.imageData?.buffer ||
        !colorToDepthFrame?.imageData ||
        !depthRange
      ) {
        throw new Error('Invalid frame data');
      }

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
      return this.handleError(error, 'RGBD frame processing');
    }
  }
}
