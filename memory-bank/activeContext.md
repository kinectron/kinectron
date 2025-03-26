# Active Context

## Current Focus: Raw Depth Data Processing Refactoring

We've refactored the raw depth data processing in the DepthStreamer application to use an image-based approach instead of binary data transmission. This change aligns with the legacy code approach and makes the codebase more consistent.

### Key Changes

1. **RawDepthFrameProcessor Improvements**:

   - Converted raw depth data to RGBA format
   - Stored 16-bit depth values across R and G channels (R for lower 8 bits, G for upper 8 bits)
   - Set B channel to 0 and A channel to 255 (fully opaque)
   - Returned image-compatible format instead of raw binary data

2. **RawDepthStreamHandler Improvements**:
   - Removed binary data transmission code
   - Added Sharp for image processing
   - Converted RGBA data to WebP image
   - Created dataURL from compressed image
   - Sent dataURL to peers using a single event

### Core Changes

1. **Image-Based Data Handling**:

   - Replaced binary data transmission with image-based approach
   - Used WebP compression with high quality to preserve depth data
   - Simplified data flow by using a single event for transmission

2. **Consistency Improvements**:

   - Aligned raw depth processing with color and depth stream processing
   - Followed the pattern established in the legacy code
   - Improved code maintainability and readability

3. **Transmission Optimization**:
   - Used WebP compression for efficient data transmission
   - Maintained data integrity with high-quality compression
   - Simplified client-side processing by using standard image format

### Current Status

The raw depth data visualization is now working correctly using the image-based approach. The depth data is properly encoded in the R and G channels of an image, transmitted as a dataURL, and can be correctly interpreted by the client.

## Active Decisions

- Using a consistent approach for all data streams:
  1. Process data into image-compatible format
  2. Use Sharp for image compression and conversion
  3. Transmit data as dataURLs
  4. Maintain backward compatibility where possible
