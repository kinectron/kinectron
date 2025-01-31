
import KinectAzure from 'kinect-azure';

function startAzureKinect(evt) {
  const kinect = new KinectAzure();

//   let kinectType = 'azure';
//   whichKinect = kinectType;

//   setCanvasDimensions(kinectType);

  
  if (kinect.open()) {
    console.log('Kinect open'); 
  // TODO: refactor so this global image and canvas is not needed
    // initAzureColorImageAndCanvas();
  } else {
    console.warn('Kinect not open. There might be a problem with your Kinect')
  }  
}

export  { startAzureKinect };


