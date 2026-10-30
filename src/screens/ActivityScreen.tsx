import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { NotificationItem, Campaign } from '../types/campaign';
import { useCampaigns } from '../context/CampaignContext';
import { ProgressBar } from '../components/common/ProgressBar';
import { Image } from 'react-native';

interface ActivityScreenProps {
  onSelectCampaignById: (campaignId: string) => void;
}

export const ActivityScreen: React.FC<ActivityScreenProps> = ({
  onSelectCampaignById
}) => {
  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    campaigns,
    followedCampaignIds,
    notificationPrefs,
    setNotificationPref,
    isNotificationEnabled
  } = useCampaigns();
  const [view, setView] = useState<'updates' | 'following'>('updates');
  const followedCampaigns = campaigns.filter(c => followedCampaignIds.includes(c.id));

  const [activeFilter, setActiveFilter] = useState<'all' | 'milestone' | 'contribution' | 'promotion'>('all');
  const [showSettings, setShowSettings] = useState<boolean>(false);

  const filteredNotifications = notifications.filter(n => {
    if (!isNotificationEnabled(n)) return false;
    if (activeFilter === 'all') return true;
    return n.type === activeFilter;
  });

  const unreadCount = notifications.filter(n => !n.read && isNotificationEnabled(n)).length;

  const getIconForType = (type: NotificationItem['type']) => {
    switch (type) {
      case 'milestone':
        return { name: 'trophy-outline' as const, color: colors.amberDark, bg: colors.amberLight };
      case 'promotion':
        return { name: 'rocket-outline' as const, color: colors.primary, bg: colors.primaryLight };
      case 'contribution':
        return { name: 'heart-outline' as const, color: colors.accentDark, bg: colors.accentLight };
      case 'submission':
        return { name: 'document-text-outline' as const, color: colors.purple, bg: colors.purpleLight };
      default:
        return { name: 'notifications-outline' as const, color: colors.textSecondary, bg: colors.background };
    }
  };

  const handleNotificationPress = (item: NotificationItem) => {
    markNotificationAsRead(item.id);
    if (item.campaignId) {
      onSelectCampaignById(item.campaignId);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Activity & Updates</Text>
          <Text style={styles.headerSubtitle}>
            {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up'}
          </Text>
        </View>

        <View style={styles.headerActions}>
          {unreadCount > 0 && (
            <TouchableOpacity
              style={styles.markReadBtn}
              onPress={markAllNotificationsAsRead}
            >
              <Text style={styles.markReadText}>Mark all read</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.settingsBtn}
            onPress={() => setShowSettings(!showSettings)}
          >
            <Ionicons
              name={showSettings ? 'close' : 'options-outline'}
              size={20}
              color={colors.text}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Notification preferences */}
      {showSettings && (
        <View style={styles.settingsTray}>
          <Text style={styles.settingsTitle}>Notification preferences</Text>
          <Text style={styles.switchDesc}>
            A category that is switched off is hidden from this feed and from the unread count.
          </Text>

          <View style={styles.switchRow}>
            <View style={styles.switchLabelContainer}>
              <Text style={styles.switchTitle}>Funding milestones</Text>
              <Text style={styles.switchDesc}>When a campaign reaches a funding milestone or its goal</Text>
            </View>
            <Switch
              value={notificationPrefs.milestone}
              onValueChange={v => setNotificationPref('milestone', v)}
              trackColor={{ false: colors.border, true: colors.primaryLight }}
              thumbColor={notificationPrefs.milestone ? colors.primary : '#FFFFFF'}
            />
          </View>

          <View style={styles.switchRow}>
            <View style={styles.switchLabelContainer}>
              <Text style={styles.switchTitle}>Promotion and reports</Text>
              <Text style={styles.switchDesc}>When promotion starts and delivery reports are ready (demo data)</Text>
            </View>
            <Switch
              value={notificationPrefs.promotion}
              onValueChange={v => setNotificationPref('promotion', v)}
              trackColor={{ false: colors.border, true: colors.primaryLight }}
              thumbColor={notificationPrefs.promotion ? colors.primary : '#FFFFFF'}
            />
          </View>

          <View style={styles.switchRow}>
            <View style={styles.switchLabelContainer}>
              <Text style={styles.switchTitle}>Payments and backed campaigns</Text>
              <Text style={styles.switchDesc}>Contribution results and updates on campaigns you backed</Text>
            </View>
            <Switch
              value={notificationPrefs.contribution}
              onValueChange={v => setNotificationPref('contribution', v)}
              trackColor={{ false: colors.border, true: colors.primaryLight }}
              thumbColor={notificationPrefs.contribution ? colors.primary : '#FFFFFF'}
            />
          </View>

          <View style={styles.switchRow}>
            <View style={styles.switchLabelContainer}>
              <Text style={styles.switchTitle}>Review and account</Text>
              <Text style={styles.switchDesc}>Submission, review decisions and account notices</Text>
            </View>
            <Switch
              value={notificationPrefs.status}
              onValueChange={v => setNotificationPref('status', v)}
              trackColor={{ false: colors.border, true: colors.primaryLight }}
              thumbColor={notificationPrefs.status ? colors.primary : '#FFFFFF'}
            />
          </View>
        </View>
      )}

      {/* Updates / Following switch */}
      <View style={styles.viewToggleRow}>
        {(['updates', 'following'] as const).map(v => (
          <TouchableOpacity
            key={v}
            style={[styles.viewToggleBtn, view === v && styles.viewToggleBtnActive]}
            onPress={() => setView(v)}
            accessibilityRole="button"
          >
            <Text style={[styles.viewToggleText, view === v && styles.viewToggleTextActive]}>
              {v === 'updates' ? 'Updates' : `Following (${followedCampaigns.length})`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {view === 'updates' ? (
        <>
      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        {(['all', 'milestone', 'promotion', 'contribution'] as const).map(tab => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.filterTab,
              activeFilter === tab && styles.activeFilterTab
            ]}
            onPress={() => setActiveFilter(tab)}
          >
            <Text
              style={[
                styles.filterTabText,
                activeFilter === tab && styles.activeFilterTabText
              ]}
            >
              {tab === 'all'
                ? 'All'
                : tab === 'milestone'
                ? 'Milestones'
                : tab === 'promotion'
                ? 'Ads Live'
                : 'Backed'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Notifications List */}
      <ScrollView contentContainerStyle={styles.listContent}>
        {filteredNotifications.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="notifications-off-outline" size={44} color={colors.textMuted} />
            <Text style={styles.emptyTitle}>No activity in this view</Text>
            <Text style={styles.emptySubtitle}>
              Activity from your created and backed campaigns will appear here.
            </Text>
          </View>
        ) : (
          filteredNotifications.map(item => {
            const iconConf = getIconForType(item.type);

            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.notifCard, !item.read && styles.unreadNotifCard]}
                onPress={() => handleNotificationPress(item)}
                activeOpacity={0.8}
              >
                <View
                  style={[styles.iconWrapper, { backgroundColor: iconConf.bg }]}
                >
                  <Ionicons name={iconConf.name} size={18} color={iconConf.color} />
                </View>

                <View style={styles.notifContent}>
                  <View style={styles.titleRow}>
                    <Text style={styles.notifTitle}>{item.title}</Text>
                    <Text style={styles.notifTimestamp}>{item.timestamp}</Text>
                  </View>
                  <Text style={styles.notifMessage}>{item.message}</Text>
                </View>

                {!item.read && <View style={styles.unreadDot} />}
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
        </>
      ) : (
        <ScrollView contentContainerStyle={styles.listContent}>
          {followedCampaigns.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="notifications-outline" size={44} color={colors.textMuted} />
              <Text style={styles.emptyTitle}>You are not following any campaigns</Text>
              <Text style={styles.emptySubtitle}>
                Tap Follow on a campaign page to keep its progress here.
              </Text>
            </View>
          ) : (
            followedCampaigns.map(c => {
              const ratio = c.funding.goalAmount > 0 ? Math.min(1, c.funding.currentAmount / c.funding.goalAmount) : 0;
              const statusLabel = (colors.status as any)[c.status]?.label || c.status;
              return (
                <TouchableOpacity
                  key={c.id}
                  style={styles.followCard}
                  onPress={() => onSelectCampaignById(c.id)}
                  activeOpacity={0.85}
                >
                  <Image source={{ uri: c.coverImage }} style={styles.followThumb} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.followTitle} numberOfLines={2}>{c.title}</Text>
                    <Text style={styles.followMeta}>
                      {statusLabel} · ${c.funding.currentAmount.toLocaleString()} of ${c.funding.goalAmount.toLocaleString()} (demo)
                    </Text>
                    <ProgressBar progress={ratio} height={6} color={colors.primary} style={{ marginTop: 8 }} />
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  viewToggleRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingVertical: 10 },
  viewToggleBtn: { flex: 1, minHeight: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 12, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  viewToggleBtnActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  viewToggleText: { fontSize: 14, fontWeight: '600', color: colors.textSecondary },
  viewToggleTextActive: { color: '#FFFFFF' },
  followCard: { flexDirection: 'row', gap: 12, padding: 12, marginBottom: 10, borderRadius: 14, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  followThumb: { width: 64, height: 64, borderRadius: 10 },
  followTitle: { fontSize: 15, fontWeight: '600', color: colors.text },
  followMeta: { fontSize: 12, color: colors.textSecondary, marginTop: 4 },
  container: {
    flex: 1,
    backgroundColor: colors.background
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text
  },
  headerSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  markReadBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4
  },
  markReadText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary
  },
  settingsBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center'
  },
  settingsTray: {
    backgroundColor: colors.surface,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 12
  },
  settingsTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'none',
    letterSpacing: 0.3
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  switchLabelContainer: {
    flex: 1,
    marginRight: 10
  },
  switchTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text
  },
  switchDesc: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1
  },
  filterRow: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 8
  },
  filterTab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: colors.background
  },
  activeFilterTab: {
    backgroundColor: colors.primary
  },
  filterTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary
  },
  activeFilterTabText: {
    color: '#FFFFFF'
  },
  listContent: {
    padding: 16,
    gap: 10
  },
  notifCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
    alignItems: 'flex-start'
  },
  unreadNotifCard: {
    borderColor: '#BCD3DE',
    backgroundColor: '#F5F9FB'
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center'
  },
  notifContent: {
    flex: 1
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4
  },
  notifTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    flex: 1
  },
  notifTimestamp: {
    fontSize: 10,
    color: colors.textMuted,
    marginLeft: 6
  },
  notifMessage: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 17
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginTop: 4
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginTop: 10
  },
  emptySubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
    textAlign: 'center'
  }
});
