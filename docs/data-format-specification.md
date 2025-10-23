# Trans.NRW-Map Data Format Specification

## Overview

This document defines the standardized data format for city data files in the Trans.NRW-Map application. All JSON files in the `/public/data/` directory must follow this specification to ensure consistency and compatibility.

## File Structure

### Required Fields

Every city data file must contain the following top-level fields:

```json
{
  "metadata": { ... },     // Optional but recommended
  "locations": [ ... ],    // Required
  "viewRoot": { ... },     // Required
  "label": "string"        // Required
}
```

## Field Specifications

### 1. Metadata (Optional but Recommended)

The `metadata` object provides information about the city data file itself:

```json
{
  "metadata": {
    "version": "1.0.0",                    // Data format version
    "lastUpdated": "2024-10-23",           // Last update date (YYYY-MM-DD)
    "cityName": "Bochum",                   // City name in English
    "cityNameLocalized": {                  // Localized city names
      "en": "Bochum",
      "de": "Bochum"
    },
    "region": "North Rhine-Westphalia",     // State/region
    "regionLocalized": {                   // Localized region names
      "en": "North Rhine-Westphalia",
      "de": "Nordrhein-Westfalen"
    },
    "country": "Germany",                   // Country
    "countryLocalized": {                  // Localized country names
      "en": "Germany",
      "de": "Deutschland"
    },
    "coordinates": {                        // City center coordinates
      "lat": 51.48165,
      "lng": 7.21648
    },
    "description": {                        // City description
      "en": "Trans-friendly locations and queer spaces in Bochum",
      "de": "Trans-freundliche Orte und queere Räume in Bochum"
    },
    "dataSource": "community-contributed", // Data source
    "maintainer": "Trans.NRW Map-Team",     // Data maintainer
    "contact": "Admin@Trans.NRW"            // Contact email
  }
}
```

### 2. Locations (Required)

The `locations` array contains all the trans-friendly locations for the city:

```json
{
  "locations": [
    {
      "id": "unique-location-id",           // Unique identifier
      "name": "Location Name",               // Display name
      "description": {                       // Multilingual descriptions
        "en": "English description",
        "de": "German description"
      },
      "location": {                         // Geographic coordinates
        "lat": 51.4726077787191,
        "lng": 7.21736666224125,
        "address": {                        // Optional address details
          "street": "Street Name",
          "number": "123",
          "postalCode": "44787"
          // Note: city and country are not included here as they are already
          // specified in the top-level metadata for the entire city data file
        }
      },
      "metadata": {                         // Optional location metadata
        "category": "bar",                   // Location type
        "tags": ["bar", "queer", "community"], // Search tags
        "openingHours": {                   // Opening hours
          "monday": "19:00-02:00",
          "tuesday": "19:00-02:00",
          "wednesday": "19:00-02:00",
          "thursday": "19:00-02:00",
          "friday": "19:00-03:00",
          "saturday": "19:00-03:00",
          "sunday": "closed"
        },
        "contact": {                        // Contact information
          "phone": "+49 234 123456",
          "email": "info@location.de",
          "website": "https://location.de"
        },
        "accessibility": {                  // Accessibility features
          "wheelchairAccessible": true,
          "genderNeutralBathrooms": true,
          "quietSpace": false
        },
        "verified": true,                   // Verification status
        "lastVerified": "2024-10-23"       // Last verification date
      }
    }
  ]
}
```

### 3. View Root (Required)

The `viewRoot` object defines the default map view for the city:

```json
{
  "viewRoot": {
    "lat": 51.48165,                       // Center latitude
    "lng": 7.21648,                        // Center longitude
    "zoom": 13                             // Optional zoom level
  }
}
```

### 4. Label (Required)

The `label` field is a string identifier for the city:

```json
{
  "label": "bochum"                        // City identifier (lowercase, no spaces)
}
```

## Data Types and Validation

