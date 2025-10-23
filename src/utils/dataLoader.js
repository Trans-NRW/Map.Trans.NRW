/**
 * Data loading utilities for the Trans.NRW-Map application
 * Handles dynamic loading of city data from the /public/data/ directory
 */

/**
 * Validates the structure of a city data JSON object
 * @param {Object} data - The data object to validate
 * @returns {Object} - Validation result with isValid and errors
 */
export function validateCityData(data) {
  const errors = [];
  
  // Check if data is an object
  if (!data || typeof data !== 'object') {
    errors.push('Data must be a valid JSON object');
    return { isValid: false, errors };
  }
  
  // Check required fields
  if (!data.locations || !Array.isArray(data.locations)) {
    errors.push('Data must contain a "locations" array');
  }
  
  if (!data.viewRoot || typeof data.viewRoot !== 'object') {
    errors.push('Data must contain a "viewRoot" object');
  }
  
  if (!data.label || typeof data.label !== 'string') {
    errors.push('Data must contain a "label" string');
  }
  
  // Validate metadata (optional but recommended)
  if (data.metadata && typeof data.metadata === 'object') {
    const metadata = data.metadata;
    
    // Check metadata version
    if (metadata.version && typeof metadata.version !== 'string') {
      errors.push('Metadata version must be a string');
    }
    
    // Check city name
    if (metadata.cityName && typeof metadata.cityName !== 'string') {
      errors.push('Metadata cityName must be a string');
    }
    
    // Check localized city name
    if (metadata.cityNameLocalized && typeof metadata.cityNameLocalized === 'object') {
      const cityNameLocalized = metadata.cityNameLocalized;
      if (cityNameLocalized.en && typeof cityNameLocalized.en !== 'string') {
        errors.push('Metadata cityNameLocalized.en must be a string');
      }
      if (cityNameLocalized.de && typeof cityNameLocalized.de !== 'string') {
        errors.push('Metadata cityNameLocalized.de must be a string');
      }
    }
    
    // Check region
    if (metadata.region && typeof metadata.region !== 'string') {
      errors.push('Metadata region must be a string');
    }
    
    // Check localized region
    if (metadata.regionLocalized && typeof metadata.regionLocalized === 'object') {
      const regionLocalized = metadata.regionLocalized;
      if (regionLocalized.en && typeof regionLocalized.en !== 'string') {
        errors.push('Metadata regionLocalized.en must be a string');
      }
      if (regionLocalized.de && typeof regionLocalized.de !== 'string') {
        errors.push('Metadata regionLocalized.de must be a string');
      }
    }
    
    // Check country
    if (metadata.country && typeof metadata.country !== 'string') {
      errors.push('Metadata country must be a string');
    }
    
    // Check localized country
    if (metadata.countryLocalized && typeof metadata.countryLocalized === 'object') {
      const countryLocalized = metadata.countryLocalized;
      if (countryLocalized.en && typeof countryLocalized.en !== 'string') {
        errors.push('Metadata countryLocalized.en must be a string');
      }
      if (countryLocalized.de && typeof countryLocalized.de !== 'string') {
        errors.push('Metadata countryLocalized.de must be a string');
      }
    }
    
    // Check coordinates in metadata
    if (metadata.coordinates && typeof metadata.coordinates === 'object') {
      if (typeof metadata.coordinates.lat !== 'number' || typeof metadata.coordinates.lng !== 'number') {
        errors.push('Metadata coordinates must have valid lat/lng numbers');
      }
    }
  }
  
  // Validate locations array
  if (data.locations && Array.isArray(data.locations)) {
    data.locations.forEach((location, index) => {
      // Check required location fields
      if (!location.name || typeof location.name !== 'string') {
        errors.push(`Location at index ${index} must have a "name" string`);
      }
      
      if (!location.description || typeof location.description !== 'object') {
        errors.push(`Location at index ${index} must have a "description" object`);
      } else {
        // Check for at least one language in description
        const hasLanguage = Object.values(location.description).some(desc => 
          typeof desc === 'string' && desc.trim().length > 0
        );
        if (!hasLanguage) {
          errors.push(`Location at index ${index} must have at least one language description`);
        }
      }
      
      if (!location.location || typeof location.location !== 'object') {
        errors.push(`Location at index ${index} must have a "location" object`);
      } else {
        if (typeof location.location.lat !== 'number' || typeof location.location.lng !== 'number') {
          errors.push(`Location at index ${index} must have valid lat/lng coordinates`);
        }
      }
      
      // Validate location metadata (optional)
      if (location.metadata && typeof location.metadata === 'object') {
        const locMetadata = location.metadata;
        
        // Check category
        if (locMetadata.category && typeof locMetadata.category !== 'string') {
          errors.push(`Location at index ${index} metadata category must be a string`);
        }
        
        // Check tags
        if (locMetadata.tags && !Array.isArray(locMetadata.tags)) {
          errors.push(`Location at index ${index} metadata tags must be an array`);
        }
        
        // Check contact info
        if (locMetadata.contact && typeof locMetadata.contact === 'object') {
          const contact = locMetadata.contact;
          if (contact.phone && typeof contact.phone !== 'string') {
            errors.push(`Location at index ${index} contact phone must be a string`);
          }
          if (contact.email && typeof contact.email !== 'string') {
            errors.push(`Location at index ${index} contact email must be a string`);
          }
          if (contact.website && typeof contact.website !== 'string') {
            errors.push(`Location at index ${index} contact website must be a string`);
          }
        }
        
        // Check accessibility info
        if (locMetadata.accessibility && typeof locMetadata.accessibility === 'object') {
          const accessibility = locMetadata.accessibility;
          if (accessibility.wheelchairAccessible !== undefined && 
              typeof accessibility.wheelchairAccessible !== 'boolean' && 
              accessibility.wheelchairAccessible !== 'unknown') {
            errors.push(`Location at index ${index} accessibility wheelchairAccessible must be a boolean or 'unknown'`);
          }
          if (accessibility.genderNeutralBathrooms !== undefined && 
              typeof accessibility.genderNeutralBathrooms !== 'boolean' && 
              accessibility.genderNeutralBathrooms !== 'unknown') {
            errors.push(`Location at index ${index} accessibility genderNeutralBathrooms must be a boolean or 'unknown'`);
          }
          if (accessibility.quietSpace !== undefined && 
              typeof accessibility.quietSpace !== 'boolean' && 
              accessibility.quietSpace !== 'unknown') {
            errors.push(`Location at index ${index} accessibility quietSpace must be a boolean or 'unknown'`);
          }
        }
      }
    });
  }
  
  // Validate viewRoot
  if (data.viewRoot && typeof data.viewRoot === 'object') {
    if (typeof data.viewRoot.lat !== 'number' || typeof data.viewRoot.lng !== 'number') {
      errors.push('viewRoot must have valid lat/lng coordinates');
    }
    
    // Check zoom level (optional)
    if (data.viewRoot.zoom !== undefined && typeof data.viewRoot.zoom !== 'number') {
      errors.push('viewRoot zoom must be a number');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Loads a single city data file
 * @param {string} cityName - The name of the city (without .json extension)
 * @returns {Promise<Object>} - Promise that resolves to the city data or rejects with error
 */
export async function loadCityData(cityName) {
  try {
    const response = await fetch(`/data/${cityName}.json`);
    
    if (!response.ok) {
      throw new Error(`Failed to load data for ${cityName}: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Validate the data structure
    const validation = validateCityData(data);
    if (!validation.isValid) {
      throw new Error(`Invalid data structure for ${cityName}: ${validation.errors.join(', ')}`);
    }
    
    return data;
  } catch (error) {
    console.error(`Error loading city data for ${cityName}:`, error);
    throw error;
  }
}

/**
 * Loads all available city data files from the data directory
 * @returns {Promise<Object>} - Promise that resolves to an object with city names as keys and data as values
 */
export async function loadAllCityData() {
  try {
    // For now, we'll use a predefined list of cities
    // In the future, this could be made dynamic by scanning the directory
    const knownCities = ['bochum']; // Add more cities as they become available
    
    const cityDataPromises = knownCities.map(async (cityName) => {
      try {
        const data = await loadCityData(cityName);
        return { cityName, data, success: true };
      } catch (error) {
        console.warn(`Failed to load data for ${cityName}:`, error.message);
        return { cityName, data: null, success: false, error: error.message };
      }
    });
    
    const results = await Promise.all(cityDataPromises);
    
    // Create an object with successful loads
    const cityData = {};
    const errors = {};
    
    results.forEach(({ cityName, data, success, error }) => {
      if (success && data) {
        cityData[cityName] = data;
      } else {
        errors[cityName] = error;
      }
    });
    
    return {
      cityData,
      errors,
      availableCities: Object.keys(cityData),
      totalCities: knownCities.length,
      successfulLoads: Object.keys(cityData).length
    };
  } catch (error) {
    console.error('Error loading city data:', error);
    throw error;
  }
}

/**
 * Gets a list of available cities
 * @returns {Array<string>} - Array of available city names
 */
export function getAvailableCities() {
  // For now, return a static list
  // In the future, this could scan the data directory
  return ['bochum'];
}

/**
 * Checks if a city data file exists and is valid
 * @param {string} cityName - The name of the city to check
 * @returns {Promise<boolean>} - Promise that resolves to true if the city data is available and valid
 */
export async function isCityDataAvailable(cityName) {
  try {
    await loadCityData(cityName);
    return true;
  } catch (error) {
    return false;
  }
}
