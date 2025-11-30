import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal,
  FlatList,
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

// Country codes for phone prefix dropdown
const COUNTRY_CODES = [
  { code: '+45', country: 'Denmark', flag: '🇩🇰' },
  { code: '+46', country: 'Sweden', flag: '🇸🇪' },
  { code: '+47', country: 'Norway', flag: '🇳🇴' },
  { code: '+358', country: 'Finland', flag: '🇫🇮' },
  { code: '+354', country: 'Iceland', flag: '🇮🇸' },
  { code: '+49', country: 'Germany', flag: '🇩🇪' },
  { code: '+44', country: 'United Kingdom', flag: '🇬🇧' },
  { code: '+33', country: 'France', flag: '🇫🇷' },
  { code: '+31', country: 'Netherlands', flag: '🇳🇱' },
  { code: '+32', country: 'Belgium', flag: '🇧🇪' },
  { code: '+39', country: 'Italy', flag: '🇮🇹' },
  { code: '+34', country: 'Spain', flag: '🇪🇸' },
  { code: '+351', country: 'Portugal', flag: '🇵🇹' },
  { code: '+43', country: 'Austria', flag: '🇦🇹' },
  { code: '+41', country: 'Switzerland', flag: '🇨🇭' },
  { code: '+48', country: 'Poland', flag: '🇵🇱' },
  { code: '+1', country: 'United States', flag: '🇺🇸' },
  { code: '+1', country: 'Canada', flag: '🇨🇦' },
];

