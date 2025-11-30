import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import Avatar from '../../components/Avatar';
import Button from '../../components/Button';
import Input from '../../components/Input';
import GuardianCard from '../../components/GuardianCard';
import { AlertModal } from '../../components/Modal';
import { colors, spacing, typography } from '../../styles/colors';
import { mockTrustedContacts, mockConnectedGuardians, mockGuardians } from '../../services/mockData';

const TABS = [
  { id: 'trusted', label: 'Trusted' },
  { id: 'guardians', label: 'Guardians' },
  { id: 'find', label: 'Find Users' },
];

export default function NetworkScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('trusted');
  const [trustedContacts, setTrustedContacts] = useState(mockTrustedContacts);
  const [connectedGuardians, setConnectedGuardians] = useState(mockConnectedGuardians);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(null);
  const [showConnectSuccess, setShowConnectSuccess] = useState(null);
  const [connectedUserIds, setConnectedUserIds] = useState(new Set());

  const handleRemoveContact = (contactId) => {
    setTrustedContacts((prev) => prev.filter((c) => c.id !== contactId));
    setShowRemoveConfirm(null);
  };

  const handleAddToTrusted = (guardian) => {
    const alreadyExists = trustedContacts.some(
      (c) => c.name.toLowerCase() === guardian.name.toLowerCase()
    );
    if (alreadyExists) return;

    const newContact = {
      id: `contact_${Date.now()}`,
      name: guardian.name,
      relationship: 'SafeCircle',
      phone: '+45 00000000',
      avatar: guardian.avatar,
    };
    setTrustedContacts((prev) => [...prev, newContact]);
  };

  const handleConnect = (user) => {
    if (connectedUserIds.has(user.id)) return;

    const newContact = {
      id: `contact_${Date.now()}`,
      name: user.name,
      relationship: 'SafeCircle',
      phone: '+45 00000000',
      avatar: user.avatar,
      rating: user.rating,
    };
    
    setTrustedContacts((prev) => [...prev, newContact]);
    setConnectedUserIds((prev) => new Set([...prev, user.id]));
    setShowConnectSuccess(user);
  };

  const isUserConnected = (userId) => {
    if (connectedUserIds.has(userId)) return true;
    const user = mockGuardians.find(g => g.id === userId);
    if (user) {
      return trustedContacts.some(
        (c) => c.name.toLowerCase() === user.name.toLowerCase()
      );
    }
    return false;
  };

  const searchResults = searchQuery.trim()
    ? mockGuardians.filter((g) =>
        g.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const renderTrustedContact = ({ item }) => (
    <View style={styles.contactCard}>
      <Avatar name={item.name} source={item.avatar} size={46} />
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{item.name}</Text>
        <View style={styles.relationshipBadge}>
          <Text style={styles.relationshipText}>{item.relationship}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => setShowRemoveConfirm(item)}
      >
        <Feather name="x" size={18} color={colors.textMuted} />
      </TouchableOpacity>
    </View>
  );

  const renderConnectedGuardian = ({ item }) => (
    <GuardianCard
      guardian={item}
      variant="connected"
      showActions
      onAddToTrusted={() => handleAddToTrusted(item)}
    />
  );

  const renderSearchResult = ({ item }) => {
    const connected = isUserConnected(item.id);
    
    return (
      <View style={styles.searchResultCard}>
        <Avatar name={item.name} source={item.avatar} size={46} />
        <View style={styles.searchResultInfo}>
          <Text style={styles.searchResultName}>{item.name}</Text>
          <View style={styles.searchResultMeta}>
            <Feather name="thumbs-up" size={12} color={colors.safe} />
            <Text style={styles.searchResultRating}>{item.rating}%</Text>
            {item.helpCount && (
              <Text style={styles.helpCount}> • {item.helpCount} helps</Text>
            )}
          </View>
        </View>
        {connected ? (
          <View style={styles.connectedBadge}>
            <Feather name="check-circle" size={16} color={colors.safe} />
            <Text style={styles.connectedText}>Connected</Text>
          </View>
        ) : (
          <Button
            title="Connect"
            onPress={() => handleConnect(item)}
            variant="primary"
            size="small"
          />
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, activeTab === tab.id && styles.tabActive]}
            onPress={() => setActiveTab(tab.id)}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab.id && styles.tabTextActive,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tab Content */}
      {activeTab === 'trusted' && (
        <View style={styles.tabContent}>
          {trustedContacts.length > 0 ? (
            <FlatList
              data={trustedContacts}
              renderItem={renderTrustedContact}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.emptyState}>
              <Feather name="users" size={56} color={colors.border} />
              <Text style={styles.emptyTitle}>No trusted contacts yet</Text>
              <Text style={styles.emptyText}>
                Add trusted contacts who will be notified when you activate safety mode
              </Text>
            </View>
          )}
          <View style={styles.addButtonsContainer}>
            <Button
              title="Add from Phone Contacts"
              onPress={() => setShowAddModal(true)}
              variant="outline"
              icon="call-outline"
              style={styles.addButton}
            />
            <Button
              title="Find SafeCircle Users"
              onPress={() => setActiveTab('find')}
              variant="primary"
              icon="search-outline"
              style={styles.addButton}
            />
          </View>
        </View>
      )}

      {activeTab === 'guardians' && (
        <View style={styles.tabContent}>
          {connectedGuardians.length > 0 ? (
            <FlatList
              data={connectedGuardians}
              renderItem={renderConnectedGuardian}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.emptyState}>
              <Feather name="shield" size={56} color={colors.border} />
              <Text style={styles.emptyTitle}>No connected guardians</Text>
              <Text style={styles.emptyText}>
                Guardians you connect with after they help you will appear here
              </Text>
            </View>
          )}
        </View>
      )}

      {activeTab === 'find' && (
        <View style={styles.tabContent}>
          <Input
            placeholder="Search by name or username"
            value={searchQuery}
            onChangeText={setSearchQuery}
            icon="search-outline"
            style={styles.searchInput}
          />
          
          {!searchQuery.trim() && (
            <View style={styles.suggestionsSection}>
              <Text style={styles.suggestionsTitle}>Suggested Users</Text>
              <FlatList
                data={mockGuardians.slice(0, 5)}
                renderItem={renderSearchResult}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
              />
            </View>
          )}
          
          {searchQuery.trim() && (
            searchResults.length > 0 ? (
              <FlatList
                data={searchResults}
                renderItem={renderSearchResult}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
              />
            ) : (
              <View style={styles.emptyState}>
                <Feather name="search" size={56} color={colors.border} />
                <Text style={styles.emptyTitle}>No users found</Text>
                <Text style={styles.emptyText}>
                  Try a different name or check the spelling
                </Text>
              </View>
            )
          )}
        </View>
      )}

      {/* Modals */}
      <AlertModal
        visible={showRemoveConfirm !== null}
        onClose={() => setShowRemoveConfirm(null)}
        icon="warning"
        iconColor={colors.guardian}
        title="Remove Contact?"
        message={`Are you sure you want to remove ${showRemoveConfirm?.name} from your trusted contacts?`}
        buttons={[
          { text: 'Cancel', onPress: () => setShowRemoveConfirm(null) },
          { text: 'Remove', primary: true, onPress: () => handleRemoveContact(showRemoveConfirm?.id) },
        ]}
      />

      <AlertModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        icon="information-circle"
        iconColor={colors.primary}
        title="Phone Contacts"
        message="In the production app, this would open your phone contacts to select people to add as trusted contacts."
        buttons={[
          { text: 'Got it', primary: true, onPress: () => setShowAddModal(false) },
        ]}
      />

      <AlertModal
        visible={showConnectSuccess !== null}
        onClose={() => setShowConnectSuccess(null)}
        icon="checkmark-circle"
        iconColor={colors.safe}
        title="Connected!"
        message={`${showConnectSuccess?.name} has been added to your trusted contacts.`}
        buttons={[
          { text: 'View Contacts', onPress: () => { setShowConnectSuccess(null); setActiveTab('trusted'); } },
          { text: 'Done', primary: true, onPress: () => setShowConnectSuccess(null) },
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
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundAlt,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  tabActive: {
    backgroundColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    letterSpacing: 0.1,
  },
  tabTextActive: {
    color: colors.textLight,
  },
  tabContent: {
    flex: 1,
  },
  listContent: {
    padding: spacing.md,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 14,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  contactInfo: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  relationshipBadge: {
    backgroundColor: `${colors.primary}12`,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  relationshipText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.primary,
    letterSpacing: 0.1,
  },
  removeButton: {
    padding: spacing.sm,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  emptyTitle: {
    ...typography.heading,
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  emptyText: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  addButtonsContainer: {
    padding: spacing.md,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  addButton: {
    marginBottom: spacing.sm,
  },
  searchInput: {
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    marginBottom: 0,
  },
  suggestionsSection: {
    flex: 1,
  },
  suggestionsTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  searchResultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 14,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchResultInfo: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  searchResultName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  searchResultMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchResultRating: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.safe,
    marginLeft: 4,
  },
  helpCount: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  connectedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${colors.safe}12`,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  connectedText: {
    marginLeft: 4,
    fontSize: 13,
    fontWeight: '600',
    color: colors.safe,
    letterSpacing: 0.1,
  },
});
