/**
 * WeatherNow - Constants
 * Contains all app constants including API configuration
 * 
 * @authors Angelo Pires & Jude Uyeno
 * @studentIDs 000920614 & 000793423
 */

// OpenWeather API Configuration
export const OPENWEATHER_API_KEY = 'b7950405bd3fa9826d31915c5a652154';
export const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';
export const OPENWEATHER_ICON_URL = 'https://openweathermap.org/img/wn';

// Default Location (Calgary, AB)
export const DEFAULT_LOCATION = {
  name: 'Calgary',
  lat: 51.0447,
  lon: -114.0719,
  country: 'CA',
};

// Temperature Units
export const TEMPERATURE_UNITS = {
  CELSIUS: 'metric',
  FAHRENHEIT: 'imperial',
};

// Wind Speed Units
export const WIND_SPEED_UNITS = {
  KMH: 'km/h',
  MPH: 'mph',
  MS: 'm/s',
};

// Time Formats
export const TIME_FORMATS = {
  TWELVE_HOUR: '12h',
  TWENTY_FOUR_HOUR: '24h',
};

// Storage Keys
export const STORAGE_KEYS = {
  FAVORITES: '@WeatherNow:favorites',
  RECENT_SEARCHES: '@WeatherNow:recentSearches',
  SETTINGS: '@WeatherNow:settings',
  LAST_LOCATION: '@WeatherNow:lastLocation',
};

// Default Settings
export const DEFAULT_SETTINGS = {
  temperatureUnit: TEMPERATURE_UNITS.CELSIUS,
  windSpeedUnit: WIND_SPEED_UNITS.KMH,
  timeFormat: TIME_FORMATS.TWELVE_HOUR,
  weatherAlerts: true,
  dailyForecast: true,
  autoLocation: true,
};

// App Colors (matching the HTML mockup)
export const COLORS = {
  primary: '#667eea',
  secondary: '#764ba2',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  white: '#FFFFFF',
  black: '#000000',
  gray: '#666666',
  lightGray: '#CCCCCC',
  transparent: 'transparent',
  glassWhite: 'rgba(255, 255, 255, 0.15)',
  glassBorder: 'rgba(255, 255, 255, 0.2)',
};

// Weather Condition Mappings
export const WEATHER_CONDITIONS = {
  Clear: { icon: 'sun', color: '#FDB813' },
  Clouds: { icon: 'cloud', color: '#A0AEC0' },
  Rain: { icon: 'cloud-rain', color: '#4A90E2' },
  Drizzle: { icon: 'cloud-drizzle', color: '#5DADE2' },
  Thunderstorm: { icon: 'cloud-lightning', color: '#7D3C98' },
  Snow: { icon: 'cloud-snow', color: '#ECF0F1' },
  Mist: { icon: 'cloud-fog', color: '#BDC3C7' },
  Fog: { icon: 'cloud-fog', color: '#95A5A6' },
};

// API Request Timeout
export const API_TIMEOUT = 10000; // 10 seconds

// Maximum number of favorites
export const MAX_FAVORITES = 5;

// Maximum number of recent searches
export const MAX_RECENT_SEARCHES = 3;

// Refresh interval for weather data (in milliseconds)
export const REFRESH_INTERVAL = 300000; // 5 minutes
