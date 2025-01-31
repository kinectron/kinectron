// main/processors/depthKeyProcessor.js
import { BaseFrameProcessor } from './baseProcessor.js';
import { KinectConstants } from '../kinectController.js';
import KinectAzure from 'kinect-azure';

/**
 * Processes depth key frames from the Kinect
 */
export class DepthKeyFrameProcessor extends BaseFrameProcessor {
  /**
   * Process a depth key frame from the Kinect
   * @param {Object} depthFrame Raw depth frame data
   * @param {Object} bodyIndexMap Body index map data
   * @returns {Object} Processed depth key frame data
   */
  processFrame(depthFrame, bodyIndexMap) {
    try {
      if (
        !depthFrame?.imageData?.buffer ||
        !bodyIndexMap?.imageData
      ) {
        throw new Error('Invalid frame data');
      }

      const depthData = new Uint16Array(depthFrame.imageData.buffer);
      const indexData = new Uint8Array(bodyIndexMap.imageData);
      const processedData = new Uint8ClampedArray(
        depthData.length * 4,
      );
      let depthPixelIndex = 0;
      let bodyPixelIndex = 0;

      for (let i = 0; i < processedData.length; i += 4) {
        const bodyIndexValue = indexData[bodyPixelIndex];

        if (
          bodyIndexValue !==
          KinectAzure.K4ABT_BODY_INDEX_MAP_BACKGROUND
        ) {
          // If this is a body pixel, store the depth value
          processedData[i] = depthData[depthPixelIndex] & 0xff; // Lower 8 bits
          processedData[i + 1] = depthData[depthPixelIndex] >> 8; // Upper 8 bits
          processedData[i + 2] = 0; // Not used
          processedData[i + 3] = 0xff; // Full opacity
        } else {
          // If this is a background pixel, make it transparent
          processedData[i] = 0;
          processedData[i + 1] = 0;
          processedData[i + 2] = 0;
          processedData[i + 3] = 0;
        }

        depthPixelIndex++;
        bodyPixelIndex++;
      }

      return {
        imageData: {
          data: processedData,
          width: KinectConstants.RAW_DEPTH.WIDTH,
          height: KinectConstants.RAW_DEPTH.HEIGHT,
        },
      };
    } catch (error) {
      return this.handleError(error, 'depth key frame processing');
    }
  }
}
