import { deleteObject, getDownloadURL, listAll, ListResult, ref, StorageReference, uploadBytes } from 'firebase/storage';
import { storage } from './config';

// Types
interface UploadResult {
  success: boolean;
  url?: string;
  path?: string;
  error?: string;
}

interface DeleteResult {
  success: boolean;
  message?: string;
  error?: string;
}

interface GetUrlResult {
  success: boolean;
  url?: string;
  error?: string;
}

interface ListImagesResult {
  success: boolean;
  images?: string[];
  error?: string;
}

// Helper function to extract path from URL
const extractPathFromURL = (url: string): string | null => {
  try {
    const decodedUrl = decodeURIComponent(url);
    const match = decodedUrl.match(/o\/(.+?)\?/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
};

export const storageService = {
  // Upload image
  uploadImage: async (uri: string, path: string): Promise<UploadResult> => {
    try {
      // Convert URI to blob
      const response = await fetch(uri);
      const blob = await response.blob();

      // Create reference
      const storageRef: StorageReference = ref(storage, path);

      // Upload file
      await uploadBytes(storageRef, blob);

      // Get download URL
      const downloadURL = await getDownloadURL(storageRef);

      return {
        success: true,
        url: downloadURL,
        path: path
      };
    } catch (error: any) {
      console.error('Upload error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Upload food item image
  uploadFoodImage: async (uri: string, itemId: string): Promise<UploadResult> => {
    const timestamp = Date.now();
    const path = `food-items/${itemId}_${timestamp}.jpg`;
    return await storageService.uploadImage(uri, path);
  },

  // Upload user profile image
  uploadProfileImage: async (uri: string, userId: string): Promise<UploadResult> => {
    const timestamp = Date.now();
    const path = `profiles/${userId}_${timestamp}.jpg`;
    return await storageService.uploadImage(uri, path);
  },

  // Upload restaurant image
  uploadRestaurantImage: async (uri: string, imageType: string): Promise<UploadResult> => {
    const timestamp = Date.now();
    const path = `restaurant/${imageType}_${timestamp}.jpg`;
    return await storageService.uploadImage(uri, path);
  },

  // Delete image
  deleteImage: async (path: string): Promise<DeleteResult> => {
    try {
      const storageRef: StorageReference = ref(storage, path);
      await deleteObject(storageRef);

      return {
        success: true,
        message: 'Image deleted successfully'
      };
    } catch (error: any) {
      console.error('Delete error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Delete image by URL
  deleteImageByURL: async (url: string): Promise<DeleteResult> => {
    try {
      // Extract path from URL
      const path = extractPathFromURL(url);
      if (!path) {
        return {
          success: false,
          error: 'Invalid URL'
        };
      }

      return await storageService.deleteImage(path);
    } catch (error: any) {
      console.error('Delete by URL error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Get image URL
  getImageURL: async (path: string): Promise<GetUrlResult> => {
    try {
      const storageRef: StorageReference = ref(storage, path);
      const url = await getDownloadURL(storageRef);

      return {
        success: true,
        url: url
      };
    } catch (error: any) {
      console.error('Get URL error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // List all images in a folder
  listImages: async (folderPath: string): Promise<ListImagesResult> => {
    try {
      const folderRef: StorageReference = ref(storage, folderPath);
      const result: ListResult = await listAll(folderRef);
      
      const images: string[] = [];
      for (const itemRef of result.items) {
        const url = await getDownloadURL(itemRef);
        images.push(url);
      }

      return {
        success: true,
        images: images
      };
    } catch (error: any) {
      console.error('List images error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Check if image exists
  imageExists: async (path: string): Promise<boolean> => {
    try {
      const storageRef: StorageReference = ref(storage, path);
      await getDownloadURL(storageRef);
      return true;
    } catch {
      return false;
    }
  },

  // Generate unique file name
  generateFileName: (prefix: string, extension: string = 'jpg'): string => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `${prefix}_${timestamp}_${random}.${extension}`;
  }
};

export default storageService;
