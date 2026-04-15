import { GenerateDownloadURLResponse, Storage } from '../../storage';
import {
  Storage as NativeStorage,
  getDownloadURL,
} from 'firebase-admin/storage';

/**
 * Firebase implementation of Storage.
 */
export class FirebaseStorage implements Storage {
  /**
   * Constructs a new Firebase storage.
   * @param {Function} storage The Firebase storage.
   */
  constructor(private storage: NativeStorage) {}

  /**
   * Generates a non-expiring download URL for files stored in your buckets.
   * Anyone with this URL can permanently access the file.
   * @param {string} filePath The file path.
   * @return {string} The download url.
   */
  async generateDownloadURL(
    filePath: string
  ): Promise<GenerateDownloadURLResponse> {
    const fileRef = this.storage.bucket().file(filePath);
    try {
      const downloadURL = await getDownloadURL(fileRef);
      return { data: downloadURL, raw: downloadURL };
    } catch (error) {
      return { error: error };
    }
  }
}
