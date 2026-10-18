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

interface ActivityScreenProps {
  onSelectCampaignById: (campaignId: string) => void;
}

export const ActivityScreen: React.FC<ActivityScreenProps> = ({
  onSelectCampaignById
}) => {
  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead
  } = useCampaigns();

  const [activeFilter, setActiveFilter] = useState<'all' | 'milestone' | 'contribution' | 'promotion'>('all');
  const [showSettings, setShowSettings] = useState<boolean>(false);

  // Preference switches
  const [milestonePush, setMilestonePush] = useState<boolean>(true);
  const [deliveryReportsPush, setDeliveryReportsPush] = useState<boolean>(true);
  const [backedCampaignUpdates, setBackedCampaignUpdates] = useState<boolean>(true);

  const filteredNotifications = notifications.filter(n => {
    if (activeFilter === 'all') return true;
    return n.type === activeFilter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

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

      {/* Optional Notification Preferences Tray */}
      {showSettings && (
        <View style={styles.settingsTray}>
          <Text style={styles.settingsTitle}>Notification Preferences</Text>

          <View style={styles.switchRow}>
            <View style={styles.switchLabelContainer}>
              <Text style={styles.switchTitle}>Campaign Milestones</Text>
              <Text style={styles.switchDesc}>When campaigns reach 50%, 80%, and goal</Text>
            </View>
            <Switch
              value={milestonePush}
              onValueChange={setMilestonePush}
              trackColor={{ false: colors.border, true: colors.primaryLight }}
              thumbColor={milestonePush ? colors.primary : '#FFFFFF'}
            />
          </View>

          <View style={styles.switchRow}>
            <View style={styles.switchLabelContainer}>
              <Text style={styles.switchTitle}>Live Ad Delivery Reports</Text>
              <Text style={styles.switchDesc}>Weekly reach numbers and impressions delivered</Text>
            </View>
            <Switch
              value={deliveryReportsPush}
              onValueChange={setDeliveryReportsPush}
              trackColor={{ false: colors.border, true: colors.primaryLight }}
              thumbColor={deliveryReportsPush ? colors.primary : '#FFFFFF'}
            />
          </View>

          <View style={styles.switchRow}>
            <View style={styles.switchLabelContainer}>
              <Text style={styles.switchTitle}>Backed Messages</Text>
              <Text style={styles.switchDesc}>Updates on campaigns you have amplified</Text>
            </View>
            <Switch
              value={backedCampaignUpdates}
              onValueChange={setBackedCampaignUpdates}
              trackColor={{ false: colors.border, true: colors.primaryLight }}
              thumbColor={backedCampaignUpdates ? colors.primary : '#FFFFFF'}
            />
          </View>
        </View>
      )}

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
    </View>
  );
};

const styles = StyleSheet.create({
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
