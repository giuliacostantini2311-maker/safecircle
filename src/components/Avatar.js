import React from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../styles/colors';

export default function Avatar({
  source,
  name,
  size = 48,
  onPress,
  showEditButton = false,
  showOnlineIndicator = false,
  isOnline = false,
  style = {},
}) {
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

      {showOnlineIndicator && (
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
});
