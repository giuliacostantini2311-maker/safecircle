import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, spacing } from '../styles/colors';

export default function Input({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  error = null,
  icon = null,
  editable = true,
  multiline = false,
  numberOfLines = 1,
  style = {},
  inputStyle = {},
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Map Ionicons to Feather
  const getFeatherIcon = (iconName) => {
    const iconMap = {
      'mail-outline': 'mail',
      'lock-closed-outline': 'lock',
      'person-outline': 'user',
      'call-outline': 'phone',
      'at-outline': 'at-sign',
      'search-outline': 'search',
      'language-outline': 'globe',
    };
    return iconMap[iconName] || iconName;
  };

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View
        style={[
          styles.inputContainer,
          isFocused && styles.focused,
          error && styles.error,
          !editable && styles.disabled,
        ]}
      >
        {icon && (
          <Feather
            name={getFeatherIcon(icon)}
            size={18}
            color={isFocused ? colors.primary : colors.textMuted}
            style={styles.icon}
          />
        )}
        <TextInput
          style={[
            styles.input,
            icon && styles.inputWithIcon,
            multiline && styles.multiline,
            inputStyle,
          ]}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          editable={editable}
          multiline={multiline}
          numberOfLines={numberOfLines}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          autoCorrect={false}
          autoComplete={secureTextEntry ? 'off' : undefined}
          textContentType={secureTextEntry ? 'oneTimeCode' : undefined}
          spellCheck={false}
        />
        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Feather
              name={showPassword ? 'eye-off' : 'eye'}
              size={18}
              color={colors.textMuted}
            />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    letterSpacing: 0.2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
  },
  focused: {
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  error: {
    borderColor: colors.emergency,
  },
  disabled: {
    backgroundColor: colors.backgroundAlt,
    opacity: 0.7,
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    paddingVertical: 14,
    letterSpacing: 0.1,
  },
  inputWithIcon: {
    paddingLeft: 0,
  },
  multiline: {
    minHeight: 100,
    textAlignVertical: 'top',
    paddingTop: 14,
  },
  eyeButton: {
    padding: 8,
    marginRight: -4,
  },
  errorText: {
    fontSize: 13,
    color: colors.emergency,
    marginTop: spacing.xs,
    marginLeft: spacing.xs,
    letterSpacing: 0.1,
  },
});
