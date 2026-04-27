# @spreeloop/geolocation

Package de géolocalisation pour Spreeloop, fournissant du reverse geocoding via OpenStreetMap.

## Installation

```bash
npm install @spreeloop/geolocation
```

## Usage

### Basic Usage

```typescript
import {
  GeocodingInterface,
  UserAgent,
} from '@spreeloop/geolocation';

const userAgent: UserAgent = {
  applicationName: 'my-app',
  supportContact: 'support@example.com',
  version: '1.0.0',
  build: 'abc123',
};

const service = GeocodingInterface.createOpenStreetMap(userAgent);

const address = await service.reverseGeocoding({
  latitude: 4.0528,
  longitude: 9.7173,
});

if (address) {
  console.log(address.suburbTownCity()); // "New Deido, Deido, Douala I"
  console.log(address.city); // "Douala I"
  console.log(address.countryCode); // "cm"
}
```

### Using Fake Implementation for Testing

```typescript
import { GeocodingInterface } from '@spreeloop/geolocation';

const service = GeocodingInterface.createFake();
const address = await service.reverseGeocoding({
  latitude: 4.0528,
  longitude: 9.7173,
});
// Returns a fake address from Douala, Cameroon
```

## API

### `GeocodingInterface`

Abstract class providing factory methods for creating geocoding service implementations.

- `static createFake(): GeocodingInterface` - Creates a fake implementation for testing
- `static createOpenStreetMap(userAgent: UserAgent): GeocodingInterface` - Creates an OpenStreetMap implementation

Abstract method:
- `reverseGeocoding(params: { latitude: number; longitude: number; }): Promise<GeocodingAddress | null>`

### Exports

The package exports the following:

- `GeocodingInterface` - Abstract class with factory methods and reverse geocoding interface
- `GeocodingAddress` - Class representing a geocoded address
- `UserAgent` - Interface for user agent configuration

### `GeocodingAddress`

Class representing a geocoded address:

- `suburb: string | null` - The sub-road's name
- `town: string | null` - The town's name
- `city: string | null` - The city's name
- `countryCode: string | null` - The country code
- `toJson(): Record<string, string | null>` - Serialize to JSON
- `suburbTownCity(): string` - Get formatted "suburb, town, city" string

### `UserAgent`

Interface for user agent information required by OpenStreetMap API:

```typescript
interface UserAgent {
  applicationName: string;
  supportContact: string;
  version: string;
  build: string;
}
```

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Run tests
npm test

# Run linter
npm run lint
```

## License

MIT
