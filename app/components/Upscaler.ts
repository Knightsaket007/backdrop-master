export const upscaleImage = (src: string, scale = 2): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        try {
          // Create a temporary canvas for initial processing
          const tempCanvas = document.createElement('canvas');
          const tempCtx = tempCanvas.getContext('2d')!;
          
          // First pass - scale up in steps for better quality
          let currentWidth = img.width;
          let currentHeight = img.height;
          tempCanvas.width = currentWidth;
          tempCanvas.height = currentHeight;
          tempCtx.drawImage(img, 0, 0);
          
          // Step-wise scaling (better quality than one big jump)
          while (currentWidth * 2 <= img.width * scale) {
            currentWidth *= 2;
            currentHeight *= 2;
            const tempCanvas2 = document.createElement('canvas');
            tempCanvas2.width = currentWidth;
            tempCanvas2.height = currentHeight;
            const tempCtx2 = tempCanvas2.getContext('2d')!;
            tempCtx2.imageSmoothingEnabled = true;
            tempCtx2.imageSmoothingQuality = 'high';
            tempCtx2.drawImage(tempCanvas, 0, 0, currentWidth, currentHeight);
            tempCanvas.width = currentWidth;
            tempCanvas.height = currentHeight;
            tempCtx.drawImage(tempCanvas2, 0, 0);
          }
          
          // Final scaling to exact size
          const finalCanvas = document.createElement('canvas');
          finalCanvas.width = img.width * scale;
          finalCanvas.height = img.height * scale;
          const finalCtx = finalCanvas.getContext('2d')!;
          
          // Apply high-quality rendering settings
          finalCtx.imageSmoothingEnabled = true;
          finalCtx.imageSmoothingQuality = 'high';
          
          // Apply sharpening effect
          finalCtx.drawImage(tempCanvas, 0, 0, finalCanvas.width, finalCanvas.height);
          
          // Optional: Apply a subtle sharpening effect
          if (scale > 1.5) {
            try {
              // This is a simple sharpening technique - for more advanced effects
              // you might want to use a WebGL solution or WASM-based library
              finalCtx.globalCompositeOperation = 'overlay';
              finalCtx.filter = 'blur(0.5px)';
              finalCtx.drawImage(finalCanvas, 0, 0);
              finalCtx.globalCompositeOperation = 'source-over';
              finalCtx.filter = 'none';
            } catch (e) {
              console.log('Filter not supported in this browser');
            }
          }
          
          resolve(finalCanvas.toDataURL('image/png', 1.0));
        } catch (error) {
          reject(error);
        }
      };
      img.onerror = reject;
      img.src = src;
    });
  };