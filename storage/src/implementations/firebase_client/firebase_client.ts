import { GenerateDownloadURLResponse, Storage } from '../../storage';
import { FirebaseStorage, getDownloadURL, ref } from 'firebase/storage';

/**
 * Firebase client SDK implementation of Storage.
 */
export class FirebaseClientStorage implements Storage {
  /**
   * Constructs a new Firebase client storage.
   * @param {FirebaseStorage} storage The Firebase client storage instance.
   */
  constructor(private storage: FirebaseStorage) {}

  /**
   * Generates a non-expiring download URL for files stored in your buckets.
   * Anyone with this URL can permanently access the file.
   * @param {string} filePath The file path.
   * @return {string} The download url.
   */
  async generateDownloadURL(
    filePath: string
  ): Promise<GenerateDownloadURLResponse> {
    const fileRef = ref(this.storage, filePath);
    try {
      const downloadURL = await getDownloadURL(fileRef);
      return { data: downloadURL, raw: downloadURL };
    } catch (error) {
      return { error: error };
    }
  }
}
