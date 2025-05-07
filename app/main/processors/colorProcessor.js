// main/processors/colorProcessor.js
import { BaseFrameProcessor } from './baseProcessor.js';
import { KinectConstants } from '../kinectController.js';

/**
 * Processes color frames from the Kinect
 */
export class ColorFrameProcessor extends BaseFrameProcessor {
  /**
   * Process a color frame from the Kinect
   * @param {Object} frame Raw color frame data
   * @returns {Object} Processed color frame data
   */
  processFrame(frame) {
    try {
      if (!frame?.imageData) {
        throw new Error('Invalid frame data');
      }

      // Create a copy of the buffer and convert BGRA to RGBA
      const bufferCopy = this.createBufferCopy(frame.imageData);
      const processedData = this.convertBGRAtoRGBA(bufferCopy);

      return {
        imageData: {
          data: processedData,
          width: KinectConstants.COLOR.WIDTH,
          height: KinectConstants.COLOR.HEIGHT,
        },
      };
    } catch (error) {
      return this.handleError(error, 'color frame processing');
    }
  }
}
