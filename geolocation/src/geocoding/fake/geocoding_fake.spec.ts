import { GeocodingFakeImplementation } from './geocoding_fake';
import { GeocodingAddress } from '../models/address_osm';

describe('GeocodingFakeImplementation', () => {
  let geocoding: GeocodingFakeImplementation;

  beforeEach(() => {
    geocoding = new GeocodingFakeImplementation();
  });

  describe('reverseGeocoding', () => {
    it('should return a fake address with suburb, town and city', async () => {
      const result = await geocoding.reverseGeocoding({
        latitude: 4.0528,
        longitude: 9.7173,
      });

      expect(result).toBeInstanceOf(GeocodingAddress);
      expect(result?.suburb).toBe('New Deido');
      expect(result?.town).toBe('Deido');
      expect(result?.city).toBe('Douala I');
    });

    it('should return same address regardless of coordinates', async () => {
      const result1 = await geocoding.reverseGeocoding({
        latitude: 0,
        longitude: 0,
      });

      const result2 = await geocoding.reverseGeocoding({
        latitude: 10,
        longitude: 10,
      });

      expect(result1?.suburb).toBe(result2?.suburb);
      expect(result1?.town).toBe(result2?.town);
      expect(result1?.city).toBe(result2?.city);
    });

    it('should return null countryCode', async () => {
      const result = await geocoding.reverseGeocoding({
        latitude: 4.0528,
        longitude: 9.7173,
      });

      expect(result?.countryCode).toBeNull();
    });
  });
});
