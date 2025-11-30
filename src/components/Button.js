import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../styles/colors';

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon = null,
  iconPosition = 'left',
  style = {},
  textStyle = {},
}) {
  const getBackgroundColor = () => {
    if (disabled) return colors.border;
    switch (variant) {
      case 'primary':
        return colors.primary;
      case 'guardian':
        return colors.guardian;
      case 'emergency':
        return colors.emergency;
      case 'safe':
        return colors.safe;
      case 'outline':
        return 'transparent';
      case 'ghost':
        return 'transparent';
      default:
        return colors.primary;
    }
  };

  const getTextColor = () => {
    if (disabled) return colors.textMuted;
    switch (variant) {
      case 'outline':
        return colors.primary;
      case 'ghost':
        return colors.primary;
      default:
        return colors.textLight;
    }
  };

  const getShadow = () => {
    if (disabled || variant === 'outline' || variant === 'ghost') return {};
    
    const shadowColors = {
      primary: 'rgba(61, 90, 128, 0.25)',
      guardian: 'rgba(212, 165, 116, 0.3)',
      emergency: 'rgba(193, 102, 107, 0.3)',
      safe: 'rgba(126, 161, 114, 0.3)',
    };
    
    return {
      shadowColor: shadowColors[variant] || shadowColors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 8,
      elevation: 4,
    };
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: 10,
          paddingHorizontal: 16,
          fontSize: 14,
          iconSize: 16,
        };
      case 'large':
        return {
          paddingVertical: 18,
          paddingHorizontal: 28,
          fontSize: 17,
          iconSize: 22,
        };
      default:
        return {
          paddingVertical: 16,
          paddingHorizontal: 24,
          fontSize: 16,
          iconSize: 20,
        };
    }
  };

  const sizeStyles = getSizeStyles();

  // Map Ionicons names to Feather names
  const getFeatherIcon = (iconName) => {
    const iconMap = {
      'alert-circle': 'alert-circle',
      'call': 'phone-call',
      'checkmark-circle': 'check-circle',
      'people': 'users',
      'radio': 'radio',
      'shield-checkmark': 'shield',
      'arrow-forward': 'arrow-right',
      'log-out-outline': 'log-out',
      'person-add': 'user-plus',
      'search-outline': 'search',
      'call-outline': 'phone',
      'shield-outline': 'shield',
      'id-card-outline': 'credit-card',
      'hand-left': 'hand',
      'navigate': 'navigation',
    };
    return iconMap[iconName] || iconName;
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          paddingVertical: sizeStyles.paddingVertical,
          paddingHorizontal: sizeStyles.paddingHorizontal,
        },
        variant === 'outline' && styles.outline,
        variant === 'outline' && disabled && styles.outlineDisabled,
        getShadow(),
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <View style={styles.content}>
          {icon && iconPosition === 'left' && (
            <Feather
              name={getFeatherIcon(icon)}
              size={sizeStyles.iconSize}
              color={getTextColor()}
              style={styles.iconLeft}
            />
          )}
          <Text
            style={[
              styles.text,
              { color: getTextColor(), fontSize: sizeStyles.fontSize },
              textStyle,
            ]}
          >
            {title}
          </Text>
          {icon && iconPosition === 'right' && (
            <Feather
              name={getFeatherIcon(icon)}
              size={sizeStyles.iconSize}
              color={getTextColor()}
              style={styles.iconRight}
            />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  outline: {
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  outlineDisabled: {
    borderColor: colors.border,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  iconLeft: {
    marginRight: 10,
  },
  iconRight: {
    marginLeft: 10,
  },
});
