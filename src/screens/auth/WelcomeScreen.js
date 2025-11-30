import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import Button from '../../components/Button';
import { colors, spacing, typography } from '../../styles/colors';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Background Pattern */}
      <View style={styles.backgroundPattern}>
        <View style={[styles.circle, styles.circle1]} />
        <View style={[styles.circle, styles.circle2]} />
        <View style={[styles.circle, styles.circle3]} />
      </View>

      <SafeAreaView style={styles.safeArea}>
        {/* Logo Section */}
        <View style={styles.logoSection}>
          <View style={styles.logoContainer}>
            <View style={styles.logoInner}>
              <Feather name="shield" size={56} color={colors.primary} />
            </View>
          </View>
          <Text style={styles.appName}>SafeCircle</Text>
          <Text style={styles.tagline}>
            Your safety network,{'\n'}always by your side
          </Text>
        </View>

        {/* Features */}
        <View style={styles.featuresSection}>
          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Feather name="users" size={20} color={colors.primary} />
            </View>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Guardian Network</Text>
              <Text style={styles.featureDesc}>Connect with trusted people nearby</Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Feather name="bell" size={20} color={colors.guardian} />
            </View>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Instant Alerts</Text>
              <Text style={styles.featureDesc}>Get help when you need it most</Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Feather name="map-pin" size={20} color={colors.safe} />
            </View>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Live Location</Text>
              <Text style={styles.featureDesc}>Share your journey in real-time</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonSection}>
          <Button
            title="Create Account"
            onPress={() => navigation.navigate('SignUp')}
            size="large"
            style={styles.signUpButton}
          />

          <Button
            title="Log In"
            onPress={() => navigation.navigate('Login')}
            variant="outline"
            size="large"
            style={styles.loginButton}
          />
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          By continuing, you agree to our Terms of Service{'\n'}and Privacy Policy
        </Text>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  backgroundPattern: {
    position: 'absolute',
    width: width,
    height: height,
    overflow: 'hidden',
  },
  circle: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.08,
  },
  circle1: {
    width: width * 0.8,
    height: width * 0.8,
    backgroundColor: colors.primary,
    top: -width * 0.3,
    right: -width * 0.2,
  },
  circle2: {
    width: width * 0.6,
    height: width * 0.6,
    backgroundColor: colors.guardian,
    bottom: height * 0.15,
    left: -width * 0.3,
  },
  circle3: {
    width: width * 0.4,
    height: width * 0.4,
    backgroundColor: colors.safe,
    bottom: -width * 0.1,
    right: -width * 0.1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: spacing.screenPadding,
  },
  logoSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing.xxl,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 36,
    backgroundColor: `${colors.primary}10`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  logoInner: {
    width: 100,
    height: 100,
    borderRadius: 30,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: `${colors.primary}20`,
  },
  appName: {
    fontSize: 38,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: -1,
    marginBottom: spacing.sm,
  },
  tagline: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 26,
  },
  featuresSection: {
    paddingVertical: spacing.xl,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  featureIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.backgroundAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  featureDesc: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  buttonSection: {
    paddingBottom: spacing.lg,
  },
  signUpButton: {
    marginBottom: spacing.md,
  },
  loginButton: {
    marginBottom: spacing.sm,
  },
  footer: {
    textAlign: 'center',
    fontSize: 12,
    color: colors.textMuted,
    lineHeight: 18,
    paddingBottom: spacing.md,
  },
});

