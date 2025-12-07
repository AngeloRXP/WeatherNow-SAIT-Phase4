/**
 * WeatherNow - Storage Service
 * Handles all local storage operations using AsyncStorage
 * 
 * @authors Angelo Pires & Jude Uyeno
 * @studentIDs 000920614 & 000793423
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  STORAGE_KEYS,
  DEFAULT_SETTINGS,
  MAX_FAVORITES,
  MAX_RECENT_SEARCHES,
} from '../utils/constants';

/**
 * Save favorite location
 * @param {object} location - Location object
 * @returns {Promise<boolean>} Success status
 */
export const saveFavorite = async (location) => {
  try {
    const favorites = await getFavorites();
    
    // Check if already exists
    const exists = favorites.some((fav) => fav.id === location.id);
    if (exists) {
      return false;
    }
    
    // Check maximum limit
    if (favorites.length >= MAX_FAVORITES) {
      throw new Error(`Maximum ${MAX_FAVORITES} favorites allowed`);
    }
    
    // Add new favorite
    favorites.push({
      id: location.id,
      name: location.name,
      lat: location.coord.lat,
      lon: location.coord.lon,
      country: location.sys.country,
      addedAt: Date.now(),
    });
    
    await AsyncStorage.setItem(
      STORAGE_KEYS.FAVORITES,
      JSON.stringify(favorites)
    );
    return true;
  } catch (error) {
    console.error('Error saving favorite:', error);
    throw error;
  }
};

/**
 * Get all favorite locations
 * @returns {Promise<Array>} Array of favorite locations
 */
export const getFavorites = async () => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.FAVORITES);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting favorites:', error);
    return [];
  }
};

/**
 * Remove favorite location
 * @param {string|number} locationId - Location ID
 * @returns {Promise<boolean>} Success status
 */
export const removeFavorite = async (locationId) => {
  try {
    const favorites = await getFavorites();
    const updated = favorites.filter((fav) => fav.id !== locationId);
    
    await AsyncStorage.setItem(
      STORAGE_KEYS.FAVORITES,
      JSON.stringify(updated)
    );
    return true;
  } catch (error) {
    console.error('Error removing favorite:', error);
    return false;
  }
};

/**
 * Check if location is favorite
 * @param {string|number} locationId - Location ID
 * @returns {Promise<boolean>} Is favorite status
 */
export const isFavorite = async (locationId) => {
  try {
    const favorites = await getFavorites();
    return favorites.some((fav) => fav.id === locationId);
  } catch (error) {
    console.error('Error checking favorite:', error);
    return false;
  }
};

/**
 * Save recent search
 * @param {object} location - Location object
 * @returns {Promise<boolean>} Success status
 */
export const saveRecentSearch = async (location) => {
  try {
    let recentSearches = await getRecentSearches();
    
    // Remove if already exists (to move to top)
    recentSearches = recentSearches.filter(
      (search) => search.id !== location.id
    );
    
    // Add to beginning
    recentSearches.unshift({
      id: location.id,
      name: location.name,
      lat: location.coord.lat,
      lon: location.coord.lon,
      country: location.sys.country,
      searchedAt: Date.now(),
    });
    
    // Keep only MAX_RECENT_SEARCHES
    if (recentSearches.length > MAX_RECENT_SEARCHES) {
      recentSearches = recentSearches.slice(0, MAX_RECENT_SEARCHES);
    }
    
    await AsyncStorage.setItem(
      STORAGE_KEYS.RECENT_SEARCHES,
      JSON.stringify(recentSearches)
    );
    return true;
  } catch (error) {
    console.error('Error saving recent search:', error);
    return false;
  }
};

/**
 * Get recent searches
 * @returns {Promise<Array>} Array of recent searches
 */
export const getRecentSearches = async () => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.RECENT_SEARCHES);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting recent searches:', error);
    return [];
  }
};

/**
 * Clear recent searches
 * @returns {Promise<boolean>} Success status
 */
export const clearRecentSearches = async () => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.RECENT_SEARCHES, JSON.stringify([]));
    return true;
  } catch (error) {
    console.error('Error clearing recent searches:', error);
    return false;
  }
};

/**
 * Save app settings
 * @param {object} settings - Settings object
 * @returns {Promise<boolean>} Success status
 */
export const saveSettings = async (settings) => {
  try {
    const currentSettings = await getSettings();
    const updatedSettings = { ...currentSettings, ...settings };
    
    await AsyncStorage.setItem(
      STORAGE_KEYS.SETTINGS,
      JSON.stringify(updatedSettings)
    );
    return true;
  } catch (error) {
    console.error('Error saving settings:', error);
    return false;
  }
};

/**
 * Get app settings
 * @returns {Promise<object>} Settings object
 */
export const getSettings = async () => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data ? JSON.parse(data) : DEFAULT_SETTINGS;
  } catch (error) {
    console.error('Error getting settings:', error);
    return DEFAULT_SETTINGS;
  }
};

/**
 * Reset settings to default
 * @returns {Promise<boolean>} Success status
 */
export const resetSettings = async () => {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.SETTINGS,
      JSON.stringify(DEFAULT_SETTINGS)
    );
    return true;
  } catch (error) {
    console.error('Error resetting settings:', error);
    return false;
  }
};

/**
 * Save last viewed location
 * @param {object} location - Location object
 * @returns {Promise<boolean>} Success status
 */
export const saveLastLocation = async (location) => {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.LAST_LOCATION,
      JSON.stringify({
        id: location.id,
        name: location.name,
        lat: location.coord.lat,
        lon: location.coord.lon,
        country: location.sys.country,
        savedAt: Date.now(),
      })
    );
    return true;
  } catch (error) {
    console.error('Error saving last location:', error);
    return false;
  }
};

/**
 * Get last viewed location
 * @returns {Promise<object|null>} Last location or null
 */
export const getLastLocation = async () => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.LAST_LOCATION);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting last location:', error);
    return null;
  }
};

/**
 * Clear all app data
 * @returns {Promise<boolean>} Success status
 */
export const clearAllData = async () => {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.FAVORITES,
      STORAGE_KEYS.RECENT_SEARCHES,
      STORAGE_KEYS.SETTINGS,
      STORAGE_KEYS.LAST_LOCATION,
    ]);
    return true;
  } catch (error) {
    console.error('Error clearing all data:', error);
    return false;
  }
};

/**
 * Get storage info (for debugging)
 * @returns {Promise<object>} Storage information
 */
export const getStorageInfo = async () => {
  try {
    const [favorites, recentSearches, settings, lastLocation] =
      await Promise.all([
        getFavorites(),
        getRecentSearches(),
        getSettings(),
        getLastLocation(),
      ]);
    
    return {
      favorites: favorites.length,
      recentSearches: recentSearches.length,
      settings,
      lastLocation: lastLocation?.name || 'None',
    };
  } catch (error) {
    console.error('Error getting storage info:', error);
    return null;
  }
};

export default {
  saveFavorite,
  getFavorites,
  removeFavorite,
  isFavorite,
  saveRecentSearch,
  getRecentSearches,
  clearRecentSearches,
  saveSettings,
  getSettings,
  resetSettings,
  saveLastLocation,
  getLastLocation,
  clearAllData,
  getStorageInfo,
};
