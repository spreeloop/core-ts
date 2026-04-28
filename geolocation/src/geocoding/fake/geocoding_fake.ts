import { Geocoding } from '../../geocoding';
import { GeocodingAddress } from '../models/address_osm';

/**
 * An implementation of GeocodingInterface that uses fake data to
 * retrieve the address.
 */
export class GeocodingFakeImplementation implements Geocoding {
  private readonly geocodingLocation: Record<string, unknown> = {
    place_id: 116070976,
    licence:
      'Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright',
    osm_type: 'way',
    osm_id: 59068016,
    lat: '4.052851963460176',
    lon: '9.717363661147893',
    place_rank: 26,
    category: 'highway',
    type: 'residential',
    importance: 0.09999999999999998,
    addresstype: 'road',
    name: 'Rue 1.769',
    display_name:
      'Rue 1.769, New Deido, Deido, Douala I, ' +
      'Communauté urbaine de Douala, Wouri,' +
      ' Littoral, 12695 DLA, Cameroun',
    address: {
      road: 'Rue 1.769',
      suburb: 'New Deido',
      town: 'Deido',
      city: 'Douala I',
      municipality: 'Communauté urbaine de Douala',
      county: 'Wouri',
      state: 'Littoral',
      postcode: '12695 DLA',
      country: 'Cameroun',
      country_code: 'cm',
    },
    boundingbox: ['4.0528345', '4.0540089', '9.7171661', '9.7188426'],
  };

  /**
   * Gets a fake geocoding's address.
   */
  async reverseGeocoding({
    latitude: _latitude,
    longitude: _longitude,
  }: {
    latitude: number;
    longitude: number;
  }): Promise<GeocodingAddress | null> {
    const address = this.geocodingLocation['address'] as Record<string, string>;

    return new GeocodingAddress({
      [GeocodingAddress.keySuburb]: address[GeocodingAddress.keySuburb] ?? null,
      [GeocodingAddress.keyTown]: address[GeocodingAddress.keyTown] ?? null,
      [GeocodingAddress.keyCity]: address[GeocodingAddress.keyCity] ?? null,
    });
  }
}
