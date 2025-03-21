// p5PointCloud.js - Point cloud visualization using p5.js

let p5Instance = null;
let points = [];
let depthBuffer = [];
let isInitialized = false;

const DEPTHWIDTH = 320;
const DEPTHHEIGHT = 288;
const NUMPARTICLES = DEPTHWIDTH * DEPTHHEIGHT;

// Create a new p5 instance with the sketch
export function initP5PointCloud(container) {
  if (p5Instance) {
    p5Instance.remove();
  }

  // Create the p5 sketch
  const sketch = (p) => {
    p.setup = function () {
      // Create canvas inside the container
      const canvas = p.createCanvas(
        container.clientWidth,
        container.clientHeight,
        p.WEBGL,
      );
      canvas.parent(container);
      createPointCloud(p);
      isInitialized = true;
    };

    p.draw = function () {
      p.background(0);
      p.orbitControl();

      if (depthBuffer.length < 1) {
        console.log('waiting for depth data');
        return;
      }

      const MINVAL = 100;
      const MAXVAL = 1000;

      for (let y = 0; y < DEPTHHEIGHT; y += 5) {
        for (let x = 0; x < DEPTHWIDTH; x += 5) {
          let i = y * DEPTHWIDTH + x;

          let depthValue = depthBuffer[i]; // 0 - 3128

          if (depthValue < MINVAL || depthValue > MAXVAL) {
            depthValue = Number.MAX_VALUE;
          } else {
            depthValue = p.map(depthValue, 0, 3000, 0, 1000);
          }

          let newR = (i / NUMPARTICLES) * 255;

          p.stroke(newR, 255 - newR, 255 - newR);
          p.point(points[i].x, points[i].y, depthValue);
        }
      }
    };

    p.windowResized = function () {
      p.resizeCanvas(container.clientWidth, container.clientHeight);
    };
  };

  // Create a new p5 instance
  p5Instance = new p5(sketch);
  return p5Instance;
}

// Update the depth data
export function updateDepthData(data) {
  if (data && data.length > 0) {
    depthBuffer = data;
  }
}

// Create the point cloud
function createPointCloud(p) {
  points = [];
  for (let y = 0; y < DEPTHHEIGHT; y++) {
    for (let x = 0; x < DEPTHWIDTH; x++) {
      let newX = x - DEPTHWIDTH / 2;
      let newY = y - DEPTHHEIGHT / 2;

      let newVertex = { x: newX, y: newY, z: 0 };
      points.push(newVertex);
    }
  }
}

// Check if the point cloud is initialized
export function isPointCloudInitialized() {
  return isInitialized;
}

// Clean up the p5 instance
export function cleanupP5PointCloud() {
  if (p5Instance) {
    p5Instance.remove();
    p5Instance = null;
    isInitialized = false;
  }
}
