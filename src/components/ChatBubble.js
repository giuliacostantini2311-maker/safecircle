import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing } from '../styles/colors';

export default function ChatBubble({
  message,
  isUser = false,
  timestamp,
  showTimestamp = false,
}) {
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <View style={[styles.container, isUser && styles.containerUser]}>
      <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleOther]}>
        <Text style={[styles.text, isUser && styles.textUser]}>{message}</Text>
      </View>
      {showTimestamp && timestamp && (
        <Text style={[styles.timestamp, isUser && styles.timestampUser]}>
          {formatTime(timestamp)}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.xs,
    maxWidth: '75%',
    alignSelf: 'flex-start',
  },
  containerUser: {
    alignSelf: 'flex-end',
  },
  bubble: {
    borderRadius: 18,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
  },
  bubbleOther: {
    backgroundColor: colors.backgroundAlt,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  bubbleUser: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
    shadowColor: 'rgba(61, 90, 128, 0.2)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  text: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 21,
    letterSpacing: 0.1,
  },
  textUser: {
    color: colors.textLight,
  },
  timestamp: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: spacing.xs,
    marginLeft: spacing.sm,
  },
  timestampUser: {
    textAlign: 'right',
    marginRight: spacing.sm,
    marginLeft: 0,
  },
});
