import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  Image,
  Share
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { Campaign, AnalyticsReport } from '../types/campaign';
import { ProgressBar } from '../components/common/ProgressBar';
import { StatusBadge } from '../components/common/Badge';

interface CreatorDashboardModalProps {
  visible: boolean;
  campaign: Campaign | null;
  onClose: () => void;
}

export const CreatorDashboardModal: React.FC<CreatorDashboardModalProps> = ({
  visible,
  campaign,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'management'>('analytics');

  if (!campaign) return null;

  const analytics: AnalyticsReport = campaign.analytics || {
    adSpendDeployed: Math.round(campaign.funding.currentAmount * 0.95),
    totalBudget: Math.round(campaign.funding.goalAmount * 0.95),
    impressionsDelivered: Math.round(campaign.funding.currentAmount * 0.95 * 22),
    uniquePeopleReached: Math.round(campaign.funding.currentAmount * 0.95 * 18),
    linkClicks: Math.round(campaign.funding.currentAmount * 0.95 * 1.4),
    ctr: 6.4,
    platformBreakdown: [
      { platform: 'Instagram Reels & Feed', percent: 55, impressions: Math.round(campaign.funding.currentAmount * 0.95 * 12) },
      { platform: 'Facebook Mobile Feed', percent: 35, impressions: Math.round(campaign.funding.currentAmount * 0.95 * 7.7) },
      { platform: 'Audience Ad Network', percent: 10, impressions: Math.round(campaign.funding.currentAmount * 0.95 * 2.3) }
    ],
    dailyReach: [
      { day: 'Mon', reach: 3400 },
      { day: 'Tue', reach: 5200 },
      { day: 'Wed', reach: 7100 },
      { day: 'Thu', reach: 9800 },
      { day: 'Fri', reach: 12400 },
      { day: 'Sat', reach: 15600 },
      { day: 'Sun', reach: 18900 }
    ],
    statusSummary: campaign.status === 'promoting'
      ? 'Ad delivery is actively running across Meta & Instagram networks as estimated in this demo.'
      : 'Campaign is currently pooling community contributions. Ads will deploy upon reaching target threshold.'
  };

  const handleShareReport = async () => {
    try {
      await Share.share({
        message: `Amplify Campaign Distribution Report for "${campaign.title}":\n` +
          `• Total Ad Spend Deployed: $${analytics.adSpendDeployed.toLocaleString()}\n` +
          `• Impressions Delivered: ${analytics.impressionsDelivered.toLocaleString()}\n` +
          `• Unique People Reached: ${analytics.uniquePeopleReached.toLocaleString()}\n` +
          `• Click-Through Rate: ${analytics.ctr}%\n` +
          `Distribution report on Amplify: https://amplify-campaigns.org/c/${campaign.id}/report`
      });
    } catch (e) {
      console.warn('Share error', e);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={onClose}>
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Creator Dashboard</Text>
            <Text style={styles.headerSubtitle} numberOfLines={1}>
              {campaign.title}
            </Text>
          </View>
          <TouchableOpacity style={styles.shareBtn} onPress={handleShareReport}>
            <Ionicons name="share-outline" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Campaign Header Card */}
          <View style={styles.campaignSummaryCard}>
            <Image source={{ uri: campaign.coverImage }} style={styles.thumbImage} />
            <View style={styles.campaignMeta}>
              <StatusBadge status={campaign.status} size="sm" />
              <Text style={styles.campaignTitle} numberOfLines={2}>
                {campaign.title}
              </Text>
              <Text style={styles.creatorOrg}>
                By {campaign.creatorName}
              </Text>
            </View>
          </View>

          {/* Toggle Tabs */}
          <View style={styles.tabRow}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'analytics' && styles.activeTab]}
              onPress={() => setActiveTab('analytics')}
            >
              <Ionicons
                name="bar-chart-outline"
                size={16}
                color={activeTab === 'analytics' ? colors.primary : colors.textSecondary}
              />
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'analytics' && styles.activeTabText
                ]}
              >
                Reach Analytics
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tab, activeTab === 'management' && styles.activeTab]}
              onPress={() => setActiveTab('management')}
            >
              <Ionicons
                name="settings-outline"
                size={16}
                color={activeTab === 'management' ? colors.primary : colors.textSecondary}
              />
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'management' && styles.activeTabText
                ]}
              >
                Campaign Management
              </Text>
            </TouchableOpacity>
          </View>

          {activeTab === 'analytics' ? (
            /* ================= ANALYTICS TAB ================= */
            <View style={styles.tabContent}>
              {/* Delivery Status Banner */}
              <View style={styles.statusBanner}>
                <Ionicons
                  name={campaign.status === 'promoting' ? 'rocket' : 'time'}
                  size={20}
                  color={campaign.status === 'promoting' ? colors.primary : colors.amberDark}
                />
                <Text style={styles.statusBannerText}>
                  {analytics.statusSummary}
                </Text>
              </View>

              {/* Top Key Metrics Grid */}
              <View style={styles.metricsGrid}>
                <View style={styles.metricCard}>
                  <Text style={styles.metricLabel}>Impressions</Text>
                  <Text style={styles.metricValue}>
                    {analytics.impressionsDelivered.toLocaleString()}
                  </Text>
                  <Text style={styles.metricSub}>Social feed displays</Text>
                </View>

                <View style={styles.metricCard}>
                  <Text style={styles.metricLabel}>Unique Reach</Text>
                  <Text style={[styles.metricValue, { color: colors.accentDark }]}>
                    {analytics.uniquePeopleReached.toLocaleString()}
                  </Text>
                  <Text style={styles.metricSub}>Individual readers</Text>
                </View>

                <View style={styles.metricCard}>
                  <Text style={styles.metricLabel}>Ad Spend Spent</Text>
                  <Text style={[styles.metricValue, { color: colors.primary }]}>
                    ${analytics.adSpendDeployed.toLocaleString()}
                  </Text>
                  <Text style={styles.metricSub}>
                    of ${analytics.totalBudget.toLocaleString()} net ad budget
                  </Text>
                </View>

                <View style={styles.metricCard}>
                  <Text style={styles.metricLabel}>Click-Through (CTR)</Text>
                  <Text style={[styles.metricValue, { color: colors.purple }]}>
                    {analytics.ctr}%
                  </Text>
                  <Text style={styles.metricSub}>{analytics.linkClicks.toLocaleString()} clicks (demo)</Text>
                </View>
              </View>

              {/* Platform Delivery Breakdown */}
              <View style={styles.breakdownCard}>
                <Text style={styles.cardHeader}>Platform Delivery Breakdown</Text>
                {analytics.platformBreakdown.map(p => (
                  <View key={p.platform} style={styles.platformRow}>
                    <View style={styles.platformHeaderRow}>
                      <Text style={styles.platformName}>{p.platform}</Text>
                      <Text style={styles.platformPercent}>{p.percent}% ({p.impressions.toLocaleString()} views)</Text>
                    </View>
                    <ProgressBar progress={p.percent / 100} height={6} color={colors.primary} />
                  </View>
                ))}
              </View>

              {/* Daily Reach Timeline Chart Bar Simulation */}
              <View style={styles.breakdownCard}>
                <Text style={styles.cardHeader}>Daily Audience Delivery</Text>
                <View style={styles.chartBarsRow}>
                  {analytics.dailyReach.map(d => (
                    <View key={d.day} style={styles.chartCol}>
                      <View
                        style={[
                          styles.chartBar,
                          { height: Math.min((d.reach / 20000) * 120, 120) }
                        ]}
                      />
                      <Text style={styles.chartDayLabel}>{d.day}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Export Report Action */}
              <TouchableOpacity
                style={styles.exportReportBtn}
                onPress={handleShareReport}
                activeOpacity={0.85}
              >
                <Ionicons name="document-text-outline" size={18} color="#FFFFFF" />
                <Text style={styles.exportReportBtnText}>
                  Share distribution report
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            /* ================= MANAGEMENT TAB ================= */
            <View style={styles.tabContent}>
              {/* Moderation Feedback */}
              <View style={styles.moderationCard}>
                <View style={styles.cardHeaderRow}>
                  <Ionicons name="shield-checkmark-outline" size={18} color={colors.accentDark} />
                  <Text style={styles.cardHeader}>Platform Review Status</Text>
                </View>
                <Text style={styles.moderationText}>
                  {campaign.reviewFeedback ||
                    'Sources are listed on the public campaign page. Review notes from the platform team will appear here.'}
                </Text>
              </View>

              {/* Campaign Milestones */}
              <View style={styles.milestonesCard}>
                <Text style={styles.cardHeader}>Campaign Lifecycle Progress</Text>
                <View style={styles.lifecycleRow}>
                  <Ionicons name="checkmark-circle" size={18} color={colors.accent} />
                  <Text style={styles.lifecycleText}>Draft & Editorial Composition Complete</Text>
                </View>
                <View style={styles.lifecycleRow}>
                  <Ionicons name="checkmark-circle" size={18} color={colors.accent} />
                  <Text style={styles.lifecycleText}>Editorial Audit & Source Fact-Checking Passed</Text>
                </View>
                <View style={styles.lifecycleRow}>
                  <Ionicons
                    name={campaign.funding.currentAmount > 0 ? 'checkmark-circle' : 'ellipse-outline'}
                    size={18}
                    color={campaign.funding.currentAmount > 0 ? colors.accent : colors.textMuted}
                  />
                  <Text style={styles.lifecycleText}>
                    Community Funding (${campaign.funding.currentAmount} raised)
                  </Text>
                </View>
                <View style={styles.lifecycleRow}>
                  <Ionicons
                    name={campaign.status === 'promoting' ? 'checkmark-circle' : 'ellipse-outline'}
                    size={18}
                    color={campaign.status === 'promoting' ? colors.primary : colors.textMuted}
                  />
                  <Text style={styles.lifecycleText}>
                    Meta & Instagram Micro-Targeted Ad Delivery
                  </Text>
                </View>
              </View>

              {/* Creator Rules & Editing Policy */}
              <View style={styles.policyNoticeBox}>
                <Ionicons name="alert-circle-outline" size={18} color={colors.textSecondary} />
                <Text style={styles.policyNoticeText}>
                  Material changes to campaign claims or targets return the campaign to review before live advertising resumes.
                </Text>
              </View>
            </View>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </Modal>
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
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerTextContainer: {
    flex: 1,
    marginHorizontal: 10
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text
  },
  headerSubtitle: {
    fontSize: 11,
    color: colors.textSecondary
  },
  shareBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center'
  },
  scrollContent: {
    padding: 16
  },
  campaignSummaryCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    gap: 12,
    marginBottom: 14
  },
  thumbImage: {
    width: 64,
    height: 64,
    borderRadius: 10
  },
  campaignMeta: {
    flex: 1,
    gap: 4
  },
  campaignTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text
  },
  creatorOrg: {
    fontSize: 11,
    color: colors.textSecondary
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: 4,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: 8,
    gap: 6
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
  tabContent: {
    gap: 14
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 10
  },
  statusBannerText: {
    flex: 1,
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10
  },
  metricCard: {
    width: '48%',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'none'
  },
  metricValue: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    marginVertical: 4
  },
  metricSub: {
    fontSize: 10,
    color: colors.textMuted
  },
  breakdownCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12
  },
  cardHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6
  },
  platformRow: {
    gap: 6
  },
  platformHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  platformName: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text
  },
  platformPercent: {
    fontSize: 11,
    color: colors.textSecondary
  },
  chartBarsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 140,
    paddingTop: 10,
    paddingHorizontal: 8
  },
  chartCol: {
    alignItems: 'center',
    gap: 6
  },
  chartBar: {
    width: 24,
    backgroundColor: colors.primary,
    borderRadius: 6
  },
  chartDayLabel: {
    fontSize: 10,
    color: colors.textSecondary
  },
  exportReportBtn: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8
  },
  exportReportBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700'
  },
  moderationCard: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border
  },
  moderationText: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 20
  },
  milestonesCard: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 10
  },
  lifecycleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  lifecycleText: {
    fontSize: 12,
    color: colors.textSecondary
  },
  policyNoticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8
  },
  policyNoticeText: {
    flex: 1,
    fontSize: 11,
    color: colors.textSecondary,
    lineHeight: 16
  }
});
