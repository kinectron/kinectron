/**
 * Stream handler factory functions
 */

import * as imageUtils from '../utils/imageProcessing.js';

/**
 * Create a frame handler for image-based streams
 * @param {string} streamType - The type of stream ('color', 'depth', 'key', etc.)
 * @param {Function} callback - The callback to receive processed frames
 * @returns {Function} - The frame handler function
 */
export function createFrameHandler(streamType, callback) {
  return (data) => {
    // Extract the actual frame data
    const frameData = data.data || data;

    // Only process frames with matching name
    if (frameData.name === streamType && frameData.imagedata) {
      // Process the image data
      imageUtils.processImageData(frameData, callback);
    } else {
      console.warn(
        `Received frame event but it's not a valid ${streamType} frame:`,
        'name=',
        frameData.name,
        'has imagedata=',
        !!frameData.imagedata,
      );
    }
  };
}

/**
 * Create a handler for raw depth data
 * @param {Function} callback - The callback to receive processed frames
 * @param {Function} unpackFunction - Function to unpack raw depth data
 * @returns {Function} - The raw depth handler function
 */
export function createRawDepthHandler(callback, unpackFunction) {
  return (data) => {
    if (data && data.imagedata) {
      // Process the data regardless of isPacked flag
      // The new implementation always unpacks the data
      unpackFunction(
        data.imagedata,
        data.width,
        data.height,
        data.width, // originalWidth is the same as width in new implementation
        data.testValues, // Pass test values to unpacking function
      )
        .then((depthValues) => {
          // Call the callback with the unpacked data
          callback({
            ...data,
            depthValues: depthValues,
            timestamp: data.timestamp || Date.now(),
          });
        })
        .catch((error) => {
          console.error('Error unpacking raw depth data:', error);
          // Still call the callback with the original data
          callback({
            ...data,
            error: 'Failed to unpack depth data: ' + error.message,
            timestamp: data.timestamp || Date.now(),
          });
        });
    } else if (data && data.rawDepthData) {
      // Legacy format - raw depth data is already in a usable format
      callback({
        ...data,
        timestamp: data.timestamp || Date.now(),
      });
    } else {
      console.warn(
        'Received raw depth frame with invalid data format:',
        data,
      );
      callback({
        ...data,
        error: 'Invalid data format',
        timestamp: data.timestamp || Date.now(),
      });
    }
  };
}

/**
 * Create a handler for body tracking data
 * @param {Function} callback - The callback to receive processed frames
 * @returns {Function} - The body handler function
 */
export function createBodyHandler(callback) {
  console.log(callback);

  return (eventData) => {
    const data = eventData.data;
    if (data && data.bodies) {
      // Body data is already in a usable format (array of body objects)
      // Just add timestamp and pass it through
      callback({
        bodies: data.bodies,
        timestamp: data.timestamp || Date.now(),
        floorClipPlane: data.floorClipPlane,
        trackingId: data.trackingId,
      });
    }
  };
}

/**
 * Create a handler for multi-frame data
 * @param {Function} callback - The callback to receive processed frames
 * @returns {Function} - The multi-frame handler function
 */
export function createMultiFrameHandler(callback) {
  return (data) => {
    if (data && data.frames) {
      // Process each frame based on its type
      const processedFrames = {};

      // Process each frame in the multiframe data
      Object.entries(data.frames).forEach(([type, frameData]) => {
        if (frameData.imagedata) {
          // For image-based frames, convert to data URL
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const { width, height } = frameData.imagedata;

          canvas.width = width;
          canvas.height = height;

          // Create ImageData object from the raw data
          const imgData = new ImageData(
            imageUtils.convertToUint8ClampedArray(
              frameData.imagedata.data,
            ),
            width,
            height,
          );

          // Put the image data on the canvas
          ctx.putImageData(imgData, 0, 0);

          // Convert to data URL
          processedFrames[type] = {
            src: canvas.toDataURL('image/jpeg'),
            width,
            height,
            raw: frameData.imagedata,
          };
        } else {
          // For non-image data (like body tracking), pass through
          processedFrames[type] = frameData;
        }
      });

      // Call the user callback with processed frames
      callback({
        frames: processedFrames,
        timestamp: data.timestamp || Date.now(),
      });
    }
  };
}
