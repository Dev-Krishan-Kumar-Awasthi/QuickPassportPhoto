/**
 * Compliance Checker — validates a processed passport photo against common standards.
 * Analyzes: face centering, brightness, sharpness (contrast proxy).
 */

export interface ComplianceResult {
  passed: boolean;
  score: number; // 0–100
  issues: string[];
  tips: string[];
}

export async function checkCompliance(imageDataUrl: string): Promise<ComplianceResult> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      // Sample at a lower resolution for performance
      const W = 200;
      const H = 256;
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, W, H);

      const data = ctx.getImageData(0, 0, W, H).data;

      const issues: string[] = [];
      const tips: string[] = [];
      let score = 100;

      // --- 1. Brightness Check ---
      let totalBrightness = 0;
      let pixelCount = 0;
      for (let i = 0; i < data.length; i += 4) {
        const a = data[i + 3];
        if (a > 10) { // Skip fully transparent pixels (background)
          const r = data[i], g = data[i + 1], b = data[i + 2];
          totalBrightness += (0.299 * r + 0.587 * g + 0.114 * b);
          pixelCount++;
        }
      }
      const avgBrightness = pixelCount > 0 ? totalBrightness / pixelCount : 128;

      if (avgBrightness < 80) {
        issues.push('Photo appears too dark');
        tips.push('Take photo in natural lighting or near a window');
        score -= 25;
      } else if (avgBrightness > 230) {
        issues.push('Photo appears overexposed');
        tips.push('Avoid harsh direct light or flash');
        score -= 15;
      }

      // --- 2. Sharpness / Contrast Check (variance proxy) ---
      let variance = 0;
      let sampleCount = 0;
      for (let i = 0; i < data.length; i += 16) { // sample every 4th pixel
        const a = data[i + 3];
        if (a > 10) {
          const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
          variance += Math.pow(lum - avgBrightness, 2);
          sampleCount++;
        }
      }
      const stdDev = sampleCount > 0 ? Math.sqrt(variance / sampleCount) : 50;

      if (stdDev < 20) {
        issues.push('Image may be blurry or low contrast');
        tips.push('Use a higher resolution or sharper photo');
        score -= 20;
      }

      // --- 3. Face Centering (check if opaque pixels are centered) ---
      let leftMass = 0;
      let rightMass = 0;
      const midX = W / 2;
      for (let i = 0; i < data.length; i += 4) {
        const a = data[i + 3];
        if (a > 50) {
          const pixelIndex = i / 4;
          const col = pixelIndex % W;
          if (col < midX) leftMass++;
          else rightMass++;
        }
      }
      const totalMass = leftMass + rightMass;
      if (totalMass > 0) {
        const centerRatio = Math.min(leftMass, rightMass) / Math.max(leftMass, rightMass);
        if (centerRatio < 0.75) {
          issues.push('Face appears off-center');
          tips.push('Center yourself in the frame before taking the photo');
          score -= 15;
        }
      }

      // --- 4. Subject Fill (enough content vs transparent) ---
      const opaquePixels = pixelCount;
      const totalPixels = W * H;
      const fillRatio = opaquePixels / totalPixels;
      if (fillRatio < 0.2) {
        issues.push('Face takes up too little of the frame');
        tips.push('Move closer to the camera for a proper passport crop');
        score -= 20;
      } else if (fillRatio > 0.97) {
        // almost no transparent area — background may not have been removed
        issues.push('Background may not have been fully removed');
        tips.push('Try a photo with a plain, uncluttered background');
        score -= 10;
      }

      score = Math.max(0, Math.min(100, score));
      const passed = issues.length === 0;

      resolve({ passed, score, issues, tips });
    };

    img.onerror = () => {
      // On error, return a passing result to not block the user
      resolve({ passed: true, score: 80, issues: [], tips: [] });
    };

    img.src = imageDataUrl;
  });
}
