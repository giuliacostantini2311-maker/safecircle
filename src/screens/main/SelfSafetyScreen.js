import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { useLocation } from '../../context/LocationContext';
import Button from '../../components/Button';
import RecordingIndicator from '../../components/RecordingIndicator';
import SafetyMap from '../../components/SafetyMap';
import Modal, { AlertModal } from '../../components/Modal';
import Input from '../../components/Input';
import { colors, spacing, typography } from '../../styles/colors';

export default function SelfSafetyScreen({ navigation }) {
  const { location, safePlaces, getCurrentLocation, startTracking, stopTracking } = useLocation();
  
  const [isActive, setIsActive] = useState(false);
  const [notifyContacts, setNotifyContacts] = useState(true);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [recording, setRecording] = useState(null);
  const [showExitModal, setShowExitModal] = useState(false);
  const [exitNote, setExitNote] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  const timerRef = useRef(null);

  useEffect(() => {
    getCurrentLocation();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      stopTracking();
    };
  }, []);

  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
    } catch (err) {
      console.log('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    if (recording) {
      try {
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        console.log('Recording saved to', uri);
      } catch (err) {
        console.log('Failed to stop recording', err);
      }
      setRecording(null);
    }
  };

  const handleActivate = async () => {
    setIsActive(true);
    await startRecording();
    startTracking();
    
    timerRef.current = setInterval(() => {
      setRecordingDuration((prev) => prev + 1);
    }, 1000);
    
    if (notifyContacts) {
      console.log('Notifying trusted contacts...');
    }
  };

  const handleDeactivate = () => {
    setShowExitModal(true);
  };

  const handleConfirmSafe = async () => {
    await stopRecording();
    if (timerRef.current) clearInterval(timerRef.current);
    stopTracking();
    setShowExitModal(false);
    setShowSuccessModal(true);
  };

  const handleSuccessDismiss = () => {
    setShowSuccessModal(false);
    navigation.goBack();
  };

  const userLocation = location?.coords ? {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
  } : null;

  // Inactive State
  if (!isActive) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Icon */}
          <View style={styles.iconSection}>
            <View style={styles.iconContainer}>
              <Feather name="shield" size={56} color={colors.primary} />
            </View>
          </View>

          {/* Description */}
          <View style={styles.descriptionSection}>
            <Text style={styles.descriptionTitle}>When activated, we will:</Text>
            
            <View style={styles.featureList}>
              {[
                'Start recording audio',
                'Notify your trusted contacts',
                'Show nearby safe places',
                'Track your location',
              ].map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <View style={styles.featureCheck}>
                    <Feather name="check" size={14} color={colors.safe} />
                  </View>
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Toggle */}
          <View style={styles.toggleSection}>
            <Text style={styles.toggleLabel}>Notify trusted contacts</Text>
            <Switch
              value={notifyContacts}
              onValueChange={setNotifyContacts}
              trackColor={{ false: colors.border, true: colors.primaryLight }}
              thumbColor={notifyContacts ? colors.primary : colors.textMuted}
            />
          </View>

          {/* Activate Button */}
          <Button
            title="I Don't Feel Safe"
            onPress={handleActivate}
            variant="primary"
            size="large"
            icon="alert-circle"
            style={styles.activateButton}
          />
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Active State
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {/* Recording Banner */}
      <View style={styles.recordingBanner}>
        <RecordingIndicator duration={recordingDuration} />
      </View>

      {/* Map */}
      <View style={styles.mapContainer}>
        <SafetyMap
          userLocation={userLocation}
          safePlaces={safePlaces}
          onSafePlacePress={(place) => {
            Alert.alert(
              place.name,
              `${place.distance}m away\n${place.address}`,
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Get Directions', onPress: () => console.log('Navigate to', place.name) },
              ]
            );
          }}
        />
      </View>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <Button
          title="Upgrade to Guardian Mode"
          onPress={() => navigation.replace('GuardianMode')}
          variant="guardian"
          icon="people"
          style={styles.upgradeButton}
        />
        
        <View style={styles.bottomButtonRow}>
          <Button
            title="Call Police"
            onPress={() => navigation.replace('PoliceMode')}
            variant="outline"
            icon="call"
            style={styles.policeButton}
            textStyle={{ color: colors.emergency }}
          />
          
          <Button
            title="I'm Safe Now"
            onPress={handleDeactivate}
            variant="safe"
            icon="checkmark-circle"
            style={styles.safeButton}
          />
        </View>
      </View>

      {/* Exit Modal */}
      <Modal
        visible={showExitModal}
        onClose={() => setShowExitModal(false)}
        title="Are you safe now?"
      >
        <Input
          placeholder="What happened? (optional)"
          value={exitNote}
          onChangeText={setExitNote}
          multiline
          numberOfLines={3}
        />
        <View style={styles.modalButtons}>
          <Button
            title="Cancel"
            onPress={() => setShowExitModal(false)}
            variant="outline"
            style={styles.modalButton}
          />
          <Button
            title="Yes, I'm Safe"
            onPress={handleConfirmSafe}
            variant="safe"
            style={styles.modalButton}
          />
        </View>
      </Modal>

      {/* Success Modal */}
      <AlertModal
        visible={showSuccessModal}
        onClose={handleSuccessDismiss}
        icon="checkmark-circle"
        iconColor={colors.safe}
        title="Glad you're safe!"
        message="Your recording has been saved. Your trusted contacts have been notified that you're safe."
        buttons={[
          {
            text: 'Done',
            primary: true,
            onPress: handleSuccessDismiss,
          },
        ]}
      />
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
  iconSection: {
    alignItems: 'center',
    marginTop: spacing.xxl,
    marginBottom: spacing.xl,
  },
  iconContainer: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: `${colors.primary}12`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  descriptionSection: {
    marginBottom: spacing.xl,
  },
  descriptionTitle: {
    ...typography.heading,
    color: colors.text,
    marginBottom: spacing.md,
  },
  featureList: {
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  featureCheck: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: `${colors.safe}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  featureText: {
    ...typography.body,
    color: colors.text,
  },
  toggleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background,
    borderRadius: 14,
    padding: spacing.md,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  toggleLabel: {
    ...typography.body,
    fontWeight: '500',
    color: colors.text,
  },
  activateButton: {
    marginTop: 'auto',
  },
  // Active state styles
  recordingBanner: {
    padding: spacing.md,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  mapContainer: {
    flex: 1,
    margin: spacing.md,
    borderRadius: 16,
    overflow: 'hidden',
  },
  bottomActions: {
    padding: spacing.md,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  upgradeButton: {
    marginBottom: spacing.sm,
  },
  bottomButtonRow: {
    flexDirection: 'row',
  },
  policeButton: {
    flex: 1,
    marginRight: spacing.sm,
    borderColor: colors.emergency,
  },
  safeButton: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  modalButtons: {
    flexDirection: 'row',
    marginTop: spacing.md,
  },
  modalButton: {
    flex: 1,
    marginHorizontal: spacing.xs,
  },
});
