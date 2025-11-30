import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useLocation } from '../../context/LocationContext';
import Button from '../../components/Button';
import { AlertModal } from '../../components/Modal';
import { colors, spacing, typography } from '../../styles/colors';
import { getRandomAddress } from '../../services/mockData';

export default function PoliceModeScreen({ navigation }) {
  const { location, address, getAddressFromCoords } = useLocation();
  
  const [isActive, setIsActive] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [respondingCount, setRespondingCount] = useState(0);
  const [displayAddress, setDisplayAddress] = useState('');
  
  const pulseAnim = new Animated.Value(1);

  useEffect(() => {
    if (location?.coords) {
      getAddressFromCoords(location.coords.latitude, location.coords.longitude);
    }
    setDisplayAddress(address || getRandomAddress());
  }, [location, address]);

  useEffect(() => {
    if (isActive) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();

      const interval = setInterval(() => {
        setRespondingCount((prev) => {
          if (prev < 5) return prev + 1;
          clearInterval(interval);
          return prev;
        });
      }, 1500);

      return () => {
        pulse.stop();
        clearInterval(interval);
      };
    }
  }, [isActive]);

  const handleConfirmEmergency = () => {
    setShowDemoModal(true);
  };

  const handleDemoConfirm = () => {
    setShowDemoModal(false);
    setIsActive(true);
  };

  const handleEndCall = () => {
    setIsActive(false);
    navigation.goBack();
  };

  const coordinates = location?.coords
    ? `${location.coords.latitude.toFixed(6)}, ${location.coords.longitude.toFixed(6)}`
    : '55.676098, 12.568337';

  // Confirmation State
  if (!isActive) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <View style={styles.confirmContainer}>
          <View style={styles.warningIconContainer}>
            <Feather name="alert-triangle" size={64} color={colors.emergency} />
          </View>

          <Text style={styles.emergencyTitle}>Emergency Mode</Text>

          <View style={styles.warningList}>
            <Text style={styles.warningText}>This will:</Text>
            {[
              { icon: 'phone-call', text: 'Simulate calling emergency services (112)' },
              { icon: 'radio', text: 'Alert all users within 500m' },
              { icon: 'map-pin', text: 'Share your location with responders' },
            ].map((item, index) => (
              <View key={index} style={styles.warningItem}>
                <Feather name={item.icon} size={18} color={colors.emergency} />
                <Text style={styles.warningItemText}>{item.text}</Text>
              </View>
            ))}
          </View>

          <Button
            title="CONFIRM EMERGENCY"
            onPress={handleConfirmEmergency}
            variant="emergency"
            size="large"
            style={styles.confirmButton}
          />

          <Button
            title="Cancel"
            onPress={() => navigation.goBack()}
            variant="ghost"
            style={styles.cancelButton}
          />
        </View>

        <AlertModal
          visible={showDemoModal}
          onClose={() => setShowDemoModal(false)}
          icon="information-circle"
          iconColor={colors.primary}
          title="Demo Mode"
          message="In production, this would dial 112 (Danish emergency services). For this demo, we'll simulate the emergency call experience."
          buttons={[
            { text: 'Cancel', onPress: () => setShowDemoModal(false) },
            { text: 'Continue Demo', primary: true, onPress: handleDemoConfirm },
          ]}
        />
      </SafeAreaView>
    );
  }

  // Active Emergency State
  return (
    <SafeAreaView style={styles.activeContainer} edges={['bottom']}>
      <View style={styles.activeHeader}>
        <Text style={styles.activeHeaderText}>CALLING EMERGENCY SERVICES</Text>
      </View>

      <View style={styles.phoneSection}>
        <Animated.View
          style={[
            styles.phoneIconContainer,
            { transform: [{ scale: pulseAnim }] },
          ]}
        >
          <Feather name="phone-call" size={48} color={colors.textLight} />
        </Animated.View>
        <Text style={styles.callingText}>Connecting to 112...</Text>
      </View>

      <View style={styles.locationSection}>
        <Text style={styles.locationLabel}>Your Location</Text>
        <Text style={styles.locationAddress}>{displayAddress}</Text>
        <Text style={styles.locationCoords}>{coordinates}</Text>
      </View>

      <View style={styles.alertStatus}>
        <Feather name="radio" size={20} color={colors.guardian} />
        <Text style={styles.alertStatusText}>Nearby users have been alerted</Text>
      </View>

      {respondingCount > 0 && (
        <View style={styles.respondingSection}>
          <Feather name="users" size={20} color={colors.safe} />
          <Text style={styles.respondingText}>
            {respondingCount} {respondingCount === 1 ? 'person is' : 'people are'} responding
          </Text>
        </View>
      )}

      <Button
        title="End Call"
        onPress={handleEndCall}
        variant="outline"
        size="large"
        style={styles.endCallButton}
        textStyle={{ color: colors.textLight }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  confirmContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing.xxl,
  },
  warningIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: `${colors.emergency}12`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  emergencyTitle: {
    ...typography.title,
    color: colors.emergency,
    marginBottom: spacing.xl,
  },
  warningList: {
    width: '100%',
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: spacing.cardPadding,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  warningText: {
    ...typography.heading,
    color: colors.text,
    marginBottom: spacing.md,
  },
  warningItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  warningItemText: {
    marginLeft: spacing.sm,
    ...typography.caption,
    color: colors.textSecondary,
    flex: 1,
  },
  confirmButton: {
    width: '100%',
    marginBottom: spacing.md,
  },
  cancelButton: {
    width: '100%',
  },
  // Active State
  activeContainer: {
    flex: 1,
    backgroundColor: colors.emergency,
    alignItems: 'center',
    paddingHorizontal: spacing.screenPadding,
  },
  activeHeader: {
    width: '100%',
    paddingVertical: spacing.lg,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.2)',
  },
  activeHeaderText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textLight,
    letterSpacing: 1,
  },
  phoneSection: {
    alignItems: 'center',
    marginTop: spacing.xxl,
    marginBottom: spacing.xl,
  },
  phoneIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  callingText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textLight,
    letterSpacing: 0.2,
  },
  locationSection: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 16,
    padding: spacing.cardPadding,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  locationLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.7)',
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  locationAddress: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: spacing.sm,
    letterSpacing: -0.2,
  },
  locationCoords: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  alertStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 24,
    marginBottom: spacing.sm,
  },
  alertStatusText: {
    marginLeft: spacing.sm,
    fontSize: 14,
    fontWeight: '600',
    color: colors.textLight,
  },
  respondingSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 24,
    marginBottom: spacing.xl,
  },
  respondingText: {
    marginLeft: spacing.sm,
    fontSize: 14,
    fontWeight: '600',
    color: colors.textLight,
  },
  endCallButton: {
    width: '100%',
    marginTop: 'auto',
    marginBottom: spacing.xl,
    borderColor: 'rgba(255,255,255,0.5)',
  },
});
