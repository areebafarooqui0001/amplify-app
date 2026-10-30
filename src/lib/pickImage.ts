import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

// Opens the photo library and returns the chosen image's uri, or null.
// Basic validation: image type and file size. Errors are explained, never silent.
export async function pickValidatedImage(): Promise<string | null> {
  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8
    });
    if (result.canceled || !result.assets || result.assets.length === 0) return null;
    const asset = result.assets[0];
    if (asset.mimeType && !ALLOWED_TYPES.includes(asset.mimeType)) {
      Alert.alert('Unsupported file', 'Please choose a JPG, PNG or WebP image.');
      return null;
    }
    if (asset.fileSize && asset.fileSize > MAX_BYTES) {
      Alert.alert('Image too large', 'Please choose an image under 5 MB.');
      return null;
    }
    return asset.uri;
  } catch {
    Alert.alert('Could not open your photos', 'Please try again, or use one of the sample images.');
    return null;
  }
}
