import React from 'react';
import { View, Text, StyleSheet, Image, Linking, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, spacing } from '../styles/colors';

// Default location: Bloxhub - Frederiksholms Kanal 28E, 1473 København
const DEFAULT_COORDS = {
  latitude: 55.6745,
  longitude: 12.5766,
};

const DEFAULT_ADDRESS = "Bloxhub, Frederiksholms Kanal 28E, 1473 København";

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function SafetyMap({
  userLocation,
  safePlaces = [],
  guardianLocation = null,
  showRadius = false,
  radius = 500,
  onSafePlacePress,
  style = {},
}) {
  const location = userLocation || DEFAULT_COORDS;
  const lat = location.latitude;
  const lng = location.longitude;

  const delta = 0.004;
  const xmin = lng - delta;
  const xmax = lng + delta;
  const ymin = lat - delta;
  const ymax = lat + delta;

  const mapWidth = Math.round(SCREEN_WIDTH * 2);
  const mapHeight = 500;
  
  const satelliteMapUrl = `https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/export?bbox=${xmin},${ymin},${xmax},${ymax}&bboxSR=4326&size=${mapWidth},${mapHeight}&format=png&f=image`;

  const openInMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    Linking.openURL(url);
  };

  const getDirections = (place) => {
    const originLat = lat;
    const originLng = lng;
    const destLat = place.lat;
    const destLng = place.lng;
    
    const url = `https://www.google.com/maps/dir/?api=1&origin=${originLat},${originLng}&destination=${destLat},${destLng}&travelmode=walking`;
    
    Alert.alert(
      'Get Directions',
      `Navigate from Bloxhub to ${place.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Open Maps', onPress: () => Linking.openURL(url) },
      ]
    );
  };

  const getPlaceIcon = (type) => {
    const icons = {
      bar: 'coffee',
      store: 'shopping-bag',
      transit: 'navigation',
      hospital: 'plus-square',
      police: 'shield',
      restaurant: 'coffee',
    };
    return icons[type] || 'map-pin';
  };

  const getPlaceColor = (type) => {
    const typeColors = {
      bar: '#8B7355',
      store: colors.safe,
      transit: colors.primary,
      hospital: colors.emergency,
      police: colors.primaryDark,
      restaurant: colors.guardian,
    };
    return typeColors[type] || colors.primary;
  };

  const formatDistance = (meters) => {
    if (meters >= 1000) {
      return `${(meters / 1000).toFixed(1)}km`;
    }
    return `${Math.round(meters)}m`;
  };

  return (
    <View style={[styles.container, style]}>
      {/* Satellite Map Image */}
      <TouchableOpacity style={styles.mapContainer} onPress={openInMaps} activeOpacity={0.95}>
        <Image
          source={{ uri: satelliteMapUrl }}
          style={styles.mapImage}
          resizeMode="cover"
        />
        
        {/* Location Pin Overlay */}
        <View style={styles.pinContainer}>
          <View style={styles.pinPulse} />
          <View style={styles.pinOuter}>
            <View style={styles.pin}>
              <Feather name="map-pin" size={18} color={colors.textLight} />
            </View>
          </View>
          <View style={styles.pinShadow} />
        </View>

        {/* Guardian indicator */}
        {guardianLocation && (
          <View style={styles.guardianIndicator}>
            <Feather name="user" size={14} color={colors.textLight} />
            <Text style={styles.guardianText}>Guardian nearby</Text>
          </View>
        )}

        {/* Radius indicator */}
        {showRadius && (
          <View style={styles.radiusIndicator}>
            <Feather name="radio" size={14} color={colors.textLight} />
            <Text style={styles.radiusText}>{radius}m radius</Text>
          </View>
        )}

        {/* Open in Maps button */}
        <TouchableOpacity style={styles.openMapsButton} onPress={openInMaps}>
          <Feather name="external-link" size={14} color={colors.textLight} />
          <Text style={styles.openMapsText}>Open in Maps</Text>
        </TouchableOpacity>

        {/* Satellite badge */}
        <View style={styles.satelliteBadge}>
          <Feather name="globe" size={11} color={colors.textLight} />
          <Text style={styles.satelliteText}>Satellite</Text>
        </View>
      </TouchableOpacity>

      {/* Address Bar */}
      <View style={styles.addressBar}>
        <View style={styles.addressIcon}>
          <Feather name="map-pin" size={14} color={colors.textLight} />
        </View>
        <View style={styles.addressContent}>
          <Text style={styles.addressLabel}>Your Location</Text>
          <Text style={styles.addressText} numberOfLines={1}>
            {DEFAULT_ADDRESS}
          </Text>
        </View>
        <Text style={styles.coordsText}>
          {lat.toFixed(4)}, {lng.toFixed(4)}
        </Text>
      </View>

      {/* Safe Places List */}
      {safePlaces.length > 0 && (
        <View style={styles.placesContainer}>
          <Text style={styles.placesTitle}>Nearby Safe Places</Text>
          {safePlaces.slice(0, 3).map((place) => (
            <TouchableOpacity
              key={place.id}
              style={styles.placeItem}
              onPress={() => getDirections(place)}
              activeOpacity={0.8}
            >
              <View style={[styles.placeIcon, { backgroundColor: `${getPlaceColor(place.type)}15` }]}>
                <Feather name={getPlaceIcon(place.type)} size={16} color={getPlaceColor(place.type)} />
              </View>
              <View style={styles.placeInfo}>
                <Text style={styles.placeName} numberOfLines={1}>{place.name}</Text>
                <Text style={styles.placeDistance}>
                  {formatDistance(place.distance)} • {place.open ? 'Open' : 'Closed'}
                </Text>
              </View>
              <TouchableOpacity 
                style={styles.directionsButton}
                onPress={() => getDirections(place)}
              >
                <Feather name="navigation" size={14} color={colors.textLight} />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  mapContainer: {
    height: 200,
    backgroundColor: colors.backgroundDark,
    position: 'relative',
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  pinContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -20,
    marginTop: -40,
    alignItems: 'center',
  },
  pinPulse: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(61, 90, 128, 0.2)',
    top: -3,
    left: -15,
  },
  pinOuter: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pin: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: colors.background,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  pinShadow: {
    width: 16,
    height: 5,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.2)',
    marginTop: 4,
  },
  guardianIndicator: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.guardian,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  guardianText: {
    marginLeft: 6,
    fontSize: 12,
    fontWeight: '600',
    color: colors.textLight,
    letterSpacing: 0.2,
  },
  radiusIndicator: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  radiusText: {
    marginLeft: 6,
    fontSize: 12,
    fontWeight: '600',
    color: colors.textLight,
    letterSpacing: 0.2,
  },
  openMapsButton: {
    position: 'absolute',
    bottom: spacing.sm,
    right: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  openMapsText: {
    marginLeft: 6,
    fontSize: 13,
    fontWeight: '600',
    color: colors.textLight,
    letterSpacing: 0.1,
  },
  satelliteBadge: {
    position: 'absolute',
    bottom: spacing.sm,
    left: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(26, 29, 35, 0.7)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  satelliteText: {
    marginLeft: 4,
    fontSize: 11,
    fontWeight: '500',
    color: colors.textLight,
    letterSpacing: 0.2,
  },
  addressBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  addressIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressContent: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  addressLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  addressText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginTop: 2,
    letterSpacing: -0.1,
  },
  coordsText: {
    fontSize: 10,
    color: colors.textMuted,
    fontFamily: 'monospace',
  },
  placesContainer: {
    flex: 1,
    padding: spacing.md,
  },
  placesTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  placeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  placeIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeInfo: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  placeName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    letterSpacing: -0.1,
  },
  placeDistance: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
    letterSpacing: 0.1,
  },
  directionsButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgba(61, 90, 128, 0.25)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
});
