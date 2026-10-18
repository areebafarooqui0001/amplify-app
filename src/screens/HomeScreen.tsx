import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { Campaign } from '../types/campaign';
import { useCampaigns } from '../context/CampaignContext';
import { CampaignCard } from '../components/cards/CampaignCard';
import { HeroSkeleton, CampaignFeedSkeleton } from '../components/common/Skeleton';

interface HomeScreenProps {
  onNavigateToExplore: () => void;
  onNavigateToCreate: () => void;
  onSelectCampaign: (campaign: Campaign) => void;
  onOpenBackModal: (campaign: Campaign) => void;
}

const HERO_AMOUNTS = [10, 25, 50, 100];

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigateToExplore,
  onNavigateToCreate,
  onSelectCampaign,
  onOpenBackModal
}) => {
  const { campaigns, bookmarkedCampaignIds, toggleBookmark } = useCampaigns();
  const [calculatorAmount, setCalculatorAmount] = useState<number>(25);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const activeCampaigns = campaigns.filter(c => c.status === 'funding' || c.status === 'promoting');

  // Dynamic estimate: ~$1 = ~22 reach impressions
  const estimatedReachHero = Math.round(calculatorAmount * 0.95 * 22);

  if (isLoading) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <HeroSkeleton />
        <CampaignFeedSkeleton count={2} />
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Brand Header */}
      <View style={styles.header}>
        <View style={styles.brandRow}>
          <View style={styles.logoIcon}>
            <Ionicons name="megaphone" size={18} color="#FFFFFF" />
          </View>
          <View>
            <Text style={styles.brandTitle}>Amplify</Text>
            <Text style={styles.brandSubtitle}>Campaign Amplification Platform</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.headerActionBtn}
          onPress={onNavigateToExplore}
        >
          <Ionicons name="search-outline" size={20} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Hero Section */}
      <View style={styles.heroSection}>
        <View style={styles.tagBadge}>
          <Ionicons name="sparkles" size={12} color={colors.primary} />
          <Text style={styles.tagBadgeText}>Community-Funded Reach</Text>
        </View>

        <Text style={styles.heroHeadline}>
          Deliver messages beyond your feed.
        </Text>

        <Text style={styles.heroDescription}>
          Back the cost of showing a message to people outside its creator&apos;s network. Your contribution pays for ads, not for the cause.
        </Text>

        {/* Reach Per Dollar Interactive Calculator */}
        <View style={styles.reachCalculatorCard}>
          <View style={styles.calcHeader}>
            <Text style={styles.calcTitle}>Reach Estimation Demo</Text>
            <Text style={styles.calcSubtitle}>Configurable demo assumptions</Text>
          </View>

          <View style={styles.calcAmountRow}>
            {HERO_AMOUNTS.map(amount => (
              <TouchableOpacity
                key={amount}
                style={[
                  styles.calcAmountBtn,
                  calculatorAmount === amount && styles.activeCalcAmountBtn
                ]}
                onPress={() => setCalculatorAmount(amount)}
              >
                <Text
                  style={[
                    styles.calcAmountText,
                    calculatorAmount === amount && styles.activeCalcAmountText
                  ]}
                >
                  ${amount}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.calcResultBox}>
            <Text style={styles.calcResultNumber}>
              ~{estimatedReachHero.toLocaleString()}{' '}
              <Text style={styles.calcResultUnit}>People Reached</Text>
            </Text>
            <Text style={styles.calcDisclaimer}>
              * Illustrative reach estimate based on ~$0.045 per impression across Meta & Instagram. Not a guarantee.
            </Text>
          </View>
        </View>

        {/* Primary Call-to-Actions */}
        <View style={styles.heroActionsRow}>
          <TouchableOpacity
            style={styles.primaryCta}
            onPress={onNavigateToExplore}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryCtaText}>Explore Campaigns</Text>
            <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryCta}
            onPress={onNavigateToCreate}
            activeOpacity={0.85}
          >
            <Ionicons name="add-circle-outline" size={16} color={colors.primary} />
            <Text style={styles.secondaryCtaText}>Start Campaign</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* How It Works Visual Flow */}
      <View style={styles.howItWorksCard}>
        <Text style={styles.sectionHeading}>How It Works</Text>
        <Text style={styles.sectionSubheading}>
          Create → Review → Amplify
        </Text>

        <View style={styles.stepsFlow}>
          <View style={styles.flowItem}>
            <View style={[styles.flowIcon, { backgroundColor: colors.primaryLight }]}>
              <Ionicons name="create" size={20} color={colors.primary} />
            </View>
            <Text style={styles.flowStepNum}>Step 1</Text>
            <Text style={styles.flowTitle}>Create Message</Text>
            <Text style={styles.flowDesc}>
              Creators prepare the story, cited evidence, and ad visuals.
            </Text>
          </View>

          <View style={styles.flowItem}>
            <View style={[styles.flowIcon, { backgroundColor: colors.amberLight }]}>
              <Ionicons name="shield-checkmark" size={20} color={colors.amberDark} />
            </View>
            <Text style={styles.flowStepNum}>Step 2</Text>
            <Text style={styles.flowTitle}>Platform Audit</Text>
            <Text style={styles.flowDesc}>
              A reviewer checks sources and ad content before a campaign opens for backing.
            </Text>
          </View>

          <View style={styles.flowItem}>
            <View style={[styles.flowIcon, { backgroundColor: colors.accentLight }]}>
              <Ionicons name="megaphone" size={20} color={colors.accentDark} />
            </View>
            <Text style={styles.flowStepNum}>Step 3</Text>
            <Text style={styles.flowTitle}>Amplify & Back</Text>
            <Text style={styles.flowDesc}>
              Backers pool micro-funds to broadcast the message across social media.
            </Text>
          </View>
        </View>

        <View style={styles.notDonationCallout}>
          <Ionicons name="information-circle" size={16} color={colors.textSecondary} />
          <Text style={styles.notDonationCalloutText}>
            <Text style={{ fontWeight: '700' }}>Important:</Text> This is not a personal donation platform. Contributions fund digital ad distribution, not cash grants to creators.
          </Text>
        </View>
      </View>

      {/* Featured / Trending Campaigns Section */}
      <View style={styles.feedHeaderRow}>
        <View>
          <Text style={styles.feedSectionTitle}>Active Campaigns</Text>
          <Text style={styles.feedSectionSubtitle}>
            Open for backing now
          </Text>
        </View>
        <TouchableOpacity onPress={onNavigateToExplore}>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>

      {activeCampaigns.slice(0, 3).map(campaign => (
        <CampaignCard
          key={campaign.id}
          campaign={campaign}
          onPress={() => onSelectCampaign(campaign)}
          onBackPress={() => onOpenBackModal(campaign)}
          isBookmarked={bookmarkedCampaignIds.includes(campaign.id)}
          onToggleBookmark={() => toggleBookmark(campaign.id)}
        />
      ))}

      {/* Bottom Exploration Banner */}
      <TouchableOpacity
        style={styles.moreBanner}
        onPress={onNavigateToExplore}
        activeOpacity={0.8}
      >
        <Ionicons name="compass-outline" size={22} color={colors.primary} />
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.moreBannerTitle}>Browse 10+ Categories</Text>
          <Text style={styles.moreBannerSub}>
            Discover campaigns across Health, Science, Policy, and Environment.
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
      </TouchableOpacity>

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
    paddingBottom: 24
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
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  logoIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center'
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.3
  },
  brandSubtitle: {
    fontSize: 11,
    color: colors.textSecondary
  },
  headerActionBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center'
  },
  heroSection: {
    padding: 20,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  tagBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    alignSelf: 'flex-start',
    gap: 5,
    marginBottom: 10
  },
  tagBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primaryDark,
    letterSpacing: 0.3
  },
  heroHeadline: {
    fontSize: 26,
    fontWeight: '900',
    color: colors.text,
    lineHeight: 33,
    marginBottom: 10
  },
  heroDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 21,
    marginBottom: 16
  },
  reachCalculatorCard: {
    backgroundColor: '#F7F8F9',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16
  },
  calcHeader: {
    marginBottom: 10
  },
  calcTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text
  },
  calcSubtitle: {
    fontSize: 11,
    color: colors.textSecondary
  },
  calcAmountRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10
  },
  calcAmountBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center'
  },
  activeCalcAmountBtn: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight
  },
  calcAmountText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text
  },
  activeCalcAmountText: {
    color: colors.primary
  },
  calcResultBox: {
    backgroundColor: colors.surface,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.borderLight
  },
  calcResultNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.accentDark
  },
  calcResultUnit: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary
  },
  calcDisclaimer: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 4,
    lineHeight: 14
  },
  heroActionsRow: {
    flexDirection: 'row',
    gap: 12
  },
  primaryCta: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 13,
    borderRadius: 12,
    gap: 6,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3
  },
  primaryCtaText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF'
  },
  secondaryCta: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    paddingVertical: 13,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.primary,
    gap: 6
  },
  secondaryCtaText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary
  },
  howItWorksCard: {
    backgroundColor: colors.surface,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text
  },
  sectionSubheading: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 16,
    fontWeight: '600'
  },
  stepsFlow: {
    gap: 12,
    marginBottom: 14
  },
  flowItem: {
    flexDirection: 'column',
    backgroundColor: '#F7F8F9',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.borderLight
  },
  flowIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6
  },
  flowStepNum: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'none'
  },
  flowTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2
  },
  flowDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 17
  },
  notDonationCallout: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 10,
    borderRadius: 10,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.border
  },
  notDonationCalloutText: {
    flex: 1,
    fontSize: 11,
    color: colors.textSecondary,
    lineHeight: 16
  },
  impactStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: colors.surface,
    marginHorizontal: 16,
    marginVertical: 14,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border
  },
  impactStatItem: {
    alignItems: 'center'
  },
  impactStatNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primaryDark
  },
  impactStatLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: colors.border
  },
  feedHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingHorizontal: 18,
    marginTop: 8,
    marginBottom: 6
  },
  feedSectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text
  },
  feedSectionSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 1
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary
  },
  moreBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    marginHorizontal: 16,
    marginTop: 10,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border
  },
  moreBannerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text
  },
  moreBannerSub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2
  }
});
