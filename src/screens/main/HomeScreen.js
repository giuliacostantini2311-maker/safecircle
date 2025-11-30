import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useLocation } from '../../context/LocationContext';
import Avatar from '../../components/Avatar';
import { colors, spacing, typography } from '../../styles/colors';
import { getGreeting } from '../../utils/constants';

export default function HomeScreen({ navigation }) {
  const { user, logout } = useAuth();
  const { nearbyGuardiansCount, getCurrentLocation } = useLocation();
  
  const [menuVisible, setMenuVisible] = useState(false);
  const [greeting, setGreeting] = useState({ greeting: '', subtitle: '' });

  useEffect(() => {
    // Use username, or firstName, or 'there' as fallback
    const displayName = user?.username || user?.firstName || 'there';
    setGreeting(getGreeting(displayName));
    getCurrentLocation();
  }, [user]);

  const handleMenuPress = () => {
    setMenuVisible(true);
  };

  const navigateFromMenu = (screen) => {
    setMenuVisible(false);
    navigation.navigate(screen);
  };

  const handleLogout = () => {
    setMenuVisible(false);
    logout();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={handleMenuPress}
        >
          <Feather name="menu" size={24} color={colors.text} />
        </TouchableOpacity>
        
        <Text style={styles.logo}>SafeCircle</Text>
        
        <TouchableOpacity
          onPress={() => navigation.navigate('Profile')}
        >
          <Avatar
            name={user?.username || user?.firstName || 'User'}
            source={user?.avatar}
            size={38}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Greeting */}
        <View style={styles.greeting}>
          <Text style={styles.greetingText}>{greeting.greeting}</Text>
          <Text style={styles.greetingSubtext}>{greeting.subtitle}</Text>
        </View>

        {/* Main Mode Cards */}
        <View style={styles.modeCards}>
          {/* Self Safety Mode */}
          <TouchableOpacity
            style={styles.modeCard}
            onPress={() => navigation.navigate('SelfSafety')}
            activeOpacity={0.8}
          >
            <View style={[styles.modeCardAccent, styles.selfSafetyAccent]} />
            <View style={styles.modeCardContent}>
              <View style={[styles.modeIconContainer, { backgroundColor: `${colors.primary}12` }]}>
                <Feather name="shield" size={26} color={colors.primary} />
              </View>
              <View style={styles.modeCardInfo}>
                <Text style={styles.modeCardTitle}>Self Safety Mode</Text>
                <Text style={styles.modeCardSubtitle}>Record & navigate to safety</Text>
              </View>
              <Feather name="chevron-right" size={22} color={colors.textMuted} />
            </View>
          </TouchableOpacity>

          {/* Guardian Mode */}
          <TouchableOpacity
            style={styles.modeCard}
            onPress={() => navigation.navigate('GuardianMode')}
            activeOpacity={0.8}
          >
            <View style={[styles.modeCardAccent, styles.guardianAccent]} />
            <View style={styles.modeCardContent}>
              <View style={[styles.modeIconContainer, { backgroundColor: `${colors.guardian}15` }]}>
                <Feather name="users" size={26} color={colors.guardian} />
              </View>
              <View style={styles.modeCardInfo}>
                <Text style={styles.modeCardTitle}>Guardian Mode</Text>
                <Text style={styles.modeCardSubtitle}>Alert nearby guardians</Text>
              </View>
              <Feather name="chevron-right" size={22} color={colors.textMuted} />
            </View>
          </TouchableOpacity>

          {/* Police Mode */}
          <TouchableOpacity
            style={styles.modeCard}
            onPress={() => navigation.navigate('PoliceMode')}
            activeOpacity={0.8}
          >
            <View style={[styles.modeCardAccent, styles.policeAccent]} />
            <View style={styles.modeCardContent}>
              <View style={[styles.modeIconContainer, { backgroundColor: `${colors.emergency}12` }]}>
                <Feather name="phone-call" size={26} color={colors.emergency} />
              </View>
              <View style={styles.modeCardInfo}>
                <Text style={styles.modeCardTitle}>Police Mode</Text>
                <Text style={styles.modeCardSubtitle}>Immediate emergency help</Text>
              </View>
              <Feather name="chevron-right" size={22} color={colors.textMuted} />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Status Bar */}
      <View style={styles.statusBar}>
        <View style={styles.statusItem}>
          <View style={[styles.statusDot, { backgroundColor: colors.safe }]} />
          <Text style={styles.statusText}>Location active</Text>
        </View>
        <View style={styles.statusDivider} />
        <View style={styles.statusItem}>
          <View style={[styles.statusDot, { backgroundColor: colors.guardian }]} />
          <Text style={styles.statusText}>{nearbyGuardiansCount} guardians nearby</Text>
        </View>
      </View>

      {/* Side Menu Modal */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity
          style={styles.menuOverlay}
          activeOpacity={1}
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.menuContainer}>
            {/* Menu Header */}
            <View style={styles.menuHeader}>
              <Avatar
                name={user?.username || user?.firstName || 'User'}
                source={user?.avatar}
                size={72}
              />
              <Text style={styles.menuUserName}>
                {user?.username || 'User'}
              </Text>
              {user?.verified && (
                <View style={styles.verifiedBadge}>
                  <Feather name="check-circle" size={14} color={colors.safe} />
                  <Text style={styles.verifiedText}>Verified</Text>
                </View>
              )}
            </View>

            {/* Menu Items */}
            <View style={styles.menuItems}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => navigateFromMenu('Profile')}
              >
                <Feather name="settings" size={20} color={colors.text} style={styles.menuItemIcon} />
                <Text style={styles.menuItemText}>Profile Settings</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => navigateFromMenu('Network')}
              >
                <Feather name="users" size={20} color={colors.text} style={styles.menuItemIcon} />
                <Text style={styles.menuItemText}>Your Network</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => navigateFromMenu('HowItWorks')}
              >
                <Feather name="info" size={20} color={colors.text} style={styles.menuItemIcon} />
                <Text style={styles.menuItemText}>How SafeCircle Works</Text>
              </TouchableOpacity>

              <View style={styles.menuDivider} />

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => navigateFromMenu('GuardianAlert')}
              >
                <Feather name="bell" size={20} color={colors.guardian} style={styles.menuItemIcon} />
                <Text style={[styles.menuItemText, { color: colors.guardian }]}>
                  [Demo] Guardian Alert
                </Text>
              </TouchableOpacity>

              <View style={styles.menuDivider} />

              <TouchableOpacity
                style={styles.menuItem}
                onPress={handleLogout}
              >
                <Feather name="log-out" size={20} color={colors.emergency} style={styles.menuItemIcon} />
                <Text style={[styles.menuItemText, { color: colors.emergency }]}>Sign Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.screenPadding,
    paddingVertical: spacing.md,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuButton: {
    padding: 4,
  },
  logo: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: -0.5,
  },
  scrollContent: {
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: spacing.lg,
  },
  greeting: {
    marginTop: spacing.xl,
    marginBottom: spacing.sectionGap,
  },
  greetingText: {
    ...typography.display,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  greetingSubtext: {
    fontSize: 17,
    color: colors.textSecondary,
    letterSpacing: 0.1,
  },
  modeCards: {
    marginBottom: spacing.lg,
  },
  modeCard: {
    backgroundColor: colors.background,
    borderRadius: 20,
    padding: spacing.cardPadding,
    marginBottom: spacing.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    position: 'relative',
    overflow: 'hidden',
  },
  modeCardAccent: {
    position: 'absolute',
    left: 0,
    top: 20,
    bottom: 20,
    width: 4,
    borderRadius: 2,
  },
  selfSafetyAccent: {
    backgroundColor: colors.primary,
  },
  guardianAccent: {
    backgroundColor: colors.guardian,
  },
  policeAccent: {
    backgroundColor: colors.emergency,
  },
  modeCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: spacing.sm,
  },
  modeIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  modeCardInfo: {
    flex: 1,
  },
  modeCardTitle: {
    ...typography.heading,
    color: colors.text,
    marginBottom: 4,
  },
  modeCardSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.screenPadding,
    backgroundColor: colors.backgroundAlt,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.sm,
  },
  statusText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
    letterSpacing: 0.1,
  },
  statusDivider: {
    width: 1,
    height: 16,
    backgroundColor: colors.border,
    marginHorizontal: spacing.lg,
  },
  // Menu Styles
  menuOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
  },
  menuContainer: {
    width: '80%',
    maxWidth: 320,
    height: '100%',
    backgroundColor: colors.background,
  },
  menuHeader: {
    paddingHorizontal: spacing.lg,
    paddingTop: 60,
    paddingBottom: spacing.lg,
    backgroundColor: colors.backgroundAlt,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuUserName: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginTop: spacing.md,
    letterSpacing: -0.3,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  verifiedText: {
    marginLeft: spacing.xs,
    fontSize: 13,
    fontWeight: '500',
    color: colors.safe,
    letterSpacing: 0.1,
  },
  menuItems: {
    padding: spacing.md,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  menuItemIcon: {
    width: 24,
    marginRight: spacing.md,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    letterSpacing: 0.1,
  },
  menuDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },
});
