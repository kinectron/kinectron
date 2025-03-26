/**
 * Utility functions for testing data processing
 */

/**
 * Test packing and unpacking of depth data
 * @param {Uint16Array} originalData - Original depth data
 * @param {Uint8ClampedArray} packedData - Packed RGBA data
 * @param {Object} dimensions - Dimensions object with originalWidth, packedWidth, and height
 * @param {Object} testIndices - Object with indices to test (e.g., {1000: value, 2000: value})
 * @param {boolean} logResults - Whether to log results to console
 * @returns {Object} Test results with original values, unpacked values, and differences
 */
export function testPackUnpack(
  originalData,
  packedData,
  dimensions,
  testIndices,
  logResults = true,
) {
  const { originalWidth, packedWidth, height } = dimensions;

  // Create array for unpacked depth values
  const unpackedValues = new Uint16Array(originalWidth * height);

  // Unpack the data (similar to _unpackRawDepthData in kinectron-modern.js)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < packedWidth; x++) {
      const srcIdx = (y * packedWidth + x) * 4;

      // Extract first depth value from R and G channels
      const depth1 =
        packedData[srcIdx] | (packedData[srcIdx + 1] << 8);

      // Extract second depth value from B and A channels
      const depth2 =
        packedData[srcIdx + 2] | (packedData[srcIdx + 3] << 8);

      // Store in output array
      unpackedValues[y * originalWidth + x * 2] = depth1;

      // Only store second value if it's within bounds
      if (x * 2 + 1 < originalWidth) {
        unpackedValues[y * originalWidth + x * 2 + 1] = depth2;
      }
    }
  }

  // Compare original and unpacked values at test indices
  const results = {};

  for (const [index, value] of Object.entries(testIndices)) {
    const idx = parseInt(index);
    const unpackedValue = unpackedValues[idx];

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
