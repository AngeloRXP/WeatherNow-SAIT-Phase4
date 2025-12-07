/**
 * WeatherNow - WeatherDetails Component
 * Displays detailed weather metrics (humidity, wind, UV, visibility)
 * 
 * @authors Angelo Pires & Jude Uyeno
 * @studentIDs 000920614 & 000793423
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {
  formatHumidity,
  formatWindSpeed,
  formatVisibility,
  getUVIndexDescription,
} from '../utils/helpers';

const WeatherDetails = ({ humidity, windSpeed, uvIndex, visibility }) => {
  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {/* Humidity */}
        <View style={styles.detailCard}>
          <View style={styles.iconContainer}>
            <Icon name="droplet" size={20} color="rgba(255, 255, 255, 0.7)" />
          </View>
          <Text style={styles.label}>Humidity</Text>
          <Text style={styles.value}>{formatHumidity(humidity)}</Text>
        </View>

        {/* Wind Speed */}
        <View style={styles.detailCard}>
          <View style={styles.iconContainer}>
            <Icon name="wind" size={20} color="rgba(255, 255, 255, 0.7)" />
          </View>
          <Text style={styles.label}>Wind Speed</Text>
          <Text style={styles.value}>{formatWindSpeed(windSpeed)}</Text>
        </View>

        {/* UV Index */}
        <View style={styles.detailCard}>
          <View style={styles.iconContainer}>
            <Icon name="sun" size={20} color="rgba(255, 255, 255, 0.7)" />
          </View>
          <Text style={styles.label}>UV Index</Text>
          <Text style={styles.value}>{uvIndex || 0}</Text>
          <Text style={styles.subValue}>
            {getUVIndexDescription(uvIndex || 0)}
          </Text>
        </View>

        {/* Visibility */}
        <View style={styles.detailCard}>
          <View style={styles.iconContainer}>
            <Icon name="eye" size={20} color="rgba(255, 255, 255, 0.7)" />
          </View>
          <Text style={styles.label}>Visibility</Text>
          <Text style={styles.value}>{formatVisibility(visibility)}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  detailCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 16,
    width: '48%',
    marginBottom: 12,
  },
  iconContainer: {
    marginBottom: 8,
  },
  label: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
  },
  value: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  subValue: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 11,
    marginTop: 2,
  },
});

export default WeatherDetails;
