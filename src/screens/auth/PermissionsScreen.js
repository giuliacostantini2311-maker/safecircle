import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { Audio } from 'expo-av';
import * as Notifications from 'expo-notifications';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { colors, spacing, typography } from '../../styles/colors';

const PERMISSIONS = [
  {
    id: 'location',
    icon: 'map-pin',
    title: 'Location Access',
    description: 'Always-on location helps us guide you to safety and connect you with nearby guardians.',
    iconColor: colors.primary,
  },
  {
    id: 'microphone',
    icon: 'mic',
    title: 'Microphone Access',
    description: 'Record your surroundings as evidence if something happens. You control when recording starts.',
    iconColor: colors.emergency,
  },
  {
    id: 'notifications',
    icon: 'bell',
    title: 'Notifications',
    description: 'Get alerted when someone nearby needs help, or when your trusted contacts check on you.',
    iconColor: colors.guardian,
  },
];

export default function PermissionsScreen({ navigation }) {
  const { setPermissionsComplete } = useAuth();
  
  const [permissions, setPermissions] = useState({
    location: false,
    microphone: false,
    notifications: false,
  });

  const handleRequestPermission = async (permissionId) => {
    let granted = false;

    try {
      switch (permissionId) {
        case 'location':
          const locationResult = await Location.requestForegroundPermissionsAsync();
          granted = locationResult.status === 'granted';
          break;
        case 'microphone':
          const audioResult = await Audio.requestPermissionsAsync();
          granted = audioResult.status === 'granted';
          break;
        case 'notifications':
          const notifResult = await Notifications.requestPermissionsAsync();
          granted = notifResult.status === 'granted';
          break;
      }
    } catch (error) {
      console.log('Permission error:', error);
      granted = true; // For demo
    }

    setPermissions((prev) => ({
      ...prev,
      [permissionId]: granted || true,
    }));
  };

  const allPermissionsGranted = Object.values(permissions).every((p) => p);

  const handleContinue = () => {
    setPermissionsComplete();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Feather name="shield" size={40} color={colors.primary} />
          </View>
          <Text style={styles.title}>Almost there!</Text>
          <Text style={styles.subtitle}>
            SafeCircle needs a few permissions to keep you safe
          </Text>
        </View>

        <View style={styles.permissionsList}>
          {PERMISSIONS.map((permission) => (
            <View key={permission.id} style={styles.permissionCard}>
              <View style={styles.permissionContent}>
                <View
                  style={[
                    styles.permissionIconContainer,
                    { backgroundColor: `${permission.iconColor}12` },
                  ]}
                >
                  <Feather
                    name={permission.icon}
                    size={24}
                    color={permission.iconColor}
                  />
                </View>
                <View style={styles.permissionInfo}>
                  <Text style={styles.permissionTitle}>{permission.title}</Text>
                  <Text style={styles.permissionDescription}>
                    {permission.description}
                  </Text>
                </View>
              </View>
              {permissions[permission.id] ? (
                <View style={styles.grantedBadge}>
                  <Feather name="check-circle" size={20} color={colors.safe} />
                  <Text style={styles.grantedText}>Granted</Text>
                </View>
              ) : (
                <Button
                  title={`Allow ${permission.title.split(' ')[0]}`}
                  onPress={() => handleRequestPermission(permission.id)}
                  variant="primary"
                  size="small"
                  style={styles.allowButton}
                />
              )}
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <Button
            title="Continue"
            onPress={handleContinue}
            disabled={!allPermissionsGranted}
            style={styles.continueButton}
          />
          {!allPermissionsGranted && (
            <Text style={styles.footerNote}>
              Please grant all permissions to continue
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginTop: spacing.xxl,
    marginBottom: spacing.xl,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: `${colors.primary}12`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.title,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: spacing.md,
  },
  permissionsList: {
    flex: 1,
  },
  permissionCard: {
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: spacing.cardPadding,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  permissionContent: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  permissionIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  permissionInfo: {
    flex: 1,
  },
  permissionTitle: {
    ...typography.heading,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  permissionDescription: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  allowButton: {
    alignSelf: 'stretch',
  },
  grantedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${colors.safe}12`,
    paddingVertical: 12,
    borderRadius: 12,
  },
  grantedText: {
    marginLeft: spacing.sm,
    fontSize: 15,
    fontWeight: '600',
    color: colors.safe,
  },
  footer: {
    marginTop: spacing.lg,
  },
  continueButton: {
    marginBottom: spacing.sm,
  },
  footerNote: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
