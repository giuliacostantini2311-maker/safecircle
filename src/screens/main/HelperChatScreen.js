import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import Avatar from '../../components/Avatar';
import Button from '../../components/Button';
import SlideToConfirm from '../../components/SlideToConfirm';
import SafetyMap from '../../components/SafetyMap';
import { colors, spacing, typography } from '../../styles/colors';
import { guardianLevels, getDisplayName } from '../../services/mockData';

const { width } = Dimensions.get('window');

export default function HelperChatScreen({ route, navigation }) {
  const { caller } = route.params;
  const scrollViewRef = useRef(null);
  
  const [messages, setMessages] = useState([
    {
      id: 'msg_1',
      sender: 'caller',
      text: caller.message || "I need help.",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [metCaller, setMetCaller] = useState(false);
  const [callerSafe, setCallerSafe] = useState(false);
  const [showMilestoneModal, setShowMilestoneModal] = useState(false);
  
  const callerDisplayName = getDisplayName(caller.firstName, caller.lastName);

  // Simulate getting current guardian level (would come from user data in real app)
  const currentHelps = 0; // First help
  const newLevel = guardianLevels.find(l => l.helpsRequired <= currentHelps + 1) || guardianLevels[1];

  const sendMessage = () => {
    if (!inputText.trim()) return;
    
    const newMessage = {
      id: `msg_${Date.now()}`,
      sender: 'guardian',
      text: inputText.trim(),
      timestamp: new Date().toISOString(),
    };
    
    setMessages(prev => [...prev, newMessage]);
    setInputText('');
    
    // Simulate caller response
    setTimeout(() => {
      const responses = [
        "Thank you so much for helping me!",
        "I can see you on the map, I'm near the bus stop.",
        "I really appreciate this.",
      ];
      const response = {
        id: `msg_${Date.now() + 1}`,
        sender: 'caller',
        text: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, response]);
    }, 2000);
  };

  const handleMetCaller = () => {
    setMetCaller(true);
  };

  const handleCallerSafe = () => {
    setCallerSafe(true);
    // Show milestone modal after a short delay
    setTimeout(() => {
      setShowMilestoneModal(true);
    }, 1000);
  };

  const handleComplete = () => {
    setShowMilestoneModal(false);
    navigation.navigate('Home');
  };

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const renderMessage = (message) => {
    const isGuardian = message.sender === 'guardian';
    
    return (
      <View
        key={message.id}
        style={[
          styles.messageBubble,
          isGuardian ? styles.guardianMessage : styles.callerMessage,
        ]}
      >
        <Text style={[
          styles.messageText,
          isGuardian ? styles.guardianMessageText : styles.callerMessageText,
        ]}>
          {message.text}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {/* Confirmation Banner */}
      {callerSafe && (
        <View style={styles.confirmationBanner}>
          <Feather name="check-circle" size={20} color={colors.white} />
          <Text style={styles.confirmationText}>
            You helped save {callerDisplayName} today! 🎉
          </Text>
        </View>
      )}

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
        keyboardVerticalOffset={100}
      >
        {/* Caller Header */}
        <View style={styles.callerHeader}>
          <Avatar
            name={callerDisplayName}
            source={caller.avatar}
            size={50}
            showBadge
            helpsCount={caller.helpsCount}
          />
          <View style={styles.callerInfo}>
            <Text style={styles.callerName}>{callerDisplayName}</Text>
            <View style={styles.callerMeta}>
              <Feather name="map-pin" size={12} color={colors.textSecondary} />
              <Text style={styles.callerDistance}>
                ~{caller.distance}m away ({caller.walkTime} min walk)
              </Text>
            </View>
          </View>
        </View>

        {/* Live Location Map */}
        <View style={styles.mapContainer}>
          <SafetyMap
            userLocation={{
              latitude: caller.location?.lat || 55.6762,
              longitude: caller.location?.lng || 12.5684,
            }}
            locationLabel={`${callerDisplayName}'s location`}
            style={styles.safetyMap}
          />
          <View style={styles.mapOverlay}>
            <View style={styles.liveIndicator}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>LIVE</Text>
            </View>
            <Text style={styles.mapOverlayText}>
              {callerDisplayName}'s location
            </Text>
          </View>
        </View>

        {/* Chat Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.chatContainer}
          contentContainerStyle={styles.chatContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map(renderMessage)}
        </ScrollView>

        {/* Input or Action Buttons */}
        {!callerSafe && (
          <>
            {/* Message Input */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Send a message..."
                placeholderTextColor={colors.textMuted}
                value={inputText}
                onChangeText={setInputText}
                multiline
                maxLength={500}
              />
              <TouchableOpacity
                style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
                onPress={sendMessage}
                disabled={!inputText.trim()}
              >
                <Feather name="send" size={20} color={inputText.trim() ? colors.primary : colors.textMuted} />
              </TouchableOpacity>
            </View>

            {/* Action Button Area */}
            <View style={styles.actionContainer}>
              {!metCaller ? (
                <Button
                  title="I met the caller"
                  onPress={handleMetCaller}
                  variant="safe"
                  size="large"
                  icon="check-circle"
                  style={styles.actionButton}
                />
              ) : (
                <View style={styles.slideContainer}>
                  <Text style={styles.slideLabel}>Confirm when safe:</Text>
                  <SlideToConfirm
                    label="Now the caller is safe"
                    onConfirm={handleCallerSafe}
                  />
                </View>
              )}
            </View>
          </>
        )}

        {/* Completed state */}
        {callerSafe && (
          <View style={styles.completedContainer}>
            <Button
              title="Return Home"
              onPress={handleComplete}
              variant="primary"
              size="large"
              style={styles.actionButton}
            />
          </View>
        )}
      </KeyboardAvoidingView>

      {/* Milestone Modal */}
      <Modal
        visible={showMilestoneModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMilestoneModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.milestoneModal}>
            <View style={styles.milestoneIconContainer}>
              <Text style={styles.milestoneIcon}>{newLevel.icon}</Text>
            </View>
            
            <Text style={styles.milestoneTitle}>Congratulations! 🎉</Text>
            <Text style={styles.milestoneSubtitle}>
              You reached the next milestone:
            </Text>
            <Text style={styles.milestoneName}>{newLevel.name}</Text>
            
            <Text style={styles.milestoneDescription}>
              Thank you for making SafeCircle a safer place for everyone.
            </Text>
            
            <Button
              title="Continue"
              onPress={handleComplete}
              variant="primary"
              size="large"
              style={styles.milestoneButton}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  confirmationBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.safe,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  confirmationText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '600',
    marginLeft: spacing.sm,
  },
  callerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  callerInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  callerName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  callerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  callerDistance: {
    fontSize: 13,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  mapContainer: {
    height: 200,
    margin: spacing.md,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.backgroundAlt,
    borderWidth: 1,
    borderColor: colors.border,
    position: 'relative',
  },
  safetyMap: {
    flex: 1,
    borderRadius: 0,
    borderWidth: 0,
  },
  mapOverlay: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: 20,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.emergency,
    marginRight: 4,
  },
  liveText: {
    color: colors.emergency,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  mapOverlayText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '500',
  },
  chatContainer: {
    flex: 1,
  },
  chatContent: {
    padding: spacing.md,
    paddingBottom: spacing.lg,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: spacing.md,
    borderRadius: 18,
    marginBottom: spacing.sm,
  },
  callerMessage: {
    alignSelf: 'flex-start',
    backgroundColor: colors.backgroundAlt,
    borderBottomLeftRadius: 4,
  },
  guardianMessage: {
    alignSelf: 'flex-end',
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  callerMessageText: {
    color: colors.text,
  },
  guardianMessageText: {
    color: colors.white,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  textInput: {
    flex: 1,
    backgroundColor: colors.backgroundAlt,
    borderRadius: 20,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    fontSize: 15,
    color: colors.text,
    maxHeight: 100,
    marginRight: spacing.sm,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.backgroundAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  actionContainer: {
    padding: spacing.md,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  actionButton: {
    marginBottom: 0,
  },
  slideContainer: {
    alignItems: 'center',
  },
  slideLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    fontWeight: '500',
  },
  completedContainer: {
    padding: spacing.md,
    backgroundColor: colors.background,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  milestoneModal: {
    backgroundColor: colors.background,
    borderRadius: 24,
    padding: spacing.xl,
    width: '100%',
    maxWidth: 320,
    alignItems: 'center',
  },
  milestoneIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.backgroundAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  milestoneIcon: {
    fontSize: 40,
  },
  milestoneTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  milestoneSubtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  milestoneName: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: spacing.lg,
  },
  milestoneDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  milestoneButton: {
    minWidth: 150,
  },
});

