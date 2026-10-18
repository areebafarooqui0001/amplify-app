import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Campaign,
  Contribution,
  NotificationItem,
  UserRole,
  CampaignStatus
} from '../types/campaign';
import { INITIAL_CAMPAIGNS, INITIAL_NOTIFICATIONS } from '../data/initialCampaigns';

interface CampaignContextType {
  campaigns: Campaign[];
  savedDraft: Partial<Campaign> | null;
  userContributions: Contribution[];
  bookmarkedCampaignIds: string[];
  notifications: NotificationItem[];
  userRole: UserRole;
  isDraftSavedAlertVisible: boolean;
  saveDraft: (draft: Partial<Campaign>) => Promise<void>;
  clearDraft: () => Promise<void>;
  submitCampaign: (campaignData: Partial<Campaign>) => Promise<Campaign>;
  backCampaign: (
    campaignId: string,
    amount: number,
    paymentMethod: 'Apple Pay' | 'Google Pay' | 'Credit Card',
    isAnonymous: boolean,
    backerName?: string
  ) => Promise<Contribution>;
  recordPaymentAttempt: (
    campaignId: string,
    amount: number,
    paymentMethod: 'Apple Pay' | 'Google Pay' | 'Credit Card',
    isAnonymous: boolean,
    status: 'pending' | 'declined' | 'failed' | 'cancelled',
    backerName?: string
  ) => Promise<Contribution>;
  settlePendingContribution: (contributionId: string) => Promise<Contribution | null>;
  toggleBookmark: (campaignId: string) => void;
  voteFeedback: (campaignId: string, vote: 'yes' | 'somewhat' | 'no') => void;
  addComment: (campaignId: string, text: string) => void;
  setUserRole: (role: UserRole) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  adminApproveCampaign: (campaignId: string) => void;
  adminRequestChanges: (campaignId: string, feedback: string) => void;
  adminRejectCampaign: (campaignId: string, reason: string) => void;
  resetToDefaults: () => Promise<void>;
}

const STORAGE_KEYS = {
  CAMPAIGNS: '@amplify_campaigns_v2',
  DRAFT: '@amplify_active_draft_v2',
  CONTRIBUTIONS: '@amplify_contributions_v2',
  BOOKMARKS: '@amplify_bookmarks_v2',
  NOTIFICATIONS: '@amplify_notifications_v2',
  USER_ROLE: '@amplify_user_role_v2'
};

const CampaignContext = createContext<CampaignContextType | undefined>(undefined);

