// main/processors/baseProcessor.js

/**
 * Base class for all frame processors
 * Handles frame data processing and transformation
 */
export class BaseFrameProcessor {
  constructor() {
    if (new.target === BaseFrameProcessor) {
      throw new Error(
        'Cannot instantiate BaseFrameProcessor directly',
      );
    }
  }

  /**
   * Process a frame of data from the Kinect
   * @abstract
   * @param {Object} frame Raw frame data from Kinect
   * @returns {Object} Processed frame data ready for sending to client
   */
  processFrame(frame) {
    throw new Error('Must implement processFrame');
  }

  /**
   * Map values from one range to another
   * @protected
   * @param {number} value The value to map
   * @param {number} inMin Input range minimum
   * @param {number} inMax Input range maximum
   * @param {number} outMin Output range minimum
   * @param {number} outMax Output range maximum
   * @returns {number} Mapped value
   */
  mapRange(value, inMin, inMax, outMin, outMax) {
    return (
      ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin
    );
  }

  /**
   * Create a copy of a buffer to avoid memory issues
   * @protected
   * @param {Buffer|Uint8Array} buffer The buffer to copy
   * @returns {Buffer} New buffer with copied content
   */
  createBufferCopy(buffer) {
    return Buffer.from(buffer);
  }

  /**
   * Convert BGRA to RGBA format
   * @protected
   * @param {Uint8Array} bgraData Input BGRA data
   * @returns {Uint8ClampedArray} Output RGBA data
   */
  convertBGRAtoRGBA(bgraData) {
    const rgbaData = new Uint8ClampedArray(bgraData.length);
    for (let i = 0; i < bgraData.length; i += 4) {
      rgbaData[i] = bgraData[i + 2]; // R = B
      rgbaData[i + 1] = bgraData[i + 1]; // G = G
      rgbaData[i + 2] = bgraData[i]; // B = R
      rgbaData[i + 3] = bgraData[i + 3]; // A = A
    }
    return rgbaData;
  }

  /**
   * Handle errors that occur during processing
   * @protected
   * @param {Error} error The error that occurred
   * @param {string} operation The operation that failed
   */
  handleError(error, operation) {
    console.error(
      `Error in ${this.constructor.name} during ${operation}:`,
      error,
    );
    return null;
  }
}
