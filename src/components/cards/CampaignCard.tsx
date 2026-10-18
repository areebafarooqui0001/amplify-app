import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { Campaign } from '../../types/campaign';
import { ProgressBar } from '../common/ProgressBar';
import { CategoryBadge, StatusBadge } from '../common/Badge';

interface CampaignCardProps {
  campaign: Campaign;
  onPress: () => void;
  onBackPress: () => void;
  isBookmarked?: boolean;
  onToggleBookmark?: () => void;
}

export const CampaignCard: React.FC<CampaignCardProps> = ({
  campaign,
  onPress,
  onBackPress,
  isBookmarked,
  onToggleBookmark
}) => {
  const percent = Math.min(
    Math.round((campaign.funding.currentAmount / campaign.funding.goalAmount) * 100),
    100
  );
  const progressRatio = campaign.funding.currentAmount / campaign.funding.goalAmount;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.9}
    >
      {/* Image & Header Overlay */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: campaign.coverImage }}
          style={styles.coverImage}
          resizeMode="cover"
        />
        <View style={styles.topOverlay}>
          <CategoryBadge category={campaign.category} />
          {onToggleBookmark && (
            <TouchableOpacity
              style={styles.bookmarkButton}
              onPress={onToggleBookmark}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons
                name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
                size={18}
                color={isBookmarked ? colors.primary : '#FFFFFF'}
              />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.statusOverlay}>
          <StatusBadge status={campaign.status} size="sm" />
        </View>
      </View>

      {/* Body Content */}
      <View style={styles.content}>
        {/* Creator Info */}
        <View style={styles.creatorRow}>
          {campaign.creatorAvatar ? (
            <Image
              source={{ uri: campaign.creatorAvatar }}
              style={styles.creatorAvatar}
            />
          ) : (
            <View style={styles.creatorAvatarPlaceholder}>
              <Ionicons name="person" size={12} color="#FFFFFF" />
            </View>
          )}
          <View style={styles.creatorInfo}>
            <Text style={styles.creatorName} numberOfLines={1}>
              {campaign.creatorName}
            </Text>
            {campaign.creatorOrg ? (
              <Text style={styles.creatorOrg} numberOfLines={1}>
                {campaign.creatorOrg}
              </Text>
            ) : null}
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title} numberOfLines={2}>
          {campaign.title}
        </Text>

        {/* Summary */}
        <Text style={styles.summary} numberOfLines={2}>
          {campaign.summary}
        </Text>

        {/* Reach Metric Banner */}
        <View style={styles.reachBanner}>
          <View style={styles.reachIconWrapper}>
            <Ionicons name="megaphone" size={15} color={colors.primary} />
          </View>
          <View style={styles.reachTextContainer}>
            <Text style={styles.reachLabel}>Estimated Audience Reach</Text>
            <Text style={styles.reachValue}>
              ~{campaign.targeting.estimatedReachTotal.toLocaleString()} people
            </Text>
          </View>
          <View style={styles.channelIcons}>
            <Ionicons name="logo-instagram" size={14} color={colors.textSecondary} />
            <Ionicons name="logo-facebook" size={14} color={colors.textSecondary} />
          </View>
        </View>

        {/* Funding Progress Bar */}
        <View style={styles.fundingSection}>
          <View style={styles.progressRow}>
            <Text style={styles.raisedAmount}>
              ${campaign.funding.currentAmount.toLocaleString()}
              <Text style={styles.goalText}>
                {' '}funded of ${campaign.funding.goalAmount.toLocaleString()}
              </Text>
            </Text>
            <Text style={styles.percentText}>{percent}%</Text>
          </View>

          <ProgressBar
            progress={progressRatio}
            height={7}
            color={percent >= 100 ? colors.accent : colors.primary}
          />

          <View style={styles.metadataRow}>
            <View style={styles.metaItem}>
              <Ionicons name="people-outline" size={13} color={colors.textSecondary} />
              <Text style={styles.metaText}>
                {campaign.funding.backerCount} backers
              </Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={13} color={colors.textSecondary} />
              <Text style={styles.metaText}>
                {campaign.funding.daysRemaining > 0
                  ? `${campaign.funding.daysRemaining} days left`
                  : 'Funded'}
              </Text>
            </View>
          </View>
        </View>

        {/* Bottom CTA Action Row */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.detailsBtn}
            onPress={onPress}
            activeOpacity={0.7}
          >
            <Text style={styles.detailsBtnText}>View Story</Text>
            <Ionicons name="arrow-forward" size={14} color={colors.primary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backBtn}
            onPress={onBackPress}
            activeOpacity={0.85}
          >
            <Ionicons name="flash" size={15} color="#FFFFFF" />
            <Text style={styles.backBtnText}>Back this campaign</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    marginHorizontal: 16,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#141A1F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    overflow: 'hidden'
  },
  imageContainer: {
    height: 190,
    width: '100%',
    position: 'relative'
  },
  coverImage: {
    width: '100%',
    height: '100%'
  },
  topOverlay: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  bookmarkButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  statusOverlay: {
    position: 'absolute',
    bottom: 12,
    left: 12
  },
  content: {
    padding: 16
  },
  creatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  creatorAvatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    marginRight: 8
  },
  creatorAvatarPlaceholder: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8
  },
  creatorInfo: {
    flex: 1
  },
  creatorName: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text
  },
  creatorOrg: {
    fontSize: 11,
    color: colors.textSecondary
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    lineHeight: 23,
    marginBottom: 6
  },
  summary: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 19,
    marginBottom: 12
  },
  reachBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 10,
    marginBottom: 14
  },
  reachIconWrapper: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10
  },
  reachTextContainer: {
    flex: 1
  },
  reachLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    fontWeight: '500',
    textTransform: 'none',
    letterSpacing: 0.3
  },
  reachValue: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primaryDark
  },
  channelIcons: {
    flexDirection: 'row',
    gap: 6
  },
  fundingSection: {
    marginBottom: 14
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 6
  },
  raisedAmount: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text
  },
  goalText: {
    fontSize: 12,
    fontWeight: '400',
    color: colors.textSecondary
  },
  percentText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary
  },
  metadataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  metaText: {
    fontSize: 12,
    color: colors.textSecondary
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight
  },
  detailsBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 4
  },
  detailsBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary
  },
  backBtn: {
    flex: 1.3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: colors.primary,
    gap: 6,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2
  },
  backBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF'
  }
});
