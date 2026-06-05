const videoElement = document.getElementById("webcam");
const modelEntity = document.getElementById("target-model");

// Initialize MediaPipe Hands
const hands = new Hands({
  locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
});

hands.setOptions({
  maxNumHands: 1,
  modelComplexity: 1,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5,
});

// This callback fires every time the AI detects hand movement
hands.onResults((results) => {
  if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
    const hand = results.multiHandLandmarks[0];

    // Landmark 0 is the WRIST. Coordinates are normalized between 0.0 and 1.0
    const wristX = hand[0].x;

    // Map the 0.0 - 1.0 screen range to a smooth 360-degree rotation
    const targetRotationY = wristX * 360 - 180;

    // Apply the rotation instantly to the A-Frame 3D asset
    modelEntity.setAttribute("rotation", `0 ${targetRotationY} 0`);
  }
});

// Setup the camera utility to continuously feed video frames to the AI model
const camera = new Camera(videoElement, {
  onFrame: async () => {
    await hands.send({ image: videoElement });
  },
  width: 640,
  height: 480,
});

camera.start();
