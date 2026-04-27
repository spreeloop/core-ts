import { FakeStorage } from './implementations/fake/fake';
import { FirebaseStorage } from './implementations/firebase/firebase';
import { FirebaseClientStorage } from './implementations/firebase_client/firebase_client';
import { Storage as NativeStorage } from 'firebase-admin/storage';
import { FirebaseStorage as ClientStorage } from 'firebase/storage';
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
   * Constructs a new Firebase client storage.
   * @param {FirebaseStorage} storage The Firebase client storage instance.
   * @return {FirebaseClientStorage}
   */
  static createFirebaseClientStorage(storage: ClientStorage): Storage {
    return new FirebaseClientStorage(storage);
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
