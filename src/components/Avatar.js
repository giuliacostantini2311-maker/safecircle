import React from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../styles/colors';

// Badge level configuration
const BADGE_LEVELS = {
  copper: { min: 1, max: 4, color: '#B87333', name: 'Copper' },
  bronze: { min: 5, max: 9, color: '#CD7F32', name: 'Bronze' },
  silver: { min: 10, max: 49, color: '#C0C0C0', name: 'Silver' },
  gold: { min: 50, max: 99, color: '#FFD700', name: 'Gold' },
  diamond: { min: 100, max: Infinity, color: '#b9f2ff', name: 'Diamond' },
};

// Get badge info based on helps count
export const getBadgeLevel = (helpsCount) => {
  if (!helpsCount || helpsCount === 0) return null;
  
  if (helpsCount >= BADGE_LEVELS.diamond.min) return { ...BADGE_LEVELS.diamond, level: 5 };
  if (helpsCount >= BADGE_LEVELS.gold.min) return { ...BADGE_LEVELS.gold, level: 4 };
  if (helpsCount >= BADGE_LEVELS.silver.min) return { ...BADGE_LEVELS.silver, level: 3 };
  if (helpsCount >= BADGE_LEVELS.bronze.min) return { ...BADGE_LEVELS.bronze, level: 2 };
  if (helpsCount >= BADGE_LEVELS.copper.min) return { ...BADGE_LEVELS.copper, level: 1 };
  
  return null;
};

export default function Avatar({
  source,
  name,
  size = 48,
  onPress,
  showEditButton = false,
  showOnlineIndicator = false,
  isOnline = false,
  helpsCount,
  showBadge = false,
  style = {},
}) {
  // Use provided helpsCount or default to 0 (no badge) if not specified
  const effectiveHelpsCount = helpsCount !== undefined ? helpsCount : 0;
  // Generate initials from name
  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  };

  // Generate a consistent warm color based on name
  const getBackgroundColor = (name) => {
    if (!name) return colors.primary;
    const colorOptions = [
      '#3D5A80', // primary blue
      '#7EA172', // sage green
      '#D4A574', // warm amber
      '#8B7355', // warm brown
      '#6B8E7B', // muted teal
      '#9B7E6E', // dusty rose
    ];
    const index = name.charCodeAt(0) % colorOptions.length;
    return colorOptions[index];
  };

  const Container = onPress ? TouchableOpacity : View;
  const badge = showBadge ? getBadgeLevel(effectiveHelpsCount) : null;
  
  // Badge size relative to avatar
  const badgeSize = Math.max(18, size * 0.38);
  const isDiamond = badge?.name === 'Diamond';

  return (
    <Container
      style={[styles.container, { width: size, height: size }, style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {source ? (
        <Image
          source={typeof source === 'string' ? { uri: source } : source}
          style={[
            styles.image,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
            },
          ]}
        />
      ) : (
        <View
          style={[
            styles.placeholder,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: getBackgroundColor(name),
            },
          ]}
        >
          <Text
            style={[
              styles.initials,
              { fontSize: size * 0.38 },
            ]}
          >
            {getInitials(name)}
          </Text>
        </View>
      )}

      {showEditButton && (
        <View style={[styles.editButton, { right: -2, bottom: -2 }]}>
          <Feather name="camera" size={12} color={colors.textLight} />
        </View>
      )}

      {showOnlineIndicator && !badge && (
        <View
          style={[
            styles.onlineIndicator,
            {
              backgroundColor: isOnline ? colors.online : colors.offline,
              width: Math.max(10, size * 0.22),
              height: Math.max(10, size * 0.22),
              borderRadius: Math.max(5, size * 0.11),
            },
          ]}
        />
      )}

      {/* Level Badge */}
      {badge && (
        <View
          style={[
            styles.badgeContainer,
            {
              width: badgeSize,
              height: badgeSize,
              borderRadius: badgeSize / 2,
              backgroundColor: badge.color,
              // Diamond glow effect
              ...(isDiamond && {
                shadowColor: '#b9f2ff',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.8,
                shadowRadius: 6,
                elevation: 8,
              }),
            },
          ]}
        >
          <Feather 
            name="star" 
            size={badgeSize * 0.55} 
            color={isDiamond ? '#1a1d23' : '#FFFFFF'} 
          />
        </View>
      )}
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  image: {
    resizeMode: 'cover',
    borderWidth: 2,
    borderColor: colors.background,
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.background,
  },
  initials: {
    color: colors.textLight,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  editButton: {
    position: 'absolute',
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.background,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  onlineIndicator: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    borderWidth: 2,
    borderColor: colors.background,
  },
  badgeContainer: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.background,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
});
