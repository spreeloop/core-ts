/**
 * Representation of a geocoding address.
 */
export class GeocodingAddress {
  /** The stored key ref for the suburb property. */
  static readonly keySuburb = 'suburb';

  /** The stored key ref for the town property. */
  static readonly keyTown = 'town';

  /** The stored key ref for the city property. */
  static readonly keyCity = 'city';

  /** The stored key ref for the countryCode property. */
  static readonly keyCountryCode = 'countryCode';

  /** The sub-road's name. */
  suburb: string | null;

  /** The town's name. */
  town: string | null;

  /** The city's name. */
  city: string | null;

  /** The country code. */
  countryCode: string | null;

  /**
   * Constructs a new GeocodingAddress.
   * @param {Record<string, unknown>} json The JSON object.
   */
  constructor(json: Record<string, unknown>) {
    this.suburb = (json[GeocodingAddress.keySuburb] as string) ?? null;
    this.town = (json[GeocodingAddress.keyTown] as string) ?? null;
    this.city = (json[GeocodingAddress.keyCity] as string) ?? null;
    this.countryCode =
      (json[GeocodingAddress.keyCountryCode] as string) ?? null;
  }

  /**
   * Returns the JSON representation of the GeocodingAddress.
   * @return {Record<string, string | null>} The JSON representation.
   */
  toJson(): Record<string, string | null> {
    return {
      [GeocodingAddress.keySuburb]: this.suburb,
      [GeocodingAddress.keyTown]: this.town,
      [GeocodingAddress.keyCity]: this.city,
      [GeocodingAddress.keyCountryCode]: this.countryCode,
    };
  }

  /**
   * Returns string that contains suburb, town and city.
   * @return {string} The formatted string.
   */
  suburbTownCity(): string {
    const result: string[] = [];
    if (this.suburb) {
      result.push(this.suburb);
    }
    if (this.town) {
      result.push(this.town);
    }
    if (this.city) {
      result.push(this.city);
    }

    if (result.length === 0) {
      return '';
    }

    return result.join(', ');
  }
}
