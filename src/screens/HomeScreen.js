/**
 * WeatherNow - Home Screen
 * Displays current weather and hourly forecast
 * 
 * @authors Angelo Pires & Jude Uyeno
 * @studentIDs 000920614 & 000793423
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  // ImageBackground, // COMMENTED OUT - No background image
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
// import Geolocation from '@react-native-community/geolocation'; // coment

import WeatherDetails from '../components/WeatherDetails';
import HourlyForecast from '../components/HourlyForecast';
import { getCurrentWeather, getForecast } from '../services/weatherAPI';
import { getSettings, saveLastLocation } from '../services/storage';
import { DEFAULT_LOCATION } from '../utils/constants';
import { formatDate } from '../utils/helpers';

const HomeScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [settings, setSettings] = useState(null);
  const [location, setLocation] = useState(DEFAULT_LOCATION);

  // Load settings
  useEffect(() => {
    loadSettings();
  }, []);

  // Load weather data when screen is focused
  useFocusEffect(
    useCallback(() => {
      loadWeatherData();
    }, [location])
  );

  const loadSettings = async () => {
    try {
      const userSettings = await getSettings();
      setSettings(userSettings);
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const loadWeatherData = async () => {
    try {
      setLoading(true);

      // Get current weather
      const weatherData = await getCurrentWeather(
        location.lat,
        location.lon,
        settings?.temperatureUnit || 'metric'
      );
      setCurrentWeather(weatherData);

      // Get forecast
      const forecast = await getForecast(
        location.lat,
        location.lon,
        settings?.temperatureUnit || 'metric'
      );
      setForecastData(forecast);

      // Save last location
      await saveLastLocation(weatherData);
    } catch (error) {
      console.error('Error loading weather data:', error);
      Alert.alert('Error', 'Failed to load weather data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadWeatherData();
    setRefreshing(false);
  };

const getCurrentLocation = () => {
  // GPS desabilitado - usando Calgary como padrão
  Alert.alert(
    'GPS Unavailable',
    'Using default location: Calgary, AB'
  );
};

  if (loading && !currentWeather) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFFFFF" />
        <Text style={styles.loadingText}>Loading weather data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.background}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#FFFFFF"
          />
        }>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.appName}>WeatherNow</Text>
            <Text style={styles.tagline}>Real-time weather updates</Text>
          </View>
          <TouchableOpacity
            style={styles.locationButton}
            onPress={getCurrentLocation}>
            <Icon name="navigation" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Current Location Info */}
        <View style={styles.locationCard}>
          <View style={styles.locationInfo}>
            <Icon name="map-pin" size={20} color="#FFFFFF" />
            <Text style={styles.locationName}>
              {currentWeather?.name || location.name}
            </Text>
          </View>
          <Text style={styles.dateText}>
            {formatDate(currentWeather?.dt || Date.now() / 1000, false)}
          </Text>
        </View>

        {/* Main Weather Display */}
        {currentWeather && (
          <View style={styles.mainWeather}>
            <View style={styles.weatherIconContainer}>
              <Icon
                name={
                  currentWeather.weather[0].main === 'Clear'
                    ? 'sun'
                    : currentWeather.weather[0].main === 'Clouds'
                    ? 'cloud'
                    : 'cloud-rain'
                }
                size={100}
                color="#FFD700"
              />
            </View>

            <View style={styles.temperatureContainer}>
              <Text style={styles.temperature}>
                {Math.round(currentWeather.main.temp)}°
              </Text>
              <Text style={styles.condition}>
                {currentWeather.weather[0].main}
              </Text>
              <Text style={styles.feelsLike}>
                Feels like {Math.round(currentWeather.main.feels_like)}°
              </Text>
            </View>

            {/* Weather Details */}
            <WeatherDetails
              humidity={currentWeather.main.humidity}
              windSpeed={currentWeather.wind.speed}
              uvIndex={currentWeather.uvi || 0}
              visibility={currentWeather.visibility}
            />
          </View>
        )}

        {/* Hourly Forecast */}
        {forecastData && (
          <HourlyForecast
            hourlyData={forecastData.list}
            timeFormat={settings?.timeFormat}
            temperatureUnit={settings?.temperatureUnit}
          />
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#667eea',
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#667eea',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  appName: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
  },
  tagline: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    marginTop: 4,
  },
  locationButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationName: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 8,
  },
  dateText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
  },
  mainWeather: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  weatherIconContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  temperatureContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  temperature: {
    color: '#FFFFFF',
    fontSize: 72,
    fontWeight: 'bold',
  },
  condition: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '500',
    marginTop: 8,
  },
  feelsLike: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 16,
    marginTop: 8,
  },
});

export default HomeScreen;
