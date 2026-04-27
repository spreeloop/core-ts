import axios from 'axios';
import { GeocodingOpenStreetMapImplementation } from './geocoding_osm';
import { GeocodingAddress } from '../models/address_osm';
import { UserAgent } from '../../geocoding';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('GeocodingOpenStreetMapImplementation', () => {
  const mockUserAgent: UserAgent = {
    applicationName: 'test-app',
    supportContact: 'test@example.com',
    version: '1.0.0',
    build: '123',
  };

  let geocoding: GeocodingOpenStreetMapImplementation;

  beforeEach(() => {
    geocoding = new GeocodingOpenStreetMapImplementation(mockUserAgent);
    jest.clearAllMocks();
  });

  describe('reverseGeocoding', () => {
    it('should return address when API call is successful', async () => {
      const mockResponse = {
        status: 200,
        data: {
          place_id: 123,
          address: {
            suburb: 'Test Suburb',
            town: 'Test Town',
            city: 'Test City',
            country_code: 'cm',
          },
        },
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await geocoding.reverseGeocoding({
        latitude: 4.0528,
        longitude: 9.7173,
      });

      expect(result).toBeInstanceOf(GeocodingAddress);
      expect(result?.suburb).toBe('Test Suburb');
      expect(result?.town).toBe('Test Town');
      expect(result?.city).toBe('Test City');
      expect(result?.countryCode).toBe('cm');
    });

    it('should return null when API returns non-200 status', async () => {
      const mockResponse = {
        status: 404,
        data: {},
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await geocoding.reverseGeocoding({
        latitude: 4.0528,
        longitude: 9.7173,
      });

      expect(result).toBeNull();
    });

    it('should return null when API call fails', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      mockedAxios.get.mockRejectedValue(new Error('Network error'));

      const result = await geocoding.reverseGeocoding({
        latitude: 4.0528,
        longitude: 9.7173,
      });

      expect(result).toBeNull();
      expect(mockedAxios.get).toHaveBeenCalledTimes(5);
      consoleSpy.mockRestore();
    }, 15000);

    it('should handle address with missing fields', async () => {
      const mockResponse = {
        status: 200,
        data: {
          place_id: 123,
          address: {
            city: 'Test City',
          },
        },
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await geocoding.reverseGeocoding({
        latitude: 4.0528,
        longitude: 9.7173,
      });

      expect(result).toBeInstanceOf(GeocodingAddress);
      expect(result?.suburb).toBeNull();
      expect(result?.town).toBeNull();
      expect(result?.city).toBe('Test City');
      expect(result?.countryCode).toBeNull();
    });

    it('should call API with correct parameters', async () => {
      const mockResponse = {
        status: 200,
        data: {
          address: {
            city: 'Douala',
          },
        },
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      await geocoding.reverseGeocoding({
        latitude: 4.0528,
        longitude: 9.7173,
      });

      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://nominatim.openstreetmap.org/reverse?lat=4.0528&lon=9.7173&format=jsonv2',
        {
          headers: {
            'User-Agent': 'test-app/1.0.0 (123)',
            From: 'test@example.com',
          },
        }
      );
    });
  });
});
