/**
 * WeatherNow - Search Screen
 * Search and select locations for weather information
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
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  // ImageBackground, // COMMENTED OUT - No background image
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
// import Geolocation from '@react-native-community/geolocation'; // COMENTADO

import { searchCities, getCurrentWeatherByCity } from '../services/weatherAPI';
import {
  saveRecentSearch,
  getRecentSearches,
  clearRecentSearches,
} from '../services/storage';

const SearchScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [popularCities] = useState([
    { id: 1, name: 'Calgary', country: 'CA', lat: 51.0447, lon: -114.0719 },
    { id: 2, name: 'Vancouver', country: 'CA', lat: 49.2827, lon: -123.1207 },
    { id: 3, name: 'Toronto', country: 'CA', lat: 43.6532, lon: -79.3832 },
    { id: 4, name: 'Montreal', country: 'CA', lat: 45.5017, lon: -73.5673 },
  ]);

  useEffect(() => {
    loadRecentSearches();
  }, []);

  const loadRecentSearches = async () => {
    try {
      const recent = await getRecentSearches();
      setRecentSearches(recent);
    } catch (error) {
      console.error('Error loading recent searches:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      Alert.alert('Invalid Input', 'Please enter a city name');
      return;
    }

    try {
      setSearching(true);
      const results = await searchCities(searchQuery, 5);
      setSearchResults(results);

      if (results.length === 0) {
        Alert.alert('No Results', 'No cities found matching your search');
      }
    } catch (error) {
      console.error('Search error:', error);
      Alert.alert('Search Error', 'Failed to search cities. Please try again.');
    } finally {
      setSearching(false);
    }
  };

  const handleLocationSelect = async (location) => {
    try {
      // Save to recent searches
      await saveRecentSearch({
        id: location.id,
        name: location.name,
        coord: { lat: location.coord?.lat || location.lat, lon: location.coord?.lon || location.lon },
        sys: { country: location.sys?.country || location.country },
      });

      // Navigate to home screen with selected location
      navigation.navigate('Home', { selectedLocation: location });

      // Clear search
      setSearchQuery('');
      setSearchResults([]);
    } catch (error) {
      console.error('Error selecting location:', error);
      Alert.alert('Error', 'Failed to select location');
    }
  };

/*
  const handleUseCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        navigation.navigate('Home', {
          selectedLocation: {
            name: 'Current Location',
            lat: latitude,
            lon: longitude,
          },
        });
      },
      (error) => {
        console.error('Geolocation error:', error);
        Alert.alert(
          'Location Error',
          'Unable to get current location. Please check permissions.'
        );
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };
*/

const handleUseCurrentLocation = () => {
  // GPS desabilitado - usando Calgary como padrão
  navigation.navigate('Home', {
    selectedLocation: {
      name: 'Calgary, AB',
      lat: 51.0447,
      lon: -114.0719,
    },
  });
};


  const handleClearRecent = async () => {
    try {
      await clearRecentSearches();
      setRecentSearches([]);
    } catch (error) {
      console.error('Error clearing recent searches:', error);
    }
  };

  const LocationCard = ({ location, onPress, showWeather = false }) => (
    <TouchableOpacity
      style={styles.locationCard}
      onPress={() => onPress(location)}
      activeOpacity={0.7}>
      <View style={styles.locationInfo}>
        <Icon name="map-pin" size={20} color="#FFFFFF" />
        <View style={styles.locationText}>
          <Text style={styles.locationName}>{location.name}</Text>
          <Text style={styles.locationCountry}>
            {location.sys?.country || location.country}
          </Text>
        </View>
      </View>
      <Icon name="chevron-right" size={20} color="rgba(255, 255, 255, 0.6)" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.background}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Search Location</Text>
        </View>

        {/* Search Input */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Icon name="search" size={20} color="rgba(255, 255, 255, 0.6)" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search city..."
              placeholderTextColor="rgba(255, 255, 255, 0.6)"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Icon name="x" size={20} color="rgba(255, 255, 255, 0.6)" />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            style={styles.searchButton}
            onPress={handleSearch}
            disabled={searching}>
            {searching ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.searchButtonText}>Search</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Current Location Button */}
        <TouchableOpacity
          style={styles.currentLocationButton}
          onPress={handleUseCurrentLocation}>
          <Icon name="navigation" size={20} color="#FFFFFF" />
          <Text style={styles.currentLocationText}>Use Current Location</Text>
        </TouchableOpacity>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Search Results</Text>
            {searchResults.map((location) => (
              <LocationCard
                key={location.id}
                location={location}
                onPress={handleLocationSelect}
              />
            ))}
          </View>
        )}

        {/* Recent Searches */}
        {recentSearches.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Searches</Text>
              <TouchableOpacity onPress={handleClearRecent}>
                <Text style={styles.clearButton}>Clear All</Text>
              </TouchableOpacity>
            </View>
            {recentSearches.map((location, index) => (
              <LocationCard
                key={index}
                location={location}
                onPress={handleLocationSelect}
              />
            ))}
          </View>
        )}

        {/* Popular Cities */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popular Cities</Text>
          <View style={styles.popularGrid}>
            {popularCities.map((city) => (
              <TouchableOpacity
                key={city.id}
                style={styles.popularCard}
                onPress={() => handleLocationSelect(city)}
                activeOpacity={0.7}>
                <Icon name="map-pin" size={16} color="#FFFFFF" />
                <Text style={styles.popularCityName}>{city.name}</Text>
                <Text style={styles.popularCityCountry}>{city.country}</Text>
              </TouchableOpacity>
            ))}
          </View>
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
  searchContainer: {
    marginBottom: 16,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    marginLeft: 12,
  },
  searchButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  currentLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    paddingVertical: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  currentLocationText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  section: {
    marginBottom: 32,
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
  clearButton: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    fontWeight: '500',
  },
  locationCard: {
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
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationText: {
    marginLeft: 12,
    flex: 1,
  },
  locationName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  locationCountry: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    marginTop: 2,
  },
  popularGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  popularCard: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  popularCityName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
  popularCityCountry: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    marginTop: 4,
  },
});

export default SearchScreen;
