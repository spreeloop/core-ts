import { GenerateDownloadURLResponse, Storage } from '../../storage';

/**
 * Fake implementation of Storage.
 */
export class FakeStorage implements Storage {
  /**
   * Generates a non-expiring download URL for files stored in your buckets.
   * Anyone with this URL can permanently access the file.
   * @return {string} The download url.
   */
  async generateDownloadURL(): Promise<GenerateDownloadURLResponse> {
    const url =
      'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png';
    return { data: url, raw: url };
  }
}
