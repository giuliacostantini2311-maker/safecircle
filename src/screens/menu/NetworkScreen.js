import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import Avatar from '../../components/Avatar';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { AlertModal } from '../../components/Modal';
import { useAuth } from '../../context/AuthContext';
import { colors, spacing, typography } from '../../styles/colors';
import { mockTrustedContacts, mockSafeCircleUsers, mockGuardians, getDisplayName } from '../../services/mockData';

const TABS = [
  { id: 'trusted', label: 'Trusted' },
  { id: 'safecircle', label: 'SafeCircle Users' },
  { id: 'find', label: 'Find Users' },
];

// Helper to format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { day: 'numeric', month: 'short', year: 'numeric' };
  return date.toLocaleDateString('en-GB', options);
};

export default function NetworkScreen({ navigation }) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('trusted');
  const [trustedContacts, setTrustedContacts] = useState(mockTrustedContacts);
  const [safeCircleUsers, setSafeCircleUsers] = useState(mockSafeCircleUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(null);
  const [showConnectSuccess, setShowConnectSuccess] = useState(null);
  const [connectedUserIds, setConnectedUserIds] = useState(new Set());
  
  // Thank you note state
  const [selectedNote, setSelectedNote] = useState(null);

  // Get the current user's display name for the letter greeting
  const currentUsername = user?.username || user?.firstName || 'Friend';

  const handleRemoveContact = (contactId) => {
    setTrustedContacts((prev) => prev.filter((c) => c.id !== contactId));
    setShowRemoveConfirm(null);
  };

  const handleConnect = (connectedUser) => {
    if (connectedUserIds.has(connectedUser.id)) return;

    const newContact = {
      id: `contact_${Date.now()}`,
      username: connectedUser.username,
      relationship: 'SafeCircle',
      phone: '+45 00000000',
      avatar: connectedUser.avatar,
      rating: connectedUser.rating,
    };
    
    setTrustedContacts((prev) => [...prev, newContact]);
    setConnectedUserIds((prev) => new Set([...prev, connectedUser.id]));
    setShowConnectSuccess(connectedUser);
  };

  const isUserConnected = (userId) => {
    if (connectedUserIds.has(userId)) return true;
    const foundUser = mockGuardians.find(g => g.id === userId);
    if (foundUser) {
      return trustedContacts.some(
        (c) => c.username?.toLowerCase() === foundUser.username?.toLowerCase()
      );
    }
    return false;
  };

  const handleOpenNote = (noteUser) => {
    setSelectedNote(noteUser);
    // Mark as read
    setSafeCircleUsers(prev => prev.map(u => 
      u.id === noteUser.id 
        ? { ...u, thankYouNote: { ...u.thankYouNote, read: true } }
        : u
    ));
  };

  const handleCloseNote = () => {
    setSelectedNote(null);
  };

  const searchResults = searchQuery.trim()
    ? mockGuardians.filter((g) =>
        g.username.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const renderTrustedContact = ({ item }) => {
    const displayName = getDisplayName(item.firstName, item.lastName);
    return (
    <View style={styles.contactCard}>
      <Avatar 
        name={displayName} 
        source={item.avatar} 
        size={46}
        showBadge
        helpsCount={item.helpsCount}
      />
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{displayName}</Text>
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
  };

  const renderSafeCircleUser = ({ item }) => {
    const displayName = getDisplayName(item.firstName, item.lastName);
    const isHelpedYou = item.lastActivity.type === 'helped_you';
    const activityText = isHelpedYou 
      ? `Saved you on ${formatDate(item.lastActivity.date)}`
      : `Helped on ${formatDate(item.lastActivity.date)}`;
    
    const hasUnreadNote = item.thankYouNote?.received && !item.thankYouNote?.read;
    const hasNote = item.thankYouNote?.received;
    
    return (
      <View style={styles.safeCircleCard}>
        {/* Main user info row */}
        <View style={styles.safeCircleMain}>
          <Avatar 
            name={displayName} 
            source={item.avatar} 
            size={50}
            showBadge
            helpsCount={item.helpsCount}
          />
          <View style={styles.safeCircleInfo}>
            <Text style={styles.safeCircleName}>{displayName}</Text>
            <View style={styles.activityRow}>
              <Feather 
                name={isHelpedYou ? "heart" : "shield"} 
                size={13} 
                color={isHelpedYou ? colors.emergency : colors.safe} 
              />
              <Text style={styles.activityText}>{activityText}</Text>
            </View>
          </View>
          
          {/* Envelope icon for thank you notes */}
          {hasNote && (
            <TouchableOpacity
              style={[
                styles.envelopeButton,
                hasUnreadNote && styles.envelopeButtonUnread
              ]}
              onPress={() => handleOpenNote(item)}
            >
              <Feather 
                name="mail" 
                size={20} 
                color={hasUnreadNote ? colors.primary : colors.textMuted} 
              />
              {hasUnreadNote && <View style={styles.unreadDot} />}
            </TouchableOpacity>
          )}
        </View>
        
        {/* Stats row */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Feather name="heart" size={14} color={colors.primary} />
            <Text style={styles.statText}>
              {item.stats.timesHelpedYou} {item.stats.timesHelpedYou === 1 ? 'time' : 'times'} helped you
            </Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Feather name="shield" size={14} color={colors.safe} />
            <Text style={styles.statText}>
              {item.stats.timesYouHelped} {item.stats.timesYouHelped === 1 ? 'time' : 'times'} you helped
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderSearchResult = ({ item }) => {
    const connected = isUserConnected(item.id);
    const displayName = getDisplayName(item.firstName, item.lastName);
    
    return (
      <View style={styles.searchResultCard}>
        <Avatar 
          name={displayName} 
          source={item.avatar} 
          size={46}
          showBadge
          helpsCount={item.helpsCount}
        />
        <View style={styles.searchResultInfo}>
          <Text style={styles.searchResultName}>{displayName}</Text>
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
              numberOfLines={1}
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

      {activeTab === 'safecircle' && (
        <View style={styles.tabContent}>
          {safeCircleUsers.length > 0 ? (
            <FlatList
              data={safeCircleUsers}
              renderItem={renderSafeCircleUser}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              ListHeaderComponent={
                <Text style={styles.sectionSubtitle}>
                  People you've helped and people who've helped you
                </Text>
              }
            />
          ) : (
            <View style={styles.emptyState}>
              <Feather name="users" size={56} color={colors.border} />
              <Text style={styles.emptyTitle}>No connections yet</Text>
              <Text style={styles.emptyText}>
                When you help someone or get helped, they'll appear here
              </Text>
            </View>
          )}
        </View>
      )}

      {activeTab === 'find' && (
        <View style={styles.tabContent}>
          <Input
            placeholder="Search by username"
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
                  Try a different username
                </Text>
              </View>
            )
          )}
        </View>
      )}

      {/* Thank You Note Modal - Simple Version */}
      <Modal
        visible={selectedNote !== null}
        transparent
        animationType="fade"
        onRequestClose={handleCloseNote}
      >
        <View style={styles.noteModalOverlay}>
          <View style={styles.noteModalContent}>
            {/* Close button */}
            <TouchableOpacity
              style={styles.noteCloseButton}
              onPress={handleCloseNote}
            >
              <Feather name="x" size={24} color={colors.textMuted} />
            </TouchableOpacity>

            {/* Letter icon */}
            <View style={styles.letterIcon}>
              <Feather name="heart" size={28} color={colors.primary} />
            </View>

            {/* Header */}
            <Text style={styles.noteModalTitle}>Thank You Note</Text>
            <Text style={styles.noteModalSubtitle}>
              from {selectedNote ? getDisplayName(selectedNote.firstName, selectedNote.lastName) : ''}
            </Text>

            {/* Letter Content */}
            <ScrollView style={styles.letterScroll} showsVerticalScrollIndicator={false}>
              <View style={styles.letterPaper}>
                <Text style={styles.letterGreeting}>Hi {currentUsername},</Text>
                <Text style={styles.letterBody}>
                  {selectedNote?.thankYouNote?.message || 'No message'}
                </Text>
                <Text style={styles.letterSignature}>
                  — {selectedNote ? getDisplayName(selectedNote.firstName, selectedNote.lastName) : ''}
                </Text>
              </View>
            </ScrollView>

            <Button
              title="Close"
              onPress={handleCloseNote}
              variant="primary"
              style={styles.closeButton}
            />
          </View>
        </View>
      </Modal>

      {/* Other Modals */}
      <AlertModal
        visible={showRemoveConfirm !== null}
        onClose={() => setShowRemoveConfirm(null)}
        icon="warning"
        iconColor={colors.guardian}
        title="Remove Contact?"
        message={`Are you sure you want to remove ${showRemoveConfirm?.username} from your trusted contacts?`}
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
        message={`${showConnectSuccess?.username} has been added to your trusted contacts.`}
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
    paddingHorizontal: 4,
    alignItems: 'center',
    borderRadius: 10,
  },
  tabActive: {
    backgroundColor: colors.primary,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    letterSpacing: 0.1,
    textAlign: 'center',
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
  sectionSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    textAlign: 'center',
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
  // SafeCircle User Card Styles
  safeCircleCard: {
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  safeCircleMain: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  safeCircleInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  safeCircleName: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginLeft: 6,
  },
  envelopeButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.backgroundAlt,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  envelopeButtonUnread: {
    backgroundColor: `${colors.primary}15`,
  },
  unreadDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.emergency,
    borderWidth: 2,
    borderColor: colors.background,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundAlt,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: spacing.sm,
  },
  statItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 6,
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: 20,
    backgroundColor: colors.border,
    marginHorizontal: spacing.sm,
  },
  // Empty State Styles
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
  // Thank You Note Modal Styles
  noteModalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  noteModalContent: {
    backgroundColor: colors.background,
    borderRadius: 24,
    padding: spacing.xl,
    width: '100%',
    maxWidth: 340,
    maxHeight: '80%',
    alignItems: 'center',
  },
  noteCloseButton: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.backgroundAlt,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  letterIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: `${colors.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  noteModalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  noteModalSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  letterScroll: {
    width: '100%',
    maxHeight: 300,
  },
  letterPaper: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  letterGreeting: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.md,
  },
  letterBody: {
    fontSize: 15,
    lineHeight: 24,
    color: colors.text,
    marginBottom: spacing.lg,
  },
  letterSignature: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primary,
    fontStyle: 'italic',
    textAlign: 'right',
  },
  closeButton: {
    marginTop: spacing.lg,
    minWidth: 120,
  },
});
