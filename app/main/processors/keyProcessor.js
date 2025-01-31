// main/processors/keyProcessor.js
import { BaseFrameProcessor } from './baseProcessor.js';
import { KinectConstants } from '../kinectController.js';
import KinectAzure from 'kinect-azure';

/**
 * Processes key (body segmentation) frames from the Kinect
 */
export class KeyFrameProcessor extends BaseFrameProcessor {
  /**
   * Process a key frame from the Kinect
   * @param {Object} colorFrame Raw color frame data
   * @param {Object} bodyIndexMap Body index map data
   * @returns {Object} Processed key frame data
   */
  processFrame(colorFrame, bodyIndexMap) {
    try {
      if (!colorFrame?.imageData || !bodyIndexMap?.imageData) {
        throw new Error('Invalid frame data');
      }

      const colorData = new Uint8Array(colorFrame.imageData);
      const indexData = new Uint8Array(bodyIndexMap.imageData);
      const processedData = new Uint8ClampedArray(colorData.length);
      let bodyIndexPixelIndex = 0;

      for (let i = 0; i < colorData.length; i += 4) {
        const bodyIndexValue = indexData[bodyIndexPixelIndex];

        // If this is a body (not background)
        if (
          bodyIndexValue !==
          KinectAzure.K4ABT_BODY_INDEX_MAP_BACKGROUND
        ) {
          // Convert BGRA to RGBA
          processedData[i] = colorData[i + 2]; // R
          processedData[i + 1] = colorData[i + 1]; // G
          processedData[i + 2] = colorData[i]; // B
          processedData[i + 3] = 0xff; // A
        } else {
          // Make background transparent
          processedData[i] = 0;
          processedData[i + 1] = 0;
          processedData[i + 2] = 0;
          processedData[i + 3] = 0;
        }
        bodyIndexPixelIndex++;
      }

      return {
        imageData: {
          data: processedData,
          width: KinectConstants.COLOR.WIDTH,
          height: KinectConstants.COLOR.HEIGHT,
        },
      };
    } catch (error) {
      return this.handleError(error, 'key frame processing');
    }
  }
}
