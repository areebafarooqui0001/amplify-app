import { Campaign, NotificationItem } from '../types/campaign';

export const INITIAL_CAMPAIGNS: Campaign[] = [
  {
    id: 'camp-1',
    title: 'Clean Air in School Zones: Particulate Matter Defense',
    category: 'Environment',
    creatorName: 'Dr. Elena Rostova',
    creatorBio: 'Environmental Epidemiologist & Community Health Advocate',
    creatorOrg: 'Clean Skies Youth Initiative',
    creatorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    summary: 'Amplifying urgent research showing 3x toxic particulate spikes outside elementary schools during drop-off hours, demanding local air filtration.',
    coverImage: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&auto=format&fit=crop&q=80',
    status: 'funding',
    isFeatured: true,
    story: [
      {
        id: 's-1',
        type: 'heading',
        content: 'Why School Drop-Off Zones Are Hidden Health Hazards'
      },
      {
        id: 's-2',
        type: 'paragraph',
        content: 'For eight months, our sensor team tracked ultra-fine particulate matter (PM2.5) across 42 municipal school zones. During morning drop-off, idling diesel and gasoline vehicles elevate airborne pollutants to levels 3.8 times higher than World Health Organization safe thresholds.'
      },
      {
        id: 's-3',
        type: 'stat',
        content: 'Drop-off hour pollution spike',
        statValue: '3.8x',
        statLabel: 'Above WHO daily safe threshold'
      },
      {
        id: 's-4',
        type: 'paragraph',
        content: 'Children breathe 50% more air per pound of body weight than adults, yet school districts rarely monitor curbside air quality. This message needs to reach suburban parents, parent-teacher associations, and city council members before next month’s municipal zoning votes.'
      },
      {
        id: 's-5',
        type: 'quote',
        content: 'Clean air in our classrooms is not a luxury—it is fundamental cognitive and physiological infrastructure for developing minds.'
      }
    ],
    sources: [
      {
        id: 'src-1',
        title: 'Air Pollution Exposure in Urban School Zones',
        publication: 'Journal of Environmental Health Perspectives',
        url: 'https://ehp.niehs.nih.gov/doi/full/10.1289/ehp.air2024',
        verified: true,
        date: 'Sept 2024'
      },
      {
        id: 'src-2',
        title: 'WHO Global Air Quality Guidelines: Particulate Matter',
        publication: 'World Health Organization Technical Brief',
        url: 'https://who.int/news-room/fact-sheets/detail/ambient-(outdoor)-air-quality',
        verified: true,
        date: 'Jan 2024'
      }
    ],
    adCreative: {
      headline: 'Is Your Child Breathing Toxic PM2.5 at School Drop-off?',
      description: 'New data reveals vehicle idling creates severe micro-pollution spikes outside schools. See the interactive report and petition your district.',
      ctaText: 'Read Report',
      imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80',
      aspectRatio: '1:1'
    },
    targeting: {
      regions: ['Metro Suburbs', 'Midwest US', 'Pacific Northwest'],
      interests: ['Parenting', 'Public Schools', 'Pediatric Health', 'Local Government'],
      demographics: 'Parents aged 25-50 within 15 miles of target school districts',
      channels: ['Meta Ads (Instagram & Facebook)', 'Local Nextdoor Feeds'],
      durationDays: 14,
      estImpressionsPerDollar: 22,
      estimatedReachTotal: 88000
    },
    funding: {
      goalAmount: 4000,
      currentAmount: 3420,
      backerCount: 171,
      currency: 'USD',
      daysRemaining: 4,
      platformFeePercent: 5,
      advertisingAllocationPercent: 95
    },
    audienceActionAdvice: 'Share this data with your school board trustee and support no-idling curbside policies in your local district.',
    feedbackVotes: {
      yes: 184,
      somewhat: 22,
      no: 6
    },
    comments: [
      {
        id: 'c-1',
        author: 'Sarah Jenkins',
        text: 'I had no idea idling was this concentrated. Backed $50 to get this in front of our local PTSA members!',
        timestamp: '2 hours ago',
        likes: 14
      },
      {
        id: 'c-2',
        author: 'Marcus Vance',
        text: 'The sources cited are peer-reviewed and pristine. Great initiative!',
        timestamp: '5 hours ago',
        likes: 8
      }
    ],
    createdAt: '2026-10-01'
  },
  {
    id: 'camp-2',
    title: 'Open Science: Unlocking Rare Pediatric Disease Research',
    category: 'Science',
    creatorName: 'Prof. David Chen',
    creatorBio: 'Biochemist & Open Science Fellow, BioCommons Institute',
    creatorOrg: 'BioCommons Open Access Project',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    summary: 'Breaking down $35 paywalls on critical genetic research so clinical researchers and families can access life-saving treatment protocols.',
    coverImage: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=800&auto=format&fit=crop&q=80',
    status: 'promoting',
    isFeatured: true,
    story: [
      {
        id: 's-10',
        type: 'heading',
        content: 'Why Publicly Funded Research Remains Locked Behind Paywalls'
      },
      {
        id: 's-11',
        type: 'paragraph',
        content: 'Taxpayers pay billions every year to fund biomedical research in university laboratories. Yet when crucial findings on rare pediatric disorders are published, commercial academic cartels lock them behind $35 to $60 paywalls per article.'
      },
      {
        id: 's-12',
        type: 'stat',
        content: 'Research funded by public grants',
        statValue: '84%',
        statLabel: 'Yet gated by commercial academic publishers'
      },
      {
        id: 's-13',
        type: 'paragraph',
        content: 'Community-funded amplification distributed our open preprint repository directly to 75,000 biomedical researchers and parent advocacy foundations, leading directly to two multi-center clinical trial collaborations.'
      }
    ],
    sources: [
      {
        id: 'src-10',
        title: 'The Economic Costs of Academic Knowledge Monopolies',
        publication: 'Nature Human Behavior Review',
        url: 'https://nature.com/articles/open-access-equity-2024',
        verified: true,
        date: 'July 2024'
      }
    ],
    adCreative: {
      headline: 'Taxpayers funded this cure. So why does reading it cost $45?',
      description: 'Access the free open preprint database for rare pediatric genetic conditions. Knowledge should be universal.',
      ctaText: 'Learn More',
      imageUrl: 'https://images.unsplash.com/photo-1579165466791-788226ab77b6?w=800&auto=format&fit=crop&q=80',
      aspectRatio: '1:1'
    },
    targeting: {
      regions: ['Global English', 'North America', 'Western Europe'],
      interests: ['Medical Research', 'Genetics', 'Rare Diseases', 'Higher Education'],
      demographics: 'Researchers, medical students, rare disease advocates aged 20-65',
      channels: ['Meta Ads (Feed & Story)', 'Academic Research Subreddits', 'LinkedIn Sponsored Posts'],
      durationDays: 30,
      estImpressionsPerDollar: 25,
      estimatedReachTotal: 125000
    },
    funding: {
      goalAmount: 5000,
      currentAmount: 5000,
      backerCount: 248,
      currency: 'USD',
      daysRemaining: 0,
      platformFeePercent: 5,
      advertisingAllocationPercent: 95
    },
    analytics: {
      adSpendDeployed: 3750,
      totalBudget: 4750,
      impressionsDelivered: 94500,
      uniquePeopleReached: 78200,
      linkClicks: 6410,
      ctr: 6.78,
      platformBreakdown: [
        { platform: 'Instagram Feed & Stories', percent: 54, impressions: 51030 },
        { platform: 'Facebook Mobile Feed', percent: 34, impressions: 32130 },
        { platform: 'Partner Ad Network', percent: 12, impressions: 11340 }
      ],
      dailyReach: [
        { day: 'Day 1', reach: 3100 },
        { day: 'Day 2', reach: 5200 },
        { day: 'Day 3', reach: 7800 },
        { day: 'Day 4', reach: 9400 },
        { day: 'Day 5', reach: 11200 },
        { day: 'Day 6', reach: 14500 },
        { day: 'Day 7', reach: 16800 }
      ],
      statusSummary: 'Ads are running on Facebook and Instagram. Figures shown are demo data.'
    },
    audienceActionAdvice: 'Deposit preprints in open repositories (arXiv, bioRxiv) and support federal mandates for open-access research.',
    feedbackVotes: {
      yes: 312,
      somewhat: 14,
      no: 3
    },
    comments: [
      {
        id: 'c-10',
        author: 'Dr. Liam Kelly',
        text: 'The ads reached our lab slack channel. We just opened three papers from this repo!',
        timestamp: '1 day ago',
        likes: 24
      }
    ],
    createdAt: '2026-09-15'
  },
  {
    id: 'camp-3',
    title: 'Teen Mental Health in the Infinite Scroll Era',
    category: 'Health',
    creatorName: 'Amara Washington, MSW',
    creatorBio: 'Adolescent Clinical Counselor & Digital Wellbeing Researcher',
    creatorOrg: 'Healthy Mind Screen Project',
    creatorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    summary: 'Distributing evidence-backed screen boundary toolkits and algorithmic literacy guides directly to middle school students and parents.',
    coverImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
    status: 'funding',
    story: [
      {
        id: 's-20',
        type: 'heading',
        content: 'Algorithms Are Designed for Dopamine, Not Wellbeing'
      },
      {
        id: 's-21',
        type: 'paragraph',
        content: 'Clinical studies show that teen anxiety symptoms spike by 40% when screen time exceeds 3.5 hours daily without restorative sleep intervals. Yet teen users are blamed rather than the predatory variable-reward design patterns of modern feeds.'
      },
      {
        id: 's-22',
        type: 'stat',
        content: 'Reported anxiety reduction',
        statValue: '34%',
        statLabel: 'When implementing nocturnal device curfews'
      },
      {
        id: 's-23',
        type: 'paragraph',
        content: 'By crowdfunding micro-targeted social ads, we deliver the solutions directly into the very feeds that teens and parents scroll every evening.'
      }
    ],
    sources: [
      {
        id: 'src-20',
        title: 'Social Media Use and Adolescent Mental Health Interventions',
        publication: 'American Psychological Association Advisory',
        url: 'https://apa.org/topics/social-media-internet/health-advisory-adolescents',
        verified: true,
        date: 'May 2024'
      }
    ],
    adCreative: {
      headline: 'Feel drained after 30 minutes on TikTok? Here is why.',
      description: 'Get the free 5-minute digital detox framework built by child psychiatrists. Reclaim your sleep.',
      ctaText: 'Take Action',
      imageUrl: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&auto=format&fit=crop&q=80',
      aspectRatio: '1:1'
    },
    targeting: {
      regions: ['California', 'New York', 'Texas', 'United Kingdom'],
      interests: ['Mental Health', 'Parenting Teens', 'Digital Wellbeing', 'High School'],
      demographics: 'Teens 13-19 and Parents 35-55',
      channels: ['Instagram Reels', 'Meta Ads (FB/IG)'],
      durationDays: 21,
      estImpressionsPerDollar: 20,
      estimatedReachTotal: 50000
    },
    funding: {
      goalAmount: 2500,
      currentAmount: 1850,
      backerCount: 92,
      currency: 'USD',
      daysRemaining: 11,
      platformFeePercent: 5,
      advertisingAllocationPercent: 95
    },
    audienceActionAdvice: 'Establish a device charging station outside teen bedrooms and activate grayscale mode after 9 PM.',
    feedbackVotes: {
      yes: 142,
      somewhat: 18,
      no: 4
    },
    comments: [],
    createdAt: '2026-10-05'
  },
  {
    id: 'camp-4',
    title: 'Protecting Urban Pollinators: Ban Neonicotinoids in Public Parks',
    category: 'Community',
    creatorName: 'Julian Alvarez',
    creatorBio: 'Urban Apiarist & Biodiversity Campaigner',
    creatorOrg: 'City Pollinator Coalition',
    creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    summary: 'Spreading public awareness on systemic pesticides used on ornamental flowers in public parks that decimate native pollinator colonies.',
    coverImage: 'https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?w=800&auto=format&fit=crop&q=80',
    status: 'funding',
    story: [
      {
        id: 's-30',
        type: 'heading',
        content: 'Pesticides On Decorative Flowers Are Poisoning Urban Hives'
      },
      {
        id: 's-31',
        type: 'paragraph',
        content: 'While municipal parks look picturesque, grounds maintenance contractors routinely spray systemic neonicotinoid pesticides on decorative tulips and clover to prevent cosmetic leaf chewing. For solitary bees and bumblebees, even 4 parts per billion disorients navigation.'
      },
      {
        id: 's-32',
        type: 'stat',
        content: 'Urban Colony Decline',
        statValue: '48%',
        statLabel: 'Across municipal zones spraying neonics'
      }
    ],
    sources: [
      {
        id: 'src-30',
        title: 'Neonicotinoid Impacts on Native Pollinator Foraging',
        publication: 'Conservation Biology Letters',
        url: 'https://conbio.onlinelibrary.wiley.com/doi/10.1111/conl.1284',
        verified: true,
        date: 'March 2024'
      }
    ],
    adCreative: {
      headline: 'Why are the bees disappearing from municipal parks?',
      description: 'Cosmetic pesticide spraying is silently decimating native pollinators. Tell city hall to choose pollinator-safe landscaping.',
      ctaText: 'Learn More',
      imageUrl: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=800&auto=format&fit=crop&q=80',
      aspectRatio: '1:1'
    },
    targeting: {
      regions: ['Greater Chicago', 'Austin', 'Seattle'],
      interests: ['Gardening', 'Urban Parks', 'Sustainability', 'Local Politics'],
      demographics: 'Local residents within 10 miles of municipal park systems',
      channels: ['Facebook Local Groups', 'Instagram Feed'],
      durationDays: 14,
      estImpressionsPerDollar: 21,
      estimatedReachTotal: 63000
    },
    funding: {
      goalAmount: 3000,
      currentAmount: 2100,
      backerCount: 105,
      currency: 'USD',
      daysRemaining: 7,
      platformFeePercent: 5,
      advertisingAllocationPercent: 95
    },
    audienceActionAdvice: 'Submit written testimony to your municipal Parks and Recreation committee requesting an organic landscaping pilot.',
    feedbackVotes: {
      yes: 98,
      somewhat: 12,
      no: 2
    },
    comments: [],
    createdAt: '2026-10-08'
  },
  {
    id: 'camp-5',
    title: 'Financial Literacy For High Schoolers: Real-World Math',
    category: 'Education',
    creatorName: 'Kavita Patel',
    creatorBio: 'Former Math Teacher & Personal Finance Author',
    creatorOrg: 'NextGen Financial Equity',
    creatorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    summary: 'Advocating for mandatory high-school curricula covering compound interest, credit card interest traps, and tax filing basics.',
    coverImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80',
    status: 'under_review',
    story: [
      {
        id: 's-40',
        type: 'heading',
        content: 'Why We Teach Trigonometry But Not Compound Debt'
      },
      {
        id: 's-41',
        type: 'paragraph',
        content: 'In 28 states, high school students can graduate without a single hour of personal finance education, yet the average 18-year-old is immediately targeted with predatory high-APR credit cards and student loans.'
      }
    ],
    sources: [
      {
        id: 'src-40',
        title: 'State of Financial Education in US Public High Schools',
        publication: 'Council for Economic Education',
        url: 'https://councilforeconed.org/survey-of-the-states-2024',
        verified: true,
        date: '2024'
      }
    ],
    adCreative: {
      headline: 'Why don’t schools teach taxes and compound interest?',
      description: 'Support the curriculum reform bill ensuring every graduate understands credit scores and personal budgeting.',
      ctaText: 'Support Message',
      imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80',
      aspectRatio: '1:1'
    },
    targeting: {
      regions: ['Nationwide US'],
      interests: ['Education Reform', 'Personal Finance', 'Parenting'],
      demographics: 'Parents and teachers aged 30-60',
      channels: ['Meta Ads', 'LinkedIn Ads'],
      durationDays: 30,
      estImpressionsPerDollar: 22,
      estimatedReachTotal: 44000
    },
    funding: {
      goalAmount: 2000,
      currentAmount: 0,
      backerCount: 0,
      currency: 'USD',
      daysRemaining: 30,
      platformFeePercent: 5,
      advertisingAllocationPercent: 95
    },
    audienceActionAdvice: 'Contact your state board of education curriculum director to endorse Senate Education Bill 412.',
    feedbackVotes: {
      yes: 42,
      somewhat: 5,
      no: 1
    },
    comments: [],
    createdAt: '2026-10-14',
    submittedAt: '2026-10-14'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Ad Campaign Promoting Live',
    message: 'Your campaign "Open Science" has reached its funding goal. Ads start only after distribution setup is complete.',
    timestamp: '1 hour ago',
    type: 'promotion',
    campaignId: 'camp-2',
    read: false
  },
  {
    id: 'notif-2',
    title: 'Funding Milestone: 85% Reached!',
    message: '"Clean Air in School Zones" just passed $3,400 with 171 community backers. Distribution preparation will start soon.',
    timestamp: '4 hours ago',
    type: 'milestone',
    campaignId: 'camp-1',
    read: false
  },
  {
    id: 'notif-3',
    title: 'New Contribution Recorded',
    message: 'A backer contributed $50 to "Teen Mental Health in the Infinite Scroll Era", boosting estimated ad reach by ~1,100 people.',
    timestamp: 'Yesterday',
    type: 'contribution',
    campaignId: 'camp-3',
    read: true
  },
  {
    id: 'notif-4',
    title: 'Campaign Submitted for Review',
    message: '"Financial Literacy For High Schoolers" was submitted and is under review. A reviewer is checking sources and ad content.',
    timestamp: '2 days ago',
    type: 'submission',
    campaignId: 'camp-5',
    read: true
  }
];
