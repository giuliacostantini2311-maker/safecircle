import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, spacing } from '../styles/colors';

export default function Card({
  children,
  title,
  subtitle,
  icon,
  iconColor = colors.primary,
  backgroundColor = colors.background,
  onPress,
  showArrow = false,
  elevated = false,
  style = {},
}) {
  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container
      style={[
        styles.card,
        elevated && styles.cardElevated,
        { backgroundColor },
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {(icon || title) && (
        <View style={styles.header}>
          {icon && (
            <View style={[styles.iconContainer, { backgroundColor: `${iconColor}15` }]}>
              <Feather name={icon} size={22} color={iconColor} />
            </View>
          )}
          <View style={styles.titleContainer}>
            {title && <Text style={styles.title}>{title}</Text>}
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </View>
          {showArrow && onPress && (
            <Feather name="chevron-right" size={22} color={colors.textMuted} />
          )}
        </View>
      )}
      {children}
    </Container>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: spacing.cardPadding,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardElevated: {
    borderRadius: 20,
    padding: spacing.lg,
    borderWidth: 0,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 46,
    height: 46,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    letterSpacing: 0.1,
  },
});
