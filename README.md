# Kinectron

Kinectron is a node-based library that broadcasts Kinect2 data over a peer connection. It builds on the Node Kinect2 and PeerJS libraries. 

Kinectron has two components--an electron application to broadcast Kinect2 data over a peer connection, and a client-side API to request and receive Kinect2 data over a peer connection.

## Kinectron Application Installation 
You will need to be running Windows 8 or Windows 10 for the app to run correctly. If you are running Windows 8, you will also need to download and install the [Official Kinect2 SDK](https://www.microsoft.com/en-us/download/details.aspx?id=44561) before running Kinectron.

Download and unzip [preview release 0.0.4.8](https://github.com/lisajamhoury/kinectron/releases/tag/0.0.4.8).

We recommend unzipping the folder directly at the C:\ drive level to avoid an error with Windows filename size limitations.

In the unzipped folder, click on the Electron application to run. 

**Important!** When you run the application for the first time you will get a Windows Firewall warning. Allow for both private and public networks to connect. 

![Screenshot](https://www.tixati.com/optimize/win7fw-001.png)

If you accidently cancel out of the notification, you can access the Firewall Settings in the following way: 

Navigate to Settings > Network & Internet > Windows Firewall > Allow an app or feature through Windows Firewall 

1. Click "Change Settings" on top right 
2. Find Electron in the list
3. Check all three boxes for Electron (Electron, Private, Public)
4. Click Ok.

### Using the Application Interface

#### Choosing A Frame
Kinectron supports broadcasting one frame or multiple frames at the same time. 

##### Single Frame
Kinectron starts by default in single frame mode. 

To start a frame, click the corresponding button. The frame will start automatically. If you click a different button, Kinectron will automatically stop the current frame and begin the new frame. 

-"Color" returns a jpeg of the color camera.  
-"Depth" returns a jpeg of the depth camera.  
-"Raw Depth" returns an array of values ranging from 0 - 8191. It displays a lossless webp image in the application for testing and feedback.    
-"Skeleton (Tracked Bodies)" returns all tracked bodies one at a time. It does not differentiate between tracked bodies. For troubleshooting, Kinectron by default will draw the tracked bodies on the application interface, however, only the body data is sent over the peer connection.  
-"All Bodies" returns an array of all six bodies, tracked or not tracked. For troubleshooting, Kinectron by default will draw the tracked bodies on the application interface, however, only the data is sent over the peer connection. 
-"Infrared" returns a jpeg of the infrared camera.  
-"Long Exposure Infrared" returns a longer exposure jpeg of the infrared camera.
-"Key" returns a png of the image of the tracked bodies on a transparent background. It has the effect of a green screen.  
-"Stop All" stops the current frame.

##### Multiframe
Multiframe broadcasts several frames simultaneously in a single feed. Click the "Multiframe" button to start multiframe mode. 

Select the checkboxes for the desired frames, then click "Start Multiframe." Click "Stop Multiframe" to end multiframe broadcast.  

Available frames correspond to the frames listed under Single Frame. Color, depth, raw depth and body are currently available under multiframe. 

Running multiple frames at once may impact the speed of your broadcast depending on the system you are running and the speed of your network.  

#### Recording

##### Recording Single Frames
To record a single frame, click the button corresponding to the frame that you want to record. Once the broadcast has started, click "Start Record" to begin recording. Click the button a second time "Stop Record" to end recording. The file will be saved automatically to your home folder in "Kinectron Recordings."

##### Recording Multiple Frames 
To record multiple frames, start the frames you wish to record, then click "Start Record" to begin recording. Click the button a second time "Stop Record" to end recording. The files will be saved automatically to your home folder in "Kinectron Recordings."

##### Recorded File Types
The recorded frames result in the following file types. These vary slighty if recording with the API. See API documentation. 

```
Color: webm
Depth: webm
Raw Depth: webm
Skeleton: webm (joints drawn to canvas) and JSON (joint data)*
All Bodies: webm (joints drawn to canvas) and JSON (joint data)*
Infrared: webm
Long Exposure Infrared: webm
Key: webm

*JSON files with joint data include a timestamp.

```


#### Advanced Options
##### Peer Server
Kinectron uses a peer server to transfer Kinect2 data to the browser. The peer server can be accessed in three ways: 

1. Connect on localhost. By default the application creates a peer connection using peer.js on localhost at port 9001 with "kinectron" as username. This is used to connect on the same computer.

2. Connect on local network. Kinectron displays the local IP address at the top of the application. This can be used in the client-side API to connect over your local wifi network. See "Creating an Instance of Kinectron" below. 

3. Connect on personal peer network. Use your own peer server by entering and submitting your ID and server details as follows: 

	Name: myname

	Server Details: {"host": "myserver.com", "port": "9000", "path": "/", "secure": "true"}

	**Important!** In order to parse correctly, server details must be enclosed within curly brackets and properties must be in double quotes.   

##### Set Image Size
The Kinectron application displays two images: the feed from the Kinect2 and the image for output over the peer connection. 

The native dimensions of the Kinect2 feeds are: 
	Color: 1920 x 1080
	Depth: 512 x 424

Kinectron outputs them at the following dimensions by default:
	Color: 960 x 540
	Depth: 512 x 424

Change the Kinectron output dimensions by entering the desired width or height and clicking "Submit." 

## Using the Client-side API
Include the library in the head of your document. 

```
<script src="https://itp.nyu.edu/kinectron/kinectron.bundle.js"></script>
```

### Create an Instance of Kinectron 
Kinectron uses a peer server to transfer Kinect data to the browser. The peer server can be accessed in three ways. See the corresponding section "The Peer Server" in "Using the Application Interface."

1. Connect to localhost. By default the application creates a peer connection using peer.js on localhost at port 9001 with "kinectron" as username. This is used to connect to the application on the same computer that is running the application. 
	
	```
	var kinectron = new Kinectron();
	```
2. Connect to local network. To work with the Kinect2 data on a different computer that is on the same local network as the computer running the Kinectron application, enter the IP address displayed by the application on start.
	
	```
	var kinectron = new Kinectron("172.16.242.138");
	```

3. Connect to personal peer network. Use your own peer server by entering your ID and server details as follows: 

	```
	var kinectron = new Kinectron("myusername", {  // enter the username to connect to
		"host": "myserver.com", // your personal peer server
		"port": "9001", // your portnumber
		"path": "/", // your path
		"secure": "true" // include parameters per peer.js documentation 
	});
	```

	**Important!** In order to parse correctly, server details must be enclosed within curly brackets and properties must be within double quotes.   

### Create Peer Connection
Connect over the peer network.

```
kinectron.makeConnection();
```

### Request A Frame

Request a frame from the application using the start function for the desired frame. Each start function optionally takes a callback. See descriptions of the return of each frame under "Choosing A Frame."

```
kinectron.startColor(myCallback);
kinectron.startDepth(myCallback);
kinectron.startRawDepth(myCallback);
kinectron.startTrackedBodies(myCallback);
kinectron.startTrackedJoint(kinectron.HANDRIGHT, myCallback); // See "Accessing Joints" below
kinectron.startBodies(myCallback);
kinectron.startInfrared(myCallback);
kinectron.startLEInfrared(myCallback);
kinectron.startKey(myCallback);
```

### Set Callbacks 

Callbacks on the frames can be set either as an argument on the start function (see "Request A Frame") or with the set callback function. Kinectron will use the most recently declared callback. 

```
kinectron.setColorCallback(myCallback);
kinectron.setDepthCallback(myCallback);
kinectron.setRawDepthCallback(myCallback);
kinectron.setTrackedBodiesCallback(myCallback);
kinectron.setBodiesCallback(myCallback);
kinectron.setInfraredCallback(myCallback);
kinectron.setLeInfraredCallback(myCallback);
kinectron.setKeyCallback(myCallback);
```

### Requesting Multiple Frames

Use the start multiframe function to request multiple frames in the same broadcast feed. The function takes two arguments. 

The first argument is an array with the names of the desired frames. Frame names are case sensitive, must be spelled correctly, and must be contained in quotes. The following frames are currently available: 'color', 'depth', 'raw-depth', and 'body'.

The second argument is an optional callback. If the callback is included, it will be executed on all the data that is being broadcast. If the callback is not set, the callback set for each frame will be called. 

Example with multiframe callback set. 
```
 	kinectron.startMultiFrame(["color", "depth", "body"], multiFrameCallback);
 
 	// Frames are delivered together in one object to the multiFrame callback
 	function multiFrameCallback(data) {
		drawKinectronImage(data.color);
		drawKinectronImage(data.depth);
		drawKinectronSkeleton(data.body);
	}

``` 

Example with individual callbacks set. 

```
	kinectron.setColorCallback(colorCallback);
	kinectron.setDepthCallback(depthCallback);
	kinectron.setBodiesCallback(bodyCallback);

	kinectron.startMultiFrame(["color", "depth", "body"]);

	// Frames are delivered individually to their respective callbacks

	colorCallback(colorImg) {
		//process color frame here
	}

	depthCallback(depthImg) {
		//process depth frame here
	}

	bodyCallback(body) {
		//process body object here
	}

```


### Accessing Individual Joints

The startTrackedJoint function allows to you access just one joint from a tracked body and perform a callback on that specific joint. The joint maintains the unique tracking ID property from its body. Use joint.trackingId to access the ID. 

```
kinectron.startTrackedJoint(kinectron.HANDRIGHT, drawRightHand);

function drawRightHand(hand) {
  background(0);
  fill(255);
  ellipse(hand.depthX * myCanvas.width, hand.depthY * myCanvas.height, 50, 50);
}
```

The available joints and their corresponding numbers are as follows: 

```
kinectron.SPINEBASE = 0;
kinectron.SPINEMID = 1;
kinectron.NECK = 2;
kinectron.HEAD = 3;
kinectron.SHOULDERLEFT = 4;
kinectron.ELBOWLEFT = 5;
kinectron.WRISTLEFT = 6;
kinectron.HANDLEFT = 7;
kinectron.SHOULDERRIGHT = 8;
kinectron.ELBOWRIGHT = 9;
kinectron.WRISTRIGHT = 10;
kinectron.HANDRIGHT = 11;
kinectron.HIPLEFT = 12;
kinectron.KNEELEFT = 13;
kinectron.ANKLELEFT = 14;
kinectron.FOOTLEFT = 15;
kinectron.HIPRIGHT = 16;
kinectron.KNEERIGHT = 17;
kinectron.ANKLERIGHT = 18;
kinectron.FOOTRIGHT = 19;
kinectron.SPINESHOULDER = 20;
kinectron.HANDTIPLEFT  = 21;
kinectron.THUMBLEFT = 22;
kinectron.HANDTIPRIGHT = 23;
kinectron.THUMBRIGHT = 24;
```

Individual joints are also accessible by name on tracked bodies.

```
kinectron.startTrackedBodies(bodyTracked);

function bodyTracked(body) {
  var handRight = body.joints[kinectron.HANDRIGHT];
}
```

### Stop Feed 
Stop the feed with the stop all function. 

```
kinectron.stopAll();
```

### Additional Skeleton (Tracked Bodies) Functions
#### Get Joints 
Use get joints to access the individual joints of each tracked body. Useful for drawing skeleton. 

```
kinectron.getJoints(myDrawJointsFunction);
```

#### Get Hands 
Get hands returns an object containing the left and right hand joints, and the left and right hand states. Hand states are 'unknown' 'notTracked' 'open' 'closed' and 'lasso'.

```
kinectron.getHands(myDrawHandsFunction);
```

### Recording
It is possible to record from the API on both the client side and the server side.

#### Server-side Recording
Use startServerRecord and stopServerRecord to begin and end recording on the Kinectron server. Recording will not begin unless a feed is running. It's a good idea to attach the start and stop functions to key presses or buttons.

```
<html>
	<body>
		<button onclick="startServerRecord()">Start Record</button>
		<button onclick="stopServerRecord()">Stop Record</button>
	</body>
</html>
``` 

Files recorded with the server-side recording from the API will be saved automatically to the home folder of the computer running the server in the "Kinectron Recordings" folder.

The recorded file types will match those listed in [Application Recording](#recorded-file-types).

#### Client-side Recording
Use the startRecord and stopRecord functions to begin and end recording on the client side. Recording will not begin unless a feed is running. It's a good idea to attach startRecord and stopRecord to key presses or buttons. 

```
<html>
	<body>
		<button onclick="startRecord()">Start Record</button>
		<button onclick="stopRecord()">Stop Record</button>
	</body>
</html>
```

**Important!** You will be prompted to download multiple files if recording more than one stream in the browser. You may have to allow multiple downloads on the site. If you continue to have trouble, make sure that the option for "Ask where to save each file before downloading" in Chrome Advanced Settings is **unchecked.** This will by default block multiple downloads. 

#### Client-side Recorded File Types
The recorded frames result in the following file types. These vary slighty if recording with the application. See application documentation for differences. 

```
Color: webm
Depth: webm
Raw Depth: JSON (array data)*
Skeleton: JSON (joint data)*
All Bodies: JSON (joint data)*
Infrared: webm
Long Exposure Infrared: webm
Key: webm

*JSON files include a timestamp on each frame.
```

Raw depth data will record, but the data is so heavy, it is not recommended to use the record function for this frame type. 

