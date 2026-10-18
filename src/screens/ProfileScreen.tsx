import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { Campaign, UserRole } from '../types/campaign';
import { useCampaigns } from '../context/CampaignContext';
import { StatusBadge } from '../components/common/Badge';

interface ProfileScreenProps {
  onSelectCampaign: (campaign: Campaign) => void;
  onOpenCreatorDashboard: (campaign: Campaign) => void;
  onOpenAdminPanel: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  onSelectCampaign,
  onOpenCreatorDashboard,
  onOpenAdminPanel
}) => {
  const {
    campaigns,
    userContributions,
    bookmarkedCampaignIds,
    userRole,
    setUserRole,
    resetToDefaults
  } = useCampaigns();

  const [activeTab, setActiveTab] = useState<'created' | 'backed' | 'saved'>('created');
  const [showSecondaryModal, setShowSecondaryModal] = useState<string | null>(null);

  // User's created campaigns (either created in session or sample created by user)
  const myCreatedCampaigns = campaigns.filter(
    c => c.creatorName.includes('Dr. Elena') || c.id.startsWith('camp-') && (c.status === 'draft' || c.status === 'under_review' || c.status === 'funding')
  );

  const mySavedCampaigns = campaigns.filter(c => bookmarkedCampaignIds.includes(c.id));

  const paidContributions = userContributions.filter(c => c.status === 'succeeded');
  const totalAmplifiedReach = paidContributions.reduce(
    (acc, curr) => acc + curr.estimatedImpactReach,
    0
  );
  const STATUS_TEXT: Record<string, { label: string; color: string }> = {
    pending: { label: 'Pending, not counted yet', color: colors.amberDark },
    declined: { label: 'Declined, not charged', color: colors.rose },
    failed: { label: 'Failed, not charged', color: colors.rose },
    cancelled: { label: 'Cancelled, not charged', color: colors.textSecondary }
  };

  const handleResetData = () => {
    Alert.alert(
      'Reset Demo Data',
      'This will reset all campaigns, draft, contributions, and notifications to default sample state.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            await resetToDefaults();
            Alert.alert('Reset Complete', 'App restored to fresh sample state.');
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarRow}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
            }}
            style={styles.avatar}
          />
          <View style={styles.profileText}>
            <Text style={styles.userName}>Community Advocate</Text>
            <Text style={styles.userEmail}>alex.rivers@amplify.community</Text>
            <View style={styles.roleBadge}>
              <Ionicons name="sparkles" size={11} color={colors.primary} />
              <Text style={styles.roleBadgeText}>Active Backer & Creator</Text>
            </View>
          </View>
        </View>

        {/* Impact Stat Counter */}
        <View style={styles.impactRow}>
          <View style={styles.impactBox}>
            <Text style={styles.impactNum}>{paidContributions.length}</Text>
            <Text style={styles.impactSub}>Campaigns Backed</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.impactBox}>
            <Text style={styles.impactNum}>+{totalAmplifiedReach.toLocaleString()}</Text>
            <Text style={styles.impactSub}>Audience Reach Funded</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.impactBox}>
            <Text style={styles.impactNum}>{mySavedCampaigns.length}</Text>
            <Text style={styles.impactSub}>Saved Stories</Text>
          </View>
        </View>
      </View>

      {/* One account, every role */}
      <View style={styles.roleSwitchCard}>
        <View style={styles.roleHeaderRow}>
          <Ionicons name="people-circle-outline" size={18} color={colors.primary} />
          <Text style={styles.roleSwitchTitle}>One account, every role</Text>
        </View>
        <Text style={styles.roleSwitchDesc}>
          Browse, back and create campaigns with the same account. There are no separate logins.
        </Text>
        <TouchableOpacity style={styles.openAdminBtn} onPress={onOpenAdminPanel}>
          <Ionicons name="shield-checkmark" size={16} color="#FFFFFF" />
          <Text style={styles.openAdminBtnText}>Reviewer demo (internal view)</Text>
        </TouchableOpacity>
      </View>

      {/* Sub-Tabs: Created / Backed / Saved */}
      <View style={styles.tabsRow}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'created' && styles.activeTab]}
          onPress={() => setActiveTab('created')}
        >
          <Text style={[styles.tabText, activeTab === 'created' && styles.activeTabText]}>
            Created ({myCreatedCampaigns.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'backed' && styles.activeTab]}
          onPress={() => setActiveTab('backed')}
        >
          <Text style={[styles.tabText, activeTab === 'backed' && styles.activeTabText]}>
            Backed ({paidContributions.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'saved' && styles.activeTab]}
          onPress={() => setActiveTab('saved')}
        >
          <Text style={[styles.tabText, activeTab === 'saved' && styles.activeTabText]}>
            Saved ({mySavedCampaigns.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Lists */}
      <View style={styles.tabContentList}>
        {activeTab === 'created' && (
          myCreatedCampaigns.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No created campaigns yet.</Text>
            </View>
          ) : (
            myCreatedCampaigns.map(c => (
              <View key={c.id} style={styles.listItemCard}>
                <Image source={{ uri: c.coverImage }} style={styles.listThumb} />
                <View style={styles.listItemMeta}>
                  <StatusBadge status={c.status} size="sm" />
                  <Text style={styles.listItemTitle} numberOfLines={2}>{c.title}</Text>
                  <Text style={styles.listItemSub}>
                    ${c.funding.currentAmount} / ${c.funding.goalAmount} funded
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.creatorActionBtn}
                  onPress={() => onOpenCreatorDashboard(c)}
                >
                  <Ionicons name="analytics" size={14} color={colors.primary} />
                  <Text style={styles.creatorActionBtnText}>Stats</Text>
                </TouchableOpacity>
              </View>
            ))
          )
        )}

        {activeTab === 'backed' && (
          userContributions.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="flash-outline" size={36} color={colors.textMuted} />
              <Text style={styles.emptyText}>You haven&apos;t backed any campaigns yet.</Text>
              <Text style={styles.emptySubtext}>
                Backing a campaign pays for ads that spread its message. Your payment history will appear here.
              </Text>
            </View>
          ) : (
            userContributions.map(contrib => (
              <View key={contrib.id} style={styles.contributionCard}>
                <View style={styles.contribTopRow}>
                  <View style={styles.contribAmountBubble}>
                    <Text style={styles.contribAmountText}>${contrib.amount}</Text>
                  </View>
                  <View style={styles.contribMeta}>
                    <Text style={styles.contribTitle} numberOfLines={1}>
                      {contrib.campaignTitle}
                    </Text>
                    <Text style={styles.contribDate}>{contrib.timestamp}</Text>
                  </View>
                </View>

                <View style={styles.contribReceiptRow}>
                  <Text style={styles.contribReceiptText}>
                    {contrib.status === 'succeeded' ? `Receipt: ${contrib.receiptId}` : `Ref: ${contrib.receiptId}`}
                  </Text>
                  {contrib.status === 'succeeded' ? (
                    <Text style={styles.contribReachText}>
                      Est. reach funded: {Math.round(contrib.estimatedImpactReach * 0.6).toLocaleString()} to {Math.round(contrib.estimatedImpactReach * 1.4).toLocaleString()}
                    </Text>
                  ) : (
                    <Text style={[styles.contribReachText, { color: (STATUS_TEXT[contrib.status] || STATUS_TEXT.failed).color }]}>
                      {(STATUS_TEXT[contrib.status] || STATUS_TEXT.failed).label}
                    </Text>
                  )}
                </View>
              </View>
            ))
          )
        )}

        {activeTab === 'saved' && (
          mySavedCampaigns.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No saved campaigns.</Text>
            </View>
          ) : (
            mySavedCampaigns.map(c => (
              <TouchableOpacity
                key={c.id}
                style={styles.listItemCard}
                onPress={() => onSelectCampaign(c)}
              >
                <Image source={{ uri: c.coverImage }} style={styles.listThumb} />
                <View style={styles.listItemMeta}>
                  <Text style={styles.listItemTitle} numberOfLines={2}>{c.title}</Text>
                  <Text style={styles.listItemSub}>By {c.creatorName}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
              </TouchableOpacity>
            ))
          )
        )}
      </View>

      {/* Secondary Destinations Links */}
      <View style={styles.secondaryMenuCard}>
        <Text style={styles.menuHeader}>Platform & Transparency</Text>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => setShowSecondaryModal('how_it_works')}
        >
          <Ionicons name="help-circle-outline" size={18} color={colors.text} />
          <Text style={styles.menuItemText}>How Amplification Works</Text>
          <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => setShowSecondaryModal('partners')}
        >
          <Ionicons name="megaphone-outline" size={18} color={colors.text} />
          <Text style={styles.menuItemText}>Ad Networks & Distribution Partners</Text>
          <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => setShowSecondaryModal('fees')}
        >
          <Ionicons name="receipt-outline" size={18} color={colors.text} />
          <Text style={styles.menuItemText}>Transparent Fee Breakdown (95/5)</Text>
          <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => setShowSecondaryModal('guidelines')}
        >
          <Ionicons name="shield-outline" size={18} color={colors.text} />
          <Text style={styles.menuItemText}>Fact-Checking & Content Guidelines</Text>
          <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
        </TouchableOpacity>
      </View>

      {/* Reset Demo Data */}
      <TouchableOpacity
        style={styles.resetDemoBtn}
        onPress={handleResetData}
      >
        <Ionicons name="refresh-outline" size={16} color={colors.rose} />
        <Text style={styles.resetDemoText}>Reset Prototype Data to Factory Demo</Text>
      </TouchableOpacity>

      <Text style={styles.versionText}>Amplify Mobile Prototype v1.0.0 · Hackathon Edition</Text>

      {/* Secondary Destination Modal */}
      <Modal
        visible={!!showSecondaryModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowSecondaryModal(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.secondarySheet}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>
                {showSecondaryModal === 'how_it_works' && 'How Amplification Works'}
                {showSecondaryModal === 'partners' && 'Distribution & Ad Networks'}
                {showSecondaryModal === 'fees' && 'Transparent 95/5 Fee Policy'}
                {showSecondaryModal === 'guidelines' && 'Fact-Checking Guidelines'}
              </Text>
              <TouchableOpacity onPress={() => setShowSecondaryModal(null)}>
                <Ionicons name="close" size={22} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: 350 }}>
              {showSecondaryModal === 'how_it_works' && (
                <Text style={styles.sheetBody}>
                  The Campaign Amplification Platform is community-funded message distribution. Anyone can discover, back, or create a campaign. Once approved by our review team, backer contributions are used to purchase micro-targeted digital advertising inventory across Meta, Instagram, and partnered networks. Contributions do not pass to the creator&apos;s personal account.
                </Text>
              )}
              {showSecondaryModal === 'partners' && (
                <Text style={styles.sheetBody}>
                  We distribute approved messages through official programmatic ad APIs including Meta Ads (Facebook & Instagram Feed & Stories), TikTok Ads, and Google Display Network. Ads are clearly labelled as community-amplified and include direct links to cited sources.
                </Text>
              )}
              {showSecondaryModal === 'fees' && (
                <Text style={styles.sheetBody}>
                  • 95% of every dollar contributed goes directly into digital ad spend auction bids.{'\n\n'}
                  • 5% platform fee covers payment processing fees (Stripe/Apple Pay), cloud hosting, and editorial source-audit verification overhead.
                </Text>
              )}
              {showSecondaryModal === 'guidelines' && (
                <Text style={styles.sheetBody}>
                  All campaigns must cite verifiable primary research, governmental open data, or peer-reviewed journals. Deceptive headlines, hate speech, and unverified medical claims are strictly rejected during our editorial audit.
                </Text>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
  },
  scrollContent: {
    paddingBottom: 30
  },
  profileHeader: {
    backgroundColor: colors.surface,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30
  },
  profileText: {
    flex: 1,
    gap: 2
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text
  },
  userEmail: {
    fontSize: 12,
    color: colors.textSecondary
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
    gap: 4,
    marginTop: 4
  },
  roleBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primaryDark
  },
  impactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 18,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight
  },
  impactBox: {
    alignItems: 'center'
  },
  impactNum: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primaryDark
  },
  impactSub: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: colors.border
  },
  roleSwitchCard: {
    backgroundColor: colors.surface,
    marginHorizontal: 16,
    marginTop: 14,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8
  },
  roleHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  roleSwitchTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text
  },
  roleSwitchDesc: {
    fontSize: 11,
    color: colors.textSecondary,
    lineHeight: 16
  },
  roleButtonsRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 6
  },
  roleBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center'
  },
  activeRoleBtn: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary
  },
  roleBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary
  },
  activeRoleBtnText: {
    color: colors.primary,
    fontWeight: '700'
  },
  openAdminBtn: {
    backgroundColor: colors.amberDark,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 8,
    gap: 6
  },
  openAdminBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700'
  },
  tabsRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: 4,
    borderWidth: 1,
    borderColor: colors.border
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center'
  },
  activeTab: {
    backgroundColor: colors.primaryLight
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: '700'
  },
  tabContentList: {
    paddingHorizontal: 16,
    marginTop: 12,
    gap: 10
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 6
  },
  emptyText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary
  },
  emptySubtext: {
    fontSize: 11,
    color: colors.textMuted,
    textAlign: 'center',
    maxWidth: 240
  },
  listItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 10
  },
  listThumb: {
    width: 50,
    height: 50,
    borderRadius: 8
  },
  listItemMeta: {
    flex: 1,
    gap: 2
  },
  listItemTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text
  },
  listItemSub: {
    fontSize: 11,
    color: colors.textSecondary
  },
  creatorActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4
  },
  creatorActionBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary
  },
  contributionCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8
  },
  contribTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  contribAmountBubble: {
    backgroundColor: colors.accentLight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8
  },
  contribAmountText: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.accentDark
  },
  contribMeta: {
    flex: 1
  },
  contribTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text
  },
  contribDate: {
    fontSize: 10,
    color: colors.textMuted
  },
  contribReceiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingTop: 6
  },
  contribReceiptText: {
    fontSize: 10,
    color: colors.textMuted
  },
  contribReachText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primaryDark
  },
  secondaryMenuCard: {
    backgroundColor: colors.surface,
    marginHorizontal: 16,
    marginTop: 18,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 8
  },
  menuHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'none',
    letterSpacing: 0.5,
    paddingHorizontal: 16,
    paddingVertical: 8
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight
  },
  menuItemText: {
    flex: 1,
    fontSize: 13,
    color: colors.text,
    fontWeight: '500'
  },
  resetDemoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    gap: 6
  },
  resetDemoText: {
    fontSize: 12,
    color: colors.rose,
    fontWeight: '600'
  },
  versionText: {
    textAlign: 'center',
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 8
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end'
  },
  secondarySheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    gap: 12
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text
  },
  sheetBody: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 20
  }
});
