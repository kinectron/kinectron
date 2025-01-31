export function initializeUI() {
  const startKinectButton = document.getElementById(
    'start-kinect-azure',
  );
  const startColorButton = document.getElementById('color');

  const additionalControls = document.getElementById(
    'additional-controls',
  );

  startKinectButton.addEventListener('click', async () => {
    startKinectButton.disabled = true;

    try {
      const result = await window.api.initializeKinect('test data');
      console.log('Kinect initialized:', result);

      additionalControls.style.display = 'block';
    } catch (error) {
      console.log('Kinect initialization error:', error);
    } finally {
      startKinectButton.disabled = false;
    }
  });

  startColorButton.addEventListener('click', async () => {
    startColorButton.disabled = true;

    try {
      const result = await window.api.startColorStream();
      console.log('Color stream opened:', result);
    } catch (error) {
      console.log('Color stream error:', error);
    } finally {
      startColorButton.disabled = false;
    }
  });
}
