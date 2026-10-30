export type CampaignCategory =
  | 'Environment'
  | 'Health'
  | 'Science'
  | 'Education'
  | 'Public Policy'
  | 'Economic Policy'
  | 'Community'
  | 'Arts & Culture'
  | 'Business'
  | 'Other';

export type CampaignStatus =
  | 'draft'
  | 'under_review'
  | 'changes_requested'
  | 'approved'
  | 'funding'
  | 'goal_reached'
  | 'distribution_prep'
  | 'promoting'
  | 'completed'
  | 'rejected';

export interface StorySection {
  id: string;
  type: 'heading' | 'paragraph' | 'quote' | 'stat' | 'image';
  content: string;
  caption?: string;
  credit?: string;
  statValue?: string;
  statLabel?: string;
  imageUrl?: string;
}

export interface SourceReference {
  id: string;
  title: string;
  publication: string;
  url: string;
  verified: boolean;
  date?: string;
}

export interface AdCreative {
  headline: string;
  description: string;
  ctaText: 'Learn More' | 'Read Report' | 'Take Action' | 'Support Message' | 'Watch Brief';
  imageUrl: string;
  videoUrl?: string;
  aspectRatio?: '1:1' | '4:5' | '9:16';
}

export interface ReachTargeting {
  regions: string[];
  interests: string[];
  demographics: string;
  channels: string[];
  durationDays: number;
  estImpressionsPerDollar: number;
  estimatedReachTotal: number;
}

export interface FundingInfo {
  goalAmount: number;
  currentAmount: number;
  backerCount: number;
  currency: string;
  daysRemaining: number;
  platformFeePercent: number; // e.g., 5%
  advertisingAllocationPercent: number; // e.g., 95%
}

export interface AnalyticsReport {
  adSpendDeployed: number;
  totalBudget: number;
  impressionsDelivered: number;
  uniquePeopleReached: number;
  linkClicks: number;
  ctr: number; // in %
  platformBreakdown: { platform: string; percent: number; impressions: number }[];
  dailyReach: { day: string; reach: number }[];
  statusSummary: string;
}

export interface CampaignComment {
  id: string;
  author: string;
  authorAvatar?: string;
  text: string;
  timestamp: string;
  likes: number;
}

export interface Campaign {
  id: string;
  title: string;
  category: CampaignCategory;
  creatorName: string;
  creatorBio?: string;
  creatorOrg?: string;
  creatorAvatar?: string;
  summary: string;
  coverImage: string;
  status: CampaignStatus;
  story: StorySection[];
  sources: SourceReference[];
  adCreative: AdCreative;
  targeting: ReachTargeting;
  funding: FundingInfo;
  analytics?: AnalyticsReport;
  audienceActionAdvice: string;
  reviewFeedback?: string;
  createdAt: string;
  submittedAt?: string;
  approvedAt?: string;
  feedbackVotes: {
    yes: number;
    somewhat: number;
    no: number;
  };
  comments: CampaignComment[];
  isFeatured?: boolean;
}

export interface Contribution {
  id: string;
  campaignId: string;
  campaignTitle: string;
  campaignImage: string;
  amount: number;
  feeAmount: number;
  netAdSpend: number;
  estimatedImpactReach: number;
  backerName?: string;
  isAnonymous: boolean;
  paymentMethod: 'Apple Pay' | 'Google Pay' | 'Credit Card';
  status: 'succeeded' | 'pending' | 'declined' | 'failed' | 'cancelled' | 'processing' | 'refunded';
  timestamp: string;
  receiptId: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'milestone' | 'submission' | 'contribution' | 'promotion' | 'system';
  campaignId?: string;
  read: boolean;
}

export interface NotificationPrefs {
  milestone: boolean;
  promotion: boolean;
  contribution: boolean;
  status: boolean;
}

export type UserRole = 'audience' | 'creator' | 'backer' | 'admin';
