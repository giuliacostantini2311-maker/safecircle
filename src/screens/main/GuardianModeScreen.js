import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useLocation } from '../../context/LocationContext';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/Button';
import Avatar from '../../components/Avatar';
import GuardianCard from '../../components/GuardianCard';
import ChatBubble from '../../components/ChatBubble';
import SafetyMap from '../../components/SafetyMap';
import RatingModal from '../../components/RatingModal';
import { colors, spacing, typography } from '../../styles/colors';
import { RADIUS_OPTIONS, DEFAULT_RADIUS } from '../../utils/constants';
import { mockGuardians, mockChatMessages, mockQuickReplies, getDisplayName } from '../../services/mockData';

const STATES = {
  INITIAL: 'initial',
  SEARCHING: 'searching',
  CONNECTED: 'connected',
};

export default function GuardianModeScreen({ navigation }) {
  const { location, getCurrentLocation } = useLocation();
  const { user } = useAuth();
  
  const [state, setState] = useState(STATES.INITIAL);
  const [selectedRadius, setSelectedRadius] = useState(DEFAULT_RADIUS);
  const [context, setContext] = useState('');
  const [genderPreference, setGenderPreference] = useState('anyone'); // 'anyone' or 'same'
  const [connectedGuardian, setConnectedGuardian] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [shareLocation, setShareLocation] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [searchingGuardians, setSearchingGuardians] = useState([]);
  
  const scrollViewRef = useRef(null);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  // Filter guardians based on gender preference
  const getFilteredGuardians = () => {
    if (genderPreference === 'anyone') {
      return mockGuardians;
    }
    // Filter to same gender
    const userGender = user?.gender || 'female';
    return mockGuardians.filter(g => g.gender === userGender);
  };

  const handleAlertGuardians = () => {
    setState(STATES.SEARCHING);
    
    const interval = setInterval(() => {
      setSearchingGuardians((prev) => {
        if (prev.length < 3) {
          return [...prev, { id: Date.now(), text: 'Guardian is viewing...' }];
        }
        return prev;
      });
    }, 1000);

    setTimeout(() => {
      clearInterval(interval);
      // Get guardians based on gender preference
      const availableGuardians = getFilteredGuardians();
      const guardian = availableGuardians[0] || mockGuardians[0];
      setConnectedGuardian(guardian);
      setMessages(mockChatMessages);
      setState(STATES.CONNECTED);
    }, 4000);
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    
    const newMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputMessage.trim(),
      timestamp: new Date().toISOString(),
    };
    
    setMessages((prev) => [...prev, newMessage]);
    setInputMessage('');
    
    setTimeout(() => {
      const responses = [
        "I'm on my way! Stay where you are.",
        "I can see your location. I'll be there in about 3 minutes.",
        "You're doing great. Keep the chat open.",
        "I'm walking towards you now. You're not alone.",
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: 'guardian',
          text: randomResponse,
          timestamp: new Date().toISOString(),
        },
      ]);
    }, 2000);
  };

  const handleQuickReply = (reply) => {
    const newMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: reply,
      timestamp: new Date().toISOString(),
    };
    
    setMessages((prev) => [...prev, newMessage]);
    
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: 'guardian',
          text: "Absolutely! I'll stay connected until you're safe. Where are you headed?",
          timestamp: new Date().toISOString(),
        },
      ]);
    }, 1500);
  };

  const handleEndSession = () => {
    setShowRatingModal(true);
  };

  const handleRatingSubmit = (ratingData) => {
    // If user wants to connect, the guardian is added to trusted contacts
    if (ratingData.addToNetwork && connectedGuardian) {
      // In a real app, this would call an API to add to trusted contacts
      console.log('Adding guardian to trusted contacts:', connectedGuardian);
      // Show a brief confirmation (could use a toast in real app)
      alert(`${getDisplayName(connectedGuardian.firstName, connectedGuardian.lastName)} has been added to your trusted contacts!`);
    }
    
    // If negative rating, log the reason (would be sent to backend in real app)
    if (ratingData.rating === 'down' && ratingData.negativeReason) {
      console.log('Negative feedback reason:', ratingData.negativeReason);
    }
    
    setShowRatingModal(false);
    navigation.goBack();
  };

  const userLocation = location?.coords ? {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
  } : null;

  const guardianLocation = connectedGuardian ? {
    latitude: (userLocation?.latitude || 55.6761) + 0.002,
    longitude: (userLocation?.longitude || 12.5683) + 0.001,
  } : null;

  // Initial State
  if (state === STATES.INITIAL) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollContent}>
          <View style={styles.iconSection}>
            <View style={styles.iconContainer}>
              <Feather name="users" size={56} color={colors.guardian} />
            </View>
          </View>

          <Text style={styles.description}>
            Alert nearby SafeCircle members who can help you
          </Text>

          <View style={styles.radiusSection}>
            <Text style={styles.sectionLabel}>Search Radius</Text>
            <View style={styles.radiusButtons}>
              {RADIUS_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.radiusButton,
                    selectedRadius === option.value && styles.radiusButtonActive,
                  ]}
                  onPress={() => setSelectedRadius(option.value)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.radiusButtonText,
                      selectedRadius === option.value && styles.radiusButtonTextActive,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Gender Preference */}
          <View style={styles.genderPrefSection}>
            <Text style={styles.sectionLabel}>Who can help you?</Text>
            <View style={styles.genderPrefOptions}>
              <TouchableOpacity
                style={[
                  styles.genderPrefButton,
                  genderPreference === 'anyone' && styles.genderPrefButtonActive,
                ]}
                onPress={() => setGenderPreference('anyone')}
              >
                <Feather 
                  name="users" 
                  size={18} 
                  color={genderPreference === 'anyone' ? colors.textLight : colors.guardian} 
                />
                <Text style={[
                  styles.genderPrefText,
                  genderPreference === 'anyone' && styles.genderPrefTextActive,
                ]}>Anyone</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.genderPrefButton,
                  genderPreference === 'same' && styles.genderPrefButtonActive,
                ]}
                onPress={() => setGenderPreference('same')}
              >
                <Feather 
                  name="user" 
                  size={18} 
                  color={genderPreference === 'same' ? colors.textLight : colors.guardian} 
                />
                <Text style={[
                  styles.genderPrefText,
                  genderPreference === 'same' && styles.genderPrefTextActive,
                ]}>Same gender only</Text>
              </TouchableOpacity>
            </View>
            {genderPreference === 'same' && (
              <Text style={styles.genderPrefNote}>
                Only {user?.gender || 'female'} guardians will be shown
              </Text>
            )}
          </View>

          <View style={styles.contextSection}>
            <Text style={styles.sectionLabel}>Add context (optional)</Text>
            <TextInput
              style={styles.contextInput}
              placeholder="e.g., Walking home alone"
              value={context}
              onChangeText={setContext}
              placeholderTextColor={colors.textMuted}
            />
          </View>

          <Button
            title="Alert Nearby Guardians"
            onPress={handleAlertGuardians}
            variant="guardian"
            size="large"
            icon="radio"
            style={styles.alertButton}
          />
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Searching State
  if (state === STATES.SEARCHING) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <View style={styles.searchingContainer}>
          <View style={styles.radarContainer}>
            <View style={[styles.radarRing, styles.radarRing1]} />
            <View style={[styles.radarRing, styles.radarRing2]} />
            <View style={[styles.radarRing, styles.radarRing3]} />
            <View style={styles.radarCenter}>
              <Feather name="radio" size={28} color={colors.guardian} />
            </View>
          </View>

          <Text style={styles.searchingText}>Searching for guardians...</Text>
          <Text style={styles.notifiedText}>
            {mockGuardians.length} guardians notified within {selectedRadius}m
          </Text>

          <View style={styles.searchingList}>
            {searchingGuardians.map((g) => (
              <GuardianCard key={g.id} variant="searching" guardian={g} />
            ))}
          </View>

          <Button
            title="Cancel"
            onPress={() => {
              setState(STATES.INITIAL);
              setSearchingGuardians([]);
            }}
            variant="outline"
            style={styles.cancelButton}
          />

          <TouchableOpacity
            style={styles.noResponseLink}
            onPress={() => navigation.replace('PoliceMode')}
          >
            <Text style={styles.noResponseText}>No response? Call Police</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Connected State
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.connectedContainer}
      >
        <View style={styles.guardianHeader}>
          <Avatar
            name={getDisplayName(connectedGuardian?.firstName, connectedGuardian?.lastName)}
            source={connectedGuardian?.avatar}
            size={46}
            showBadge
            helpsCount={connectedGuardian?.helpsCount}
          />
          <View style={styles.guardianInfo}>
            <Text style={styles.guardianName}>{getDisplayName(connectedGuardian?.firstName, connectedGuardian?.lastName)}</Text>
            <View style={styles.guardianMeta}>
              <Feather name="thumbs-up" size={12} color={colors.safe} />
              <Text style={styles.guardianRating}>{connectedGuardian?.rating}%</Text>
              <Text style={styles.guardianDistance}>
                ~{connectedGuardian?.distance}m away
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.callGuardianButton}
            onPress={() => {
              // In a real app, this would initiate a phone call
              alert('Calling guardian...');
            }}
          >
            <Feather name="phone" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView
          ref={scrollViewRef}
          style={styles.chatContainer}
          contentContainerStyle={styles.chatContent}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd()}
        >
          {messages.map((message) => (
            <ChatBubble
              key={message.id}
              message={message.text}
              isUser={message.sender === 'user'}
              timestamp={message.timestamp}
              showTimestamp
            />
          ))}
        </ScrollView>

        {messages.length < 3 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.quickReplies}
            contentContainerStyle={styles.quickRepliesContent}
          >
            {mockQuickReplies.map((reply, index) => (
              <TouchableOpacity
                key={index}
                style={styles.quickReplyButton}
                onPress={() => handleQuickReply(reply)}
              >
                <Text style={styles.quickReplyText}>{reply}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        <View style={styles.locationToggle}>
          <Feather name="map-pin" size={18} color={colors.primary} />
          <Text style={styles.locationToggleText}>Share my exact location</Text>
          <Switch
            value={shareLocation}
            onValueChange={setShareLocation}
            trackColor={{ false: colors.border, true: colors.primaryLight }}
            thumbColor={shareLocation ? colors.primary : colors.textMuted}
          />
        </View>

        {shareLocation && (
          <View style={styles.miniMapContainer}>
            <SafetyMap
              userLocation={userLocation}
              guardianLocation={guardianLocation}
              style={styles.miniMap}
            />
          </View>
        )}

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.messageInput}
            placeholder="Type a message..."
            value={inputMessage}
            onChangeText={setInputMessage}
            placeholderTextColor={colors.textMuted}
          />
          <TouchableOpacity
            style={[styles.sendButton, inputMessage.trim() && styles.sendButtonActive]}
            onPress={handleSendMessage}
            disabled={!inputMessage.trim()}
          >
            <Feather
              name="send"
              size={20}
              color={inputMessage.trim() ? colors.textLight : colors.textMuted}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.bottomActions}>
          <Button
            title="Cancel Request"
            onPress={() => navigation.navigate('Home')}
            variant="primary"
            icon="x-circle"
            style={styles.actionButton}
          />
          <Button
            title="Call Police"
            onPress={() => navigation.replace('PoliceMode')}
            variant="emergency"
            icon="phone-call"
            style={styles.actionButton}
          />
          <Button
            title="I'm Safe"
            onPress={handleEndSession}
            variant="safe"
            icon="check-circle"
            style={styles.actionButton}
          />
        </View>
      </KeyboardAvoidingView>

      <RatingModal
        visible={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        guardian={connectedGuardian}
        onSubmit={handleRatingSubmit}
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
    marginBottom: spacing.lg,
  },
  iconContainer: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: `${colors.guardian}15`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  radiusSection: {
    marginBottom: spacing.lg,
  },
  sectionLabel: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  radiusButtons: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
    padding: 4,
  },
  radiusButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
  },
  radiusButtonActive: {
    backgroundColor: colors.guardian,
  },
  radiusButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  radiusButtonTextActive: {
    color: colors.textLight,
  },
  // Gender Preference Section
  genderPrefSection: {
    marginBottom: spacing.lg,
  },
  genderPrefOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  genderPrefButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    marginHorizontal: 4,
    borderRadius: 12,
    backgroundColor: colors.backgroundAlt,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  genderPrefButtonActive: {
    backgroundColor: colors.guardian,
    borderColor: colors.guardian,
  },
  genderPrefText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 8,
  },
  genderPrefTextActive: {
    color: colors.textLight,
  },
  genderPrefNote: {
    fontSize: 12,
    color: colors.guardian,
    marginTop: spacing.sm,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  contextSection: {
    marginBottom: spacing.xl,
  },
  contextInput: {
    backgroundColor: colors.background,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  alertButton: {
    marginTop: 'auto',
  },
  // Searching State
  searchingContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing.xxl,
  },
  radarContainer: {
    width: 180,
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  radarRing: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: colors.guardianLight,
    borderRadius: 100,
  },
  radarRing1: { width: 70, height: 70 },
  radarRing2: { width: 120, height: 120 },
  radarRing3: { width: 180, height: 180 },
  radarCenter: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: `${colors.guardian}15`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchingText: {
    ...typography.heading,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  notifiedText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  searchingList: {
    width: '100%',
    marginBottom: spacing.lg,
  },
  cancelButton: {
    width: '100%',
    marginBottom: spacing.md,
  },
  noResponseLink: {
    padding: spacing.sm,
  },
  noResponseText: {
    fontSize: 15,
    color: colors.emergency,
    fontWeight: '500',
  },
  // Connected State
  connectedContainer: {
    flex: 1,
  },
  guardianHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  guardianInfo: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  callGuardianButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: `${colors.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.sm,
  },
  guardianName: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text,
    letterSpacing: -0.2,
  },
  guardianMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  guardianRating: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.safe,
    marginLeft: 4,
    marginRight: spacing.sm,
  },
  guardianDistance: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  chatContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  chatContent: {
    padding: spacing.md,
  },
  quickReplies: {
    maxHeight: 48,
    backgroundColor: colors.background,
  },
  quickRepliesContent: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },
  quickReplyButton: {
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    marginHorizontal: 4,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  quickReplyText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  locationToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    backgroundColor: colors.backgroundAlt,
  },
  locationToggleText: {
    flex: 1,
    marginLeft: spacing.sm,
    fontSize: 15,
    color: colors.text,
  },
  miniMapContainer: {
    height: 140,
    margin: spacing.sm,
    borderRadius: 12,
    overflow: 'hidden',
  },
  miniMap: {
    borderRadius: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  messageInput: {
    flex: 1,
    backgroundColor: colors.backgroundAlt,
    borderRadius: 22,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    fontSize: 15,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sendButton: {
    marginLeft: spacing.sm,
    padding: 10,
    borderRadius: 22,
    backgroundColor: colors.border,
  },
  sendButtonActive: {
    backgroundColor: colors.primary,
  },
  bottomActions: {
    flexDirection: 'row',
    padding: spacing.md,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
});
