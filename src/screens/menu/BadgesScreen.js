import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../styles/colors';

// Badge level configuration
const BADGE_LEVELS = [
  { 
    name: 'Copper', 
    level: 1, 
    minHelps: 1, 
    maxHelps: 4, 
    color: '#B87333',
    description: 'You\'re just getting started! Help 1-4 people to earn this badge.',
  },
  { 
    name: 'Bronze', 
    level: 2, 
    minHelps: 5, 
    maxHelps: 9, 
    color: '#CD7F32',
    description: 'Great progress! Help 5-9 people to reach Bronze level.',
  },
  { 
    name: 'Silver', 
    level: 3, 
    minHelps: 10, 
    maxHelps: 49, 
    color: '#C0C0C0',
    description: 'You\'re making a real difference! Help 10-49 people for Silver.',
  },
  { 
    name: 'Gold', 
    level: 4, 
    minHelps: 50, 
    maxHelps: 99, 
    color: '#FFD700',
    description: 'A true guardian! Help 50-99 people to achieve Gold status.',
  },
  { 
    name: 'Diamond', 
    level: 5, 
    minHelps: 100, 
    maxHelps: null, 
    color: '#b9f2ff',
    description: 'The highest honor! Help 100+ people to become a Diamond guardian.',
    glow: true,
  },
];

export default function BadgesScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Feather name="award" size={32} color={colors.primary} />
          </View>
          <Text style={styles.headerTitle}>Guardian Badges</Text>
          <Text style={styles.headerSubtitle}>
            Earn badges by helping others in your community. The more people you help, the higher your badge level!
          </Text>
        </View>

        {/* How it Works */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How It Works</Text>
          <View style={styles.howItWorksCard}>
            <View style={styles.howItWorksItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <Text style={styles.howItWorksText}>
                Help someone who calls for a guardian
              </Text>
            </View>
            <View style={styles.howItWorksItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <Text style={styles.howItWorksText}>
                Complete the session and mark them as safe
              </Text>
            </View>
            <View style={styles.howItWorksItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <Text style={styles.howItWorksText}>
                Your help count increases and badge upgrades automatically
              </Text>
            </View>
          </View>
        </View>

        {/* Badge Levels */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Badge Levels</Text>
          
          {BADGE_LEVELS.map((badge, index) => (
            <View key={badge.name} style={styles.badgeCard}>
              <View style={styles.badgeHeader}>
                <View 
                  style={[
                    styles.badgeIcon,
                    { backgroundColor: badge.color },
                    badge.glow && styles.badgeIconGlow,
                  ]}
                >
                  <Feather name="star" size={20} color={badge.glow ? '#1a1d23' : '#FFFFFF'} />
                </View>
                <View style={styles.badgeInfo}>
                  <Text style={styles.badgeName}>{badge.name}</Text>
                  <Text style={styles.badgeRange}>
                    {badge.maxHelps 
                      ? `${badge.minHelps} - ${badge.maxHelps} helps`
                      : `${badge.minHelps}+ helps`
                    }
                  </Text>
                </View>
                <View style={styles.levelBadge}>
                  <Text style={styles.levelText}>Level {badge.level}</Text>
                </View>
              </View>
              <Text style={styles.badgeDescription}>{badge.description}</Text>
            </View>
          ))}
        </View>

        {/* Note */}
        <View style={styles.noteCard}>
          <Feather name="info" size={20} color={colors.primary} />
          <Text style={styles.noteText}>
            Your badge is displayed on your profile picture throughout the app, showing others your dedication to keeping the community safe.
          </Text>
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
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: spacing.xxl,
  },
  // Header
  header: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  headerIcon: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: `${colors.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  headerTitle: {
    ...typography.display,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  headerSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  // Sections
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.heading,
    color: colors.text,
    marginBottom: spacing.md,
  },
  // How it Works
  howItWorksCard: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 16,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  howItWorksItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textLight,
  },
  howItWorksText: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
    lineHeight: 20,
  },
  // Badge Cards
  badgeCard: {
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  badgeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  badgeIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  badgeIconGlow: {
    shadowColor: '#b9f2ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 8,
  },
  badgeInfo: {
    flex: 1,
  },
  badgeName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  badgeRange: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  levelBadge: {
    backgroundColor: colors.backgroundAlt,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  levelText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
  },
  badgeDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  // Note
  noteCard: {
    flexDirection: 'row',
    backgroundColor: `${colors.primary}10`,
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'flex-start',
  },
  noteText: {
    flex: 1,
    fontSize: 13,
    color: colors.text,
    marginLeft: spacing.sm,
    lineHeight: 19,
  },
});

