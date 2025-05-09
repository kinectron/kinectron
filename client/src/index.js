/**
 * @fileoverview Main entry point for the Kinectron client library
 * @version 1.0.0
 */

import { Kinectron } from './kinectron.js';

console.log('You are running Kinectron API version 1.0.0');

// Export the Kinectron class as the main API
export { Kinectron };

// Also provide as default export for more flexible importing
export default Kinectron;