export const CampaignProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>(INITIAL_CAMPAIGNS);
  const [savedDraft, setSavedDraft] = useState<Partial<Campaign> | null>(null);
  const [userContributions, setUserContributions] = useState<Contribution[]>([]);
  const [bookmarkedCampaignIds, setBookmarkedCampaignIds] = useState<string[]>(['camp-1']);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [userRole, setUserRoleState] = useState<UserRole>('audience');
  const [isDraftSavedAlertVisible, setIsDraftSavedAlertVisible] = useState(false);

  // Load persisted state on startup
  useEffect(() => {
    const loadState = async () => {
      try {
        const storedCampaigns = await AsyncStorage.getItem(STORAGE_KEYS.CAMPAIGNS);
        if (storedCampaigns) {
          setCampaigns(JSON.parse(storedCampaigns));
        }

        const storedDraft = await AsyncStorage.getItem(STORAGE_KEYS.DRAFT);
        if (storedDraft) {
          setSavedDraft(JSON.parse(storedDraft));
        }

        const storedContributions = await AsyncStorage.getItem(STORAGE_KEYS.CONTRIBUTIONS);
        if (storedContributions) {
          setUserContributions(JSON.parse(storedContributions));
        }

        const storedBookmarks = await AsyncStorage.getItem(STORAGE_KEYS.BOOKMARKS);
        if (storedBookmarks) {
          setBookmarkedCampaignIds(JSON.parse(storedBookmarks));
        }

        const storedNotifications = await AsyncStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
        if (storedNotifications) {
          setNotifications(JSON.parse(storedNotifications));
        }

        const storedRole = await AsyncStorage.getItem(STORAGE_KEYS.USER_ROLE);
        if (storedRole) {
          setUserRoleState(storedRole as UserRole);
        }
      } catch (err) {
        console.warn('Failed to load state from AsyncStorage', err);
      }
    };
    loadState();
  }, []);

  const saveDraft = async (draft: Partial<Campaign>) => {
    try {
      setSavedDraft(draft);
      await AsyncStorage.setItem(STORAGE_KEYS.DRAFT, JSON.stringify(draft));
      setIsDraftSavedAlertVisible(true);
      setTimeout(() => setIsDraftSavedAlertVisible(false), 2000);
    } catch (err) {
      console.warn('Error saving draft', err);
    }
  };

  const clearDraft = async () => {
    try {
      setSavedDraft(null);
      await AsyncStorage.removeItem(STORAGE_KEYS.DRAFT);
    } catch (err) {
      console.warn('Error clearing draft', err);
    }
  };

  const submitCampaign = async (campaignData: Partial<Campaign>): Promise<Campaign> => {
    const newId = `camp-${Date.now()}`;
    const newCampaign: Campaign = {
      id: newId,
      title: campaignData.title || 'Untitled Campaign',
      category: campaignData.category || 'Public Policy',
      creatorName: campaignData.creatorName || 'Anonymous Creator',
      creatorBio: campaignData.creatorBio || 'Community Advocate',
      creatorOrg: campaignData.creatorOrg || '',
      creatorAvatar: campaignData.creatorAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      summary: campaignData.summary || '',
      coverImage: campaignData.coverImage || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
      status: 'under_review',
      story: campaignData.story && campaignData.story.length > 0 ? campaignData.story : [
        {
          id: `s-${Date.now()}`,
          type: 'paragraph',
          content: campaignData.summary || 'Campaign narrative details.'
        }
      ],
      sources: campaignData.sources || [],
      adCreative: campaignData.adCreative || {
        headline: campaignData.title?.slice(0, 45) || 'Important community message',
        description: campaignData.summary?.slice(0, 90) || 'Support the distribution of this message.',
        ctaText: 'Learn More',
        imageUrl: campaignData.coverImage || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
        aspectRatio: '1:1'
      },
      targeting: campaignData.targeting || {
        regions: ['North America'],
        interests: ['Community Awareness'],
        demographics: 'Ages 18-65',
        channels: ['Meta Ads (Instagram & Facebook)'],
        durationDays: 14,
        estImpressionsPerDollar: 22,
        estimatedReachTotal: ((campaignData.funding?.goalAmount || 1500) * 0.95 * 22)
      },
      funding: {
        goalAmount: campaignData.funding?.goalAmount || 1500,
        currentAmount: 0,
        backerCount: 0,
        currency: 'USD',
        daysRemaining: campaignData.targeting?.durationDays || 14,
        platformFeePercent: 5,
        advertisingAllocationPercent: 95
      },
      audienceActionAdvice: campaignData.audienceActionAdvice || 'Share this message to help amplify reach beyond personal networks.',
      feedbackVotes: { yes: 0, somewhat: 0, no: 0 },
      comments: [],
      createdAt: new Date().toISOString().split('T')[0],
      submittedAt: new Date().toISOString().split('T')[0]
    };

    const updated = [newCampaign, ...campaigns];
    setCampaigns(updated);
    await AsyncStorage.setItem(STORAGE_KEYS.CAMPAIGNS, JSON.stringify(updated));
    await clearDraft();

    // Add submission notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Campaign Submitted for Review',
      message: `"${newCampaign.title}" is under review. A reviewer will check your sources and ad content.`,
      timestamp: 'Just now',
      type: 'submission',
      campaignId: newCampaign.id,
      read: false
    };
    const updatedNotifs = [newNotif, ...notifications];
    setNotifications(updatedNotifs);
    await AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updatedNotifs));

    return newCampaign;
  };

  // Non-successful payment attempts are recorded for payment history but never change funding progress.
  const recordPaymentAttempt = async (
    campaignId: string,
    amount: number,
    paymentMethod: 'Apple Pay' | 'Google Pay' | 'Credit Card',
    isAnonymous: boolean,
    status: 'pending' | 'declined' | 'failed' | 'cancelled',
    backerName?: string
  ): Promise<Contribution> => {
    const feeAmount = Math.round(amount * 0.05 * 100) / 100;
    const netAdSpend = Math.round((amount - feeAmount) * 100) / 100;
    const target = campaigns.find(c => c.id === campaignId);
    const attempt: Contribution = {
      id: `contrib-${Date.now()}`,
      campaignId,
      campaignTitle: target ? target.title : 'Campaign',
      campaignImage: target ? target.coverImage : '',
      amount,
      feeAmount,
      netAdSpend,
      estimatedImpactReach: Math.round(netAdSpend * (target?.targeting?.estImpressionsPerDollar || 22)),
      backerName: isAnonymous ? undefined : (backerName || 'Community Supporter'),
      isAnonymous,
      paymentMethod,
      status,
      timestamp: new Date().toLocaleString(),
      receiptId: `PEND-${Math.floor(100000 + Math.random() * 900000)}`
    };
    const titles = {
      pending: 'Payment pending',
      declined: 'Payment declined',
      failed: 'Payment failed',
      cancelled: 'Payment cancelled'
    } as const;
    const bodies = {
      pending: `Your $${amount} payment for "${attempt.campaignTitle}" is being confirmed. It is not counted toward funding yet.`,
      declined: `Your $${amount} payment for "${attempt.campaignTitle}" was declined. You were not charged.`,
      failed: `Your $${amount} payment for "${attempt.campaignTitle}" did not go through. You were not charged.`,
      cancelled: `You cancelled the $${amount} payment for "${attempt.campaignTitle}". You were not charged.`
    } as const;
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: titles[status],
      message: bodies[status],
      timestamp: 'Just now',
      type: 'contribution',
      campaignId,
      read: false
    };
    const nextContribs = [attempt, ...userContributions];
    setUserContributions(nextContribs);
    await AsyncStorage.setItem(STORAGE_KEYS.CONTRIBUTIONS, JSON.stringify(nextContribs));
    const nextNotifs = [notif, ...notifications];
    setNotifications(nextNotifs);
    await AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(nextNotifs));
    return attempt;
  };

  // Confirms a pending payment: only now does it count toward funding.
  const settlePendingContribution = async (contributionId: string): Promise<Contribution | null> => {
    const pending = userContributions.find(c => c.id === contributionId && c.status === 'pending');
    if (!pending) return null;
    const settled: Contribution = {
      ...pending,
      status: 'succeeded',
      receiptId: `RCPT-${Math.floor(100000 + Math.random() * 900000)}`,
      timestamp: new Date().toLocaleString()
    };
    const nextContribs = userContributions.map(c => (c.id === contributionId ? settled : c));
    setUserContributions(nextContribs);
    await AsyncStorage.setItem(STORAGE_KEYS.CONTRIBUTIONS, JSON.stringify(nextContribs));

    const nextCampaigns = campaigns.map(c => {
      if (c.id !== pending.campaignId) return c;
      const newTotal = c.funding.currentAmount + pending.amount;
      const reached = newTotal >= c.funding.goalAmount;
      return {
        ...c,
        status: reached && c.status === 'funding' ? ('goal_reached' as CampaignStatus) : c.status,
        funding: { ...c.funding, currentAmount: newTotal, backerCount: c.funding.backerCount + 1 }
      };
    });
    setCampaigns(nextCampaigns);
    await AsyncStorage.setItem(STORAGE_KEYS.CAMPAIGNS, JSON.stringify(nextCampaigns));

    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Payment confirmed',
      message: `Your $${pending.amount} payment for "${pending.campaignTitle}" is confirmed and now counts toward funding.`,
      timestamp: 'Just now',
      type: 'contribution',
      campaignId: pending.campaignId,
      read: false
    };
    const nextNotifs = [notif, ...notifications];
    setNotifications(nextNotifs);
    await AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(nextNotifs));
    return settled;
  };

  const backCampaign = async (
    campaignId: string,
    amount: number,
    paymentMethod: 'Apple Pay' | 'Google Pay' | 'Credit Card',
    isAnonymous: boolean,
    backerName?: string
  ): Promise<Contribution> => {
    const feeAmount = Math.round(amount * 0.05 * 100) / 100;
    const netAdSpend = Math.round((amount - feeAmount) * 100) / 100;
    const targetCampaign = campaigns.find(c => c.id === campaignId);
    const estReach = Math.round(netAdSpend * (targetCampaign?.targeting?.estImpressionsPerDollar || 22));
    const campaignTitle = targetCampaign ? targetCampaign.title : 'Campaign Amplification';
    const campaignImage = targetCampaign ? targetCampaign.coverImage : '';

    const newContribution: Contribution = {
      id: `contrib-${Date.now()}`,
      campaignId,
      campaignTitle,
      campaignImage,
      amount,
      feeAmount,
      netAdSpend,
      estimatedImpactReach: estReach,
      backerName: isAnonymous ? undefined : (backerName || 'Community Supporter'),
      isAnonymous,
      paymentMethod,
      status: 'succeeded',
      timestamp: new Date().toLocaleString(),
      receiptId: `RCPT-${Math.floor(100000 + Math.random() * 900000)}`
    };

    // Update campaign funding state
    const updatedCampaigns = campaigns.map(c => {
      if (c.id === campaignId) {
        const newTotal = c.funding.currentAmount + amount;
        const newBackerCount = c.funding.backerCount + 1;
        const isGoalReached = newTotal >= c.funding.goalAmount;
        return {
          ...c,
          status: isGoalReached && c.status === 'funding' ? ('goal_reached' as CampaignStatus) : c.status,
          funding: {
            ...c.funding,
            currentAmount: newTotal,
            backerCount: newBackerCount
          }
        };
      }
      return c;
    });

    setCampaigns(updatedCampaigns);
    await AsyncStorage.setItem(STORAGE_KEYS.CAMPAIGNS, JSON.stringify(updatedCampaigns));

    const updatedContributions = [newContribution, ...userContributions];
    setUserContributions(updatedContributions);
    await AsyncStorage.setItem(STORAGE_KEYS.CONTRIBUTIONS, JSON.stringify(updatedContributions));

    // Notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Contribution confirmed',
      message: `You contributed $${amount} toward amplifying "${campaignTitle}". Estimated +${estReach.toLocaleString()} audience reach funded!`,
      timestamp: 'Just now',
      type: 'contribution',
      campaignId,
      read: false
    };
    const updatedNotifs = [newNotif, ...notifications];
    setNotifications(updatedNotifs);
    await AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updatedNotifs));

    return newContribution;
  };

  const toggleBookmark = async (campaignId: string) => {
    let updated: string[];
    if (bookmarkedCampaignIds.includes(campaignId)) {
      updated = bookmarkedCampaignIds.filter(id => id !== campaignId);
    } else {
      updated = [...bookmarkedCampaignIds, campaignId];
    }
    setBookmarkedCampaignIds(updated);
    await AsyncStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(updated));
  };

  const voteFeedback = async (campaignId: string, vote: 'yes' | 'somewhat' | 'no') => {
    const updated = campaigns.map(c => {
      if (c.id === campaignId) {
        return {
          ...c,
          feedbackVotes: {
            ...c.feedbackVotes,
            [vote]: c.feedbackVotes[vote] + 1
          }
        };
      }
      return c;
    });
    setCampaigns(updated);
    await AsyncStorage.setItem(STORAGE_KEYS.CAMPAIGNS, JSON.stringify(updated));
  };

  const addComment = async (campaignId: string, text: string) => {
    const newComment = {
      id: `c-${Date.now()}`,
      author: 'You (Audience)',
      text,
      timestamp: 'Just now',
      likes: 0
    };
    const updated = campaigns.map(c => {
      if (c.id === campaignId) {
        return {
          ...c,
          comments: [newComment, ...(c.comments || [])]
        };
      }
      return c;
    });
    setCampaigns(updated);
    await AsyncStorage.setItem(STORAGE_KEYS.CAMPAIGNS, JSON.stringify(updated));
  };

  const setUserRole = async (role: UserRole) => {
    setUserRoleState(role);
    await AsyncStorage.setItem(STORAGE_KEYS.USER_ROLE, role);
  };

  const markNotificationAsRead = async (id: string) => {
    const updated = notifications.map(n => (n.id === id ? { ...n, read: true } : n));
    setNotifications(updated);
    await AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated));
  };

  const markAllNotificationsAsRead = async () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    await AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated));
  };

  const adminApproveCampaign = async (campaignId: string) => {
    const updated = campaigns.map(c => {
      if (c.id === campaignId) {
        return {
          ...c,
          status: 'funding' as CampaignStatus,
          approvedAt: new Date().toISOString().split('T')[0]
        };
      }
      return c;
    });
    setCampaigns(updated);
    await AsyncStorage.setItem(STORAGE_KEYS.CAMPAIGNS, JSON.stringify(updated));

    const target = campaigns.find(c => c.id === campaignId);
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Campaign approved',
      message: `"${target?.title}" was reviewed and approved! It is now live on Explore for community funding.`,
      timestamp: 'Just now',
      type: 'milestone',
      campaignId,
      read: false
    };
    setNotifications([newNotif, ...notifications]);
  };

  const adminRequestChanges = async (campaignId: string, feedback: string) => {
    const updated = campaigns.map(c => {
      if (c.id === campaignId) {
        return {
          ...c,
          status: 'changes_requested' as CampaignStatus,
          reviewFeedback: feedback
        };
      }
      return c;
    });
    setCampaigns(updated);
    await AsyncStorage.setItem(STORAGE_KEYS.CAMPAIGNS, JSON.stringify(updated));

    const target = campaigns.find(c => c.id === campaignId);
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Changes requested',
      message: `Editorial feedback received for "${target?.title}": ${feedback}`,
      timestamp: 'Just now',
      type: 'milestone',
      campaignId,
      read: false
    };
    const updatedNotifs = [newNotif, ...notifications];
    setNotifications(updatedNotifs);
    await AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updatedNotifs));
  };

  const adminRejectCampaign = async (campaignId: string, reason: string) => {
    const updated = campaigns.map(c => {
      if (c.id === campaignId) {
        return {
          ...c,
          status: 'rejected' as CampaignStatus,
          reviewFeedback: reason
        };
      }
      return c;
    });
    setCampaigns(updated);
    await AsyncStorage.setItem(STORAGE_KEYS.CAMPAIGNS, JSON.stringify(updated));

    const target = campaigns.find(c => c.id === campaignId);
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Campaign not approved',
      message: `"${target?.title}" does not meet platform advertising guidelines: ${reason}`,
      timestamp: 'Just now',
      type: 'milestone',
      campaignId,
      read: false
    };
    const updatedNotifs = [newNotif, ...notifications];
    setNotifications(updatedNotifs);
    await AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updatedNotifs));
  };

  const resetToDefaults = async () => {
    await AsyncStorage.clear();
    setCampaigns(INITIAL_CAMPAIGNS);
    setSavedDraft(null);
    setUserContributions([]);
    setBookmarkedCampaignIds(['camp-1']);
    setNotifications(INITIAL_NOTIFICATIONS);
    setUserRoleState('audience');
  };

  return (
    <CampaignContext.Provider
      value={{
        campaigns,
        savedDraft,
        userContributions,
        bookmarkedCampaignIds,
        notifications,
        userRole,
        isDraftSavedAlertVisible,
        saveDraft,
        clearDraft,
        submitCampaign,
        backCampaign,
        recordPaymentAttempt,
        settlePendingContribution,
        toggleBookmark,
        voteFeedback,
        addComment,
        setUserRole,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        adminApproveCampaign,
        adminRequestChanges,
        adminRejectCampaign,
        resetToDefaults
      }}
    >
      {children}
    </CampaignContext.Provider>
  );
};

export const useCampaigns = () => {
  const context = useContext(CampaignContext);
  if (!context) {
    throw new Error('useCampaigns must be used within a CampaignProvider');
  }
  return context;
};
