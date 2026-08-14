/**
 * ImgBB Image Upload Service
 * Supports direct image upload to ImgBB via their public V1 API.
 * Users can use the provided default API key or input their own in settings.
 */

const DEFAULT_IMGBB_API_KEY = '5a66caeeff5e0d4bb883b6fa0fca8eef';
const IMGBB_KEY_STORAGE = 'imgbb_custom_api_key';

export function getImgbbApiKey(): string {
  try {
    const custom = localStorage.getItem(IMGBB_KEY_STORAGE);
    if (custom && custom.trim().length > 5) {
      return custom.trim();
    }
  } catch (e) {
    // Ignore localStorage read error
  }
  return DEFAULT_IMGBB_API_KEY;
}

export function setImgbbApiKey(key: string): void {
  try {
    if (!key || key.trim() === '') {
      localStorage.removeItem(IMGBB_KEY_STORAGE);
    } else {
      localStorage.setItem(IMGBB_KEY_STORAGE, key.trim());
    }
  } catch (e) {
    console.warn('Failed to save ImgBB key to localStorage', e);
  }
}

export interface ImgBBUploadResponse {
  success: boolean;
  url?: string;
  display_url?: string;
  thumb_url?: string;
  delete_url?: string;
  error?: string;
}

/**
 * Uploads an image (File, Blob, or base64 Data URL) directly to ImgBB
 */
export async function uploadToImgBB(
  input: File | Blob | string,
  apiKey?: string
): Promise<ImgBBUploadResponse> {
  const key = apiKey || getImgbbApiKey();

  try {
    const formData = new FormData();

    if (typeof input === 'string') {
      // If it's a data URL, strip the prefix 'data:image/...;base64,'
      const base64Clean = input.replace(/^data:image\/[a-z]+;base64,/, '');
      formData.append('image', base64Clean);
    } else {
      formData.append('image', input);
    }

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${key}`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (data && data.success && data.data) {
      return {
        success: true,
        url: data.data.url,
        display_url: data.data.display_url || data.data.url,
        thumb_url: data.data.thumb?.url || data.data.url,
        delete_url: data.data.delete_url,
      };
    } else {
      const errorMsg = data?.error?.message || 'ImgBB upload failed';
      console.warn('ImgBB Upload Error:', errorMsg);
      return {
        success: false,
        error: errorMsg,
      };
    }
  } catch (err: any) {
    console.error('ImgBB Network/Upload Exception:', err);
    return {
      success: false,
      error: err?.message || 'Network error during image upload to ImgBB',
    };
  }
}
