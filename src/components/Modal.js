import React from 'react';
import {
  Modal as RNModal,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, spacing } from '../styles/colors';

export default function Modal({
  visible,
  onClose,
  title,
  children,
  showCloseButton = true,
  closeOnBackdrop = true,
  size = 'medium',
}) {
  const getModalSize = () => {
    switch (size) {
      case 'small':
        return { maxWidth: 300 };
      case 'large':
        return { maxWidth: 500, maxHeight: '80%' };
      case 'full':
        return { flex: 1, margin: 0, borderRadius: 0 };
      default:
        return { maxWidth: 400 };
    }
  };

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={closeOnBackdrop ? onClose : null}>
        <View style={styles.overlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardView}
          >
            <TouchableWithoutFeedback>
              <View style={[styles.modalContainer, getModalSize()]}>
                {/* Handle bar */}
                <View style={styles.handleBar} />
                
                {(title || showCloseButton) && (
                  <View style={styles.header}>
                    <Text style={styles.title}>{title}</Text>
                    {showCloseButton && (
                      <TouchableOpacity
                        onPress={onClose}
                        style={styles.closeButton}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      >
                        <Feather name="x" size={22} color={colors.textSecondary} />
                      </TouchableOpacity>
                    )}
                  </View>
                )}
                <View style={styles.content}>{children}</View>
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </RNModal>
  );
}

// Alert Modal Component for simple alerts
export function AlertModal({
  visible,
  onClose,
  icon,
  iconColor = colors.primary,
  title,
  message,
  buttons = [],
}) {
  // Map icon names
  const getFeatherIcon = (iconName) => {
    const iconMap = {
      'checkmark-circle': 'check-circle',
      'warning': 'alert-triangle',
      'information-circle': 'info',
      'sync': 'refresh-cw',
    };
    return iconMap[iconName] || iconName;
  };

  return (
    <Modal visible={visible} onClose={onClose} showCloseButton={false} size="small">
      <View style={styles.alertContent}>
        {icon && (
          <View style={[styles.alertIcon, { backgroundColor: `${iconColor}12` }]}>
            <Feather name={getFeatherIcon(icon)} size={28} color={iconColor} />
          </View>
        )}
        {title && <Text style={styles.alertTitle}>{title}</Text>}
        {message && <Text style={styles.alertMessage}>{message}</Text>}
        <View style={styles.alertButtons}>
          {buttons.map((button, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.alertButton,
                button.primary && styles.alertButtonPrimary,
                index > 0 && { marginLeft: 12 },
              ]}
              onPress={button.onPress}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.alertButtonText,
                  button.primary && styles.alertButtonTextPrimary,
                  button.destructive && styles.alertButtonTextDestructive,
                ]}
              >
                {button.text}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.screenPadding,
  },
  keyboardView: {
    width: '100%',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: colors.background,
    borderRadius: 24,
    width: '100%',
    overflow: 'hidden',
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 28,
    elevation: 12,
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
    letterSpacing: -0.3,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  // Alert Modal Styles
  alertContent: {
    alignItems: 'center',
    paddingTop: spacing.lg,
  },
  alertIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  alertTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.sm,
    letterSpacing: -0.3,
  },
  alertMessage: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.lg,
    letterSpacing: 0.1,
  },
  alertButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  alertButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: colors.backgroundAlt,
    minWidth: 100,
    alignItems: 'center',
  },
  alertButtonPrimary: {
    backgroundColor: colors.primary,
    shadowColor: 'rgba(61, 90, 128, 0.25)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  alertButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    letterSpacing: 0.1,
  },
  alertButtonTextPrimary: {
    color: colors.textLight,
  },
  alertButtonTextDestructive: {
    color: colors.emergency,
  },
});
