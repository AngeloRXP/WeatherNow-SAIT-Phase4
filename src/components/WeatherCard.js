/**
 * WeatherNow - WeatherCard Component
 * Displays current weather information in a card format
 * 
 * @authors Angelo Pires & Jude Uyeno
 * @studentIDs 000920614 & 000793423
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { formatTemperature, getWeatherIcon } from '../utils/helpers';
import { COLORS } from '../utils/constants';

const WeatherCard = ({
  location,
  temperature,
  condition,
  feelsLike,
  weatherIcon,
  onPress,
  style,
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      activeOpacity={0.8}>
      <View style={styles.locationContainer}>
        <Icon name="map-pin" size={18} color="#FFFFFF" />
        <Text style={styles.locationText}>{location}</Text>
      </View>

      <View style={styles.weatherContainer}>
        <View style={styles.iconContainer}>
          {weatherIcon ? (
            <Image
              source={{ uri: weatherIcon }}
              style={styles.weatherIcon}
              resizeMode="contain"
            />
          ) : (
            <Icon
              name={getWeatherIcon('01d')}
              size={48}
              color="#FFD700"
            />
          )}
        </View>

        <View style={styles.tempContainer}>
          <Text style={styles.temperature}>{temperature}</Text>
          <Text style={styles.condition}>{condition}</Text>
        </View>
      </View>

      {feelsLike && (
        <Text style={styles.feelsLike}>Feels like {feelsLike}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  weatherContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconContainer: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weatherIcon: {
    width: 80,
    height: 80,
  },
  tempContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  temperature: {
    color: '#FFFFFF',
    fontSize: 48,
    fontWeight: 'bold',
  },
  condition: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 18,
    fontWeight: '500',
  },
  feelsLike: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    marginTop: 12,
  },
});

export default WeatherCard;
