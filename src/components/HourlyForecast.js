/**
 * WeatherNow - HourlyForecast Component
 * Displays hourly weather forecast in a horizontal scroll
 * 
 * @authors Angelo Pires & Jude Uyeno
 * @studentIDs 000920614 & 000793423
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { formatTime, formatTemperature, getWeatherIcon } from '../utils/helpers';

const HourlyForecast = ({ hourlyData, timeFormat, temperatureUnit }) => {
  // Take first 24 hours (8 data points * 3 hours = 24 hours)
  const displayData = hourlyData ? hourlyData.slice(0, 8) : [];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hourly Forecast</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {displayData.map((hour, index) => (
          <View key={index} style={styles.hourCard}>
            <Text style={styles.time}>{formatTime(hour.dt, timeFormat)}</Text>

            <View style={styles.iconContainer}>
              {hour.weather && hour.weather[0] && hour.weather[0].icon ? (
                <Image
                  source={{
                    uri: `https://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png`,
                  }}
                  style={styles.weatherIcon}
                  resizeMode="contain"
                />
              ) : (
                <Icon name="cloud" size={32} color="#FFFFFF" />
              )}
            </View>

            <Text style={styles.temp}>
              {formatTemperature(hour.main.temp, temperatureUnit)}
            </Text>

            {hour.pop > 0 && (
              <View style={styles.precipContainer}>
                <Icon name="cloud-rain" size={12} color="#4A90E2" />
                <Text style={styles.precipText}>
                  {Math.round(hour.pop * 100)}%
                </Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  hourCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    minWidth: 80,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  time: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  weatherIcon: {
    width: 40,
    height: 40,
  },
  temp: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  precipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  precipText: {
    color: '#4A90E2',
    fontSize: 11,
    marginLeft: 4,
  },
});

export default HourlyForecast;
