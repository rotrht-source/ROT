import { compressImage } from './imageCompressor';
import { uploadToImgBB } from './imgbbService';

export interface SmartUploadResult {
  url: string;
  source: 'imgbb' | 'compressed_canvas' | 'direct';
}

/**
 * Handles image selection from File inputs.
 * 1. Pre-compresses image locally for fast client response.
 * 2. Attempts direct upload to ImgBB for permanent CDN hosting.
 * 3. Falls back gracefully to locally compressed data URL if network fails.
 */
export async function uploadImageSmart(
  file: File,
  onProgressState?: (isUploading: boolean) => void
): Promise<string> {
  if (onProgressState) onProgressState(true);

  try {
    // Step 1: Compress for optimal web display & fast payload
    const localCompressed = await compressImage(file, 900, 900, 0.75);

    // Step 2: Upload to ImgBB
    const imgbbRes = await uploadToImgBB(localCompressed);

    if (imgbbRes && imgbbRes.success && imgbbRes.url) {
      if (onProgressState) onProgressState(false);
      return imgbbRes.url;
    }

    // Step 3: Fallback to local compressed format
    console.info('Using local compressed fallback for image');
    if (onProgressState) onProgressState(false);
    return localCompressed;
  } catch (error) {
    console.error('Smart image upload error:', error);
    if (onProgressState) onProgressState(false);
    // Ultimate fallback
    return await compressImage(file, 800, 800, 0.6);
  }
}
