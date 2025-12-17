import { ref, uploadBytes, getDownloadURL, deleteObject, listAll } from 'firebase/storage';
import { storage } from './config';

export const storageService = {
  // Upload image
  uploadImage: async (uri, path) => {
    try {
      // Convert URI to blob
      const response = await fetch(uri);
      const blob = await response.blob();

      // Create reference
      const storageRef = ref(storage, path);

      // Upload file
      await uploadBytes(storageRef, blob);

      // Get download URL
      const downloadURL = await getDownloadURL(storageRef);

      return {
        success: true,
        url: downloadURL,
        path: path
      };
    } catch (error) {
      console.error('Upload error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Upload food item image
  uploadFoodImage: async (uri, itemId) => {
    const timestamp = Date.now();
    const path = `food-items/${itemId}_${timestamp}.jpg`;
    return await storageService.uploadImage(uri, path);
  },

  // Upload user profile image
  uploadProfileImage: async (uri, userId) => {
    const timestamp = Date.now();
    const path = `profiles/${userId}_${timestamp}.jpg`;
    return await storageService.uploadImage(uri, path);
  },

  // Upload restaurant image
  uploadRestaurantImage: async (uri, imageType) => {
    const timestamp = Date.now();
    const path = `restaurant/${imageType}_${timestamp}.jpg`;
    return await storageService.uploadImage(uri, path);
  },

  // Delete image
  deleteImage: async (path) => {
    try {
      const storageRef = ref(storage, path);
      await deleteObject(storageRef);

      return {
        success: true,
        message: 'Image deleted successfully'
      };
    } catch (error) {
      console.error('Delete error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Delete image by URL
  deleteImageByURL: async (url) => {
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
    } catch (error) {
      console.error('Delete by URL error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Get image URL
  getImageURL: async (path) => {
    try {
      const storageRef = ref(storage, path);
      const url = await getDownloadURL(storageRef);

      return {
        success: true,
        url: url
      };
    } catch (error) {
      console.error('Get URL error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // List images in a folder
  listImages: async (folderPath) => {
    try {
      const storageRef = ref(storage, folderPath);
      const result = await listAll(storageRef);

      const urls = await Promise.all(
        result.items.map(async (itemRef) => {
          const url = await getDownloadURL(itemRef);
          return {
            name: itemRef.name,
            path: itemRef.fullPath,
            url: url
          };
        })
      );

      return {
        success: true,
        images: urls
      };
    } catch (error) {
      console.error('List images error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Upload multiple images
  uploadMultipleImages: async (uriArray, basePath) => {
    try {
      const uploadPromises = uriArray.map((uri, index) => {
        const timestamp = Date.now();
        const path = `${basePath}/image_${index}_${timestamp}.jpg`;
        return storageService.uploadImage(uri, path);
      });

      const results = await Promise.all(uploadPromises);
      const successful = results.filter(r => r.success);
      const failed = results.filter(r => !r.success);

      return {
        success: failed.length === 0,
        uploaded: successful.length,
        failed: failed.length,
        urls: successful.map(r => r.url),
        errors: failed.map(r => r.error)
      };
    } catch (error) {
      console.error('Multiple upload error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Compress image before upload (basic implementation)
  compressImage: async (uri, quality = 0.7) => {
    try {
      // This is a placeholder - in production, use a proper image compression library
      // like expo-image-manipulator or react-native-image-resizer
      
      // For now, just return the original URI
      return {
        success: true,
        uri: uri
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Generate thumbnail
  generateThumbnail: async (uri, width = 200, height = 200) => {
    try {
      // Placeholder - in production, implement actual thumbnail generation
      // using expo-image-manipulator or similar library
      
      return {
        success: true,
        uri: uri
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Get file size
  getFileSize: async (uri) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const sizeInBytes = blob.size;
      const sizeInMB = (sizeInBytes / (1024 * 1024)).toFixed(2);

      return {
        success: true,
        bytes: sizeInBytes,
        mb: sizeInMB
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Validate image
  validateImage: async (uri, maxSizeMB = 5) => {
    try {
      const sizeResult = await storageService.getFileSize(uri);
      
      if (!sizeResult.success) {
        return {
          isValid: false,
          error: 'Could not determine file size'
        };
      }

      if (parseFloat(sizeResult.mb) > maxSizeMB) {
        return {
          isValid: false,
          error: `File size exceeds ${maxSizeMB}MB limit`
        };
      }

      // Check if it's actually an image
      const response = await fetch(uri);
      const blob = await response.blob();
      
      if (!blob.type.startsWith('image/')) {
        return {
          isValid: false,
          error: 'File is not an image'
        };
      }

      return {
        isValid: true,
        size: sizeResult.mb,
        type: blob.type
      };
    } catch (error) {
      return {
        isValid: false,
        error: error.message
      };
    }
  },

  // Clean up old images
  cleanupOldImages: async (folderPath, daysOld = 30) => {
    try {
      const storageRef = ref(storage, folderPath);
      const result = await listAll(storageRef);

      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      const deletePromises = result.items.map(async (itemRef) => {
        const metadata = await itemRef.getMetadata();
        const uploadDate = new Date(metadata.timeCreated);

        if (uploadDate < cutoffDate) {
          await deleteObject(itemRef);
          return { deleted: true, name: itemRef.name };
        }
        return { deleted: false, name: itemRef.name };
      });

      const results = await Promise.all(deletePromises);
      const deletedCount = results.filter(r => r.deleted).length;

      return {
        success: true,
        deletedCount: deletedCount,
        message: `Cleaned up ${deletedCount} old images`
      };
    } catch (error) {
      console.error('Cleanup error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
};

// Helper function to extract path from Firebase Storage URL
function extractPathFromURL(url) {
  try {
    const baseUrl = 'https://firebasestorage.googleapis.com/v0/b/';
    if (!url.startsWith(baseUrl)) return null;

    const pathStart = url.indexOf('/o/') + 3;
    const pathEnd = url.indexOf('?');
    
    if (pathStart === -1 || pathEnd === -1) return null;

    const encodedPath = url.substring(pathStart, pathEnd);
    return decodeURIComponent(encodedPath);
  } catch (error) {
    console.error('Extract path error:', error);
    return null;
  }
}

export default storageService;