/**
 * Utility functions for processing image data from different streams
 */

import { DEBUG, log } from './debug.js';

/**
 * Process image data from a frame
 * @param {Object} frameData - The frame data containing image information
 * @param {number} width - The width of the image
 * @param {number} height - The height of the image
 * @param {Function} callback - Callback to receive the processed image
 */
export function processImageData(frameData, callback) {
  // Check for both imagedata and imageData formats
  const imagedata = frameData.imagedata || frameData.imageData;

  if (!frameData || !imagedata) {
    log.warn('Invalid frame data received:', frameData);
    return;
  }

  const { width, height } = imagedata;

  // Create a canvas to convert image data to a data URL
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = width;
  canvas.height = height;

  try {
    // Check if data is a string (data URL)
    if (typeof imagedata.data === 'string') {
      log.data('Processing image data from data URL');
      createImageFromDataUrl(
        imagedata.data,
        width,
        height,
        (src) => {
          // Call the user callback with processed frame
          callback({
            src,
            width,
            height,
            raw: imagedata,
            timestamp: frameData.timestamp || Date.now(),
          });
        },
        (err) => {
          log.error('Error loading image from data URL:', err);
          // Try to call callback anyway with the raw data
          callback({
            src: imagedata.data,
            width,
            height,
            raw: imagedata,
            timestamp: frameData.timestamp || Date.now(),
          });
        },
      );
    } else {
      log.data('Processing image data from raw pixel data');
      // Handle raw pixel data
      const pixelData = convertToUint8ClampedArray(imagedata.data);
      const imgData = new ImageData(pixelData, width, height);

      // Put the image data on the canvas
      ctx.putImageData(imgData, 0, 0);

      // Convert to data URL for easy display
      const src = canvas.toDataURL('image/jpeg');

      // Call the user callback with processed frame
      callback({
        src,
        width,
        height,
        raw: imagedata,
        timestamp: frameData.timestamp || Date.now(),
      });
    }
  } catch (error) {
    log.error('Error processing frame:', error);
    log.error('Frame data:', imagedata);
  }
}

/**
 * Create an image from a data URL
 * @param {string} dataUrl - The data URL
 * @param {number} width - The width of the image
 * @param {number} height - The height of the image
 * @param {Function} onSuccess - Success callback with the data URL
 * @param {Function} onError - Error callback
 */
export function createImageFromDataUrl(
  dataUrl,
  width,
  height,
  onSuccess,
  onError,
) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = width;
  canvas.height = height;

  // Create an image from the data URL
  const img = new Image();

  img.onload = () => {
    // Draw the image to the canvas
    ctx.drawImage(img, 0, 0, width, height);

    // Use the original data URL
    onSuccess(dataUrl);
  };

  // Set error handler
  img.onerror = (err) => {
    if (onError) {
      onError(err);
    }
  };

  // Start loading the image
  img.src = dataUrl;
}

/**
 * Convert various data formats to Uint8ClampedArray
 * @param {*} data - The data to convert
 * @returns {Uint8ClampedArray} - The converted data
 */
export function convertToUint8ClampedArray(data) {
  if (data instanceof Uint8ClampedArray) {
    return data;
  } else if (data instanceof Uint8Array) {
    return new Uint8ClampedArray(data);
  } else if (Array.isArray(data)) {
    return new Uint8ClampedArray(data);
  } else {
    // Handle case where data is an object (e.g., from JSON)
    return new Uint8ClampedArray(Object.values(data));
  }
}
