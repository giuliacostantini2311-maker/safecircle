import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Modal from './Modal';
import Button from './Button';
import Avatar from './Avatar';
import { colors, spacing } from '../styles/colors';
import { getDisplayName } from '../services/mockData';

export default function RatingModal({
  visible,
  onClose,
  guardian,
  onSubmit,
}) {
  const [rating, setRating] = useState(null);
  const [wantToConnect, setWantToConnect] = useState(false);
  const [negativeReason, setNegativeReason] = useState('');

  const guardianDisplayName = guardian 
    ? getDisplayName(guardian.firstName, guardian.lastName) 
    : guardian?.name || 'Guardian';

  // Check if submit is allowed
  const canSubmit = rating === 'up' || (rating === 'down' && negativeReason.trim().length > 0);

  const handleSubmit = () => {
    onSubmit({
      rating,
      addToNetwork: wantToConnect,
      negativeReason: rating === 'down' ? negativeReason : null,
    });
    // Reset state
    setRating(null);
    setWantToConnect(false);
    setNegativeReason('');
    onClose();
  };

  const handleRatingChange = (newRating) => {
    setRating(newRating);
    // Clear reason if switching to positive
    if (newRating === 'up') {
      setNegativeReason('');
    }
  };

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title="Session Complete"
      showCloseButton={false}
      closeOnBackdrop={false}
    >
      <View style={styles.content}>
        {guardian && (
          <>
            <View style={styles.guardianInfo}>
              <Avatar 
                name={guardianDisplayName} 
                source={guardian.avatar} 
                size={72}
                showBadge
                helpsCount={guardian.helpsCount}
              />
              <Text style={styles.guardianName}>{guardianDisplayName}</Text>
              <Text style={styles.helpedText}>helped you feel safe</Text>
            </View>

            <Text style={styles.ratingQuestion}>How was your experience?</Text>

            <View style={styles.ratingButtons}>
              <TouchableOpacity
                style={[
                  styles.ratingButton,
                  rating === 'up' && styles.ratingButtonActiveUp,
                ]}
                onPress={() => handleRatingChange('up')}
                activeOpacity={0.8}
              >
                <Feather
                  name="thumbs-up"
                  size={28}
                  color={rating === 'up' ? colors.textLight : colors.safe}
                />
                <Text
                  style={[
                    styles.ratingLabel,
                    rating === 'up' && styles.ratingLabelActive,
                  ]}
                >
                  Great
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.ratingButton,
                  rating === 'down' && styles.ratingButtonActiveDown,
                ]}
                onPress={() => handleRatingChange('down')}
                activeOpacity={0.8}
              >
                <Feather
                  name="thumbs-down"
                  size={28}
                  color={rating === 'down' ? colors.textLight : colors.emergency}
                />
                <Text
                  style={[
                    styles.ratingLabel,
                    rating === 'down' && styles.ratingLabelActive,
                  ]}
                >
                  Not helpful
                </Text>
              </TouchableOpacity>
            </View>

            {/* Reason input for negative rating */}
            {rating === 'down' && (
              <View style={styles.reasonSection}>
                <Text style={styles.reasonLabel}>
                  Please tell us why <Text style={styles.requiredAsterisk}>*</Text>
                </Text>
                <TextInput
                  style={styles.reasonInput}
                  placeholder="What went wrong? Your feedback helps improve the community..."
                  placeholderTextColor={colors.textMuted}
                  value={negativeReason}
                  onChangeText={setNegativeReason}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
                {negativeReason.trim().length === 0 && (
                  <Text style={styles.reasonRequired}>
                    A reason is required to continue
                  </Text>
                )}
              </View>
            )}

            <View style={styles.connectSection}>
              <Text style={styles.connectQuestion}>Add to your network?</Text>
              <TouchableOpacity
                style={[
                  styles.connectButton,
                  wantToConnect && styles.connectButtonActive,
                ]}
                onPress={() => setWantToConnect(!wantToConnect)}
                activeOpacity={0.8}
              >
                <Feather
                  name={wantToConnect ? 'check-circle' : 'user-plus'}
                  size={18}
                  color={wantToConnect ? colors.textLight : colors.primary}
                />
                <Text
                  style={[
                    styles.connectButtonText,
                    wantToConnect && styles.connectButtonTextActive,
                  ]}
                >
                  {wantToConnect ? 'Added to Trusted!' : 'Connect'}
                </Text>
              </TouchableOpacity>
              {wantToConnect && (
                <Text style={styles.connectNote}>
                  Will be added to your trusted contacts
                </Text>
              )}
            </View>
          </>
        )}

        <Button
          title="Done"
          onPress={handleSubmit}
          variant="primary"
          style={styles.submitButton}
          disabled={!canSubmit}
        />
        {!canSubmit && rating === 'down' && (
          <Text style={styles.submitHint}>
            Please provide a reason to continue
          </Text>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    paddingTop: spacing.sm,
  },
  guardianInfo: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  guardianName: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginTop: spacing.md,
    letterSpacing: -0.3,
  },
  helpedText: {
    fontSize: 15,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    letterSpacing: 0.1,
  },
  ratingQuestion: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.md,
    letterSpacing: -0.2,
  },
  ratingButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  ratingButton: {
    width: 100,
    height: 100,
    borderRadius: 16,
    backgroundColor: colors.backgroundAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: spacing.sm,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  ratingButtonActiveUp: {
    backgroundColor: colors.safe,
    borderColor: colors.safe,
    shadowColor: 'rgba(126, 161, 114, 0.3)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  ratingButtonActiveDown: {
    backgroundColor: colors.emergency,
    borderColor: colors.emergency,
    shadowColor: 'rgba(193, 102, 107, 0.3)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  ratingLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginTop: spacing.sm,
    letterSpacing: 0.1,
  },
  ratingLabelActive: {
    color: colors.textLight,
  },
  // Reason section for negative feedback
  reasonSection: {
    width: '100%',
    marginBottom: spacing.lg,
  },
  reasonLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  requiredAsterisk: {
    color: colors.emergency,
  },
  reasonInput: {
    width: '100%',
    minHeight: 80,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 12,
    padding: spacing.md,
    fontSize: 15,
    color: colors.text,
    backgroundColor: colors.backgroundAlt,
  },
  reasonRequired: {
    fontSize: 12,
    color: colors.emergency,
    marginTop: spacing.xs,
  },
  // Connect section
  connectSection: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginBottom: spacing.md,
  },
  connectQuestion: {
    fontSize: 15,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    letterSpacing: 0.1,
  },
  connectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    backgroundColor: colors.backgroundAlt,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  connectButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  connectButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: spacing.sm,
    letterSpacing: 0.1,
  },
  connectButtonTextActive: {
    color: colors.textLight,
  },
  connectNote: {
    fontSize: 12,
    color: colors.safe,
    marginTop: spacing.sm,
  },
  submitButton: {
    width: '100%',
  },
  submitHint: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: spacing.sm,
  },
});
