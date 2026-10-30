// Static help and policy pages shown from Profile. All figures are demo assumptions.
export interface InfoPage {
  key: string;
  title: string;
  icon: string; // Ionicons name
  body: string[];
}

export const INFO_PAGES: InfoPage[] = [
  {
    key: 'how_it_works',
    title: 'How it works',
    icon: 'help-circle-outline',
    body: [
      'Create: a creator writes a message as a campaign, with a story, sources and ad visuals, and sets a funding goal.',
      'Review: a reviewer checks the story, sources, visuals and targeting. Only approved campaigns open for backing.',
      'Amplify: backers contribute toward the cost of showing the message to people beyond the creator’s own network. Ads start only after funding closes and distribution setup is complete.',
      'One account can browse, back and create. You can browse and back as a guest.'
    ]
  },
  {
    key: 'fees',
    title: 'Fees and use of funds',
    icon: 'receipt-outline',
    body: [
      'In this prototype, 95% of each contribution is set aside for advertising and 5% covers platform and payment fees. These are demo assumptions.',
      'A contribution pays for distribution of the message. It is not a donation and is not paid to the creator, person or organization in the message.',
      'If a campaign is not approved, or does not reach its goal, contributions are refunded. Unspent advertising funds are refunded or reallocated as stated on the campaign page.',
      'Reach figures are estimates based on assumed ad prices. Actual reach depends on ad inventory, targeting, delivery and performance.'
    ]
  },
  {
    key: 'partners',
    title: 'Distribution partners',
    icon: 'megaphone-outline',
    body: [
      'The platform plans to distribute approved campaigns as ads on Facebook and Instagram (Meta).',
      'This prototype does not connect to any real ad account. Delivery numbers shown in reports are demo data.',
      'Ads link back to the campaign page, where the story and sources are visible.'
    ]
  },
  {
    key: 'guidelines',
    title: 'Community guidelines',
    icon: 'shield-outline',
    body: [
      'Campaigns must be honest about who is behind them and must list the sources they rely on.',
      'Deceptive headlines, hate speech, harassment and unsupported medical claims are not allowed.',
      'A reviewer can approve a campaign, ask for changes, or decline it. Decisions are recorded.',
      'You can report a campaign you think breaks these rules.'
    ]
  },
  {
    key: 'faq',
    title: 'FAQs',
    icon: 'chatbubbles-outline',
    body: [
      'Is this a donation? No. A contribution pays for ads that spread a message. It does not go to the creator or the cause.',
      'Will my contribution reach a fixed number of people? No. We show an estimated range, not a guarantee.',
      'Do I need an account to back a campaign? No. You can back as a guest. Your name stays private by default.',
      'What happens if a campaign does not reach its goal? Contributions are refunded.',
      'Does reaching the goal start the ads right away? No. Ads start after distribution setup is complete.'
    ]
  },
  {
    key: 'about',
    title: 'About',
    icon: 'information-circle-outline',
    body: [
      'Amplify helps important messages travel beyond their creators’ existing networks, funded by the community and reviewed before they run.',
      'This is a hackathon prototype. Sample campaigns, people and figures are demo data.'
    ]
  },
  {
    key: 'contact',
    title: 'Help and contact',
    icon: 'mail-outline',
    body: [
      'For help with a campaign or a payment, include the campaign name and your payment reference.',
      'Demo contact: help@amplify.example (not a real mailbox in this prototype).'
    ]
  },
  {
    key: 'terms',
    title: 'Terms of use (demo)',
    icon: 'document-text-outline',
    body: [
      'Creators confirm that their statements and sources are truthful and not deceptive.',
      'Backers understand that contributions fund advertising distribution, not direct support of a cause.',
      'Campaigns may be changed, paused or declined by a reviewer. These terms are a demo summary, not legal text.'
    ]
  },
  {
    key: 'privacy',
    title: 'Privacy (demo)',
    icon: 'lock-closed-outline',
    body: [
      'Backer names are private by default. Payment records are kept accurate and are not shown publicly.',
      'Guest contributions do not need a profile. We ask only for what a payment needs.',
      'Ads may use broad targeting such as region and interests. Campaign pages explain the targeting used.'
    ]
  }
];
