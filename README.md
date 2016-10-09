# Kinectron

Kinectron is a node-based library that broadcasts Kinect2 data over a peer connection. It builds on the Node Kinect2 and PeerJS libraries. 

Kinectron has two components--an electron application to broadcast Kinect2 data over a peer connection, and a client-side API to request and receive Kinect2 data over a peer connection.

## Kinectron Application Installation 
You will need to be running Windows 10 and install [the official Kinect 2 SDK](https://www.microsoft.com/en-us/download/details.aspx?id=44561) for the app to run correctly.  

Download and unzip file. [need to add file]

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
Download and include the library in the <head> of your document. 

```
<script src="kinectron.bundle.js" type="text/javascript"></script>
```

### Create an Instance of Kinectron 
Kinectron uses a peer server to transfer Kinect data to the browser. The peer server can be accessed in three ways. See the corresponding section "The Peer Server" in "Using the Application Interface."

1. Connect to localhost. By default the application creates a peer connection using peer.js on localhost at port 9001 with "kinectron" as username. This is used to connect to the application on the same computer that is running the application. 
	
```
var kinectron = new Kinectron();
```
2. Connect to local network. To work with the Kinect2 data on a different computer that is on the same local network as the computer running the Kinectron application, enter the peer ID, IP address, and port number displayed by the application on start.
	
```
var kinectron = new Kinectron("kinectron", { // username matches application display 
	"host": "172.16.242.138",  // host matches application display
	"port": "9001", // port matches application display
	"path": "/"
});
```

**Important!** In order to parse correctly, server details must be enclosed within curly brackets and properties must be within double quotes.   

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

