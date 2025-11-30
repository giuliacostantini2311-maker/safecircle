import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  PanResponder,
  Dimensions,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, spacing } from '../styles/colors';

const SLIDER_WIDTH = Dimensions.get('window').width - 80;
const THUMB_SIZE = 56;
const THRESHOLD = 0.85; // 85% to complete

export default function SlideToConfirm({ onConfirm, label = 'Slide to confirm' }) {
  const translateX = useRef(new Animated.Value(0)).current;
  const [completed, setCompleted] = useState(false);

  const maxSlide = SLIDER_WIDTH - THUMB_SIZE - 8;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !completed,
      onMoveShouldSetPanResponder: () => !completed,
      onPanResponderMove: (_, gestureState) => {
        const newValue = Math.max(0, Math.min(gestureState.dx, maxSlide));
        translateX.setValue(newValue);
      },
      onPanResponderRelease: (_, gestureState) => {
        const progress = gestureState.dx / maxSlide;
        
        if (progress >= THRESHOLD) {
          // Complete the slide
          Animated.spring(translateX, {
            toValue: maxSlide,
            useNativeDriver: true,
            friction: 8,
          }).start(() => {
            setCompleted(true);
            onConfirm && onConfirm();
          });
        } else {
          // Reset to start
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
            friction: 8,
          }).start();
        }
      },
    })
  ).current;

  // Background fill animation
  const fillWidth = translateX.interpolate({
    inputRange: [0, maxSlide],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp',
  });

  // Text opacity (fades as you slide)
  const textOpacity = translateX.interpolate({
    inputRange: [0, maxSlide * 0.5],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  if (completed) {
    return (
      <View style={[styles.container, styles.completedContainer]}>
        <Feather name="check" size={24} color={colors.white} />
        <Text style={styles.completedText}>Confirmed!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Background fill */}
      <Animated.View
        style={[
          styles.fill,
          {
            width: fillWidth,
          },
        ]}
      />
      
      {/* Label */}
      <Animated.Text style={[styles.label, { opacity: textOpacity }]}>
        {label}
      </Animated.Text>
      
      {/* Sliding thumb */}
      <Animated.View
        style={[
          styles.thumb,
          {
            transform: [{ translateX }],
          },
        ]}
        {...panResponder.panHandlers}
      >
        <Feather name="chevrons-right" size={24} color={colors.safe} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: SLIDER_WIDTH,
    height: THUMB_SIZE + 8,
    backgroundColor: `${colors.safe}20`,
    borderRadius: (THUMB_SIZE + 8) / 2,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.safe,
  },
  fill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: `${colors.safe}40`,
    borderRadius: (THUMB_SIZE + 8) / 2,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.safe,
    letterSpacing: 0.2,
  },
  thumb: {
    position: 'absolute',
    left: 4,
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  completedContainer: {
    backgroundColor: colors.safe,
    flexDirection: 'row',
    borderColor: colors.safe,
  },
  completedText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
    marginLeft: spacing.sm,
  },
});



