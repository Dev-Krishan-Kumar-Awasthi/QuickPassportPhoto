/**
 * Auto Image Enhancement Utility
 * 
 * Applies professional-grade enhancements:
 * 1. Auto-Levels (Contrast stretching)
 * 2. Saturation/Vibrance Boost
 * 3. Unsharp Masking (Sharpening)
 */

export async function autoEnhanceImage(dataUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const width = img.width;
        const height = img.height;
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Could not get 2d context');

        ctx.drawImage(img, 0, 0);
        
        let imgData = ctx.getImageData(0, 0, width, height);
        let data = imgData.data;

        // --- 1. Auto Levels (Contrast Stretching) ---
        // Find min and max luminance
        let minLum = 255;
        let maxLum = 0;
        
        // Fast pass to find bounds
        for (let i = 0; i < data.length; i += 16) {
          const r = data[i], g = data[i + 1], b = data[i + 2];
          const lum = 0.299 * r + 0.587 * g + 0.114 * b;
          if (lum < minLum) minLum = lum;
          if (lum > maxLum) maxLum = lum;
        }

        // Avoid extreme stretching if already good or pure black/white image
        if (minLum < 20) minLum = 0; 
        if (maxLum > 235) maxLum = 255;

        const stretchRange = maxLum - minLum;
        
        // --- 2. Color Saturation Boost ---
        const saturationBoost = 1.15; // 15% boost

        for (let i = 0; i < data.length; i += 4) {
          let r = data[i];
          let g = data[i + 1];
          let b = data[i + 2];

          // Apply contrast stretch
          if (stretchRange > 0 && stretchRange < 255) {
            r = ((r - minLum) / stretchRange) * 255;
            g = ((g - minLum) / stretchRange) * 255;
            b = ((b - minLum) / stretchRange) * 255;
          }

          // Apply Gamma Boost (Lighting correction for skin tones, gamma = 1.15)
          const gamma = 1.15;
          r = 255 * Math.pow(r / 255, 1 / gamma);
          g = 255 * Math.pow(g / 255, 1 / gamma);
          b = 255 * Math.pow(b / 255, 1 / gamma);

          // Apply Saturation Boost
          const lum = 0.299 * r + 0.587 * g + 0.114 * b;
          r = lum + (r - lum) * saturationBoost;
          g = lum + (g - lum) * saturationBoost;
          b = lum + (b - lum) * saturationBoost;

          // Clamp
          data[i] = Math.min(255, Math.max(0, r));
          data[i + 1] = Math.min(255, Math.max(0, g));
          data[i + 2] = Math.min(255, Math.max(0, b));
        }

        ctx.putImageData(imgData, 0, 0);

        // --- 3. Sharpening (Unsharp Mask equivalent using convolution matrix) ---
        // We use a gentle sharpening matrix to restore details
        const sharpenAmount = 0.6; // 0.0 to 1.0ish
        const center = 1 + (4 * sharpenAmount);
        const edge = -sharpenAmount;
        
        // [ edge, edge, edge ]
        // [ edge, center, edge ]
        // [ edge, edge, edge ]
        // But for speed, a 3x3 simple cross is often enough:
        // [ 0,    edge,   0 ]
        // [ edge, center, edge ]
        // [ 0,    edge,   0 ]
        
        const weights = [
          0, edge, 0,
          edge, center, edge,
          0, edge, 0
        ];
        
        // Apply convolution (creating a new fresh imageData to read from)
        const srcData = ctx.getImageData(0, 0, width, height).data;
        const dstImgData = ctx.createImageData(width, height);
        const dstData = dstImgData.data;

        const side = Math.round(Math.sqrt(weights.length));
        const halfSide = Math.floor(side / 2);
        
        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const dstOff = (y * width + x) * 4;
            let r = 0, g = 0, b = 0, a = srcData[dstOff + 3];

            for (let cy = 0; cy < side; cy++) {
              for (let cx = 0; cx < side; cx++) {
                const scy = y + cy - halfSide;
                const scx = x + cx - halfSide;
                
                // Clamp coordinates
                const cY = Math.min(Math.max(scy, 0), height - 1);
                const cX = Math.min(Math.max(scx, 0), width - 1);
                
                const srcOff = (cY * width + cX) * 4;
                const wt = weights[cy * side + cx];
                
                r += srcData[srcOff] * wt;
                g += srcData[srcOff + 1] * wt;
                b += srcData[srcOff + 2] * wt;
              }
            }

            dstData[dstOff] = Math.min(255, Math.max(0, r));
            dstData[dstOff + 1] = Math.min(255, Math.max(0, g));
            dstData[dstOff + 2] = Math.min(255, Math.max(0, b));
            dstData[dstOff + 3] = a;
          }
        }

        ctx.putImageData(dstImgData, 0, 0);
        
        resolve(canvas.toDataURL('image/png', 0.95));
      } catch (err) {
        console.error('Enhancement failed, returning original', err);
        resolve(dataUrl); // Fallback to original
      }
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}
