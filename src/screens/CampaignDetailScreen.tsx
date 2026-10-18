import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
  TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { Campaign } from '../types/campaign';
import { useCampaigns } from '../context/CampaignContext';
import { ProgressBar } from '../components/common/ProgressBar';
import { CategoryBadge, StatusBadge } from '../components/common/Badge';
import { StoryRenderer } from '../components/story/StoryRenderer';
import { SocialAdPreview } from '../components/cards/SocialAdPreview';

interface CampaignDetailScreenProps {
  campaign: Campaign;
  onBack: () => void;
  onOpenBackModal: (campaign: Campaign) => void;
}

export const CampaignDetailScreen: React.FC<CampaignDetailScreenProps> = ({
  campaign,
  onBack,
  onOpenBackModal
}) => {
  const {
    bookmarkedCampaignIds,
    toggleBookmark,
    voteFeedback,
    addComment
  } = useCampaigns();

  const [activeTab, setActiveTab] = useState<'story' | 'visuals' | 'targeting'>('story');
  const [isUseOfFundsExpanded, setIsUseOfFundsExpanded] = useState<boolean>(false);
  const [hasVoted, setHasVoted] = useState<boolean>(false);
  const [commentInput, setCommentInput] = useState<string>('');

  const isBookmarked = bookmarkedCampaignIds.includes(campaign.id);
  const percent = Math.min(
    Math.round((campaign.funding.currentAmount / campaign.funding.goalAmount) * 100),
    100
  );
  const progressRatio = campaign.funding.currentAmount / campaign.funding.goalAmount;

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Help amplify this message beyond our feeds: "${campaign.title}" - Read and back on Amplify: https://amplify-campaigns.org/c/${campaign.id}`,
        title: campaign.title
      });
    } catch (e) {
      console.warn('Share error', e);
    }
  };

  const handleVote = (vote: 'yes' | 'somewhat' | 'no') => {
    if (hasVoted) return;
    voteFeedback(campaign.id, vote);
    setHasVoted(true);
  };

  const handleAddComment = () => {
    if (!commentInput.trim()) return;
    addComment(campaign.id, commentInput.trim());
    setCommentInput('');
  };

  const totalVotes =
    (campaign.feedbackVotes?.yes || 0) +
    (campaign.feedbackVotes?.somewhat || 0) +
    (campaign.feedbackVotes?.no || 0);

  return (
    <View style={styles.container}>
      {/* Top Navigation Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity
          style={styles.navBtn}
          onPress={onBack}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.navTitle} numberOfLines={1}>
          {campaign.title}
        </Text>
        <View style={styles.navRight}>
          <TouchableOpacity
            style={styles.navBtn}
            onPress={() => toggleBookmark(campaign.id)}
          >
            <Ionicons
              name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
              size={20}
              color={isBookmarked ? colors.primary : colors.text}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navBtn} onPress={handleShare}>
            <Ionicons name="share-outline" size={20} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Cover Image & Badges */}
        <View style={styles.coverWrapper}>
          <Image
            source={{ uri: campaign.coverImage }}
            style={styles.coverImage}
            resizeMode="cover"
          />
          <View style={styles.coverBadges}>
            <CategoryBadge category={campaign.category} />
            <StatusBadge status={campaign.status} size="sm" />
          </View>
        </View>

        {/* Title & Creator Header */}
        <View style={styles.headerSection}>
          <Text style={styles.title}>{campaign.title}</Text>

          <View style={styles.creatorRow}>
            {campaign.creatorAvatar ? (
              <Image
                source={{ uri: campaign.creatorAvatar }}
                style={styles.creatorAvatar}
              />
            ) : (
              <View style={styles.creatorPlaceholder}>
                <Ionicons name="person" size={16} color="#FFFFFF" />
              </View>
            )}
            <View style={styles.creatorMeta}>
              <Text style={styles.creatorName}>{campaign.creatorName}</Text>
              <Text style={styles.creatorBio} numberOfLines={1}>
                {campaign.creatorBio || campaign.creatorOrg || 'Community Campaigner'}
              </Text>
            </View>
          </View>

          <Text style={styles.summary}>{campaign.summary}</Text>
        </View>

        {/* Funding & Reach Card */}
        <View style={styles.fundingCard}>
          <View style={styles.fundingTopRow}>
            <View>
              <Text style={styles.raisedAmount}>
                ${campaign.funding.currentAmount.toLocaleString()}
              </Text>
              <Text style={styles.goalSubtext}>
                of ${campaign.funding.goalAmount.toLocaleString()} amplification goal
              </Text>
            </View>
            <View style={styles.percentBadge}>
              <Text style={styles.percentText}>{percent}% funded</Text>
            </View>
          </View>

          <ProgressBar
            progress={progressRatio}
            height={8}
            color={percent >= 100 ? colors.accent : colors.primary}
            style={{ marginVertical: 10 }}
          />

          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Ionicons name="megaphone-outline" size={16} color={colors.primary} />
              <Text style={styles.statBoxNumber}>
                ~{campaign.targeting.estimatedReachTotal.toLocaleString()}
              </Text>
              <Text style={styles.statBoxLabel}>Target Reach</Text>
            </View>
            <View style={styles.statBox}>
              <Ionicons name="people-outline" size={16} color={colors.accentDark} />
              <Text style={styles.statBoxNumber}>{campaign.funding.backerCount}</Text>
              <Text style={styles.statBoxLabel}>Community Backers</Text>
            </View>
            <View style={styles.statBox}>
              <Ionicons name="time-outline" size={16} color={colors.amberDark} />
              <Text style={styles.statBoxNumber}>
                {campaign.funding.daysRemaining > 0
                  ? `${campaign.funding.daysRemaining}d`
                  : 'Funded'}
              </Text>
              <Text style={styles.statBoxLabel}>Days Left</Text>
            </View>
          </View>

          {/* Core Concept Reminder */}
          <View style={styles.conceptNotice}>
            <Ionicons name="shield-checkmark-outline" size={15} color={colors.primaryDark} />
            <Text style={styles.conceptNoticeText}>
              Backed funds purchase advertising distribution on Meta & Instagram to take this message beyond the creator’s feed.
            </Text>
          </View>
        </View>

        {/* Section Tabs */}
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'story' && styles.activeTabItem]}
            onPress={() => setActiveTab('story')}
          >
            <Text
              style={[
                styles.tabItemText,
                activeTab === 'story' && styles.activeTabItemText
              ]}
            >
              Story & Sources
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'visuals' && styles.activeTabItem]}
            onPress={() => setActiveTab('visuals')}
          >
            <Text
              style={[
                styles.tabItemText,
                activeTab === 'visuals' && styles.activeTabItemText
              ]}
            >
              Ad Placement
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'targeting' && styles.activeTabItem]}
            onPress={() => setActiveTab('targeting')}
          >
            <Text
              style={[
                styles.tabItemText,
                activeTab === 'targeting' && styles.activeTabItemText
              ]}
            >
              Targeting Plan
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        {activeTab === 'story' && (
          <StoryRenderer
            story={campaign.story}
            sources={campaign.sources}
            audienceActionAdvice={campaign.audienceActionAdvice}
          />
        )}

        {activeTab === 'visuals' && (
          <View style={styles.visualsTabContent}>
            <Text style={styles.tabSectionTitle}>Advertising Assets & Creative</Text>
            <Text style={styles.tabSectionSubtitle}>
              Here is how this campaign message will appear to targeted audiences across social media when funded.
            </Text>
            <SocialAdPreview
              adCreative={campaign.adCreative}
              creatorName={campaign.creatorName}
            />
          </View>
        )}

        {activeTab === 'targeting' && (
          <View style={styles.targetingTabContent}>
            <Text style={styles.tabSectionTitle}>Audience & Distribution Strategy</Text>
            <Text style={styles.tabSectionSubtitle}>
              Targeting settings determined to maximize message impact without political or discriminatory bias.
            </Text>

            <View style={styles.targetCard}>
              <View style={styles.targetRow}>
                <Ionicons name="location-outline" size={18} color={colors.primary} />
                <View style={styles.targetDetail}>
                  <Text style={styles.targetLabel}>Targeted Geographies</Text>
                  <Text style={styles.targetValue}>
                    {campaign.targeting.regions.join(', ')}
                  </Text>
                </View>
              </View>

              <View style={styles.targetRow}>
                <Ionicons name="people-outline" size={18} color={colors.primary} />
                <View style={styles.targetDetail}>
                  <Text style={styles.targetLabel}>Demographics & Interests</Text>
                  <Text style={styles.targetValue}>
                    {campaign.targeting.demographics} ({campaign.targeting.interests.join(', ')})
                  </Text>
                </View>
              </View>

              <View style={styles.targetRow}>
                <Ionicons name="phone-portrait-outline" size={18} color={colors.primary} />
                <View style={styles.targetDetail}>
                  <Text style={styles.targetLabel}>Distribution Channels</Text>
                  <Text style={styles.targetValue}>
                    {campaign.targeting.channels.join(' · ')}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Expandable Use of Funds Section */}
        <TouchableOpacity
          style={styles.accordionHeader}
          onPress={() => setIsUseOfFundsExpanded(!isUseOfFundsExpanded)}
          activeOpacity={0.8}
        >
          <View style={styles.accordionTitleRow}>
            <Ionicons name="cash-outline" size={18} color={colors.accentDark} />
            <Text style={styles.accordionTitle}>Transparent Use of Funds & Policies</Text>
          </View>
          <Ionicons
            name={isUseOfFundsExpanded ? 'chevron-up' : 'chevron-down'}
            size={18}
            color={colors.textSecondary}
          />
        </TouchableOpacity>

        {isUseOfFundsExpanded && (
          <View style={styles.accordionBody}>
            <View style={styles.policyRow}>
              <Text style={styles.policyBullet}>•</Text>
              <Text style={styles.policyText}>
                <Text style={{ fontWeight: '700' }}>95% Ad Budget:</Text> Used solely for buying micro-targeted digital ad inventory on Meta, Instagram, and partnered social networks.
              </Text>
            </View>
            <View style={styles.policyRow}>
              <Text style={styles.policyBullet}>•</Text>
              <Text style={styles.policyText}>
                <Text style={{ fontWeight: '700' }}>5% Platform & Payment Fee:</Text> Covers credit card processing fees, infrastructure hosting, and independent source verification audits.
              </Text>
            </View>
            <View style={styles.policyRow}>
              <Text style={styles.policyBullet}>•</Text>
              <Text style={styles.policyText}>
                <Text style={{ fontWeight: '700' }}>Not a Direct Donation:</Text> Your contribution pays for advertising distribution. It is not paid to the creator or to the cause.
              </Text>
            </View>
            <View style={styles.policyRow}>
              <Text style={styles.policyBullet}>•</Text>
              <Text style={styles.policyText}>
                <Text style={{ fontWeight: '700' }}>Unspent / Failed Goals:</Text> If a campaign fails to reach its threshold or is rejected in review, backer funds are refunded or credited.
              </Text>
            </View>
          </View>
        )}

        {/* Community Perspective Poll */}
        <View style={styles.pollCard}>
          <Text style={styles.pollTitle}>Did this message change your perspective?</Text>
          <Text style={styles.pollSubtitle}>
            Anonymous reader sentiment measured across {totalVotes} responses
          </Text>

          <View style={styles.pollButtonsRow}>
            {(['yes', 'somewhat', 'no'] as const).map(option => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.pollBtn,
                  hasVoted && styles.pollBtnVoted
                ]}
                onPress={() => handleVote(option)}
                disabled={hasVoted}
              >
                <Text style={styles.pollBtnEmoji}>
                  {option === 'yes' ? '+' : option === 'somewhat' ? '~' : '-'}
                </Text>
                <Text style={styles.pollBtnLabel}>
                  {option === 'yes' ? 'Yes' : option === 'somewhat' ? 'Somewhat' : 'No'}
                </Text>
                {hasVoted && (
                  <Text style={styles.pollBtnCount}>
                    {campaign.feedbackVotes?.[option] || 0}
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
          {hasVoted && (
            <Text style={styles.votedNotice}>Thank you for your feedback!</Text>
          )}
        </View>

        {/* Discussion / Comments Section */}
        <View style={styles.commentsSection}>
          <Text style={styles.sectionHeader}>
            Community Discussion ({campaign.comments?.length || 0})
          </Text>

          <View style={styles.commentInputRow}>
            <TextInput
              style={styles.commentInput}
              placeholder="Share a perspective on this message..."
              placeholderTextColor={colors.textMuted}
              value={commentInput}
              onChangeText={setCommentInput}
            />
            <TouchableOpacity
              style={styles.sendCommentBtn}
              onPress={handleAddComment}
            >
              <Ionicons name="send" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {campaign.comments && campaign.comments.length > 0 ? (
            campaign.comments.map(c => (
              <View key={c.id} style={styles.commentCard}>
                <View style={styles.commentHeader}>
                  <Text style={styles.commentAuthor}>{c.author}</Text>
                  <Text style={styles.commentTime}>{c.timestamp}</Text>
                </View>
                <Text style={styles.commentBody}>{c.text}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyComments}>
              Be the first to share an insight or supportive reflection!
            </Text>
          )}
        </View>

        {/* Bottom space for sticky footer */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Sticky Bottom Backing Bar */}
      <View style={styles.stickyFooter}>
        <View style={styles.footerInfo}>
          <Text style={styles.footerGoal}>
            ${campaign.funding.currentAmount.toLocaleString()}{' '}
            <Text style={{ color: colors.textSecondary, fontWeight: '400' }}>
              / ${campaign.funding.goalAmount.toLocaleString()}
            </Text>
          </Text>
          <Text style={styles.footerReach}>
            ~{campaign.targeting.estimatedReachTotal.toLocaleString()} audience reach
          </Text>
        </View>

        <TouchableOpacity
          style={styles.footerBackBtn}
          onPress={() => onOpenBackModal(campaign)}
          activeOpacity={0.85}
        >
          <Ionicons name="flash" size={16} color="#FFFFFF" />
          <Text style={styles.footerBackBtnText}>Back Campaign</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  navBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center'
  },
  navTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginHorizontal: 10
  },
  navRight: {
    flexDirection: 'row',
    gap: 8
  },
  scrollContent: {
    paddingBottom: 20
  },
  coverWrapper: {
    width: '100%',
    height: 240,
    position: 'relative'
  },
  coverImage: {
    width: '100%',
    height: '100%'
  },
  coverBadges: {
    position: 'absolute',
    bottom: 12,
    left: 16,
    flexDirection: 'row',
    gap: 8
  },
  headerSection: {
    padding: 18
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    lineHeight: 30,
    marginBottom: 12
  },
  creatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  creatorAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10
  },
  creatorPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10
  },
  creatorMeta: {
    flex: 1
  },
  creatorName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text
  },
  creatorBio: {
    fontSize: 12,
    color: colors.textSecondary
  },
  summary: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22
  },
  fundingCard: {
    backgroundColor: '#F7F8F9',
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border
  },
  fundingTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  raisedAmount: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text
  },
  goalSubtext: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2
  },
  percentBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20
  },
  percentText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 10
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8
  },
  statBoxNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginTop: 4
  },
  statBoxLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2
  },
  conceptNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6EFF3',
    padding: 10,
    borderRadius: 10,
    gap: 8,
    marginTop: 6
  },
  conceptNoticeText: {
    flex: 1,
    fontSize: 11,
    color: colors.primaryDark,
    lineHeight: 16
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginTop: 18,
    marginHorizontal: 16
  },
  tabItem: {
    paddingVertical: 12,
    marginRight: 20,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent'
  },
  activeTabItem: {
    borderBottomColor: colors.primary
  },
  tabItemText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary
  },
  activeTabItemText: {
    color: colors.primary,
    fontWeight: '700'
  },
  visualsTabContent: {
    padding: 16
  },
  targetingTabContent: {
    padding: 16
  },
  tabSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4
  },
  tabSectionSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 12,
    lineHeight: 18
  },
  targetCard: {
    backgroundColor: '#F7F8F9',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    gap: 14
  },
  targetRow: {
    flexDirection: 'row',
    gap: 10
  },
  targetDetail: {
    flex: 1
  },
  targetLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text
  },
  targetValue: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2
  },
  accordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border
  },
  accordionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  accordionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text
  },
  accordionBody: {
    backgroundColor: colors.background,
    marginHorizontal: 16,
    padding: 14,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: colors.border,
    gap: 8
  },
  policyRow: {
    flexDirection: 'row',
    gap: 6
  },
  policyBullet: {
    color: colors.primary,
    fontWeight: '700'
  },
  policyText: {
    flex: 1,
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18
  },
  pollCard: {
    backgroundColor: colors.purpleLight,
    marginHorizontal: 16,
    marginTop: 18,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#C9D8DE'
  },
  pollTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center'
  },
  pollSubtitle: {
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 2,
    marginBottom: 12
  },
  pollButtonsRow: {
    flexDirection: 'row',
    gap: 10
  },
  pollBtn: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#C9D8DE'
  },
  pollBtnVoted: {
    backgroundColor: '#EAF0F2'
  },
  pollBtnEmoji: {
    fontSize: 18
  },
  pollBtnLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.text,
    marginTop: 2
  },
  pollBtnCount: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.purple,
    marginTop: 2
  },
  votedNotice: {
    fontSize: 11,
    color: colors.purple,
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '600'
  },
  commentsSection: {
    padding: 16
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12
  },
  commentInputRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14
  },
  commentInput: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 42,
    fontSize: 13,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.text
  },
  sendCommentBtn: {
    backgroundColor: colors.primary,
    width: 42,
    height: 42,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  commentCard: {
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.borderLight
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4
  },
  commentAuthor: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text
  },
  commentTime: {
    fontSize: 11,
    color: colors.textMuted
  },
  commentBody: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18
  },
  emptyComments: {
    fontSize: 12,
    color: colors.textMuted,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 10
  },
  stickyFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 8
  },
  footerInfo: {
    flex: 1
  },
  footerGoal: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text
  },
  footerReach: {
    fontSize: 11,
    color: colors.accentDark,
    fontWeight: '600',
    marginTop: 2
  },
  footerBackBtn: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3
  },
  footerBackBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700'
  }
});
