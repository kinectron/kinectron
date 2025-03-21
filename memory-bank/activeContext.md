# Active Context

## Current Focus: Raw Depth Data Visualization Issue

We're working on fixing an issue with the raw depth data visualization in the DepthStreamer application. The problem is that the binary depth data isn't being properly transmitted from the server to the client.

### Changes Made

1. **Server-side Changes (app/main/handlers/rawDepthHandler.js)**:

   - Modified the server to downsample the depth data before sending it as JSON
   - Reduced the data size by a factor of 4 to prevent "Maximum call stack size exceeded" errors
   - Added logging to track the flow of depth data
   - Continued to broadcast the full binary data separately for clients that support it

2. **Client-side Changes (client/src/kinectron-modern.js)**:

   - Added code to handle the downsampled depth data and upsample it back to the original dimensions
   - Added handlers for both binary data and JSON data
   - Added extensive logging to track the flow of depth data
   - Fixed event forwarding from the peer connection to the Kinectron class

3. **PeerJS Configuration Changes (client/src/peer/peerConnection.js)**:
   - Changed the serialization from 'json' to 'binary' to support ArrayBuffer data
   - Modified the `send` method to handle binary data correctly

### Current Status

The issue is not yet resolved. Based on the logs:

1. The server is correctly sending both `rawDepthMetadata` and `rawDepthData` events
2. The client is receiving the `rawDepthMetadata` events, but there's no mention of receiving the `rawDepth` or `rawDepthData` events
3. The renderer logs show that the app is processing depth data, but it's not clear where this data is coming from

### Next Steps

1. **Investigate WebRTC Binary Data Transmission**: The issue might be with how WebRTC handles binary data. We need to check if the binary data is being correctly sent and received.

2. **Check PeerJS Configuration**: Ensure that PeerJS is correctly configured to handle binary data. The serialization is set to 'binary', but there might be other settings that need to be adjusted.

3. **Add More Logging**: Add more detailed logging to track the flow of binary data from the server to the client. This will help identify where the data is being lost.

4. **Test with Simplified Data**: Try sending a small, simple binary buffer to test if the binary data transmission works at all. This will help isolate the issue.

5. **Consider Alternative Approaches**: If binary data transmission continues to be problematic, consider alternative approaches such as:
   - Encoding the depth data as a base64 string and sending it as JSON
   - Using a different WebRTC library that better supports binary data
   - Implementing a custom binary protocol on top of WebRTC

## Recent Changes

- Modified `app/main/handlers/rawDepthHandler.js` to downsample depth data before sending as JSON
- Updated `client/src/kinectron-modern.js` to handle downsampled depth data and upsample it
- Changed PeerJS serialization from 'json' to 'binary' in `client/src/peer/peerConnection.js`
- Added extensive logging throughout the codebase to track data flow

## Active Decisions

- Using a multi-pronged approach to ensure depth data visualization works:

  1. Try to send binary data directly (preferred for performance)
  2. Fallback to downsampled JSON data if binary transmission fails
  3. Upsample the data on the client side if needed

- Maintaining backward compatibility with existing code while adding new functionality
