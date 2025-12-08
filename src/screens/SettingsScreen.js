/**
 * WeatherNow - Settings Screen
 * Manage favorites, settings, and preferences
 * 
 * @authors Angelo Pires & Jude Uyeno
 * @studentIDs 000920614 & 000793423
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

import {
  getFavorites,
  removeFavorite,
  getSettings,
  saveSettings,
  resetSettings,
  clearAllData,
} from '../services/storage';
import {
  TEMPERATURE_UNITS,
  WIND_SPEED_UNITS,
  TIME_FORMATS,
  DEFAULT_SETTINGS,
} from '../utils/constants';

const SettingItem = ({ icon, label, children }) => (
  <View style={styles.settingItem}>
    <View style={styles.settingLeft}>
      <Icon name={icon} size={20} color="rgba(255, 255, 255, 0.8)" />
      <Text style={styles.settingLabel}>{label}</Text>
    </View>
    {children}
  </View>
);

const SettingsScreen = ({ navigation }) => {
  const [favorites, setFavorites] = useState([]);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [favs, sets] = await Promise.all([getFavorites(), getSettings()]);
      setFavorites(favs);
      setSettings(sets);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleRemoveFavorite = async (locationId) => {
    Alert.alert(
      'Remove Favorite',
      'Are you sure you want to remove this location from favorites?',
      [{ text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              await removeFavorite(locationId);
              setFavorites(favorites.filter((fav) => fav.id !== locationId));
            } catch (error) {
              Alert.alert('Error', 'Failed to remove favorite');
            }
          },
        },
    ]);
  };

  const handleSettingChange = async (key, value) => {
    try {
      const newSettings = { ...settings, [key]: value };
      setSettings(newSettings);
      await saveSettings(newSettings);
    } catch (error) {
      console.error('Error saving setting:', error);
      Alert.alert('Error', 'Failed to save setting');
    }
  };

  const handleResetSettings = () => {
    Alert.alert(
      'Reset Settings',
      'Are you sure you want to reset all settings to default?',
      [{ text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            try {
              await resetSettings();
              setSettings(DEFAULT_SETTINGS);
              Alert.alert('Success', 'Settings have been reset to default');
            } catch (error) {
              Alert.alert('Error', 'Failed to reset settings');
            }
          },
        },
    ]);
  };

  const handleClearAllData = () => {
    Alert.alert(
      'Clear All Data',
      'This will remove all favorites, recent searches, and reset settings. Are you sure?',
      [{ text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearAllData();
              setFavorites([]);
              setSettings(DEFAULT_SETTINGS);
              Alert.alert('Success', 'All data has been cleared');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear data');
            }
          },
        },
    ]);
  };

  return (
    <View style={styles.background}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
        </View>

        {/* Favorite Locations */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Favorite Locations</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate('Search')}>
              <Icon name="plus" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {favorites.length > 0 ? (
            favorites.map((fav, index) => (
              <View key={index} style={styles.favoriteCard}>
                <View style={styles.favoriteInfo}>
                  <Icon name="map-pin" size={18} color="#FFFFFF" />
                  <View style={styles.favoriteText}>
                    <Text style={styles.favoriteName}>{fav.name}</Text>
                    <Text style={styles.favoriteCountry}>{fav.country}</Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => handleRemoveFavorite(fav.id)}
                  style={styles.deleteButton}>
                  <Icon name="trash-2" size={18} color="#FF6B6B" />
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Icon name="star" size={48} color="rgba(255, 255, 255, 0.3)" />
              <Text style={styles.emptyText}>No favorite locations yet</Text>
            </View>
          )}
        </View>

        {/* Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>

          <View style={styles.card}>
            <SettingItem icon="thermometer" label="Temperature Unit">
              <View style={styles.buttonGroup}>
                <TouchableOpacity
                  style={[
                    styles.unitButton,
                    settings.temperatureUnit === TEMPERATURE_UNITS.CELSIUS &&
                      styles.unitButtonActive,
                  ]}
                  onPress={() =>
                    handleSettingChange(
                      'temperatureUnit',
                      TEMPERATURE_UNITS.CELSIUS
                    )
                  }>
                  <Text
                    style={[
                      styles.unitButtonText,
                      settings.temperatureUnit === TEMPERATURE_UNITS.CELSIUS &&
                        styles.unitButtonTextActive,
                    ]}>
                    °C
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.unitButton,
                    settings.temperatureUnit === TEMPERATURE_UNITS.FAHRENHEIT &&
                      styles.unitButtonActive,
                  ]}
                  onPress={() =>
                    handleSettingChange(
                      'temperatureUnit',
                      TEMPERATURE_UNITS.FAHRENHEIT
                    )
                  }>
                  <Text
                    style={[
                      styles.unitButtonText,
                      settings.temperatureUnit ===
                        TEMPERATURE_UNITS.FAHRENHEIT &&
                        styles.unitButtonTextActive,
                    ]}>
                    °F
                  </Text>
                </TouchableOpacity>
              </View>
            </SettingItem>

            <View style={styles.divider} />

            <SettingItem icon="wind" label="Wind Unit">
              
              <View style={styles.buttonGroup}>
                {Object.values(WIND_SPEED_UNITS).map((unit) => (
                  <TouchableOpacity
                    key={unit}
                    style={[
                      styles.unitButton,
                      settings.windSpeedUnit === unit &&
                        styles.unitButtonActive,
                    ]}
                    onPress={() =>
                      handleSettingChange('windSpeedUnit', unit)
                    }>
                    <Text
                      style={[
                        styles.unitButtonText,
                        settings.windSpeedUnit === unit &&
                          styles.unitButtonTextActive,
                      ]}>
                      {unit}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </SettingItem>

            <View style={styles.divider} />

            <SettingItem icon="clock" label="Time Format">
              <View style={styles.buttonGroup}>
                <TouchableOpacity
                  style={[
                    styles.unitButton,
                    settings.timeFormat === TIME_FORMATS.TWELVE_HOUR &&
                      styles.unitButtonActive,
                  ]}
                  onPress={() =>
                    handleSettingChange('timeFormat', TIME_FORMATS.TWELVE_HOUR)
                  }>
                  <Text
                    style={[
                      styles.unitButtonText,
                      settings.timeFormat === TIME_FORMATS.TWELVE_HOUR &&
                        styles.unitButtonTextActive,
                    ]}>
                    12h
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.unitButton,
                    settings.timeFormat === TIME_FORMATS.TWENTY_FOUR_HOUR &&
                      styles.unitButtonActive,
                  ]}
                  onPress={() =>
                    handleSettingChange(
                      'timeFormat',
                      TIME_FORMATS.TWENTY_FOUR_HOUR
                    )
                  }>
                  <Text
                    style={[
                      styles.unitButtonText,
                      settings.timeFormat === TIME_FORMATS.TWENTY_FOUR_HOUR &&
                        styles.unitButtonTextActive,
                    ]}>
                    24h
                  </Text>
                </TouchableOpacity>
              </View>
            </SettingItem>
          </View>
        </View>

        {/* Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>

          <View style={styles.card}>
            <SettingItem icon="alert-circle" label="Weather Alerts">
              <Switch
                value={settings.weatherAlerts}
                onValueChange={(value) =>
                  handleSettingChange('weatherAlerts', value)
                }
                trackColor={{
                  false: 'rgba(255, 255, 255, 0.3)',
                  true: 'rgba(255, 215, 0, 0.8)',
                }}
                thumbColor="#FFFFFF"
              />
            </SettingItem>

            <View style={styles.divider} />

            <SettingItem icon="calendar" label="Daily Forecast">
              <Switch
                value={settings.dailyForecast}
                onValueChange={(value) =>
                  handleSettingChange('dailyForecast', value)
                }
                trackColor={{
                  false: 'rgba(255, 255, 255, 0.3)',
                  true: 'rgba(255, 215, 0, 0.8)',
                }}
                thumbColor="#FFFFFF"
              />
            </SettingItem>

            <View style={styles.divider} />

            <SettingItem icon="map-pin" label="Auto Location Updates">
              <Switch
                value={settings.autoLocation}
                onValueChange={(value) =>
                  handleSettingChange('autoLocation', value)
                }
                trackColor={{
                  false: 'rgba(255, 255, 255, 0.3)',
                  true: 'rgba(255, 215, 0, 0.8)',
                }}
                thumbColor="#FFFFFF"
              />
            </SettingItem>
          </View>
        </View>

        {/* About & Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>

          <View style={styles.card}>
            <TouchableOpacity
              style={styles.linkItem}
              onPress={() => Alert.alert('Privacy Policy', 'Privacy policy coming soon')}>
              <Icon name="shield" size={20} color="rgba(255, 255, 255, 0.8)" />
              <Text style={styles.linkText}>Privacy Policy</Text>
              <Icon
                name="chevron-right"
                size={20}
                color="rgba(255, 255, 255, 0.6)"
              />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.linkItem}
              onPress={() => Alert.alert('Terms of Service', 'Terms of service coming soon')}>
              <Icon name="file-text" size={20} color="rgba(255, 255, 255, 0.8)" />
              <Text style={styles.linkText}>Terms of Service</Text>
              <Icon
                name="chevron-right"
                size={20}
                color="rgba(255, 255, 255, 0.6)"
              />
            </TouchableOpacity>

            <View style={styles.divider} />

            <View style={styles.versionItem}>
              <Icon name="info" size={20} color="rgba(255, 255, 255, 0.8)" />
              <Text style={styles.linkText}>App Version</Text>
              <Text style={styles.versionText}>1.0.0</Text>
            </View>
          </View>
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.dangerButton}
            onPress={handleResetSettings}>
            <Icon name="rotate-ccw" size={20} color="#FF6B6B" />
            <Text style={styles.dangerButtonText}>Reset Settings</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.dangerButton}
            onPress={handleClearAllData}>
            <Icon name="trash-2" size={20} color="#FF6B6B" />
            <Text style={styles.dangerButtonText}>Clear All Data</Text>
          </TouchableOpacity>
        </View>

        {/* Credits */}
        <View style={styles.credits}>
          <Text style={styles.creditsText}>Developed by</Text>
          <Text style={styles.creditsNames}>Angelo Pires & Jude Uyeno</Text>
          <Text style={styles.creditsText}>SAIT Mobile Application Development</Text>
        </View>
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
  header: {
    marginBottom: 24,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  favoriteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  favoriteInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  favoriteText: {
    marginLeft: 12,
  },
  favoriteName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  favoriteCountry: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    marginTop: 2,
  },
  deleteButton: {
    padding: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
    marginTop: 12,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingLabel: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 15,
    marginLeft: 12,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  unitButton: {
    paddingHorizontal: 11,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  unitButtonActive: {
    backgroundColor: 'rgba(255, 215, 0, 0.3)',
  },
  unitButtonText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    fontWeight: '600',
  },
  unitButtonTextActive: {
    color: '#FFD700',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: 8,
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  linkText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 15,
    marginLeft: 12,
    flex: 1,
  },
  versionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  versionText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 15,
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 107, 107, 0.2)',
    borderRadius: 16,
    paddingVertical: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.4)',
  },
  dangerButtonText: {
    color: '#FF6B6B',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  credits: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  creditsText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
  },
  creditsNames: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    fontWeight: '600',
    marginVertical: 4,
  },
});

export default SettingsScreen;
