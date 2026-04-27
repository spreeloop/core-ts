import { GeocodingOpenStreetMapImplementation } from './geocoding/osm/geocoding_osm';
import { GeocodingAddress } from './geocoding/models/address_osm';
import { GeocodingFakeImplementation } from './geocoding/fake/geocoding_fake';

/**
 * The user Agent.
 */
export interface UserAgent {
  applicationName: string;
  supportContact: string;
  version: string;
  build: string;
}

/**
 * Service providing the user's geocoding.
 */
export abstract class Geocoding {
  /**
   * Constructs a new Fake storage.
   * @return {Geocoding}
   */
  static createFake(): Geocoding {
    return new GeocodingFakeImplementation();
  }

  /**
   * Constructs a new OpenStreetMap storage.
   * @param {UserAgent} userAgent The user agent.
   * @return {Geocoding}
   */
  static createOpenStreetMap(userAgent: UserAgent): Geocoding {
    return new GeocodingOpenStreetMapImplementation(userAgent);
  }

  /**
   * Gets a geocoding's address with a pair latitude and longitude.
   * @param {object} params The long and lat.
   * @return {Promise<GeocodingAddress | null>}
   */
  abstract reverseGeocoding(params: {
    latitude: number;
    longitude: number;
  }): Promise<GeocodingAddress | null>;
}
