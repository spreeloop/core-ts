import axios, { AxiosResponse } from 'axios';
import { GeocodingInterface, UserAgent } from '../../geocoding';
import { GeocodingAddress } from '../models/address_osm';
import { GeocodingResultOSM } from '../models/result_osm';

/**
 * An implementation of GeocodingInterface that uses Open street map to
 * retrieve the address.
 * Link to API documentation : https://nominatim.org/release-docs/latest/api/Reverse/.
 */
export class GeocodingOpenStreetMapImplementation
  implements GeocodingInterface
{
  private readonly userAgent: UserAgent;

  /**
   * Open Street map's Api endpoint url for geocoding.
   */
  private readonly url = 'nominatim.openstreetmap.org';

  /**
   * Constructs a new GeocodingOpenStreetMapImplementation.
   * @param {UserAgent} userAgent The user agent.
   */
  constructor(userAgent: UserAgent) {
    this.userAgent = userAgent;
  }

  /**
   * Retry mechanism for HTTP requests with exponential backoff.
   * Retries on 403 status codes, max 5 retries with increasing delay.
   * @param {Function} requestFunction The request function to retry.
   * @return {Promise<T>} The response.
   */
  private async retryHttpRequest<T>(
    requestFunction: () => Promise<T>
  ): Promise<T> {
    const maxRetries = 5;
    const forbiddenStatusCode = 403;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const response = await requestFunction();

        // Check if response is an HTTP response with status code
        if (
          typeof response === 'object' &&
          response !== null &&
          'status' in response
        ) {
          const status = (response as { status: number }).status;

          // If status is 403 and we haven't exceeded max retries, wait and retry.
          if (status === forbiddenStatusCode && attempt < maxRetries - 1) {
            const delayMs = (attempt + 1) * 1000;
            console.log(
              `RETRY ${attempt + 1}/${maxRetries} after ${delayMs}ms due to 403`
            );
            await new Promise((resolve) => setTimeout(resolve, delayMs));
            continue;
          }
        }

        // Return response (success or non-403 error).
        return response;
      } catch (e) {
        // If it's the last attempt or not a network error, rethrow.
        if (attempt === maxRetries - 1) {
          throw e;
        }
        // For network errors, wait and retry.
        const delayMs = (attempt + 1) * 1000;
        console.error(
          `RETRY ${attempt + 1}/${maxRetries} after ${delayMs}ms due to error:`,
          e
        );
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }

    // This should never be reached, but just in case.
    throw new Error('Max retries exceeded');
  }

  /**
   * Gets a geocoding's address with a pair latitude and longitude.
   */
  async reverseGeocoding({
    latitude,
    longitude,
  }: {
    latitude: number;
    longitude: number;
  }): Promise<GeocodingAddress | null> {
    const urlParams = '/reverse';
    const dataParams = new URLSearchParams({
      lat: latitude.toString(),
      lon: longitude.toString(),
      format: 'jsonv2',
    });

    const uri = `https://${this.url}${urlParams}?${dataParams.toString()}`;

    try {
      const response = await this.retryHttpRequest<AxiosResponse>(() =>
        axios.get(uri, {
          headers: {
            'User-Agent': `${this.userAgent.applicationName}/${this.userAgent.version} (${this.userAgent.build})`,
            From: this.userAgent.supportContact,
          },
        })
      );

      const okStatusCode = 200;
      if (response.status === okStatusCode) {
        const body = response.data;
        const result = new GeocodingResultOSM(body);

        return new GeocodingAddress({
          [GeocodingAddress.keySuburb]: result.addressOSM?.suburb ?? null,
          [GeocodingAddress.keyTown]: result.addressOSM?.town ?? null,
          [GeocodingAddress.keyCity]: result.addressOSM?.city ?? null,
          [GeocodingAddress.keyCountryCode]:
            result.addressOSM?.countryCode ?? null,
        });
      }
    } catch (e) {
      console.error(e);
      return null;
    }

    return null;
  }
}
