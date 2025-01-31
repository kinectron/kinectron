// main/processors/bodyProcessor.js
import { BaseFrameProcessor } from './baseProcessor.js';
import { KinectConstants } from '../kinectController.js';

/**
 * Processes body tracking frames from the Kinect
 */
export class BodyFrameProcessor extends BaseFrameProcessor {
  /**
   * Process a body frame from the Kinect
   * @param {Object} frame Raw body frame data
   * @returns {Object} Processed body frame data
   */
  processFrame(frame) {
    try {
      if (!frame?.bodies) {
        throw new Error('Invalid frame data');
      }

      const processed = { ...frame };
      // Remove unused image buffers to reduce data size
      delete processed.bodyIndexMapImageFrame;
      delete processed.bodyIndexMapToColorImageFrame;

      if (processed.bodies) {
        processed.bodies.forEach((body) => {
          if (body.skeleton) {
            body.skeleton.joints.forEach((joint) => {
              // Normalize joint coordinates to 0-1 range
              joint.colorX =
                joint.colorX / KinectConstants.COLOR.WIDTH;
              joint.colorY =
                joint.colorY / KinectConstants.COLOR.HEIGHT;
              joint.depthX =
                joint.depthX / KinectConstants.DEPTH.WIDTH;
              joint.depthY =
                joint.depthY / KinectConstants.DEPTH.HEIGHT;
            });
          }
        });
      }

      return processed;
    } catch (error) {
      return this.handleError(error, 'body frame processing');
    }
  }
}
