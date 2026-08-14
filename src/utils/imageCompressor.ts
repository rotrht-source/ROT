/**
 * Utility to compress images (Files or Data URLs) using HTML Canvas
 * to prevent localStorage quota exceeded errors.
 */

export function compressImage(
  input: File | string,
  maxWidth = 500,
  maxHeight = 500,
  quality = 0.55
): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();

    const processImage = () => {
      let width = img.width;
      let height = img.height;

      if (width > maxWidth || height > maxHeight) {
        if (width / height > maxWidth / maxHeight) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        // Fallback if canvas context fails
        resolve(typeof input === 'string' ? input : '');
        return;
      }

      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);

      // Export compressed image as JPEG
      const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
      resolve(compressedDataUrl);
    };

    img.onerror = () => {
      // Fallback if image fails to load
      resolve(typeof input === 'string' ? input : '');
    };

    img.onload = () => {
      processImage();
    };

    if (typeof input === 'string') {
      // Input is already a data URL or image URL
      if (!input.startsWith('data:image')) {
        // External HTTP/HTTPS URL, no need to compress
        resolve(input);
        return;
      }
      img.src = input;
    } else {
      // Input is a File
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result && typeof e.target.result === 'string') {
          img.src = e.target.result;
        } else {
          resolve('');
        }
      };
      reader.onerror = () => resolve('');
      reader.readAsDataURL(input);
    }
  });
}
