# Amplify

A mobile app for community-funded message amplification. Someone with an important message but a small audience writes a campaign. A reviewer approves it. Backers then pool money that pays for the ads that carry the message to new people.

**A contribution is not a donation.** It pays for advertising distribution. It does not go to the creator, the person, or the cause described in the campaign.

Built with React Native (Expo) and TypeScript for the Humanity Founders Campaign Amplification hackathon, where it received a letter of distinction. The matching backend lives in the `amplify-api` repository.

## What you can do in the app

**Anyone, without an account**
- Browse a feed of campaigns, with a reach estimate per dollar shown as an estimate, never a guarantee
- Search Explore, filter by category and sort, with loading, empty and no-results states
- Read a campaign: story, public sources, use of funds, review process, and a short "did this change your mind?" poll
- Follow, bookmark and share a campaign

**Backers**
- Pick a preset or custom amount and see the estimated reach as a range, plus a full fee breakdown
- Contribute as a guest. Names are private by default
- Simulated checkout that shows every real outcome: success, pending, declined, failed and cancelled. A pending payment is not counted toward funding until it is confirmed
- Payment history in Profile

**Creators**
- Start from a hub: create manually, create with a voice-assisted draft (demo mode), or resume a saved draft
- Five steps in a fixed order: Basics, Story, Visuals, Reach, Submit, with autosave and clear validation
- Story composer with headings, paragraphs, quotes, statistics and images (captions and credits), editing in place, reordering, source management and a live preview
- Ad preview for Instagram and Facebook placements
- The funding goal is always set by the creator, never generated
- Full preview before submitting, then a status timeline

**Everyone**
- Activity feed with notification settings that really filter the feed, and a Following tab
- One account for every role. There are no separate logins for audience, backer and creator
- A reviewer demo screen that shows approval and the campaign lifecycle
- Help and policy pages: FAQs, fees, privacy, terms and guidelines

## Product decisions

- Reach is always shown as an estimated range from clearly labelled demo assumptions.
- Reaching the funding goal does not start ads. A campaign must pass distribution preparation first.
- Sample campaigns and figures are labelled as demo data. The app makes no verification or trust-score claims it cannot back up.
- Drafts and in-review campaigns are never shown to the public.

## Tech

- React Native with Expo, TypeScript
- Local persistence with AsyncStorage
- Image upload with type and size validation (JPG, PNG, WebP, up to 5 MB)
- A render error boundary so one broken screen never closes the app
- Builds with EAS Build (Android APK)

## Project structure

```
App.tsx                 app shell, tabs and navigation
src/
  screens/              Home, Explore, Create (hub and five steps), Activity, Profile, campaign and backing screens
  components/           cards, story renderer, shared UI
  context/              campaign, contribution and notification state
  data/                 seed campaigns and help pages
  theme/                colors and design tokens
  types/                shared TypeScript types
  lib/                  helpers such as image picking
```

## Run it

```bash
npm install
npx expo start            # add --tunnel if your network blocks local connections
```

Open it with Expo Go on a phone that supports the project's Expo SDK version.

Build an installable Android APK:

```bash
npm i -g eas-cli
eas login
eas build -p android --profile preview
```

## Current limits

- The app runs on local demo data and is not connected to a server yet. Connecting it to `amplify-api` is the next step.
- Payments are simulated and no real ad accounts are connected.
- Video ads, AI image generation, comments, and push or email notifications are not included.
- Android only for now.

## License

MIT