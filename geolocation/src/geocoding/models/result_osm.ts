/**
 * Representation of geocoding's result's open street map.
 */
export class GeocodingResultOSM {
  /** The stored key ref for the placeId property. */
  static readonly keyPlaceId = 'place_id';

  /** The stored key ref for the osmType property. */
  static readonly keyOsmType = 'osm_type';

  /** The stored key ref for the osmId property. */
  static readonly keyOsmId = 'osm_id';

  /** The stored key ref for the lat property. */
  static readonly keyLat = 'lat';

  /** The stored key ref for the lon property. */
  static readonly keyLon = 'lon';

  /** The stored key ref for the placeRank property. */
  static readonly keyPlaceRank = 'place_rank';

  /** The stored key ref for the category property. */
  static readonly keyCategory = 'category';

  /** The stored key ref for the type property. */
  static readonly keyType = 'type';

  /** The stored key ref for the importance property. */
  static readonly keyImportance = 'importance';

  /** The stored key ref for the addressType property. */
  static readonly keyAddressType = 'addresstype';

  /** The stored key ref for the name property. */
  static readonly keyName = 'name';

  /** The stored key ref for the displayName property. */
  static readonly keyDisplayName = 'display_name';

  /** The stored key ref for the addressOSM property. */
  static readonly keyAddress = 'address';

  /** The stored key ref for the boundingBox property. */
  static readonly keyBoundingBox = 'boundingbox';

  /** The place id. */
  placeId: number | null;

  /** The open street map type. */
  osmType: string | null;

  /** The open street map id. */
  osmId: number | null;

  /** The latitude. */
  lat: string;

  /** The longitude. */
  lon: string;

  /** The place rank. */
  placeRank: number | null;

  /** The category. */
  category: string | null;

  /** The type. */
  type: string | null;

  /** The importance. */
  importance: number | null;

  /** The address type. */
  addressType: string | null;

  /** The name. */
  name: string | null;

  /** The display name. */
  displayName: string | null;

  /** The address open street map. */
  addressOSM: AddressOSM | null;

  /** The bounding box. */
  boundingBox: string[] | null;

  /**
   * Constructs a new GeocodingResultOSM from object.
   * @param {Record<string, unknown>} json The JSON object.
   */
  constructor(json: Record<string, unknown>) {
    this.placeId = (json[GeocodingResultOSM.keyPlaceId] as number) ?? null;
    this.osmType = (json[GeocodingResultOSM.keyOsmType] as string) ?? null;
    this.osmId = (json[GeocodingResultOSM.keyOsmId] as number) ?? null;
    this.lat = (json[GeocodingResultOSM.keyLat] as string) ?? '';
    this.lon = (json[GeocodingResultOSM.keyLon] as string) ?? '';
    this.placeRank = (json[GeocodingResultOSM.keyPlaceRank] as number) ?? null;
    this.category = (json[GeocodingResultOSM.keyCategory] as string) ?? null;
    this.type = (json[GeocodingResultOSM.keyType] as string) ?? null;
    this.importance =
      typeof json[GeocodingResultOSM.keyImportance] === 'number'
        ? (json[GeocodingResultOSM.keyImportance] as number)
        : null;
    this.addressType =
      (json[GeocodingResultOSM.keyAddressType] as string) ?? null;
    this.name = (json[GeocodingResultOSM.keyName] as string) ?? null;
    this.displayName =
      (json[GeocodingResultOSM.keyDisplayName] as string) ?? null;
    this.addressOSM = json[GeocodingResultOSM.keyAddress]
      ? new AddressOSM(
          json[GeocodingResultOSM.keyAddress] as Record<string, unknown>
        )
      : null;
    this.boundingBox = json[GeocodingResultOSM.keyBoundingBox]
      ? (json[GeocodingResultOSM.keyBoundingBox] as string[])
      : null;
  }

