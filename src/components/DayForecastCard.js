/**
 * WeatherNow - DayForecastCard Component
 * Displays individual day forecast card
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
import {
  getDayName,
  formatDate,
  formatTemperature,
  formatHumidity,
  formatWindSpeed,
} from '../utils/helpers';

const DayForecastCard = ({
  forecast,
  temperatureUnit,
  onPress,
  isToday = false,
}) => {
  const dayName = isToday ? 'Today' : getDayName(forecast.dt, false);
  const date = formatDate(forecast.dt, false);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.dayName}>{dayName}</Text>
          <Text style={styles.date}>{date}</Text>
        </View>

        <View style={styles.iconContainer}>
          {forecast.weather && forecast.weather.icon ? (
            <Image
              source={{
                uri: `https://openweathermap.org/img/wn/${forecast.weather.icon}@2x.png`,
              }}
              style={styles.weatherIcon}
              resizeMode="contain"
            />
          ) : (
            <Icon name="cloud" size={40} color="#FFFFFF" />
          )}
        </View>
      </View>

      {/* Temperature Range */}
      <View style={styles.tempContainer}>
        <View style={styles.tempRow}>
          <Text style={styles.tempLabel}>High</Text>
          <Text style={styles.tempHigh}>
            {formatTemperature(forecast.temp.max, temperatureUnit)}
          </Text>
        </View>
        <View style={styles.tempRow}>
          <Text style={styles.tempLabel}>Low</Text>
          <Text style={styles.tempLow}>
            {formatTemperature(forecast.temp.min, temperatureUnit)}
          </Text>
        </View>
      </View>

      {/* Weather Details */}
      <View style={styles.detailsContainer}>
        {/* Precipitation */}
        {forecast.pop > 0 && (
          <View style={styles.detailItem}>
            <Icon name="cloud-rain" size={14} color="rgba(255, 255, 255, 0.7)" />
            <Text style={styles.detailText}>
              {Math.round(forecast.pop * 100)}%
            </Text>
          </View>
        )}

        {/* Humidity */}
        <View style={styles.detailItem}>
          <Icon name="droplet" size={14} color="rgba(255, 255, 255, 0.7)" />
          <Text style={styles.detailText}>
            {formatHumidity(forecast.humidity)}
          </Text>
        </View>

        {/* Wind */}
        <View style={styles.detailItem}>
          <Icon name="wind" size={14} color="rgba(255, 255, 255, 0.7)" />
          <Text style={styles.detailText}>
            {formatWindSpeed(forecast.wind_speed)}
          </Text>
        </View>
      </View>

      {/* Temperature Bar Visualization */}
      <View style={styles.tempBar}>
        <View style={styles.tempBarFill} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dayName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  date: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 13,
    marginTop: 2,
  },
  iconContainer: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weatherIcon: {
    width: 50,
    height: 50,
  },
  tempContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  tempRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tempLabel: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 13,
    marginRight: 8,
  },
  tempHigh: {
    color: '#FFD700',
    fontSize: 20,
    fontWeight: 'bold',
  },
  tempLow: {
    color: '#87CEEB',
    fontSize: 20,
    fontWeight: 'bold',
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 16,
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 13,
  },
  tempBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  tempBarFill: {
    height: '100%',
    width: '70%',
    backgroundColor: '#FFD700',
    borderRadius: 3,
  },
});

export default DayForecastCard;
