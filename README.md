# Amplify — Community-Funded Campaign Amplification Platform

A modern, mobile-first React Native prototype built for the **Campaign Amplification Hackathon**.

The **Amplify Platform** empowers creators, researchers, nonprofits, and citizens to amplify vital messages beyond their existing social feeds. Backers pool micro-contributions toward digital advertising inventory (Meta, Instagram, TikTok, and partner networks) rather than donating directly to individuals or organizations.

---

## 🌟 Key Highlights & Core Flows

### 1. 🏠 Home Screen
- **Hero Promise:** "Deliver messages beyond your feed" explaining community-funded reach.
- **Interactive Reach Calculator:** Configurable demo model demonstrating audience reach per dollar (e.g. $25 funds ~520 impressions across Meta & Instagram).
- **How It Works Flow:** Clear 3-step sequence (**Create → Review → Amplify**) reinforcing the distinction from traditional charitable donation platforms.
- **Platform Impact Statistics:** Live impact numbers (1.2M+ Audience Reached, $142K Ad Spend Deployed, 98.4% Source Accuracy).
- **Active Campaign Feed:** High-priority, active campaigns with funding status, reach meters, and one-tap backing.

### 2. 🔎 Explore & Discovery
- **Live Search Bar:** Real-time query matching across titles, editorial summaries, creators, and categories.
- **10 Core Categories:** Environment, Health, Science, Education, Public Policy, Economic Policy, Community, Arts & Culture, Business, and Other.
- **Dynamic Sorting:** Most Backed, Goal Progress %, Top Reach, and Newly Added.
- **Status Filters:** All Status, Funding Active, and Promoting Live.
- **Defensive UI States:** Rich loading, empty states, and no-results fallback with instant reset.

### 3. ✍️ 5-Step Campaign Creation Wizard
Strictly conforms to the requested 5-step order with a persistent top progress indicator and automatic AsyncStorage draft persistence:
- **Step 1 — Basics:** Title (with 60-character limit counter), category selection, creator/organization, editorial summary, and cover imagery presets.
- **Step 2 — Story & Sources:** Editorial article composer with paragraph blocks, pull-quotes, and highlight statistics (e.g., `3.8x PM2.5 spike`). Source citation manager ensuring sources remain visible on the public campaign page. Live preview toggle.
- **Step 3 — Campaign & Ad Visuals:** Social ad headline, body copy, CTA button choices, and live interactive Instagram & Facebook mobile feed card preview.
- **Step 4 — Reach & Targeting:** Geographic target regions, audience demographics/interests, social distribution channels, duration selector, and dynamic reach forecast engine.
- **Step 5 — Submit & Funding Goal:** Complete review summary. **The creator sets the funding goal at this stage** (not auto-set by AI). Transparent 95/5 fee policy (95% ad spend, 5% processing/auditing), truthfulness compliance agreements, and submission timeline.
- **🎙️ AI & Voice Draft Assistant:** Simulate describing a topic via voice/prompt to populate editable drafts without locking fields.

### 4. 📄 Campaign Detail Screen
- **Editorial Layout:** High readability, pull-quotes, contextually embedded statistics, and verified citation cards with direct links.
- **Social Ad Preview Tab:** Shows readers how the campaign message looks when amplified on Instagram & Facebook.
- **Targeting Plan Tab:** Transparent breakdown of selected geographies, demographics, and channels.
- **Expandable Use of Funds:** Explains the 95% advertising allocation, 5% platform fee, and refund policies for unreached goals.
- **Community Sentiment Poll:** "Did this message change your perspective?" with interactive voting (Yes / Somewhat / No) and live vote counts.
- **Sticky Backing Bar:** Accessible backing footer with real-time progress and reach estimate.

### 5. 💳 Back a Campaign Flow
- **Preset Tiers:** $15, $35, $75, $150, or custom amount.
- **Dynamic Reach Feedback:** Live calculation of people reached based on the exact amount.
- **Transparent Fee Breakdown:** Clearly separates net ad spend (95%) from processing fees (5%).
- **Non-Donation Disclaimer:** Explicit reminder that contributions fund advertising distribution, not personal gifts.
- **Simulated 1-Tap Checkout:** Apple Pay, Google Pay, and Credit Card options with anonymous guest contribution support.
- **Instant Receipt & Confirmation:** Generates a verifiable receipt ID, adds to backed history, and updates campaign funding in real time.

### 6. 📊 Creator Dashboard & Real-Time Analytics
- **Live Performance Metrics:** Impressions delivered, unique reach, ad spend deployed vs budget, and link clicks / CTR (e.g. 6.78%).
- **Platform Distribution Breakdown:** Instagram Stories & Feed (55%), Facebook Mobile (35%), Partner Network (10%).
- **Daily Audience Delivery Chart:** Weekly delivery visualization.
- **Distribution Report:** Shareable / exportable verified impact report.

### 7. 🔔 Activity & Notifications Center
- **Real-Time Event Feed:** Campaign approved, funding milestones (85% reached), new contributions, and live ad promotion launches.
- **Filter Tabs:** All, Milestones, Ads Live, and Backed.
- **Notification Preferences:** Toggles for milestone push alerts, weekly delivery reports, and backer updates.

### 8. 👤 Profile & Multi-Role Switching
- **Role Switcher:** Demonstrates Audience, Creator, Backer, and Administrator personas in a single account.
- **Impact Stats:** Total campaigns backed, audience reach generated, and bookmarked stories.
- **Admin Review Panel:** Hackathon judges can inspect pending campaigns, audit cited sources, and approve campaigns to immediately move them live onto the Explore feed.

---

## 🛠️ Tech Stack & Architecture

- **Framework:** React Native with Expo SDK 58.0.0
- **Language:** TypeScript 6.0
- **State Management:** React Context (`CampaignContext`) with `@react-native-async-storage/async-storage` for persistence.
- **Styling & UX:** Mobile-first design system with restrained colors, accessible contrast, safe-area adaptation, and haptic feedback.
- **Icons:** `@expo/vector-icons` (Ionicons)
- **Status:**
  - `npx expo-doctor`: **20/20 checks passed**
  - `npx tsc --noEmit`: **0 errors**
  - `npx eslint . --quiet`: **0 errors**

---

## 🚀 How to Run Locally

### Start Development Server
```bash
npx expo start
```
- Press `w` to open in Web browser.
- Press `a` to run on connected Android device/emulator.
- Press `i` to run on iOS Simulator (macOS).
- Scan the QR code with the **Expo Go** app on your phone.

### Run Verification Checks
```bash
npx tsc --noEmit     # Type check
npx eslint . --quiet # Lint check
npx expo-doctor      # System health check
```

---

## 📦 Building the Android APK (for Hackathon Submission)

To build a standalone installable APK via EAS Build (cloud):
```bash
# 1. Install EAS CLI if needed
npm install -g eas-cli

# 2. Login to your Expo account
eas login

# 3. Configure build profile for APK preview in eas.json
eas build --profile preview --platform android
```
The resulting `.apk` link can be directly downloaded and installed on any Android phone.
