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
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Avatar from '../../components/Avatar';
import { AlertModal } from '../../components/Modal';
import { colors, spacing, typography } from '../../styles/colors';

export default function SignUpScreen({ navigation }) {
  const { signUp, error } = useAuth();
  
  const [avatar, setAvatar] = useState(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!fullName.trim()) errors.fullName = 'Full name is required';
    if (!email.trim()) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) errors.email = 'Please enter a valid email';
    if (!phone.trim()) errors.phone = 'Phone number is required';
    if (!password) errors.password = 'Password is required';
    else if (password.length < 6) errors.password = 'Password must be at least 6 characters';
    if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match';
    if (!agreedToTerms) errors.terms = 'You must agree to the terms';

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleVerifyMitID = async () => {
    setShowVerifyModal(true);
    setVerifying(true);
    
    setTimeout(() => {
      setVerifying(false);
      setShowVerifyModal(false);
      setIsVerified(true);
      setShowSuccessModal(true);
    }, 2000);
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    await signUp({
      firstName: fullName.split(' ')[0],
      lastName: fullName.split(' ').slice(1).join(' '),
      email,
      phone,
      avatar,
      verified: isVerified,
    });
    setLoading(false);
  };

  const isFormValid = fullName && email && phone && password && confirmPassword && agreedToTerms;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Feather name="arrow-left" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join the SafeCircle community</Text>
          </View>

          <View style={styles.avatarSection}>
            <Avatar
              source={avatar}
              name={fullName || 'User'}
              size={100}
              onPress={pickImage}
              showEditButton
            />
            <TouchableOpacity onPress={pickImage}>
              <Text style={styles.changePhotoText}>
                {avatar ? 'Change Photo' : 'Add Photo'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.form}>
            <Input
              label="Full Name"
              placeholder="Enter your full name"
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
              icon="person-outline"
              error={validationErrors.fullName}
            />

            <Input
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              icon="mail-outline"
              error={validationErrors.email}
            />

            <Input
              label="Phone Number"
              placeholder="+45 12345678"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              icon="call-outline"
              error={validationErrors.phone}
            />

            <Input
              label="Password"
              placeholder="Create a password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              icon="lock-closed-outline"
              error={validationErrors.password}
            />

            <Input
              label="Confirm Password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              icon="lock-closed-outline"
              error={validationErrors.confirmPassword}
            />

            <View style={styles.verifySection}>
              {isVerified ? (
                <View style={styles.verifiedBadge}>
                  <Feather name="check-circle" size={20} color={colors.safe} />
                  <Text style={styles.verifiedText}>MitID Verified</Text>
                </View>
              ) : (
                <Button
                  title="Verify with MitID"
                  onPress={handleVerifyMitID}
                  variant="outline"
                  icon="id-card-outline"
                />
              )}
            </View>

            <TouchableOpacity
              style={styles.termsContainer}
              onPress={() => setAgreedToTerms(!agreedToTerms)}
            >
              <View style={[styles.checkbox, agreedToTerms && styles.checkboxChecked]}>
                {agreedToTerms && <Feather name="check" size={14} color={colors.textLight} />}
              </View>
              <Text style={styles.termsText}>
                I agree to the <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
                <Text style={styles.termsLink}>Privacy Policy</Text>
              </Text>
            </TouchableOpacity>
            {validationErrors.terms && (
              <Text style={styles.errorText}>{validationErrors.terms}</Text>
            )}

            {error && <Text style={styles.errorText}>{error}</Text>}

            <Button
              title="Create Account"
              onPress={handleSignUp}
              loading={loading}
              disabled={!isFormValid}
              style={styles.signUpButton}
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <AlertModal
        visible={showVerifyModal}
        onClose={() => {}}
        icon="sync"
        iconColor={colors.primary}
        title="Verifying with MitID"
        message="Please wait while we verify your identity..."
        buttons={[]}
      />

      <AlertModal
        visible={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        icon="checkmark-circle"
        iconColor={colors.safe}
        title="Verification Successful!"
        message="Your identity has been verified with MitID."
        buttons={[
          { text: 'Continue', primary: true, onPress: () => setShowSuccessModal(false) },
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
    padding: spacing.sm,
    marginLeft: -spacing.sm,
    marginBottom: spacing.md,
    alignSelf: 'flex-start',
  },
  title: {
    ...typography.title,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  changePhotoText: {
    marginTop: spacing.sm,
    fontSize: 15,
    color: colors.primary,
    fontWeight: '600',
  },
  form: {
    flex: 1,
  },
  verifySection: {
    marginBottom: spacing.md,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${colors.safe}12`,
    paddingVertical: 14,
    paddingHorizontal: spacing.lg,
    borderRadius: 14,
  },
  verifiedText: {
    marginLeft: spacing.sm,
    fontSize: 16,
    fontWeight: '600',
    color: colors.safe,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  termsText: {
    flex: 1,
    ...typography.caption,
    color: colors.textSecondary,
  },
  termsLink: {
    color: colors.primary,
    fontWeight: '500',
  },
  errorText: {
    color: colors.emergency,
    fontSize: 13,
    marginBottom: spacing.md,
  },
  signUpButton: {
    marginTop: spacing.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.lg,
    paddingVertical: spacing.md,
  },
  footerText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  loginLink: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
  },
});
