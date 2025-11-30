import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useLocation } from '../../context/LocationContext';
import Button from '../../components/Button';
import Avatar from '../../components/Avatar';
import SafetyMap from '../../components/SafetyMap';
import { colors, spacing, typography } from '../../styles/colors';
import { ALERT_EXPIRY_TIME } from '../../utils/constants';

export default function GuardianAlertScreen({ navigation }) {
  const { location } = useLocation();
  
  const [countdown, setCountdown] = useState(ALERT_EXPIRY_TIME);
  const [requestContext] = useState('Walking home alone');
  const [requesterName] = useState('Maria L.');
  const [distance] = useState(250);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigation.goBack();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleHelp = () => {
    navigation.navigate('GuardianMode');
  };

  const handleDecline = () => {
    navigation.goBack();
  };

  const approximateLocation = location?.coords ? {
    latitude: location.coords.latitude + (Math.random() - 0.5) * 0.003,
    longitude: location.coords.longitude + (Math.random() - 0.5) * 0.003,
  } : {
    latitude: 55.6761,
    longitude: 12.5683,
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.alertHeader}>
        <View style={styles.alertBadge}>
          <Feather name="alert-circle" size={20} color={colors.guardian} />
          <Text style={styles.alertBadgeText}>Help Request</Text>
        </View>
        <Text style={styles.countdownText}>Expires in {countdown}s</Text>
      </View>

      <View style={styles.mapContainer}>
        <SafetyMap
          userLocation={approximateLocation}
          showRadius
          radius={100}
        />
        <View style={styles.mapOverlay}>
          <View style={styles.blurBadge}>
            <Feather name="eye-off" size={14} color={colors.textSecondary} />
            <Text style={styles.blurText}>Approximate location</Text>
          </View>
        </View>
      </View>

      <View style={styles.detailsSection}>
        <View style={styles.requesterInfo}>
          <Avatar name={requesterName} size={52} />
          <View style={styles.requesterText}>
            <Text style={styles.alertTitle}>Someone nearby needs help</Text>
            <Text style={styles.distanceText}>~{distance}m from you</Text>
          </View>
        </View>

        {requestContext && (
          <View style={styles.contextContainer}>
            <Feather name="message-circle" size={16} color={colors.textSecondary} />
            <Text style={styles.contextText}>"{requestContext}"</Text>
          </View>
        )}

        <View style={styles.requesterDetails}>
          <View style={styles.detailItem}>
            <Feather name="user" size={16} color={colors.textSecondary} />
            <Text style={styles.detailText}>{requesterName}</Text>
          </View>
          <View style={styles.detailItem}>
            <Feather name="check-circle" size={16} color={colors.safe} />
            <Text style={styles.detailText}>Verified member</Text>
          </View>
        </View>
      </View>

      <View style={styles.actions}>
        <Button
          title="I Can Help"
          onPress={handleHelp}
          variant="safe"
          size="large"
          icon="hand-left"
          style={styles.helpButton}
        />
        <Button
          title="Can't Help Now"
          onPress={handleDecline}
          variant="ghost"
          size="large"
          style={styles.declineButton}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: `${colors.guardian}12`,
    borderBottomWidth: 1,
    borderBottomColor: colors.guardianLight,
  },
  alertBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertBadgeText: {
    marginLeft: spacing.sm,
    fontSize: 15,
    fontWeight: '600',
    color: colors.guardianDark,
  },
  countdownText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  mapContainer: {
    height: 220,
    margin: spacing.md,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  mapOverlay: {
    position: 'absolute',
    bottom: spacing.sm,
    left: spacing.sm,
    right: spacing.sm,
  },
  blurBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  blurText: {
    marginLeft: 6,
    fontSize: 12,
    color: colors.textSecondary,
  },
  detailsSection: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  requesterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  requesterText: {
    marginLeft: spacing.md,
    flex: 1,
  },
  alertTitle: {
    ...typography.heading,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  distanceText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  contextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundAlt,
    padding: spacing.md,
    borderRadius: 14,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  contextText: {
    marginLeft: spacing.sm,
    ...typography.body,
    color: colors.text,
    fontStyle: 'italic',
    flex: 1,
  },
  requesterDetails: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundAlt,
    borderRadius: 14,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  detailItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    marginLeft: spacing.sm,
    ...typography.caption,
    color: colors.textSecondary,
  },
  actions: {
    padding: spacing.md,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  helpButton: {
    marginBottom: spacing.sm,
  },
  declineButton: {},
});
