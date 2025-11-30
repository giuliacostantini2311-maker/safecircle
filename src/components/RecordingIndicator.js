import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, spacing } from '../styles/colors';

export default function RecordingIndicator({ duration, compact = false }) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0.6,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (compact) {
    return (
      <View style={styles.compactContainer}>
        <Animated.View
          style={[
            styles.compactDot,
            {
              transform: [{ scale: pulseAnim }],
              opacity: opacityAnim,
            },
          ]}
        />
        <Text style={styles.compactText}>{formatTime(duration)}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.dotContainer}>
          <Animated.View
            style={[
              styles.dotPulse,
              {
                transform: [{ scale: pulseAnim }],
                opacity: opacityAnim,
              },
            ]}
          />
          <View style={styles.dot} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Recording</Text>
          <Text style={styles.timer}>{formatTime(duration)}</Text>
        </View>
        <Feather name="shield" size={22} color={colors.safe} />
      </View>
      <View style={styles.secureRow}>
        <Feather name="lock" size={12} color={colors.textSecondary} />
        <Text style={styles.subtitle}>Audio saved securely</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FDF6F6',
    borderRadius: 14,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#F5DEDE',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dotContainer: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  dotPulse: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.emergency,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.emergency,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.emergency,
    letterSpacing: 0.3,
  },
  timer: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.emergencyDark,
    fontVariant: ['tabular-nums'],
    letterSpacing: -0.5,
  },
  secureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
    letterSpacing: 0.1,
  },
  // Compact styles
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDF6F6',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F5DEDE',
  },
  compactDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.emergency,
    marginRight: 8,
  },
  compactText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.emergency,
    fontVariant: ['tabular-nums'],
  },
});
