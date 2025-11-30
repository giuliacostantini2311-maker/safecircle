import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import Button from '../../components/Button';
import { colors, spacing, typography } from '../../styles/colors';
import { mockCallersNeedingHelp, getDisplayName } from '../../services/mockData';

export default function CallersNeedingHelpScreen({ navigation }) {
  const [callers] = useState(mockCallersNeedingHelp);

  const handleHelpCaller = (caller) => {
    navigation.navigate('HelperChat', { caller });
  };

  const renderCaller = ({ item }) => {
    const displayName = getDisplayName(item.firstName, item.lastName);
    return (
      <View style={styles.callerCard}>
        <View style={styles.callerCardHeader}>
          <View style={styles.callerIconContainer}>
            <Feather name="user" size={24} color={colors.textMuted} />
          </View>
          <View style={styles.callerInfo}>
            <Text style={styles.callerName}>
              {displayName} needs your help
            </Text>
            <View style={styles.callerDistance}>
              <Feather name="map-pin" size={12} color={colors.textSecondary} />
              <Text style={styles.callerDistanceText}>
                ~{item.distance}m away ({item.walkTime} min walk)
              </Text>
            </View>
          </View>
        </View>
        
        {/* Brief message preview - only show if message exists */}
        {item.message && (
          <View style={styles.messageContainer}>
            <Feather name="message-circle" size={14} color={colors.textMuted} />
            <Text style={styles.callerMessage} numberOfLines={2}>
              {item.message}
            </Text>
          </View>
        )}
        
        <Button
          title="Help this Caller"
          onPress={() => handleHelpCaller(item)}
          variant="safe"
          style={styles.helpButton}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {/* Header Info */}
      <View style={styles.headerInfo}>
        <View style={styles.headerIconContainer}>
          <Feather name="alert-circle" size={24} color={colors.white} />
        </View>
        <Text style={styles.headerTitle}>People Nearby Need Help</Text>
        <Text style={styles.headerSubtitle}>
          {callers.length} {callers.length === 1 ? 'person is' : 'people are'} waiting for a guardian
        </Text>
      </View>

      {/* Callers List */}
      <FlatList
        data={callers}
        renderItem={renderCaller}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Feather name="check-circle" size={56} color={colors.safe} />
            <Text style={styles.emptyTitle}>All safe!</Text>
            <Text style={styles.emptyText}>
              No one needs help right now. Check back later.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    ...(Platform.OS === 'web' && { height: '100%' }),
  },
  headerInfo: {
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.backgroundAlt,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.emergency,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  headerTitle: {
    ...typography.heading,
    color: colors.text,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  listContent: {
    padding: spacing.md,
  },
  callerCard: {
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  callerCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  callerIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.backgroundAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  callerInfo: {
    flex: 1,
  },
  callerName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  callerDistance: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  callerDistanceText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.backgroundAlt,
    borderRadius: 10,
    padding: spacing.sm,
    marginBottom: spacing.md,
  },
  callerMessage: {
    flex: 1,
    fontSize: 13,
    color: colors.text,
    marginLeft: spacing.xs,
    lineHeight: 18,
    fontStyle: 'italic',
  },
  helpButton: {
    marginBottom: 0,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxl,
  },
  emptyTitle: {
    ...typography.heading,
    color: colors.safe,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
