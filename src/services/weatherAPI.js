/**
 * WeatherNow - Weather API Service
 * Handles all API calls to OpenWeather API
 * 
 * @authors Angelo Pires & Jude Uyeno
 * @studentIDs 000920614 & 000793423
 */

import axios from 'axios';
import {
  OPENWEATHER_API_KEY,
  OPENWEATHER_BASE_URL,
  API_TIMEOUT,
  DEFAULT_LOCATION,
} from '../utils/constants';

/**
 * Create axios instance with default config
 */
const api = axios.create({
  baseURL: OPENWEATHER_BASE_URL,
  timeout: API_TIMEOUT,
  params: {
    appid: OPENWEATHER_API_KEY,
  },
});

/**
 * Get current weather by coordinates
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {string} units - Temperature units (metric/imperial)
 * @returns {Promise<object>} Weather data
 */
export const getCurrentWeather = async (lat, lon, units = 'metric') => {
  try {
    const response = await api.get('/weather', {
      params: {
        lat,
        lon,
        units,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching current weather:', error);
    throw handleAPIError(error);
  }
};

/**
 * Get current weather by city name
 * @param {string} cityName - City name
 * @param {string} units - Temperature units (metric/imperial)
 * @returns {Promise<object>} Weather data
 */
export const getCurrentWeatherByCity = async (cityName, units = 'metric') => {
  try {
    const response = await api.get('/weather', {
      params: {
        q: cityName,
        units,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching weather by city:', error);
    throw handleAPIError(error);
  }
};

/**
 * Get 5-day forecast (3-hour intervals)
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {string} units - Temperature units (metric/imperial)
 * @returns {Promise<object>} Forecast data
 */
export const getForecast = async (lat, lon, units = 'metric') => {
  try {
    const response = await api.get('/forecast', {
      params: {
        lat,
        lon,
        units,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching forecast:', error);
    throw handleAPIError(error);
  }
};

/**
 * Get 7-day forecast (requires One Call API or daily forecast)
 * Note: OpenWeather 3.0 One Call API requires paid subscription
 * For this project, we'll process 5-day forecast to extract daily data
 * 
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {string} units - Temperature units (metric/imperial)
 * @returns {Promise<Array>} Array of daily forecasts
 */
export const getSevenDayForecast = async (lat, lon, units = 'metric') => {
  try {
    const response = await api.get('/forecast', {
      params: {
        lat,
        lon,
        units,
      },
    });
    
    // Process the 5-day forecast data to extract daily forecasts
    return processDailyForecasts(response.data.list);
  } catch (error) {
    console.error('Error fetching 7-day forecast:', error);
    throw handleAPIError(error);
  }
};

/**
 * Search cities by name
 * @param {string} query - Search query
 * @param {number} limit - Number of results (default: 5)
 * @returns {Promise<Array>} Array of matching cities
 */
export const searchCities = async (query, limit = 5) => {
  try {
    const response = await api.get('/find', {
      params: {
        q: query,
        type: 'like',
        cnt: limit,
      },
    });
    return response.data.list || [];
  } catch (error) {
    console.error('Error searching cities:', error);
    throw handleAPIError(error);
  }
};

/**
 * Get weather by geolocation
 * Uses device's current location
 * 
 * @param {object} position - Geolocation position object
 * @param {string} units - Temperature units (metric/imperial)
 * @returns {Promise<object>} Weather data
 */
export const getWeatherByLocation = async (position, units = 'metric') => {
  try {
    const { latitude, longitude } = position.coords;
    return await getCurrentWeather(latitude, longitude, units);
  } catch (error) {
    console.error('Error fetching weather by location:', error);
    throw handleAPIError(error);
  }
};

/**
 * Process forecast list to extract daily forecasts
 * Groups 3-hour forecasts into daily forecasts
 * 
 * @param {Array} forecastList - Array of 3-hour forecast data
 * @returns {Array} Array of daily forecasts
 */
const processDailyForecasts = (forecastList) => {
  const dailyForecasts = {};
  
  forecastList.forEach((item) => {
    const date = new Date(item.dt * 1000).toDateString();
    
    if (!dailyForecasts[date]) {
      dailyForecasts[date] = {
        dt: item.dt,
        temp: {
          min: item.main.temp,
          max: item.main.temp,
        },
        weather: item.weather[0],
        humidity: item.main.humidity,
        wind_speed: item.wind.speed,
        pop: item.pop || 0, // Probability of precipitation
        allTemps: [item.main.temp],
      };
    } else {
      // Update min/max temperatures
      dailyForecasts[date].temp.min = Math.min(
        dailyForecasts[date].temp.min,
        item.main.temp
      );
      dailyForecasts[date].temp.max = Math.max(
        dailyForecasts[date].temp.max,
        item.main.temp
      );
      dailyForecasts[date].allTemps.push(item.main.temp);
      
      // Update probability of precipitation if higher
      if (item.pop > dailyForecasts[date].pop) {
        dailyForecasts[date].pop = item.pop;
      }
    }
  });
  
  // Convert to array and calculate average humidity
  return Object.values(dailyForecasts).map((day) => {
    const avgHumidity =
      day.allTemps.reduce((sum, temp) => sum + temp, 0) / day.allTemps.length;
    delete day.allTemps;
    return {
      ...day,
      humidity: Math.round(avgHumidity),
    };
  });
};

/**
 * Handle API errors
 * @param {Error} error - Error object
 * @returns {Error} Formatted error
 */
const handleAPIError = (error) => {
  if (error.response) {
    // Server responded with error status
    const message = error.response.data.message || 'Server error occurred';
    return new Error(message);
  } else if (error.request) {
    // Request made but no response
    return new Error('No response from server. Check your internet connection.');
  } else {
    // Error setting up request
    return new Error(error.message || 'An error occurred');
  }
};

/**
 * Test API connection
 * @returns {Promise<boolean>} Connection status
 */
export const testAPIConnection = async () => {
  try {
    await getCurrentWeather(
      DEFAULT_LOCATION.lat,
      DEFAULT_LOCATION.lon,
      'metric'
    );
    return true;
  } catch (error) {
    console.error('API connection test failed:', error);
    return false;
  }
};

export default {
  getCurrentWeather,
  getCurrentWeatherByCity,
  getForecast,
  getSevenDayForecast,
  searchCities,
  getWeatherByLocation,
  testAPIConnection,
};
