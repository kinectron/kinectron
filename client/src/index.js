/**
 * @fileoverview Main entry point for the Kinectron client library
 * @version 1.0.1
 * @description Kinectron enables real-time streaming of Microsoft Azure Kinect data into web browsers using WebRTC.
 * This client library connects to a Kinectron server running on a computer with an Azure Kinect device.
 */

import { Kinectron } from './kinectron.js';

console.log('You are running Kinectron API version 1.0.1');

/**
 * Kinectron client class for connecting to a Kinectron server and accessing Azure Kinect data streams
 *
 * @module kinectron
 * @exports Kinectron
 * @example
 * // Using ES modules (recommended)
 * import Kinectron from 'kinectron';
 *
 * // Create a new Kinectron instance
 * const kinectron = new Kinectron('127.0.0.1');
 *
 * // Connect and initialize
 * kinectron.on('ready', () => {
 *   console.log('Connected to Kinectron server');
 *   kinectron.initKinect()
 *     .then(() => {
 *       // Start a color stream
 *       kinectron.startColor((colorFrame) => {
 *         // Display the color image
 *         document.getElementById('colorImage').src = colorFrame.src;
 *       });
 *     });
 * });
 *
 * // Using script tag (UMD build)
 * // <script src="https://cdn.jsdelivr.net/npm/kinectron@1.0.0/dist/kinectron.umd.js"></script>
 * // const kinectron = new Kinectron('127.0.0.1');
 */
export default Kinectron;
