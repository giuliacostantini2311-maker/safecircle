import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
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
import { LANGUAGES } from '../../utils/constants';

export default function ProfileScreen({ navigation }) {
  const { user, updateProfile, logout } = useAuth();
  
  const [avatar, setAvatar] = useState(user?.avatar);
  const [fullName, setFullName] = useState(`${user?.firstName || ''} ${user?.lastName || ''}`.trim());
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [username, setUsername] = useState(user?.username || '');
  const [language, setLanguage] = useState(user?.language || 'en');
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const pickImage = async () => {
    // Request permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to upload your profile picture!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
      // Accepted formats: JPEG, PNG, WebP, GIF, BMP, TIFF
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const [firstName, ...lastNameParts] = fullName.split(' ');
    const lastName = lastNameParts.join(' ');
    
    await updateProfile({ firstName, lastName, email, phone, username, language, avatar });
    setSaving(false);
    setShowSuccess(true);
  };

  const handleDelete = () => {
    setShowDeleteConfirm(false);
    logout();
  };

  const selectedLanguage = LANGUAGES.find((l) => l.code === language);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.avatarSection}>
          <Avatar
            source={avatar}
            name={fullName || 'User'}
            size={100}
            onPress={pickImage}
            showEditButton
            showBadge
            helpsCount={user?.helpsCount}
          />
          <TouchableOpacity onPress={pickImage}>
            <Text style={styles.changePhotoText}>Change Photo</Text>
          </TouchableOpacity>
          <Text style={styles.formatInfo}>
            Accepted formats: JPEG, PNG, WebP, GIF, BMP, TIFF
          </Text>
        </View>

        {user?.verified && (
          <View style={styles.verifiedBadge}>
            <Feather name="check-circle" size={18} color={colors.safe} />
            <Text style={styles.verifiedText}>MitID Verified</Text>
          </View>
        )}

        <View style={styles.form}>
          <Input
            label="Full Name"
            placeholder="Enter your full name"
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words"
            icon="person-outline"
          />

          <Input
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            icon="mail-outline"
          />

          <Input
            label="Phone Number"
            placeholder="+45 12345678"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            icon="call-outline"
          />

          <Input
            label="Username"
            placeholder="Choose a username"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            icon="at-outline"
          />

          <View style={styles.languageSection}>
            <Text style={styles.label}>Language</Text>
            <TouchableOpacity
              style={styles.languageButton}
              onPress={() => setShowLanguagePicker(true)}
              activeOpacity={0.8}
            >
              <Feather name="globe" size={18} color={colors.textMuted} />
              <Text style={styles.languageText}>{selectedLanguage?.label}</Text>
              <Feather name="chevron-down" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.actions}>
          <Button
            title="Save Changes"
            onPress={handleSave}
            loading={saving}
            style={styles.saveButton}
          />

          <Button
            title="Sign Out"
            onPress={logout}
            variant="outline"
            icon="log-out-outline"
            style={styles.signOutButton}
          />

          <TouchableOpacity
            style={styles.deleteLink}
            onPress={() => setShowDeleteConfirm(true)}
          >
            <Text style={styles.deleteLinkText}>Delete Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <AlertModal
        visible={showLanguagePicker}
        onClose={() => setShowLanguagePicker(false)}
        title="Select Language"
        buttons={LANGUAGES.map((lang) => ({
          text: lang.label,
          primary: lang.code === language,
          onPress: () => { setLanguage(lang.code); setShowLanguagePicker(false); },
        }))}
      />

      <AlertModal
        visible={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        icon="warning"
        iconColor={colors.emergency}
        title="Delete Account?"
        message="This action cannot be undone. All your data will be permanently deleted."
        buttons={[
          { text: 'Cancel', onPress: () => setShowDeleteConfirm(false) },
          { text: 'Delete', destructive: true, onPress: handleDelete },
        ]}
      />

      <AlertModal
        visible={showSuccess}
        onClose={() => setShowSuccess(false)}
        icon="checkmark-circle"
        iconColor={colors.safe}
        title="Profile Updated"
        message="Your changes have been saved successfully."
        buttons={[
          { text: 'Done', primary: true, onPress: () => setShowSuccess(false) },
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
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: spacing.xl,
  },
  avatarSection: {
    alignItems: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  changePhotoText: {
    marginTop: spacing.sm,
    fontSize: 15,
    color: colors.primary,
    fontWeight: '600',
  },
  formatInfo: {
    marginTop: spacing.xs,
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${colors.safe}12`,
    paddingVertical: 10,
    paddingHorizontal: spacing.lg,
    borderRadius: 20,
    alignSelf: 'center',
    marginBottom: spacing.lg,
  },
  verifiedText: {
    marginLeft: spacing.sm,
    fontSize: 14,
    fontWeight: '600',
    color: colors.safe,
  },
  form: {
    marginBottom: spacing.lg,
  },
  languageSection: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
  },
  languageText: {
    flex: 1,
    marginLeft: spacing.sm,
    fontSize: 16,
    color: colors.text,
  },
  actions: {
    marginTop: spacing.md,
  },
  saveButton: {
    marginBottom: spacing.sm,
  },
  signOutButton: {
    marginBottom: spacing.lg,
  },
  deleteLink: {
    alignItems: 'center',
    padding: spacing.sm,
  },
  deleteLinkText: {
    fontSize: 15,
    color: colors.emergency,
    fontWeight: '500',
  },
});
