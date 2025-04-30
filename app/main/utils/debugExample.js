// Example script demonstrating how to use the debug flags
import { DEBUG, log } from './debug.js';

/**
 * This example shows how to use the debug flags to control logging verbosity.
 * Run this script to see the different types of logs and how they are controlled.
 */

// Function to demonstrate different log types
function demonstrateLogging() {
  console.log('=== Debug Flags Example ===');
  console.log('Current DEBUG settings:');
  Object.keys(DEBUG).forEach((key) => {
    if (typeof DEBUG[key] === 'boolean') {
      console.log(`  ${key}: ${DEBUG[key]}`);
    }
  });

  console.log('\n=== Always Visible Logs ===');
  // These logs are always visible regardless of debug flags
  log.info('This is an info message - always visible');
  log.warn('This is a warning message - always visible');
  log.error('This is an error message - always visible');

  console.log('\n=== Conditional Logs (currently hidden) ===');
  // These logs are only visible if the corresponding debug flag is enabled
  log.frame('This frame log is only visible if DEBUG.FRAMES is true');
  log.handler(
    'This handler log is only visible if DEBUG.HANDLERS is true',
  );
  log.debug(
    'PERFORMANCE',
    'This performance log is only visible if DEBUG.PERFORMANCE is true',
  );
  log.debug(
    'DATA',
    'This data log is only visible if DEBUG.DATA is true',
  );
  log.debug(
    'NETWORK',
    'This network log is only visible if DEBUG.NETWORK is true',
  );
  log.debug(
    'PEER',
    'This peer connection log is only visible if DEBUG.PEER is true',
  );

  console.log('\n=== Enabling Debug Flags ===');
  // Enable some debug flags
  DEBUG.FRAMES = true;
  DEBUG.PERFORMANCE = true;

  console.log('Enabled DEBUG.FRAMES and DEBUG.PERFORMANCE');

  console.log('\n=== Conditional Logs (some now visible) ===');
  // Now some of these logs will be visible
  log.frame(
    'This frame log is now visible because DEBUG.FRAMES is true',
  );
  log.handler(
    'This handler log is still hidden because DEBUG.HANDLERS is false',
  );
  log.debug(
    'PERFORMANCE',
    'This performance log is now visible because DEBUG.PERFORMANCE is true',
  );
  log.debug(
    'DATA',
    'This data log is still hidden because DEBUG.DATA is false',
  );

  console.log('\n=== Using enableAll() and disableAll() ===');
  // Enable all debug flags
  DEBUG.enableAll();
  console.log('Enabled all debug flags with DEBUG.enableAll()');

  console.log('\n=== All Logs Now Visible ===');
  // Now all logs will be visible
  log.frame('This frame log is visible');
  log.handler('This handler log is visible');
  log.debug('PERFORMANCE', 'This performance log is visible');
  log.debug('DATA', 'This data log is visible');
  log.debug('NETWORK', 'This network log is visible');
  log.debug('PEER', 'This peer connection log is visible');

  // Disable all debug flags
  DEBUG.disableAll();
  console.log('\nDisabled all debug flags with DEBUG.disableAll()');
}

// Run the demonstration
demonstrateLogging();

console.log('\n=== How to Use in Your Code ===');
console.log('1. Import the DEBUG object and log functions:');
console.log("   import { DEBUG, log } from './utils/debug.js';");
console.log(
  '2. Use log.info(), log.warn(), and log.error() for important messages',
);
console.log('3. Use log.frame() for frame-related logs');
console.log('4. Use log.handler() for handler-related logs');
console.log(
  '5. Use log.debug(flag, message) for other conditional logs',
);
console.log('6. Set DEBUG flags to control verbosity:');
console.log('   DEBUG.FRAMES = true; // Enable frame logs');
console.log('   DEBUG.HANDLERS = true; // Enable handler logs');
console.log('   DEBUG.enableAll(); // Enable all logs');
console.log('   DEBUG.disableAll(); // Disable all logs');
