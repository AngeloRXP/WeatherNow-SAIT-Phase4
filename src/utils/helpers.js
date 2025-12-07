/**
 * WeatherNow - Helper Functions
 * Utility functions for data formatting and conversions
 * 
 * @authors Angelo Pires & Jude Uyeno
 * @studentIDs 000920614 & 000793423
 */

import { WIND_SPEED_UNITS, TIME_FORMATS } from './constants';

/**
 * Format temperature with unit
 * @param {number} temp - Temperature value
 * @param {string} unit - Temperature unit (metric/imperial)
 * @returns {string} Formatted temperature
 */
export const formatTemperature = (temp, unit = 'metric') => {
  const rounded = Math.round(temp);
  return unit === 'metric' ? `${rounded}°C` : `${rounded}°F`;
};

/**
 * Convert wind speed to different units
 * @param {number} speed - Wind speed in m/s (OpenWeather default)
 * @param {string} targetUnit - Target unit
 * @returns {string} Formatted wind speed
 */
export const formatWindSpeed = (speed, targetUnit = WIND_SPEED_UNITS.KMH) => {
  let convertedSpeed;
  
  switch (targetUnit) {
    case WIND_SPEED_UNITS.KMH:
      convertedSpeed = speed * 3.6;
      return `${Math.round(convertedSpeed)} km/h`;
    case WIND_SPEED_UNITS.MPH:
      convertedSpeed = speed * 2.237;
      return `${Math.round(convertedSpeed)} mph`;
    case WIND_SPEED_UNITS.MS:
      return `${Math.round(speed)} m/s`;
    default:
      return `${Math.round(speed * 3.6)} km/h`;
  }
};

/**
 * Format timestamp to readable date
 * @param {number} timestamp - Unix timestamp
 * @param {boolean} includeTime - Include time in output
 * @returns {string} Formatted date
 */
export const formatDate = (timestamp, includeTime = false) => {
  const date = new Date(timestamp * 1000);
  
  const options = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  };
  
  if (includeTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }
  
  return date.toLocaleDateString('en-US', options);
};

/**
 * Format time from timestamp
 * @param {number} timestamp - Unix timestamp
 * @param {string} format - Time format (12h/24h)
 * @returns {string} Formatted time
 */
export const formatTime = (timestamp, format = TIME_FORMATS.TWELVE_HOUR) => {
  const date = new Date(timestamp * 1000);
  
  if (format === TIME_FORMATS.TWENTY_FOUR_HOUR) {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  }
  
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

/**
 * Get day name from timestamp
 * @param {number} timestamp - Unix timestamp
 * @param {boolean} short - Return short day name
 * @returns {string} Day name
 */
export const getDayName = (timestamp, short = false) => {
  const date = new Date(timestamp * 1000);
  const options = { weekday: short ? 'short' : 'long' };
  return date.toLocaleDateString('en-US', options);
};

/**
 * Get weather icon name based on condition
 * @param {string} condition - Weather condition code
 * @returns {string} Icon name
 */
export const getWeatherIcon = (condition) => {
  const iconMap = {
    '01d': 'sun',
    '01n': 'moon',
    '02d': 'cloud-sun',
    '02n': 'cloud-moon',
    '03d': 'cloud',
    '03n': 'cloud',
    '04d': 'cloud',
    '04n': 'cloud',
    '09d': 'cloud-rain',
    '09n': 'cloud-rain',
    '10d': 'cloud-sun-rain',
    '10n': 'cloud-moon-rain',
    '11d': 'cloud-lightning',
    '11n': 'cloud-lightning',
    '13d': 'cloud-snow',
    '13n': 'cloud-snow',
    '50d': 'cloud-fog',
    '50n': 'cloud-fog',
  };
  
  return iconMap[condition] || 'cloud';
};

/**
 * Get UV Index description
 * @param {number} uvIndex - UV index value
 * @returns {string} UV index description
 */
export const getUVIndexDescription = (uvIndex) => {
  if (uvIndex <= 2) return 'Low';
  if (uvIndex <= 5) return 'Moderate';
  if (uvIndex <= 7) return 'High';
  if (uvIndex <= 10) return 'Very High';
  return 'Extreme';
};

/**
 * Calculate feels like temperature description
 * @param {number} actual - Actual temperature
 * @param {number} feelsLike - Feels like temperature
 * @returns {string} Description
 */
export const getFeelsLikeDescription = (actual, feelsLike) => {
  const diff = Math.abs(actual - feelsLike);
  
  if (diff < 2) return 'Similar to actual temperature';
  if (feelsLike < actual) return 'Feels colder due to wind';
  return 'Feels warmer due to humidity';
};

/**
 * Format humidity percentage
 * @param {number} humidity - Humidity percentage
 * @returns {string} Formatted humidity
 */
export const formatHumidity = (humidity) => {
  return `${Math.round(humidity)}%`;
};

/**
 * Format visibility distance
 * @param {number} visibility - Visibility in meters
 * @returns {string} Formatted visibility
 */
export const formatVisibility = (visibility) => {
  const km = visibility / 1000;
  return `${km.toFixed(1)} km`;
};

/**
 * Get background gradient based on weather
 * @param {string} condition - Weather condition
 * @returns {object} Gradient colors
 */
export const getWeatherGradient = (condition) => {
  const gradients = {
    Clear: ['#667eea', '#764ba2'],
    Clouds: ['#757F9A', '#D7DDE8'],
    Rain: ['#4A90E2', '#5DADE2'],
    Drizzle: ['#89F7FE', '#66A6FF'],
    Thunderstorm: ['#373B44', '#4286f4'],
    Snow: ['#E6DADA', '#274046'],
    Mist: ['#BDC3C7', '#2C3E50'],
    Fog: ['#95A5A6', '#34495E'],
  };
  
  return gradients[condition] || ['#667eea', '#764ba2'];
};

/**
 * Validate location coordinates
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {boolean} Valid coordinates
 */
export const validateCoordinates = (lat, lon) => {
  return (
    typeof lat === 'number' &&
    typeof lon === 'number' &&
    lat >= -90 &&
    lat <= 90 &&
    lon >= -180 &&
    lon <= 180
  );
};

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 20) => {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};
