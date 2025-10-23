import { useState, useEffect, useCallback } from 'react';
import { loadCityData, loadAllCityData, getAvailableCities, isCityDataAvailable } from '../utils/dataLoader';

// Dunno if we even need all of this but theoretically this allows us to load city data based on the maps zoom level and center point.
// Probably not necessary for now but we can keep it for future use when there is more than a few cities with a lot of data.

/**
 * Custom hook for managing city data loading
 * @param {string} initialCity - The initial city to load
 * @returns {Object} - Hook state and methods
 */
export function useData(initialCity = 'bochum') {
  const [currentCity, setCurrentCity] = useState(initialCity);
  const [cityData, setCityData] = useState(null);
  const [allCityData, setAllCityData] = useState({});
  const [availableCities, setAvailableCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingErrors, setLoadingErrors] = useState({});

  // Load available cities on mount
  useEffect(() => {
    const cities = getAvailableCities();
    setAvailableCities(cities);
  }, []);

  // Load all city data on mount
  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const result = await loadAllCityData();
        setAllCityData(result.cityData);
        setLoadingErrors(result.errors);
        
        // If we have data for the current city, set it
        if (result.cityData[currentCity]) {
          setCityData(result.cityData[currentCity]);
        }
      } catch (err) {
        setError(err.message);
        console.error('Error loading all city data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadAllData();
  }, []);

  // Load specific city data
  const loadCity = useCallback(async (cityName) => {
    if (!cityName) return;

    setLoading(true);
    setError(null);

    try {
      // Check if we already have this city's data
      if (allCityData[cityName]) {
        setCityData(allCityData[cityName]);
        setCurrentCity(cityName);
        setLoading(false);
        return;
      }

      // Load the city data
      const data = await loadCityData(cityName);
      setCityData(data);
      setCurrentCity(cityName);
      
      // Update the allCityData with the new data
      setAllCityData(prev => ({
        ...prev,
        [cityName]: data
      }));
    } catch (err) {
      setError(err.message);
      console.error(`Error loading city data for ${cityName}:`, err);
    } finally {
      setLoading(false);
    }
  }, [allCityData]);

  // Switch to a different city
  const switchCity = useCallback((cityName) => {
    if (cityName === currentCity) return;
    
    if (allCityData[cityName]) {
      // We already have this city's data
      setCityData(allCityData[cityName]);
      setCurrentCity(cityName);
    } else {
      // Load the city data
      loadCity(cityName);
    }
  }, [currentCity, allCityData, loadCity]);

  // Refresh current city data
  const refreshCurrentCity = useCallback(() => {
    loadCity(currentCity);
  }, [currentCity, loadCity]);

  // Refresh all city data
  const refreshAllData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await loadAllCityData();
      setAllCityData(result.cityData);
      setLoadingErrors(result.errors);
      
      // Update current city data if available
      if (result.cityData[currentCity]) {
        setCityData(result.cityData[currentCity]);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error refreshing all city data:', err);
    } finally {
      setLoading(false);
    }
  }, [currentCity]);

  // Check if a city is available
  const isCityAvailable = useCallback((cityName) => {
    return availableCities.includes(cityName) && !loadingErrors[cityName];
  }, [availableCities, loadingErrors]);

  return {
    // State
    currentCity,
    cityData,
    allCityData,
    availableCities,
    loading,
    error,
    loadingErrors,
    
    // Methods
    loadCity,
    switchCity,
    refreshCurrentCity,
    refreshAllData,
    isCityAvailable,
    
    // Computed values
    hasData: !!cityData,
    hasError: !!error,
    hasLoadingErrors: Object.keys(loadingErrors).length > 0,
    totalAvailableCities: availableCities.length,
    totalLoadedCities: Object.keys(allCityData).length
  };
}
