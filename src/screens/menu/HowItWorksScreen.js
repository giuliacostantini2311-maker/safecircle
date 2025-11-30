import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import Button from '../../components/Button';
import { colors, spacing, typography } from '../../styles/colors';

const { width } = Dimensions.get('window');

const CARDS = [
  {
    id: 'welcome',
    icon: 'users',
    iconColor: colors.primary,
    title: 'Welcome to Your Safety Circle',
    description: "SafeCircle is built on one simple idea: we're safer together. Our community of verified members looks out for each other, any time, anywhere.",
  },
  {
    id: 'self-safety',
    icon: 'shield',
    iconColor: colors.primary,
    title: 'Self Safety Mode',
    description: 'Feeling uneasy? Activate Self Safety to record your surroundings, alert your trusted contacts, and find safe places nearby. You control everything.',
  },
  {
    id: 'guardian-mode',
    icon: 'users',
    iconColor: colors.guardian,
    title: 'Call Guardian',
    description: 'Need backup? Alert nearby community members who can chat with you, virtually walk you home, or even come to your location if needed.',
  },
  {
    id: 'be-guardian',
    icon: 'heart',
    iconColor: colors.safe,
    title: 'Become a Guardian',
    description: "When someone nearby calls for a guardian, you'll receive an alert. Accept to help them feel safe. Build your reputation as a trusted community member.",
  },
  {
    id: 'police-mode',
    icon: 'phone-call',
    iconColor: colors.emergency,
    title: 'Call Police',
    description: 'Real emergency? One tap connects you to emergency services while simultaneously alerting nearby users who might be able to assist immediately.',
  },
  {
    id: 'badges',
    icon: 'award',
    iconColor: '#FFD700',
    title: 'Guardian Badges',
    description: 'Earn badges by helping others! Start at Copper (1-4 helps), progress to Bronze, Silver, Gold, and reach Diamond status at 100+ helps. Your badge shows on your profile.',
  },
  {
    id: 'network',
    icon: 'share-2',
    iconColor: colors.primary,
    title: 'Build Trust Together',
    description: "Rate your experiences. Connect with guardians who've helped you. Grow your network of trusted community members who have your back.",
  },
  {
    id: 'privacy',
    icon: 'lock',
    iconColor: colors.text,
    title: 'Your Privacy Matters',
    description: 'Your exact location is only shared when YOU choose. Recordings are encrypted and only accessible by you. MitID verification keeps our community trustworthy.',
  },
];

export default function HowItWorksScreen({ navigation }) {
  const scrollViewRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = (event) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / width);
    setCurrentIndex(index);
  };

  const goToCard = (index) => {
    scrollViewRef.current?.scrollTo({ x: index * width, animated: true });
  };

  const handleDone = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        {CARDS.map((card) => (
          <View key={card.id} style={styles.cardContainer}>
            <View style={styles.card}>
              <View style={[styles.iconContainer, { backgroundColor: `${card.iconColor}12` }]}>
                <Feather name={card.icon} size={48} color={card.iconColor} />
              </View>
              <Text style={styles.cardTitle}>{card.title}</Text>
              <Text style={styles.cardDescription}>{card.description}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.pagination}>
        {CARDS.map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.dot, currentIndex === index && styles.dotActive]}
            onPress={() => goToCard(index)}
          />
        ))}
      </View>

      <View style={styles.navigation}>
        {currentIndex < CARDS.length - 1 ? (
          <View style={styles.navButtons}>
            <TouchableOpacity style={styles.skipButton} onPress={handleDone}>
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
            <Button
              title="Next"
              onPress={() => goToCard(currentIndex + 1)}
              icon="arrow-forward"
              iconPosition="right"
              style={styles.nextButton}
            />
          </View>
        ) : (
          <Button
            title="Got It!"
            onPress={handleDone}
            size="large"
            style={styles.doneButton}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  cardContainer: {
    width: width,
    justifyContent: 'center',
    paddingHorizontal: spacing.screenPadding,
  },
  card: {
    backgroundColor: colors.background,
    borderRadius: 24,
    padding: spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  cardTitle: {
    ...typography.title,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  cardDescription: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: colors.primary,
    width: 24,
  },
  navigation: {
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: spacing.md,
  },
  navButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skipButton: {
    padding: spacing.sm,
  },
  skipText: {
    ...typography.body,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  nextButton: {
    paddingHorizontal: spacing.xl,
  },
  doneButton: {
    width: '100%',
  },
});
