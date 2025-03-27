/**
 * Utility functions for testing data processing
 */

/**
 * Test packing and unpacking of depth data
 * @param {Uint16Array} originalData - Original depth data
 * @param {Uint8ClampedArray} pixelData - RGBA pixel data
 * @param {Object} dimensions - Dimensions object with width and height
 * @param {Object} testIndices - Object with indices to test (e.g., {1000: value, 2000: value})
 * @param {boolean} logResults - Whether to log results to console
 * @returns {Object} Test results with original values, unpacked values, and differences
 */
export function testPackUnpack(
  originalData,
  pixelData,
  dimensions,
  testIndices,
  logResults = true,
) {
  const { width, height } = dimensions;

  // Create array for unpacked depth values
  const processedData = [];

  // Process the raw depth data exactly like the legacy client code
  for (let i = 0; i < pixelData.length; i += 4) {
    // Extract depth value from R and G channels
    const depth = (pixelData[i + 1] << 8) | pixelData[i]; // Get uint16 data from buffer
    processedData.push(depth);
  }

  // Compare original and unpacked values at test indices
  const results = {};

  for (const [index, value] of Object.entries(testIndices)) {
    const idx = parseInt(index);
    const unpackedValue = processedData[idx];

    results[`Index ${idx}`] = {
      Original: value,
      Unpacked: unpackedValue,
      Difference: value - unpackedValue,
    };
  }

  // Log results if requested
  if (logResults) {
    console.log('Pack/Unpack Test Results:', results);
  }

  return results;
}