  /**
   * Returns the JSON representation of the GeocodingResultOSM.
   * @return {Record<string, unknown>} The JSON representation.
   */
  toJson(): Record<string, unknown> {
    return {
      [GeocodingResultOSM.keyPlaceId]: this.placeId,
      [GeocodingResultOSM.keyOsmType]: this.osmType,
      [GeocodingResultOSM.keyOsmId]: this.osmId,
      [GeocodingResultOSM.keyLat]: this.lat,
      [GeocodingResultOSM.keyLon]: this.lon,
      [GeocodingResultOSM.keyPlaceRank]: this.placeRank,
      [GeocodingResultOSM.keyCategory]: this.category,
      [GeocodingResultOSM.keyType]: this.type,
      [GeocodingResultOSM.keyImportance]: this.importance,
      [GeocodingResultOSM.keyAddressType]: this.addressType,
      [GeocodingResultOSM.keyName]: this.name,
      [GeocodingResultOSM.keyDisplayName]: this.displayName,
      [GeocodingResultOSM.keyAddress]: this.addressOSM?.toJson() ?? null,
      [GeocodingResultOSM.keyBoundingBox]: this.boundingBox,
    };
  }
}

/**
 * Representation of a geocoding address with open street map.
 */
class AddressOSM {
  /** The stored key ref for the road property. */
  static readonly keyRoad = 'road';

  /** The stored key ref for the suburb property. */
  static readonly keySuburb = 'suburb';

  /** The stored key ref for the town property. */
  static readonly keyTown = 'town';

  /** The stored key ref for the city property. */
  static readonly keyCity = 'city';

  /** The stored key ref for the municipality property. */
  static readonly keyMunicipality = 'municipality';

  /** The stored key ref for the county property. */
  static readonly keyCounty = 'county';

  /** The stored key ref for the state property. */
  static readonly keyState = 'state';

  /** The stored key ref for the postCode property. */
  static readonly keyPostCode = 'postcode';

  /** The stored key ref for the country property. */
  static readonly keyCountry = 'country';

  /** The stored key ref for the countryCode property. */
  static readonly keyCountryCode = 'country_code';

  /** The road's name. */
  road: string | null;

  /** The sub-road's name. */
  suburb: string | null;

  /** The town's name. */
  town: string | null;

  /** The city's name. */
  city: string | null;

  /** The municipality's name. */
  municipality: string | null;

  /** The county's name. */
  county: string | null;

  /** The state's name. */
  state: string | null;

  /** The postal code. */
  postCode: string | null;

  /** The country's name. */
  country: string | null;

  /** The country code. */
  countryCode: string | null;

  /**
   * Constructs a new AddressOSM.
   * @param {Record<string, unknown>} json The JSON object.
   */
  constructor(json: Record<string, unknown>) {
    this.road = (json[AddressOSM.keyRoad] as string) ?? null;
    this.suburb = (json[AddressOSM.keySuburb] as string) ?? null;
    this.town = (json[AddressOSM.keyTown] as string) ?? null;
    this.city = (json[AddressOSM.keyCity] as string) ?? null;
    this.municipality = (json[AddressOSM.keyMunicipality] as string) ?? null;
    this.county = (json[AddressOSM.keyCounty] as string) ?? null;
    this.state = (json[AddressOSM.keyState] as string) ?? null;
    this.postCode = (json[AddressOSM.keyPostCode] as string) ?? null;
    this.country = (json[AddressOSM.keyCountry] as string) ?? null;
    this.countryCode = (json[AddressOSM.keyCountryCode] as string) ?? null;
  }

  /**
   * Returns the JSON representation of the AddressOSM.
   * @return {Record<string, string | null>} The JSON representation.
   */
  toJson(): Record<string, string | null> {
    return {
      [AddressOSM.keyRoad]: this.road,
      [AddressOSM.keySuburb]: this.suburb,
      [AddressOSM.keyTown]: this.town,
      [AddressOSM.keyCity]: this.city,
      [AddressOSM.keyMunicipality]: this.municipality,
      [AddressOSM.keyCounty]: this.county,
      [AddressOSM.keyState]: this.state,
      [AddressOSM.keyPostCode]: this.postCode,
      [AddressOSM.keyCountry]: this.country,
      [AddressOSM.keyCountryCode]: this.countryCode,
    };
  }
}
