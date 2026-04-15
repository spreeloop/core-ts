import { FakeStorage } from './implementations/fake/fake';
import { FirebaseStorage } from './implementations/firebase/firebase';
import { Storage as NativeStorage } from 'firebase-admin/storage';
import { FunctionResponse } from './implementations/utils/operation_response';

export type GenerateDownloadURLResponse = FunctionResponse<string, string>;

/**
 * Factory for Storage implementations.
 */
export abstract class Storage {
  /**
   * Constructs a new Fake storage.
   * @return {FakeDatabase}
   */
  static createFake(): Storage {
    return new FakeStorage();
  }

  /**
   * Constructs a new Firebase storage.
   * @param {class} storage The Firebase storage.
   * @return {FirebaseStorage}
   */
  static createFirebaseStorage(storage: NativeStorage): Storage {
    return new FirebaseStorage(storage);
  }

  /**
   * Generates a non-expiring download URL for files stored in your buckets.
   * Anyone with this URL can permanently access the file.
   * @param {string} filePath The file path.
   * @return {string} The download url.
   */
  abstract generateDownloadURL(
    filePath: string
  ): Promise<GenerateDownloadURLResponse>;
}
