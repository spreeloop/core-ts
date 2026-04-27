import { GenerateDownloadURLResponse, Storage } from '../../storage';

/**
 * Fake implementation of Storage.
 */
export class FakeStorage implements Storage {
  /**
   * Generates a non-expiring download URL for files stored in your buckets.
   * Anyone with this URL can permanently access the file.
   * @param {string} filePath The file path.
   * @return {string} The download url.
   */
  async generateDownloadURL(
    filePath?: string | null | undefined
  ): Promise<GenerateDownloadURLResponse> {
    const url = filePath
      ? filePath
      : 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png';
    return { data: url, raw: url };
  }
}
