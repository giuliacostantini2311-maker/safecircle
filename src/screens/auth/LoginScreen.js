import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { AlertModal } from '../../components/Modal';
import { colors, spacing, typography } from '../../styles/colors';

export default function LoginScreen({ navigation }) {
  const { login, error, clearError } = useAuth();
  
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showMitIDModal, setShowMitIDModal] = useState(false);
  const [mitIDLoading, setMitIDLoading] = useState(false);

  const handleLogin = async () => {
    if (!emailOrUsername || !password) return;
    
    setLoading(true);
    // Determine if input is email or username
    const isEmail = emailOrUsername.includes('@');
    await login(isEmail ? emailOrUsername : `${emailOrUsername}@demo.com`, password);
    setLoading(false);
  };

  const handleMitIDLogin = () => {
    setShowMitIDModal(true);
  };

  const simulateMitIDLogin = async () => {
    setMitIDLoading(true);
    // Simulate MitID verification
    setTimeout(async () => {
      setMitIDLoading(false);
      setShowMitIDModal(false);
      // Log in with demo credentials after MitID verification
      await login('mitid@demo.com', 'mitid123');
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header with Back Button */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Feather name="arrow-left" size={24} color={colors.text} />
            </TouchableOpacity>
            </View>

          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>Welcome back</Text>
            <Text style={styles.subtitle}>
              Log in to your SafeCircle account
            </Text>
          </View>

          {/* Login Form */}
          <View style={styles.form}>
            <Input
              label="Email or Username"
              placeholder="Enter your email or username"
              value={emailOrUsername}
              onChangeText={setEmailOrUsername}
              autoCapitalize="none"
              icon="user"
            />
            
            <Input
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              icon="lock"
            />

            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            {error && (
              <Text style={styles.errorText}>{error}</Text>
            )}

            <Button
              title="Log In"
              onPress={handleLogin}
              loading={loading}
              disabled={!emailOrUsername || !password}
              size="large"
              style={styles.loginButton}
            />

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* MitID Login */}
            <TouchableOpacity
              style={styles.mitIDButton}
              onPress={handleMitIDLogin}
            >
              <View style={styles.mitIDIcon}>
                <Feather name="credit-card" size={22} color={colors.primary} />
              </View>
              <Text style={styles.mitIDButtonText}>Continue with MitID</Text>
              <Feather name="chevron-right" size={20} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Sign Up Link */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text style={styles.signUpLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* MitID Modal */}
      <AlertModal
        visible={showMitIDModal}
        onClose={() => !mitIDLoading && setShowMitIDModal(false)}
        icon={mitIDLoading ? "loader" : "credit-card"}
        iconColor={colors.primary}
        title={mitIDLoading ? "Connecting to MitID" : "MitID Login"}
        message={mitIDLoading 
          ? "Please wait while we verify your identity..." 
          : "You will be redirected to MitID to verify your identity securely."
        }
        buttons={mitIDLoading ? [] : [
          {
            text: 'Cancel',
            onPress: () => setShowMitIDModal(false),
          },
          {
            text: 'Continue',
            primary: true,
            onPress: simulateMitIDLogin,
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
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: spacing.xl,
  },
  header: {
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.backgroundAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleSection: {
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.display,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  form: {
    flex: 1,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: -spacing.sm,
    marginBottom: spacing.md,
    paddingVertical: spacing.xs,
  },
  forgotPasswordText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.1,
  },
  errorText: {
    color: colors.emergency,
    fontSize: 14,
    marginBottom: spacing.md,
    textAlign: 'center',
    letterSpacing: 0.1,
  },
  loginButton: {
    marginTop: spacing.sm,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    marginHorizontal: spacing.md,
    color: colors.textMuted,
    fontSize: 14,
    letterSpacing: 0.2,
  },
  mitIDButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundAlt,
    borderRadius: 14,
    padding: spacing.md,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  mitIDIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  mitIDButtonText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.xl,
    paddingVertical: spacing.md,
  },
  footerText: {
    fontSize: 15,
    color: colors.textSecondary,
    letterSpacing: 0.1,
  },
  signUpLink: {
    fontSize: 15,
    color: colors.primary,
    fontWeight: '600',
    letterSpacing: 0.1,
  },
});