### Required Fields
- `locations`: Array of location objects
- `viewRoot`: Object with lat/lng coordinates
- `label`: String identifier

### Location Object Requirements
- `name`: String (required)
- `description`: Object with language keys (required)
- `location`: Object with lat/lng coordinates (required)

### Optional Fields
- `metadata`: City metadata object
- `id`: Unique location identifier
- `address`: Address details object (street, number, postalCode only)
- `metadata`: Location metadata object

### Address Structure
The `address` object within each location contains only location-specific details:
- `street`: Street name
- `number`: House/building number
- `postalCode`: Postal/ZIP code

**Note**: City and country information is not included in individual location addresses as it is already specified in the top-level metadata for the entire city data file, avoiding redundancy.

### Localized Fields
The following fields support localization for multiple languages:
- `cityNameLocalized`: Localized city names
- `regionLocalized`: Localized region/state names
- `countryLocalized`: Localized country names
- `description`: Localized descriptions (in metadata and locations)

## Language Support

### Supported Languages
- `en`: English
- `de`: German

### Description Format
All descriptions must support at least one language:

```json
{
  "description": {
    "en": "English description",
    "de": "German description"
  }
}
```

## Accessibility Features

The `accessibility` object supports the following fields:

- `wheelchairAccessible`: Wheelchair accessibility (boolean or 'unknown')
- `genderNeutralBathrooms`: Gender-neutral bathroom availability (boolean or 'unknown')
- `quietSpace`: Availability of quiet spaces (boolean or 'unknown')

**Note**: Accessibility fields can be `true`, `false`, or `'unknown'` to indicate when information is not available.

## Categories

Supported location categories:

- `bar`: Bars and nightlife
- `cafe`: Cafes and coffee shops
- `restaurant`: Restaurants
- `shop`: Shops and retail
- `healthcare`: Healthcare providers
- `support`: Support groups and services
- `event`: Event venues
- `other`: Other types of locations

## Validation Rules

### Coordinate Validation
- Latitude: -90 to 90
- Longitude: -180 to 180
- Must be numbers, not strings

### String Validation
- All string fields must be non-empty
- Descriptions must have at least one language
- Names must be unique within a city

### Date Validation
- Dates must be in YYYY-MM-DD format
- `lastUpdated` and `lastVerified` must be valid dates

## Example Files

### Minimal Valid File
```json
{
  "locations": [
    {
      "name": "Test Location",
      "description": {
        "en": "Test description"
      },
      "location": {
        "lat": 51.48165,
        "lng": 7.21648
      }
    }
  ],
  "viewRoot": {
    "lat": 51.48165,
    "lng": 7.21648
  },
  "label": "test"
}
```

### Complete Example
See `public/data/bochum.json` for a complete example with all optional fields.

## Migration Guide

### From Old Format
If you have existing data files, update them to include:

1. Add `metadata` object with version and city information
2. Add unique `id` fields to each location
3. Add `address` information to location objects
4. Add `metadata` objects to locations with category and tags
5. Add accessibility information where available

### Backward Compatibility
The application maintains backward compatibility with the old format, but new features require the standardized format.

## Best Practices

### Data Quality
- Verify all locations before adding
- Include contact information when available
- Add accessibility information
- Use consistent naming conventions

### Performance
- Keep descriptions concise but informative
- Use appropriate zoom levels for viewRoot
- Include relevant tags for search functionality

### Maintenance
- Update `lastUpdated` when making changes
- Verify locations regularly
- Keep contact information current
- Add new locations as they become available

## Error Handling

The application will validate all data files and report errors for:

- Missing required fields
- Invalid coordinate values
- Malformed JSON
- Missing language descriptions
- Invalid data types

## Future Extensions

The format is designed to be extensible. Future versions may include:

- Additional accessibility features
- Event information
- User reviews and ratings
- Photo galleries
- Real-time status updates

## Support

For questions about the data format or help with migration, contact the Trans.NRW Map-Team at Admin@Trans.NRW.
