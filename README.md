# Kinectron

Kinectron is a node-based library that broadcasts Kinect2 data over a peer connection. It builds on the Node Kinect2 and PeerJS libraries. 

Kinectron has two components--an electron application to broadcast Kinect2 data over a peer connection, and a client-side API to request and receive Kinect2 data over a peer connection.

## Kinectron Application Installation 
You will need to be running Windows 8 or Windows 10 for the app to run correctly. If you are running Windows 8, you will also need to download and install the [Official Kinect2 SDK](https://www.microsoft.com/en-us/download/details.aspx?id=44561) before running Kinectron.

Download and unzip [preview release 0.0.4.4](https://github.com/lisajamhoury/kinectron/releases/tag/0.0.4.4).

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

#### The Peer Server
Kinectron uses a peer server to transfer Kinect2 data to the browser. The peer server can be accessed in three ways: 

1. Connect on localhost. By default the application creates a peer connection using peer.js on localhost at port 9001 with "kinectron" as username. This is used to connect on the same computer.

2. Connect on local network. Kinectron displays the local IP address, along with peer ID and port number. These can be used in the client-side API to connect over your local wifi network. See "Creating an Instance of Kinectron." 

3. Connect on personal peer network. Use your own peer server by entering and submitting your ID and server details as follows: 

	Name: myname

	Server Details: {"host": "myserver.com", "port": "9000", "path": "/", "secure": "true"}

	**Important!** In order to parse correctly, server details must be enclosed within curly brackets and properties must be in double quotes.   

#### Set Image Size
The Kinectron application displays two images: the feed from the Kinect2 and the image for output over the peer connection. 

The native dimensions of the Kinect2 feeds are: 
	Color: 1920 x 1080
	Depth: 512 x 424

Kinectron outputs them at the following dimensions by default:
	Color: 960 x 540
	Depth: 512 x 424

Change the Kinectron output dimensions by entering the desired width or height and clicking "Submit." 

#### Choose a Feed
Kinectron currently supports sending only one feed. (Multifeed support coming very soon!)

To start a feed, click the corresponding button. The feed will start automatically. If you click a different button, Kinectron will automatically stop the current feed and begin the new feed. Clicking the same button twice starts, then stops, that feed.

-"Color" returns a jpeg of the color camera.  
-"Depth" returns a jpeg of the depth camera.  
-"Skeleton (Tracked Bodies)" returns all tracked bodies one at a time. It does not differentiate between tracked bodies. For troubleshooting, Kinectron by default will draw the tracked bodies on the application interface, however, only the data is sent over the peer connection.  
-"All Bodies" returns an array of all six bodies, tracked or not tracked. For troubleshooting, Kinectron by default will draw the tracked bodies on the application interface, however, only the data is sent over the peer connection. 
-"Infrared" returns a jpeg of the infrared camera.  
-"Long Exposure Infrared" returns a longer exposure png of the infrared camera.  
-"Key" returns a png of the image of the tracked bodies on a transparent background.  
-"Stop All" stops all feeds. 

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

### Request A Feed

Request a feed from the application using the start function for the desired feed. Each start function optionally takes a callback. See descriptions of the return of each feed under "Choosing a Feed."

```
kinectron.startRGB(myCallback);
kinectron.startDepth(myCallback);
kinectron.startTrackedBodies(myCallback);
kinectron.startTrackedJoint(kinectron.HANDRIGHT, myCallback); // See "Accessing Joints" below
kinectron.startBodies(myCallback);
kinectron.startInfrared(myCallback);
kinectron.startLEInfrared(myCallback);
kinectron.startKey(myCallback);
```

### Set Callbacks 

Callbacks on the feeds can be set either as an argument on the start function (see "Request A Feed") or with the set callback function. Kinectron will use the most recently declared callback. 

```
kinectron.setRGBCallback(myCallback);
kinectron.setDepthCallback(myCallback);
kinectron.setTrackedBodiesCallback(myCallback);
kinectron.setBodiesCallback(myCallback);
kinectron.setInfraredCallback(myCallback);
kinectron.setLeInfraredCallback(myCallback);
kinectron.setKeyCallback(myCallback);
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

### Stop Feeds 
Stop all feeds with the stop all function. 

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

