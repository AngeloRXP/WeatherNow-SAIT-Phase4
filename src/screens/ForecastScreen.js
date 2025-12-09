/**
 * WeatherNow - Forecast Screen
 * Displays 7-day weather forecast
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

import DayForecastCard from '../components/DayForecastCard';
import { getSevenDayForecast, getCurrentWeather } from '../services/weatherAPI';
import { getSettings, getLastLocation } from '../services/storage';
import { DEFAULT_LOCATION } from '../utils/constants';
import { formatDate } from '../utils/helpers';
import { location, setLocation } from '../services/storage';

const ForecastScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [forecastData, setForecastData] = useState([]);
  const [todayWeather, setTodayWeather] = useState(null);
  const [settings, setSettings] = useState(null);

  // Load settings and location
  useEffect(() => {
    loadInitialData();
  }, []);

  // Reload when screen is focused
  useFocusEffect(
    useCallback(() => {
      loadForecastData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location])
  );

  const loadInitialData = async () => {
    try {
      const [userSettings, lastLoc] = await Promise.all([
        getSettings(),
        getLastLocation(),
      ]);

      setSettings(userSettings);
      if (lastLoc) {
        setLocation(lastLoc);
      }
    } catch (error) {
      console.error('Error loading initial data:', error);
    }
  };

  const loadForecastData = async () => {
    try {
      setLoading(true);

      // Get current weather for today's summary
      const currentData = await getCurrentWeather(
        location.lat,
        location.lon,
        settings?.temperatureUnit || 'metric'
      );
      setTodayWeather(currentData);

      // Get 7-day forecast
      const forecast = await getSevenDayForecast(
        location.lat,
        location.lon,
        settings?.temperatureUnit || 'metric'
      );
      setForecastData(forecast);
    } catch (error) {
      console.error('Error loading forecast:', error);
      Alert.alert('Error', 'Failed to load forecast data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadForecastData();
    setRefreshing(false);
  };

  const handleDayPress = (forecast) => {
    Alert.alert(
      'Forecast Details',
      `Temperature: ${Math.round(forecast.temp.min)}° - ${Math.round(
        forecast.temp.max
      )}°\nHumidity: ${forecast.humidity}%\nWind: ${Math.round(
        forecast.wind_speed * 3.6
      )} km/h`,
      [{ text: 'OK' }]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFFFFF" />
        <Text style={styles.loadingText}>Loading forecast...</Text>
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
            <Text style={styles.title}>7-Day Forecast</Text>
            <Text style={styles.subtitle}>
              {location.name || 'Current Location'}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={onRefresh}>
            <Icon name="refresh-cw" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Today's Summary */}
        {todayWeather && (
          <View style={styles.todaySummary}>
            <Text style={styles.todayLabel}>Today</Text>
            <View style={styles.todayContent}>
              <View style={styles.todayLeft}>
                <Icon
                  name={
                    todayWeather.weather[0].main === 'Clear'
                      ? 'sun'
                      : todayWeather.weather[0].main === 'Clouds'
                      ? 'cloud'
                      : 'cloud-rain'
                  }
                  size={60}
                  color="#FFD700"
                />
              </View>
              <View style={styles.todayRight}>
                <Text style={styles.todayTemp}>
                  {Math.round(todayWeather.main.temp)}°
                </Text>
                <Text style={styles.todayCondition}>
                  {todayWeather.weather[0].main}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Forecast List */}
        <View style={styles.forecastList}>
          {forecastData.map((forecast, index) => (
            <DayForecastCard
              key={index}
              forecast={forecast}
              temperatureUnit={settings?.temperatureUnit || 'metric'}
              onPress={() => handleDayPress(forecast)}
              isToday={index === 0}
            />
          ))}
        </View>

        {/* Empty State */}
        {forecastData.length === 0 && (
          <View style={styles.emptyState}>
            <Icon name="cloud-off" size={64} color="rgba(255, 255, 255, 0.5)" />
            <Text style={styles.emptyText}>No forecast data available</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={loadForecastData}>
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
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
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    marginTop: 4,
  },
  refreshButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  todaySummary: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  todayLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  todayContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  todayLeft: {
    marginRight: 20,
  },
  todayRight: {
    flex: 1,
  },
  todayTemp: {
    color: '#FFFFFF',
    fontSize: 48,
    fontWeight: 'bold',
  },
  todayCondition: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 20,
    fontWeight: '500',
    marginTop: 4,
  },
  forecastList: {
    marginTop: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 16,
    marginTop: 16,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ForecastScreen;