export default function SignUpScreen({ navigation }) {
  const { signUp, error } = useAuth();
  
  // Form state
  const [avatar, setAvatar] = useState(null);
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(COUNTRY_CODES[0]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
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
    
    if (!avatar) errors.avatar = 'Profile picture is required';
    if (!fullName.trim()) errors.fullName = 'Full name is required';
    
    // Age validation (+16)
    const ageNum = parseInt(age);
    if (!age.trim()) {
      errors.age = 'Age is required';
    } else if (isNaN(ageNum) || ageNum < 16) {
      errors.age = 'You must be at least 16 years old';
    } else if (ageNum > 120) {
      errors.age = 'Please enter a valid age';
    }
    
    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Please enter a valid email';
    }
    
    if (!phoneNumber.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^\d{6,15}$/.test(phoneNumber.replace(/\s/g, ''))) {
      errors.phone = 'Please enter a valid phone number';
    }
    
    if (!username.trim()) {
      errors.username = 'Username is required';
    } else if (username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      errors.username = 'Username can only contain letters, numbers, and underscores';
    }
    
    if (!password) {
      errors.password = 'Password is required';
    }
    
    if (!isVerified) {
      errors.mitid = 'MitID verification is required';
    }
    
    if (!agreedToTerms) {
      errors.terms = 'You must agree to the terms and conditions';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleVerifyMitID = async () => {
    setShowVerifyModal(true);
    setVerifying(true);
    
    // Simulate MitID verification
    setTimeout(() => {
      setVerifying(false);
      setShowVerifyModal(false);
      setIsVerified(true);
      setShowSuccessModal(true);
    }, 2500);
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    await signUp({
      firstName: fullName.split(' ')[0],
      lastName: fullName.split(' ').slice(1).join(' '),
      email,
      username,
      phone: `${selectedCountry.code} ${phoneNumber}`,
      age: parseInt(age),
      avatar,
      verified: isVerified,
    });
    setLoading(false);
  };

  const isFormValid = avatar && fullName && age && email && phoneNumber && 
                      username && password && isVerified && agreedToTerms;

  const renderCountryItem = ({ item }) => (
    <TouchableOpacity
      style={styles.countryItem}
      onPress={() => {
        setSelectedCountry(item);
        setShowCountryPicker(false);
      }}
    >
      <Text style={styles.countryFlag}>{item.flag}</Text>
      <Text style={styles.countryName}>{item.country}</Text>
      <Text style={styles.countryCode}>{item.code}</Text>
      {selectedCountry.code === item.code && selectedCountry.country === item.country && (
        <Feather name="check" size={20} color={colors.primary} />
      )}
    </TouchableOpacity>
  );

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
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Feather name="arrow-left" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* Title */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join the SafeCircle community</Text>
          </View>

          {/* Avatar Section */}
          <View style={styles.avatarSection}>
            <Avatar
              source={avatar}
              name={fullName || 'User'}
              size={110}
              onPress={pickImage}
              showEditButton
            />
            <TouchableOpacity onPress={pickImage}>
              <Text style={styles.changePhotoText}>
                {avatar ? 'Change Photo' : 'Upload Photo *'}
              </Text>
            </TouchableOpacity>
            {validationErrors.avatar && (
              <Text style={styles.avatarError}>{validationErrors.avatar}</Text>
            )}
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Input
              label="Full Name *"
              placeholder="Enter your full name"
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
              icon="user"
              error={validationErrors.fullName}
            />

            <Input
              label="Age *"
              placeholder="Your age (16+)"
              value={age}
              onChangeText={(text) => setAge(text.replace(/[^0-9]/g, ''))}
              keyboardType="numeric"
              icon="calendar"
              error={validationErrors.age}
            />

            <Input
              label="Email *"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              icon="mail"
              error={validationErrors.email}
            />

            {/* Phone Number with Country Picker */}
            <View style={styles.phoneContainer}>
              <Text style={styles.inputLabel}>Phone Number *</Text>
              <View style={styles.phoneInputRow}>
                <TouchableOpacity
                  style={styles.countryPicker}
                  onPress={() => setShowCountryPicker(true)}
                >
                  <Text style={styles.countryPickerFlag}>{selectedCountry.flag}</Text>
                  <Text style={styles.countryPickerCode}>{selectedCountry.code}</Text>
                  <Feather name="chevron-down" size={16} color={colors.textMuted} />
                </TouchableOpacity>
                <View style={styles.phoneInputWrapper}>
                  <Input
                    placeholder="Phone number"
                    value={phoneNumber}
                    onChangeText={(text) => setPhoneNumber(text.replace(/[^0-9]/g, ''))}
                    keyboardType="phone-pad"
                    style={styles.phoneInput}
                    error={validationErrors.phone}
                  />
                </View>
              </View>
            </View>

            <Input
              label="Username *"
              placeholder="Choose a username"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              icon="at-sign"
              error={validationErrors.username}
            />

            <Input
              label="Password *"
              placeholder="Create a password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              icon="lock"
              error={validationErrors.password}
            />

            {/* MitID Verification */}
            <View style={styles.verifySection}>
              <Text style={styles.inputLabel}>MitID Verification *</Text>
              {isVerified ? (
                <View style={styles.verifiedBadge}>
                  <Feather name="check-circle" size={22} color={colors.safe} />
                  <Text style={styles.verifiedText}>Verified with MitID</Text>
                </View>
              ) : (
                <>
                  <TouchableOpacity
                    style={styles.mitIDButton}
                    onPress={handleVerifyMitID}
                  >
                    <View style={styles.mitIDIcon}>
                      <Feather name="credit-card" size={22} color={colors.primary} />
                    </View>
                    <View style={styles.mitIDTextContainer}>
                      <Text style={styles.mitIDButtonText}>Verify with MitID</Text>
                      <Text style={styles.mitIDButtonSubtext}>Secure identity verification</Text>
                    </View>
                    <Feather name="chevron-right" size={20} color={colors.textMuted} />
                  </TouchableOpacity>
                  {validationErrors.mitid && (
                    <Text style={styles.errorText}>{validationErrors.mitid}</Text>
                  )}
                </>
              )}
            </View>

            {/* Terms Agreement */}
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
              size="large"
              style={styles.signUpButton}
            />
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Log In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Country Picker Modal */}
      <Modal
        visible={showCountryPicker}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCountryPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Country</Text>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowCountryPicker(false)}
              >
                <Feather name="x" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={COUNTRY_CODES}
              renderItem={renderCountryItem}
              keyExtractor={(item, index) => `${item.code}-${item.country}-${index}`}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.countryList}
            />
          </View>
        </View>
      </Modal>

      {/* MitID Verification Modal */}
      <AlertModal
        visible={showVerifyModal}
        onClose={() => {}}
        icon="loader"
        iconColor={colors.primary}
        title="Verifying with MitID"
        message="Please wait while we securely verify your identity..."
        buttons={[]}
      />

      {/* Verification Success Modal */}
      <AlertModal
        visible={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        icon="check-circle"
        iconColor={colors.safe}
        title="Verification Successful!"
        message="Your identity has been verified with MitID. You can now complete your registration."
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
    paddingBottom: spacing.xxl,
  },
  header: {
    marginTop: spacing.md,
    marginBottom: spacing.md,
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
    marginBottom: spacing.lg,
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
  avatarError: {
    marginTop: spacing.xs,
    fontSize: 13,
    color: colors.emergency,
  },
  form: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    letterSpacing: 0.2,
  },
  phoneContainer: {
    marginBottom: spacing.md,
  },
  phoneInputRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  countryPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    marginRight: spacing.sm,
  },
  countryPickerFlag: {
    fontSize: 20,
    marginRight: spacing.xs,
  },
  countryPickerCode: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
    marginRight: spacing.xs,
  },
  phoneInputWrapper: {
    flex: 1,
  },
  phoneInput: {
    marginBottom: 0,
  },
  verifySection: {
    marginBottom: spacing.md,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${colors.safe}12`,
    paddingVertical: 16,
    paddingHorizontal: spacing.lg,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: `${colors.safe}30`,
  },
  verifiedText: {
    marginLeft: spacing.sm,
    fontSize: 16,
    fontWeight: '600',
    color: colors.safe,
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
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  mitIDTextContainer: {
    flex: 1,
  },
  mitIDButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  mitIDButtonSubtext: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
  checkbox: {
    width: 24,
    height: 24,
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
    lineHeight: 22,
  },
  termsLink: {
    color: colors.primary,
    fontWeight: '500',
  },
  errorText: {
    color: colors.emergency,
    fontSize: 13,
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
  },
  signUpButton: {
    marginTop: spacing.lg,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.xl,
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
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.screenPadding,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    ...typography.heading,
    color: colors.text,
  },
  modalCloseButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.backgroundAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countryList: {
    paddingVertical: spacing.sm,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.screenPadding,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  countryFlag: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  countryName: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  countryCode: {
    fontSize: 15,
    color: colors.textSecondary,
    marginRight: spacing.md,
  },
});
