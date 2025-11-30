import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Avatar from './Avatar';
import { colors, spacing } from '../styles/colors';

export default function GuardianCard({
  guardian,
  onPress,
  variant = 'default',
  showActions = false,
  onAddToTrusted,
}) {
  const formatDistance = (meters) => {
    if (meters >= 1000) {
      return `${(meters / 1000).toFixed(1)}km away`;
    }
    return `${Math.round(meters)}m away`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (variant === 'searching') {
    return (
      <View style={[styles.card, styles.searchingCard]}>
        <View style={styles.searchingDot} />
        <Text style={styles.searchingText}>Guardian is viewing...</Text>
      </View>
    );
  }

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={onPress ? 0.8 : 1}
    >
      <Avatar
        name={guardian.name}
        source={guardian.avatar}
        size={50}
        showOnlineIndicator={variant === 'default'}
        isOnline={true}
      />
      
      <View style={styles.info}>
        <Text style={styles.name}>{guardian.name}</Text>
        
        {variant === 'default' && (
          <View style={styles.details}>
            <View style={styles.rating}>
              <Feather name="thumbs-up" size={13} color={colors.safe} />
              <Text style={styles.ratingText}>{guardian.rating}%</Text>
            </View>
            <Text style={styles.distance}>
              ~{formatDistance(guardian.distance)}
            </Text>
          </View>
        )}
        
        {variant === 'connected' && (
          <View style={styles.details}>
            <Text style={styles.helpedOn}>
              Helped on {formatDate(guardian.helpedOn)}
            </Text>
            {guardian.rating && (
              <Feather
                name={guardian.rating === 'up' ? 'thumbs-up' : 'thumbs-down'}
                size={14}
                color={guardian.rating === 'up' ? colors.safe : colors.emergency}
              />
            )}
          </View>
        )}
      </View>

      {showActions && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={onAddToTrusted}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Feather name="user-plus" size={18} color={colors.primary} />
        </TouchableOpacity>
      )}

      {onPress && !showActions && (
        <Feather name="chevron-right" size={20} color={colors.textMuted} />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 14,
    padding: spacing.md,
    marginVertical: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  searchingCard: {
    justifyContent: 'flex-start',
    backgroundColor: colors.guardianLight,
    borderColor: colors.guardian,
    borderWidth: 1,
  },
  searchingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.guardian,
    marginRight: spacing.sm,
  },
  searchingText: {
    fontSize: 14,
    color: colors.guardianDark,
    fontWeight: '500',
    letterSpacing: 0.1,
  },
  info: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  details: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  ratingText: {
    fontSize: 13,
    color: colors.safe,
    fontWeight: '600',
    marginLeft: 4,
  },
  distance: {
    fontSize: 13,
    color: colors.textSecondary,
    letterSpacing: 0.1,
  },
  helpedOn: {
    fontSize: 13,
    color: colors.textSecondary,
    marginRight: spacing.sm,
    letterSpacing: 0.1,
  },
  addButton: {
    padding: spacing.sm,
    backgroundColor: colors.primaryLight + '20',
    borderRadius: 10,
  },
});
