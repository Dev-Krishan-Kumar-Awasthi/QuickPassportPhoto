let modelsLoaded = false;
const MODEL_URL = '/models';

export async function loadFaceModels() {
  if (modelsLoaded) return;
  
  // Dynamic import to ensure it only runs on the client
  const faceapi = await import('@vladmandic/face-api');
  
  await Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
  ]);
  
  modelsLoaded = true;
}

/**
 * Detects the face in a transparent PNG and calculates the optimal crop
 * for a biometric passport photo (3.5cm x 4.5cm).
 * Uses a multi-scale approach to detect small faces in full-body photos.
 */
export async function getBiometricCrop(imgElement: HTMLImageElement) {
  await loadFaceModels();
  const faceapi = await import('@vladmandic/face-api');

  // Helper function to detect face at a specific scale
  const detectAtScale = async (scale: number) => {
    let input: HTMLImageElement | HTMLCanvasElement = imgElement;
    
    if (scale !== 1) {
      const canvas = document.createElement('canvas');
      canvas.width = imgElement.width * scale;
      canvas.height = imgElement.height * scale;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(imgElement, 0, 0, canvas.width, canvas.height);
      input = canvas;
    }

    const detections = await faceapi.detectSingleFace(
      input, 
      new faceapi.TinyFaceDetectorOptions({ inputSize: 608, scoreThreshold: 0.3 })
    ).withFaceLandmarks();

    if (!detections) return null;

    // Scale coordinates back down
    return {
      detection: {
        box: {
          x: detections.detection.box.x / scale,
          y: detections.detection.box.y / scale,
          width: detections.detection.box.width / scale,
          height: detections.detection.box.height / scale,
        }
      },
      landmarks: {
        getLeftEye: () => detections.landmarks.getLeftEye().map(p => ({ x: p.x / scale, y: p.y / scale })),
        getRightEye: () => detections.landmarks.getRightEye().map(p => ({ x: p.x / scale, y: p.y / scale })),
        getJawOutline: () => detections.landmarks.getJawOutline().map(p => ({ x: p.x / scale, y: p.y / scale })),
        getNose: () => detections.landmarks.getNose().map(p => ({ x: p.x / scale, y: p.y / scale })),
      }
    };
  };

  // Try multiple scales to catch small faces in full body photos
  let result = await detectAtScale(1);
  if (!result) result = await detectAtScale(2); // Try 2x scale
  if (!result) result = await detectAtScale(4); // Try 4x scale for very small faces

  if (!result) return null;

  const { detection, landmarks } = result;
  const { box } = detection;
  
  // Passport photo guidelines:
  // 1. Face should take up 70-80% of the image.
  // 2. Eyes should be roughly at specific heights.
  
  const faceWidth = box.width;
  const faceHeight = box.height;
  
  // Target dimensions for output (300 DPI)
  const targetW = 413; // 35mm
  const targetH = 531; // 45mm
  
  // We want the face width to be ~75% of the crop width
  const cropW = faceWidth / 0.65; 
  const cropH = cropW * (targetH / targetW);

  // Center horizontally on the face
  let startX = box.x + (faceWidth / 2) - (cropW / 2);
  
  // Vertically, position eye line at ~30-40% from top
  const eyeLeft = landmarks.getLeftEye()[0];
  const eyeRight = landmarks.getRightEye()[0];
  const eyeCenterY = (eyeLeft.y + eyeRight.y) / 2;
  
  let startY = eyeCenterY - (cropH * 0.35);

  return {
    x: Math.max(0, startX),
    y: Math.max(0, startY),
    width: cropW,
    height: cropH,
    targetWidth: targetW,
    targetHeight: targetH,
    landmarks: {
      chin: landmarks.getJawOutline()[8], // Middle of jawline
      leftJaw: landmarks.getJawOutline()[0],
      rightJaw: landmarks.getJawOutline()[16],
      nose: landmarks.getNose()[3], // Tip of nose
    }
  };
}

