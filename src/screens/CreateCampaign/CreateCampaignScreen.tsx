import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  Modal,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import {
  Campaign,
  CampaignCategory,
  StorySection,
  SourceReference,
  AdCreative
} from '../../types/campaign';
import { useCampaigns } from '../../context/CampaignContext';
import { StepIndicator } from '../../components/creator/StepIndicator';
import { StoryRenderer } from '../../components/story/StoryRenderer';
import { SocialAdPreview } from '../../components/cards/SocialAdPreview';

const CATEGORIES: CampaignCategory[] = [
  'Environment',
  'Health',
  'Science',
  'Education',
  'Public Policy',
  'Economic Policy',
  'Community',
  'Arts & Culture',
  'Business',
  'Other'
];

const PRESET_IMAGES = [
  'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80'
];

const REGIONS = ['India', 'United States', 'Europe', 'Canada', 'United Kingdom', 'Latin America', 'Global English'];
const CHANNELS = ['Meta Ads (FB/IG)', 'Instagram Reels'];

interface CreateCampaignScreenProps {
  onCancel: () => void;
  onCampaignCreated: (newCampaign: Campaign) => void;
  startWithVoice?: boolean;
}

export const CreateCampaignScreen: React.FC<CreateCampaignScreenProps> = ({
  onCancel,
  onCampaignCreated,
  startWithVoice
}) => {
  const { savedDraft, saveDraft, clearDraft, submitCampaign, isDraftSavedAlertVisible } = useCampaigns();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [showVoiceModal, setShowVoiceModal] = useState<boolean>(false);
  useEffect(() => {
    if (startWithVoice) setShowVoiceModal(true);
  }, [startWithVoice]);
  const [isAiGenerating, setIsAiGenerating] = useState<boolean>(false);
  const [voicePromptInput, setVoicePromptInput] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [submittedCampaign, setSubmittedCampaign] = useState<Campaign | null>(null);

  // Form State initialized from savedDraft if available
  const [title, setTitle] = useState<string>(() => savedDraft?.title || '');
  const [category, setCategory] = useState<CampaignCategory>(() => savedDraft?.category || 'Environment');
  const [creatorName, setCreatorName] = useState<string>(() => savedDraft?.creatorName || '');
  const [creatorOrg, setCreatorOrg] = useState<string>(() => savedDraft?.creatorOrg || '');
  const [summary, setSummary] = useState<string>(() => savedDraft?.summary || '');
  const [coverImage, setCoverImage] = useState<string>(() => savedDraft?.coverImage || PRESET_IMAGES[0]);

  // Step 2: Story
  const [storySections, setStorySections] = useState<StorySection[]>(() => savedDraft?.story || []);
  const [newSectionType, setNewSectionType] = useState<'paragraph' | 'quote' | 'stat'>('paragraph');
  const [newSectionContent, setNewSectionContent] = useState<string>('');
  const [newStatValue, setNewStatValue] = useState<string>('');
  const [newStatLabel, setNewStatLabel] = useState<string>('');

  // Sources
  const [sources, setSources] = useState<SourceReference[]>(() => savedDraft?.sources || []);
  const [sourceTitle, setSourceTitle] = useState<string>('');
  const [sourcePub, setSourcePub] = useState<string>('');
  const [sourceUrl, setSourceUrl] = useState<string>('');
  const [audienceActionAdvice, setAudienceActionAdvice] = useState<string>(() => savedDraft?.audienceActionAdvice || '');
  const [showLiveStoryPreview, setShowLiveStoryPreview] = useState<boolean>(false);

  // Step 3: Visuals
  const [adHeadline, setAdHeadline] = useState<string>(() => savedDraft?.adCreative?.headline || '');
  const [adDescription, setAdDescription] = useState<string>(() => savedDraft?.adCreative?.description || '');
  const [adCta, setAdCta] = useState<AdCreative['ctaText']>(() => savedDraft?.adCreative?.ctaText || 'Learn More');

  // Step 4: Reach
  const [selectedRegions, setSelectedRegions] = useState<string[]>(() => savedDraft?.targeting?.regions || ['United States']);
  const [selectedChannels, setSelectedChannels] = useState<string[]>(() => savedDraft?.targeting?.channels || ['Meta Ads (FB/IG)']);
  const [demographics, setDemographics] = useState<string>(() => savedDraft?.targeting?.demographics || 'Adults 18-55 interested in civic policy');
  const [durationDays, setDurationDays] = useState<number>(() => savedDraft?.targeting?.durationDays || 14);

  // Step 5: Submit
  const [goalAmount, setGoalAmount] = useState<string>(() => savedDraft?.funding?.goalAmount ? savedDraft.funding.goalAmount.toString() : '');
  const [agreedToTerms, setAgreedToTerms] = useState<boolean>(false);
  const [agreedToTruthfulness, setAgreedToTruthfulness] = useState<boolean>(false);

  // Auto-save draft on step change
  const triggerSaveDraft = () => {
    saveDraft({
      title,
      category,
      creatorName,
      creatorOrg,
      summary,
      coverImage,
      story: storySections,
      sources,
      audienceActionAdvice,
      adCreative: {
        headline: adHeadline || title.slice(0, 45),
        description: adDescription || summary.slice(0, 90),
        ctaText: adCta,
        imageUrl: coverImage,
        aspectRatio: '1:1'
      },
      targeting: {
        regions: selectedRegions,
        interests: ['Community Impact', category],
        demographics,
        channels: selectedChannels,
        durationDays,
        estImpressionsPerDollar: 22,
        estimatedReachTotal: Math.round((parseFloat(goalAmount) || 0) * 0.95 * 22)
      },
      funding: {
        goalAmount: parseFloat(goalAmount) || 0,
        currentAmount: 0,
        backerCount: 0,
        currency: 'USD',
        daysRemaining: durationDays,
        platformFeePercent: 5,
        advertisingAllocationPercent: 95
      }
    });
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!title.trim()) {
        alert('Please enter a campaign title.');
        return;
      }
      if (!creatorName.trim()) {
        alert('Please provide a creator or organization name.');
        return;
      }
      // Populate defaults if empty for ad creative
      if (!adHeadline) setAdHeadline(title.slice(0, 50));
      if (!adDescription) setAdDescription(summary.slice(0, 100));
    }
    if (currentStep === 2) {
      if (storySections.length === 0) {
        alert('Add at least one story section before continuing.');
        return;
      }
      if (sources.length === 0) {
        Alert.alert(
          'No sources added',
          'Readers see your sources on the campaign page, and reviewers check them. Adding at least one builds trust.',
          [
            { text: 'Add a source', style: 'cancel' },
            {
              text: 'Continue anyway',
              onPress: () => {
                triggerSaveDraft();
                setCurrentStep(3);
              }
            }
          ]
        );
        return;
      }
    }
    if (currentStep === 4 && (selectedRegions.length === 0 || selectedChannels.length === 0)) {
      alert('Choose at least one region and one channel.');
      return;
    }
    triggerSaveDraft();
    setCurrentStep(prev => Math.min(prev + 1, 5));
  };

  const handleBack = () => {
    triggerSaveDraft();
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  // Step 2 Helpers
  const handleAddSection = () => {
    if (!newSectionContent.trim() && newSectionType !== 'stat') return;
    const newSec: StorySection = {
      id: `sec-${Date.now()}`,
      type: newSectionType,
      content: newSectionContent.trim(),
      statValue: newSectionType === 'stat' ? newStatValue : undefined,
      statLabel: newSectionType === 'stat' ? newStatLabel : undefined
    };
    setStorySections([...storySections, newSec]);
    setNewSectionContent('');
    setNewStatValue('');
    setNewStatLabel('');
  };

  const handleRemoveSection = (id: string) => {
    setStorySections(storySections.filter(s => s.id !== id));
  };

  const handleAddSource = () => {
    if (!sourceTitle.trim() || !sourceUrl.trim()) {
      alert('Source requires both a title and a valid URL.');
      return;
    }
    const newSrc: SourceReference = {
      id: `src-${Date.now()}`,
      title: sourceTitle.trim(),
      publication: sourcePub.trim() || 'Independent Publication',
      url: sourceUrl.trim(),
      verified: true
    };
    setSources([...sources, newSrc]);
    setSourceTitle('');
    setSourcePub('');
    setSourceUrl('');
  };

  const handleRemoveSource = (id: string) => {
    setSources(sources.filter(s => s.id !== id));
  };

  // AI / Voice Assistant Generator
  const handleSimulateAiGeneration = (promptTopic: string) => {
    setIsAiGenerating(true);
    setTimeout(() => {
      setIsAiGenerating(false);
      setShowVoiceModal(false);

      const topic = promptTopic.trim();
      const topicTitle = topic.charAt(0).toUpperCase() + topic.slice(1);
      setTitle(topicTitle.slice(0, 60));
      setSummary(
        `An explainer on ${topic.toLowerCase()}: what it is, who it affects, and what readers can do. Edit this so it says exactly what your message is.`
      );
      setStorySections([
        { id: `s-${Date.now()}-1`, type: 'heading', content: 'What this is about' },
        {
          id: `s-${Date.now()}-2`,
          type: 'paragraph',
          content: `Describe ${topic.toLowerCase()} in your own words: what the issue is, who it affects, and what you want readers to understand.`
        },
        { id: `s-${Date.now()}-3`, type: 'heading', content: 'What the evidence says' },
        {
          id: `s-${Date.now()}-4`,
          type: 'paragraph',
          content: 'Summarize the evidence you are relying on, and add a source below for each claim.'
        }
      ]);
      setAdHeadline(topicTitle.slice(0, 40));
      setAdDescription('Read the story and the sources behind this message.');
      setAudienceActionAdvice('Share this with someone who may find it useful.');
      Alert.alert('Draft created', 'We filled in a starting outline. Nothing is final: edit it, add your own facts and sources, and set your own creator name.');
    }, 1500);
  };

  const handleSubmitFinal = async () => {
    if (!agreedToTerms || !agreedToTruthfulness) {
      alert('Please check both compliance agreements to confirm this message meets community advertising guidelines.');
      return;
    }

    const goalNum = parseFloat(goalAmount) || 0;
    if (goalNum < 100) {
      alert('Please set your funding goal. The minimum is $100.');
      return;
    }

    setIsSubmitting(true);
    try {
      const created = await submitCampaign({
        title,
        category,
        creatorName,
        creatorOrg,
        summary,
        coverImage,
        story: storySections.length > 0 ? storySections : [
          { id: `sec-def`, type: 'paragraph', content: summary || 'Campaign editorial narrative.' }
        ],
        sources,
        audienceActionAdvice,
        adCreative: {
          headline: adHeadline || title.slice(0, 45),
          description: adDescription || summary.slice(0, 90),
          ctaText: adCta,
          imageUrl: coverImage,
          aspectRatio: '1:1'
        },
        targeting: {
          regions: selectedRegions,
          interests: ['Civic Awareness', category],
          demographics,
          channels: selectedChannels,
          durationDays,
          estImpressionsPerDollar: 22,
          estimatedReachTotal: Math.round(goalNum * 0.95 * 22)
        },
        funding: {
          goalAmount: goalNum,
          currentAmount: 0,
          backerCount: 0,
          currency: 'USD',
          daysRemaining: durationDays,
          platformFeePercent: 5,
          advertisingAllocationPercent: 95
        }
      });

      setIsSubmitting(false);
      setSubmittedCampaign(created);
      setShowSuccessModal(true);
    } catch {
      setIsSubmitting(false);
      alert('Error submitting campaign.');
    }
  };

  const handleFinish = () => {
    setShowSuccessModal(false);
    if (submittedCampaign) {
      onCampaignCreated(submittedCampaign);
    } else {
      onCancel();
    }
  };

  const estReachForGoal = Math.round((parseFloat(goalAmount) || 0) * 0.95 * 22);

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={onCancel}
        >
          <Ionicons name="close" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>New campaign</Text>
        <TouchableOpacity
          style={styles.aiBadgeBtn}
          onPress={() => setShowVoiceModal(true)}
        >
          <Ionicons name="sparkles" size={14} color={colors.purple} />
          <Text style={styles.aiBadgeText}>AI Assist</Text>
        </TouchableOpacity>
      </View>

      {/* Persistent 5-Step Indicator */}
      <StepIndicator currentStep={currentStep} />

      {/* Draft Saved Floating Toast */}
      {isDraftSavedAlertVisible && (
        <View style={styles.draftToast}>
          <Ionicons name="cloud-done-outline" size={14} color={colors.accentDark} />
          <Text style={styles.draftToastText}>Draft saved automatically</Text>
        </View>
      )}

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* ================= STEP 1: BASICS ================= */}
        {currentStep === 1 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepHeader}>Step 1: Campaign Basics</Text>
            <Text style={styles.stepSubheader}>
              Introduce your message, who it comes from, and choose an engaging cover visual.
            </Text>

            {/* Campaign Title */}
            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>Campaign Title *</Text>
                <Text style={[styles.charCount, title.length > 55 && { color: colors.rose }]}>
                  {title.length}/60
                </Text>
              </View>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. Clean Air in School Zones: Particulate Defense"
                placeholderTextColor={colors.textMuted}
                value={title}
                maxLength={60}
                onChangeText={setTitle}
              />
              <Text style={styles.fieldHint}>
                The title also serves as the default advertising headline across social feeds.
              </Text>
            </View>

            {/* Category Chips */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Category *</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chipsScroll}
              >
                {CATEGORIES.map(cat => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.categoryChip,
                      category === cat && styles.activeCategoryChip
                    ]}
                    onPress={() => setCategory(cat)}
                  >
                    <Text
                      style={[
                        styles.categoryChipText,
                        category === cat && styles.activeCategoryChipText
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Creator & Org */}
            <View style={styles.inputRow}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.label}>Creator Name *</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Your Name / Title"
                  placeholderTextColor={colors.textMuted}
                  value={creatorName}
                  onChangeText={setCreatorName}
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Organization</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Optional Org/Group"
                  placeholderTextColor={colors.textMuted}
                  value={creatorOrg}
                  onChangeText={setCreatorOrg}
                />
              </View>
            </View>

            {/* Summary */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Editorial Summary</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                placeholder="Briefly explain what this message is about and why people should care..."
                placeholderTextColor={colors.textMuted}
                value={summary}
                multiline
                numberOfLines={3}
                onChangeText={setSummary}
              />
            </View>

            {/* Cover Image Presets */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Select Cover Imagery</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.imagePresetsScroll}
              >
                {PRESET_IMAGES.map((img, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={[
                      styles.presetImgWrapper,
                      coverImage === img && styles.activePresetImgWrapper
                    ]}
                    onPress={() => setCoverImage(img)}
                  >
                    <Image source={{ uri: img }} style={styles.presetThumbnail} />
                    {coverImage === img && (
                      <View style={styles.presetCheckOverlay}>
                        <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" />
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        )}

        {/* ================= STEP 2: STORY ================= */}
        {currentStep === 2 && (
          <View style={styles.stepContainer}>
            <View style={styles.stepHeaderRow}>
              <View>
                <Text style={styles.stepHeader}>Step 2: Editorial Story & Sources</Text>
                <Text style={styles.stepSubheader}>
                  Write a clear article and cite your sources.
                </Text>
              </View>
              <TouchableOpacity
                style={styles.previewToggleBtn}
                onPress={() => setShowLiveStoryPreview(!showLiveStoryPreview)}
              >
                <Ionicons
                  name={showLiveStoryPreview ? 'eye-off-outline' : 'eye-outline'}
                  size={16}
                  color={colors.primary}
                />
                <Text style={styles.previewToggleText}>
                  {showLiveStoryPreview ? 'Edit' : 'Preview'}
                </Text>
              </TouchableOpacity>
            </View>

            {showLiveStoryPreview ? (
              <StoryRenderer
                story={storySections}
                sources={sources}
                audienceActionAdvice={audienceActionAdvice}
              />
            ) : (
              <>
                {/* Existing Sections List */}
                <Text style={styles.sectionSublabel}>
                  Story Sections ({storySections.length})
                </Text>
                {storySections.map((sec, idx) => (
                  <View key={sec.id} style={styles.sectionCard}>
                    <View style={styles.sectionCardHeader}>
                      <Text style={styles.sectionTypeTag}>{sec.type.toUpperCase()}</Text>
                      <TouchableOpacity onPress={() => handleRemoveSection(sec.id)}>
                        <Ionicons name="trash-outline" size={16} color={colors.rose} />
                      </TouchableOpacity>
                    </View>
                    {sec.type === 'stat' && (
                      <Text style={styles.statPreviewText}>
                        {sec.statValue} — {sec.statLabel}
                      </Text>
                    )}
                    <Text style={styles.sectionPreviewContent} numberOfLines={2}>
                      {sec.content}
                    </Text>
                  </View>
                ))}

                {/* Add New Story Section Form */}
                <View style={styles.addSectionBox}>
                  <Text style={styles.addSectionTitle}>Add Content Block</Text>
                  <View style={styles.typeSelectorRow}>
                    {(['paragraph', 'quote', 'stat'] as const).map(type => (
                      <TouchableOpacity
                        key={type}
                        style={[
                          styles.typeBtn,
                          newSectionType === type && styles.activeTypeBtn
                        ]}
                        onPress={() => setNewSectionType(type)}
                      >
                        <Text
                          style={[
                            styles.typeBtnText,
                            newSectionType === type && styles.activeTypeBtnText
                          ]}
                        >
                          {type}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  {newSectionType === 'stat' && (
                    <View style={styles.inputRow}>
                      <TextInput
                        style={[styles.textInput, { flex: 1, marginRight: 8 }]}
                        placeholder="Stat (e.g. 3.8x)"
                        value={newStatValue}
                        onChangeText={setNewStatValue}
                      />
                      <TextInput
                        style={[styles.textInput, { flex: 2 }]}
                        placeholder="Label (e.g. Above WHO safe limit)"
                        value={newStatLabel}
                        onChangeText={setNewStatLabel}
                      />
                    </View>
                  )}

                  <TextInput
                    style={[styles.textInput, styles.textArea, { marginTop: 8 }]}
                    placeholder={
                      newSectionType === 'quote'
                        ? 'Enter quote text...'
                        : newSectionType === 'stat'
                        ? 'Contextual details about this statistic...'
                        : 'Write paragraph text...'
                    }
                    placeholderTextColor={colors.textMuted}
                    value={newSectionContent}
                    multiline
                    numberOfLines={3}
                    onChangeText={setNewSectionContent}
                  />

                  <TouchableOpacity
                    style={styles.addBlockBtn}
                    onPress={handleAddSection}
                  >
                    <Ionicons name="add" size={16} color="#FFFFFF" />
                    <Text style={styles.addBlockBtnText}>Insert Block</Text>
                  </TouchableOpacity>
                </View>

                {/* Sources & Citations */}
                <Text style={[styles.sectionSublabel, { marginTop: 20 }]}>
                  Evidence & sources ({sources.length})
                </Text>
                <Text style={styles.fieldHint}>
                  Sources are shown publicly on the campaign page and checked during review.
                </Text>

                {sources.map(src => (
                  <View key={src.id} style={styles.sourceItem}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.sourceTitle}>{src.title}</Text>
                      <Text style={styles.sourcePublication}>{src.publication} · {src.url}</Text>
                    </View>
                    <TouchableOpacity onPress={() => handleRemoveSource(src.id)}>
                      <Ionicons name="trash-outline" size={16} color={colors.rose} />
                    </TouchableOpacity>
                  </View>
                ))}

                <View style={styles.addSourceBox}>
                  <TextInput
                    style={[styles.textInput, { marginBottom: 6 }]}
                    placeholder="Source Study or Article Title"
                    placeholderTextColor={colors.textMuted}
                    value={sourceTitle}
                    onChangeText={setSourceTitle}
                  />
                  <TextInput
                    style={[styles.textInput, { marginBottom: 6 }]}
                    placeholder="Publication (e.g. Nature, WHO, CDC)"
                    placeholderTextColor={colors.textMuted}
                    value={sourcePub}
                    onChangeText={setSourcePub}
                  />
                  <TextInput
                    style={[styles.textInput, { marginBottom: 8 }]}
                    placeholder="URL (https://...)"
                    placeholderTextColor={colors.textMuted}
                    value={sourceUrl}
                    onChangeText={setSourceUrl}
                    keyboardType="url"
                  />
                  <TouchableOpacity
                    style={styles.addSourceBtn}
                    onPress={handleAddSource}
                  >
                    <Ionicons name="shield-checkmark-outline" size={14} color={colors.primary} />
                    <Text style={styles.addSourceBtnText}>Add Citation</Text>
                  </TouchableOpacity>
                </View>

                {/* Suggested Audience Actions */}
                <View style={[styles.inputGroup, { marginTop: 18 }]}>
                  <Text style={styles.label}>Suggested Reader Action</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="e.g. Share with your local school board or petition city hall"
                    placeholderTextColor={colors.textMuted}
                    value={audienceActionAdvice}
                    onChangeText={setAudienceActionAdvice}
                  />
                </View>
              </>
            )}
          </View>
        )}

        {/* ================= STEP 3: VISUALS & AD CREATIVE ================= */}
        {currentStep === 3 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepHeader}>Step 3: Campaign & Ad Visuals</Text>
            <Text style={styles.stepSubheader}>
              Configure how your message will appear when community-backed ads run on social media.
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Social Ad Headline</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Catchy headline optimized for social feeds"
                placeholderTextColor={colors.textMuted}
                value={adHeadline}
                onChangeText={setAdHeadline}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Social Ad Body Description</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                placeholder="Ad text displayed directly in Instagram & Facebook feeds..."
                placeholderTextColor={colors.textMuted}
                value={adDescription}
                multiline
                numberOfLines={2}
                onChangeText={setAdDescription}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Call to Action Button</Text>
              <View style={styles.ctaChipsRow}>
                {(['Learn More', 'Read Report', 'Take Action', 'Support Message'] as const).map(cta => (
                  <TouchableOpacity
                    key={cta}
                    style={[
                      styles.ctaChip,
                      adCta === cta && styles.activeCtaChip
                    ]}
                    onPress={() => setAdCta(cta)}
                  >
                    <Text
                      style={[
                        styles.ctaChipText,
                        adCta === cta && styles.activeCtaChipText
                      ]}
                    >
                      {cta}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Social Ad Feed Preview */}
            <Text style={[styles.sectionSublabel, { marginTop: 16 }]}>
              Live Social Placement Preview
            </Text>
            <SocialAdPreview
              adCreative={{
                headline: adHeadline || title.slice(0, 45) || 'Community Message',
                description: adDescription || summary.slice(0, 90) || 'Help amplify this message.',
                ctaText: adCta,
                imageUrl: coverImage,
                aspectRatio: '1:1'
              }}
              creatorName={creatorName || 'Campaign Creator'}
            />
          </View>
        )}

        {/* ================= STEP 4: REACH & TARGETING ================= */}
        {currentStep === 4 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepHeader}>Step 4: Reach & Distribution Strategy</Text>
            <Text style={styles.stepSubheader}>
              Define who needs to see this message beyond your personal followers.
            </Text>

            {/* Target Regions */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Target Geographic Regions</Text>
              <View style={styles.multiSelectRow}>
                {REGIONS.map(reg => {
                  const isSelected = selectedRegions.includes(reg);
                  return (
                    <TouchableOpacity
                      key={reg}
                      style={[
                        styles.multiSelectChip,
                        isSelected && styles.activeMultiSelectChip
                      ]}
                      onPress={() => {
                        if (isSelected) {
                          setSelectedRegions(selectedRegions.filter(r => r !== reg));
                        } else {
                          setSelectedRegions([...selectedRegions, reg]);
                        }
                      }}
                    >
                      <Ionicons
                        name={isSelected ? 'checkmark' : 'add'}
                        size={14}
                        color={isSelected ? '#FFFFFF' : colors.textSecondary}
                      />
                      <Text
                        style={[
                          styles.multiSelectText,
                          isSelected && styles.activeMultiSelectText
                        ]}
                      >
                        {reg}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Channels */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Distribution Channels</Text>
              <View style={styles.multiSelectRow}>
                {CHANNELS.map(ch => {
                  const isSelected = selectedChannels.includes(ch);
                  return (
                    <TouchableOpacity
                      key={ch}
                      style={[
                        styles.multiSelectChip,
                        isSelected && styles.activeMultiSelectChip
                      ]}
                      onPress={() => {
                        if (isSelected) {
                          setSelectedChannels(selectedChannels.filter(c => c !== ch));
                        } else {
                          setSelectedChannels([...selectedChannels, ch]);
                        }
                      }}
                    >
                      <Ionicons
                        name={isSelected ? 'checkmark' : 'add'}
                        size={14}
                        color={isSelected ? '#FFFFFF' : colors.textSecondary}
                      />
                      <Text
                        style={[
                          styles.multiSelectText,
                          isSelected && styles.activeMultiSelectText
                        ]}
                      >
                        {ch}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Demographics */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Audience Interests & Demographics</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. Parents 25-50, educators, public health advocates"
                placeholderTextColor={colors.textMuted}
                value={demographics}
                onChangeText={setDemographics}
              />
            </View>

            {/* Duration */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Campaign Duration ({durationDays} days)</Text>
              <View style={styles.durationRow}>
                {[7, 14, 21, 30].map(days => (
                  <TouchableOpacity
                    key={days}
                    style={[
                      styles.durationBtn,
                      durationDays === days && styles.activeDurationBtn
                    ]}
                    onPress={() => setDurationDays(days)}
                  >
                    <Text
                      style={[
                        styles.durationBtnText,
                        durationDays === days && styles.activeDurationBtnText
                      ]}
                    >
                      {days} Days
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Dynamic Reach Preview Card */}
            <View style={styles.reachForecastCard}>
              <View style={styles.reachForecastHeader}>
                <Ionicons name="sparkles" size={16} color={colors.accentDark} />
                <Text style={styles.reachForecastTitle}>Reach Forecast</Text>
              </View>
              <Text style={styles.reachForecastNumber}>
                ~{(durationDays * 2200).toLocaleString()} to {(durationDays * 4500).toLocaleString()} Impressions
              </Text>
              <Text style={styles.reachForecastDesc}>
                Estimated impressions across {selectedChannels.length} channels in {selectedRegions.join(', ')}. Final delivery depends on market auction pricing.
              </Text>
            </View>
          </View>
        )}

        {/* ================= STEP 5: SUBMIT & GOAL ================= */}
        {currentStep === 5 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepHeader}>Step 5: Review & Funding Goal</Text>
            <Text style={styles.stepSubheader}>
              Set your target distribution budget and verify compliance before editorial review.
            </Text>

            {/* Funding Goal Input */}
            <View style={styles.fundingGoalCard}>
              <Text style={styles.fundingGoalTitle}>Set Funding Goal ($ USD) *</Text>
              <Text style={styles.fundingGoalNotice}>
                You set the funding goal at this step. It is never generated by AI.
              </Text>

              <View style={styles.goalInputRow}>
                <Text style={styles.goalDollar}>$</Text>
                <TextInput
                  style={styles.goalInput}
                  value={goalAmount}
                  onChangeText={setGoalAmount}
                  keyboardType="numeric"
                  placeholder="Enter your goal (minimum 100)"
                />
              </View>

              <View style={styles.goalReachBanner}>
                <Ionicons name="megaphone" size={16} color={colors.primary} />
                <Text style={styles.goalReachText}>
                  At ${goalAmount || 0}, this campaign could reach an estimated{' '}
                  <Text style={{ fontWeight: '800' }}>{Math.round(estReachForGoal * 0.6).toLocaleString()} to {Math.round(estReachForGoal * 1.4).toLocaleString()}</Text>{' '}
                  people. This is an estimate, not a guarantee.
                </Text>
              </View>

              {/* Fee Breakdown */}
              <View style={styles.feeBreakdown}>
                <View style={styles.feeRow}>
                  <Text style={styles.feeLabel}>95% Social Ad Spend</Text>
                  <Text style={styles.feeVal}>
                    ${((parseFloat(goalAmount) || 0) * 0.95).toFixed(2)}
                  </Text>
                </View>
                <View style={styles.feeRow}>
                  <Text style={styles.feeLabel}>5% Platform & Payment Fees</Text>
                  <Text style={styles.feeVal}>
                    ${((parseFloat(goalAmount) || 0) * 0.05).toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>

            {/* Full campaign preview */}
            <View style={styles.pvBanner}>
              <Ionicons name="eye-outline" size={16} color={colors.primary} />
              <Text style={styles.pvBannerText}>
                Preview. This is how your campaign will look. Nothing is public until a reviewer approves it.
              </Text>
            </View>

            <View style={styles.pvCard}>
              {!!coverImage && <Image source={{ uri: coverImage }} style={styles.pvCover} />}
              <View style={styles.pvBody}>
                <Text style={styles.pvKicker}>{category}</Text>
                <Text style={styles.pvTitle}>{title || 'Untitled campaign'}</Text>
                <Text style={styles.pvByline}>
                  By {creatorName || 'Creator name missing'}{creatorOrg ? `, ${creatorOrg}` : ''}
                </Text>
                {!!summary && <Text style={styles.pvSummary}>{summary}</Text>}
                <TouchableOpacity style={styles.pvEdit} onPress={() => setCurrentStep(1)}>
                  <Text style={styles.pvEditText}>Edit basics</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.pvSection}>
              <View style={styles.pvSectionHead}>
                <Text style={styles.pvSectionTitle}>Story</Text>
                <TouchableOpacity style={styles.pvEdit} onPress={() => setCurrentStep(2)}>
                  <Text style={styles.pvEditText}>Edit</Text>
                </TouchableOpacity>
              </View>
              {storySections.length === 0 ? (
                <Text style={styles.pvWarn}>No story yet. Go back and add at least one section.</Text>
              ) : (
                storySections.map(sec =>
                  sec.type === 'heading' ? (
                    <Text key={sec.id} style={styles.pvH}>{sec.content}</Text>
                  ) : sec.type === 'stat' ? (
                    <View key={sec.id} style={styles.pvStat}>
                      <Text style={styles.pvStatValue}>{sec.statValue}</Text>
                      <Text style={styles.pvStatLabel}>{sec.statLabel || sec.content}</Text>
                    </View>
                  ) : sec.type === 'image' && sec.imageUrl ? (
                    <View key={sec.id}>
                      <Image source={{ uri: sec.imageUrl }} style={styles.pvInlineImg} />
                      {!!sec.caption && <Text style={styles.pvCaption}>{sec.caption}</Text>}
                    </View>
                  ) : (
                    <Text key={sec.id} style={[styles.pvP, sec.type === 'quote' && styles.pvQuote]}>
                      {sec.content}
                    </Text>
                  )
                )
              )}
              {!!audienceActionAdvice && (
                <Text style={styles.pvAction}>What readers can do: {audienceActionAdvice}</Text>
              )}
            </View>

            <View style={styles.pvSection}>
              <View style={styles.pvSectionHead}>
                <Text style={styles.pvSectionTitle}>Sources (public)</Text>
                <TouchableOpacity style={styles.pvEdit} onPress={() => setCurrentStep(2)}>
                  <Text style={styles.pvEditText}>Edit</Text>
                </TouchableOpacity>
              </View>
              {sources.length === 0 ? (
                <Text style={styles.pvWarn}>No sources listed. Readers and reviewers will see none.</Text>
              ) : (
                sources.map(src => (
                  <View key={src.id} style={styles.pvSource}>
                    <Text style={styles.pvSourceTitle}>{src.title}</Text>
                    <Text style={styles.pvSourceMeta} numberOfLines={1}>{src.publication} · {src.url}</Text>
                  </View>
                ))
              )}
            </View>

            <View style={styles.pvSection}>
              <View style={styles.pvSectionHead}>
                <Text style={styles.pvSectionTitle}>Ad creative</Text>
                <TouchableOpacity style={styles.pvEdit} onPress={() => setCurrentStep(3)}>
                  <Text style={styles.pvEditText}>Edit</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.pvH}>{adHeadline || title.slice(0, 45) || 'No headline'}</Text>
              <Text style={styles.pvP}>{adDescription || summary.slice(0, 90) || 'No ad description'}</Text>
              <Text style={styles.pvMeta}>Button: {adCta}</Text>
            </View>

            <View style={styles.pvSection}>
              <View style={styles.pvSectionHead}>
                <Text style={styles.pvSectionTitle}>Audience and distribution</Text>
                <TouchableOpacity style={styles.pvEdit} onPress={() => setCurrentStep(4)}>
                  <Text style={styles.pvEditText}>Edit</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.pvMeta}>Regions: {selectedRegions.join(', ') || 'None selected'}</Text>
              <Text style={styles.pvMeta}>Audience: {demographics || 'Not specified'}</Text>
              <Text style={styles.pvMeta}>Channels: {selectedChannels.join(', ') || 'None selected'}</Text>
              <Text style={styles.pvMeta}>Duration: {durationDays} days</Text>
              <Text style={styles.pvNote}>
                You chose these settings. A reviewer may adjust targeting, budget split and timing before ads run.
              </Text>
            </View>

            <View style={styles.pvSection}>
              <Text style={styles.pvSectionTitle}>Funding</Text>
              <Text style={styles.pvMeta}>
                Goal: {parseFloat(goalAmount) > 0 ? `$${parseFloat(goalAmount).toLocaleString()}` : 'Not set yet'}
              </Text>
              {parseFloat(goalAmount) > 0 && (
                <Text style={styles.pvMeta}>
                  Estimated reach at goal: {Math.round(estReachForGoal * 0.6).toLocaleString()} to {Math.round(estReachForGoal * 1.4).toLocaleString()} people (estimate, not a guarantee)
                </Text>
              )}
              <Text style={styles.pvNote}>
                95% of each contribution goes to advertising and 5% covers platform and payment fees (demo figures). Contributions pay for ads, not for you or your cause. If the campaign is not approved or does not reach its goal, contributions are refunded.
              </Text>
            </View>

            {/* Compliance Checkboxes */}
            <View style={styles.complianceBox}>
              <TouchableOpacity
                style={styles.checkboxRow}
                onPress={() => setAgreedToTruthfulness(!agreedToTruthfulness)}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={agreedToTruthfulness ? 'checkbox' : 'square-outline'}
                  size={20}
                  color={colors.primary}
                />
                <Text style={styles.checkboxText}>
                  I confirm that all statements and sources cited are truthful and non-deceptive.
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.checkboxRow}
                onPress={() => setAgreedToTerms(!agreedToTerms)}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={agreedToTerms ? 'checkbox' : 'square-outline'}
                  size={20}
                  color={colors.primary}
                />
                <Text style={styles.checkboxText}>
                  I understand that contributions fund advertising distribution, not direct cash transfers.
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Bottom space */}
        <View style={{ height: 90 }} />
      </ScrollView>

      {/* Persistent Navigation Controls */}
      <View style={styles.bottomBar}>
        {currentStep > 1 ? (
          <TouchableOpacity
            style={styles.backStepBtn}
            onPress={handleBack}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={18} color={colors.text} />
            <Text style={styles.backStepBtnText}>Back</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.saveDraftBtn}
            onPress={triggerSaveDraft}
          >
            <Ionicons name="bookmark-outline" size={16} color={colors.primary} />
            <Text style={styles.saveDraftBtnText}>Save Draft</Text>
          </TouchableOpacity>
        )}

        {currentStep < 5 ? (
          <TouchableOpacity
            style={styles.nextStepBtn}
            onPress={handleNext}
            activeOpacity={0.85}
          >
            <Text style={styles.nextStepBtnText}>Continue to Step {currentStep + 1}</Text>
            <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.submitBtn, isSubmitting && styles.disabledBtn]}
            onPress={handleSubmitFinal}
            disabled={isSubmitting}
            activeOpacity={0.85}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Ionicons name="paper-plane" size={16} color="#FFFFFF" />
                <Text style={styles.submitBtnText}>Submit for Review</Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </View>

      {/* Voice / AI Generation Modal */}
      <Modal
        visible={showVoiceModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowVoiceModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.voiceSheet}>
            <View style={styles.voiceHeader}>
              <View style={styles.voiceHeaderLeft}>
                <Ionicons name="mic-outline" size={22} color={colors.purple} />
                <Text style={styles.voiceTitle}>Describe your idea</Text>
              </View>
              <TouchableOpacity onPress={() => setShowVoiceModal(false)}>
                <Ionicons name="close" size={20} color={colors.text} />
              </TouchableOpacity>
            </View>

            <Text style={styles.voiceDesc}>
              Tell us what the message is, who should hear it, and what supports it. We turn it into an editable outline. You add the facts and sources.
            </Text>

            <TextInput
              style={styles.voiceInput}
              placeholder="e.g. Clean drinking water testing in rural school districts..."
              autoFocus
              placeholderTextColor={colors.textMuted}
              value={voicePromptInput}
              onChangeText={setVoicePromptInput}
              multiline
              numberOfLines={3}
            />

            <Text style={styles.voiceDesc}>
              To speak instead of type, tap the microphone key on your keyboard. Voice drafting runs in demo mode in this prototype.
            </Text>

            <View style={styles.promptChipsRow}>
              {['Microplastics in Municipal Tap Water', 'AI Literacy in Public High Schools', 'Open Medical Research'].map(prompt => (
                <TouchableOpacity
                  key={prompt}
                  style={styles.promptChip}
                  onPress={() => setVoicePromptInput(prompt)}
                >
                  <Text style={styles.promptChipText}>{prompt}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.generateDraftBtn}
              onPress={() => handleSimulateAiGeneration(voicePromptInput || 'Public Health in Community Waters')}
              disabled={isAiGenerating}
            >
              {isAiGenerating ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons name="sparkles" size={16} color="#FFFFFF" />
                  <Text style={styles.generateDraftBtnText}>Generate Editable Draft</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Submission Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.successCard}>
            <View style={styles.successIconBubble}>
              <Ionicons name="checkmark-circle" size={48} color={colors.accent} />
            </View>

            <Text style={styles.successModalTitle}>Submitted for review</Text>
            <Text style={styles.successModalSub}>
              &ldquo;{submittedCampaign?.title}&rdquo; is now in the review queue. A reviewer checks your sources and ad content before it opens for backing.
            </Text>

            {/* Review Timeline */}
            <View style={styles.timelineBox}>
              <View style={styles.timelineItem}>
                <Ionicons name="checkmark-circle" size={18} color={colors.accent} />
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineTitle}>Draft Submitted</Text>
                  <Text style={styles.timelineDesc}>Received and queued for review</Text>
                </View>
              </View>

              <View style={styles.timelineItem}>
                <Ionicons name="time" size={18} color={colors.amberDark} />
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineTitle}>Review</Text>
                  <Text style={styles.timelineDesc}>A reviewer checks sources, visuals and targeting (demo: about 1 to 2 days)</Text>
                </View>
              </View>

              <View style={styles.timelineItem}>
                <Ionicons name="radio-button-off" size={18} color={colors.textMuted} />
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineTitle}>Open for backing</Text>
                  <Text style={styles.timelineDesc}>People can contribute toward promoting your message</Text>
                </View>
              </View>

              <View style={styles.timelineItem}>
                <Ionicons name="radio-button-off" size={18} color={colors.textMuted} />
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineTitle}>Distribution setup, then promotion</Text>
                  <Text style={styles.timelineDesc}>Ads start only after funding closes and setup is complete</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={styles.successDoneBtn}
              onPress={handleFinish}
            >
              <Text style={styles.successDoneBtnText}>View my campaign</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  pvBanner: { flexDirection: 'row', gap: 8, alignItems: 'flex-start', padding: 12, borderRadius: 12, backgroundColor: colors.primaryLight, marginBottom: 12 },
  pvBannerText: { flex: 1, fontSize: 13, lineHeight: 18, color: colors.primaryDark },
  pvCard: { borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, marginBottom: 12 },
  pvCover: { width: '100%', height: 170 },
  pvBody: { padding: 16 },
  pvKicker: { fontSize: 12, fontWeight: '600', color: colors.primary, marginBottom: 4 },
  pvTitle: { fontSize: 22, lineHeight: 28, fontWeight: '700', color: colors.text, fontFamily: 'serif' },
  pvByline: { fontSize: 13, color: colors.textSecondary, marginTop: 4 },
  pvSummary: { fontSize: 15, lineHeight: 22, color: colors.text, marginTop: 10 },
  pvSection: { padding: 16, borderRadius: 16, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, marginBottom: 12, gap: 8 },
  pvSectionHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  pvSectionTitle: { fontSize: 15, fontWeight: '700', color: colors.text },
  pvEdit: { minHeight: 36, paddingHorizontal: 10, justifyContent: 'center', alignSelf: 'flex-start' },
  pvEditText: { fontSize: 13, fontWeight: '600', color: colors.primary },
  pvH: { fontSize: 17, lineHeight: 24, fontWeight: '700', color: colors.text, fontFamily: 'serif', marginTop: 4 },
  pvP: { fontSize: 16, lineHeight: 25, color: colors.text, fontFamily: 'serif' },
  pvQuote: { fontStyle: 'italic', color: colors.textSecondary },
  pvStat: { paddingVertical: 8, paddingLeft: 12, borderLeftWidth: 3, borderLeftColor: colors.primary },
  pvStatValue: { fontSize: 24, fontWeight: '700', color: colors.primary },
  pvStatLabel: { fontSize: 13, color: colors.textSecondary },
  pvInlineImg: { width: '100%', height: 160, borderRadius: 12 },
  pvCaption: { fontSize: 12, color: colors.textSecondary, marginTop: 4 },
  pvAction: { fontSize: 14, lineHeight: 20, color: colors.text, marginTop: 6 },
  pvSource: { paddingVertical: 6 },
  pvSourceTitle: { fontSize: 14, fontWeight: '600', color: colors.text },
  pvSourceMeta: { fontSize: 12, color: colors.textSecondary },
  pvMeta: { fontSize: 14, lineHeight: 20, color: colors.text },
  pvNote: { fontSize: 12, lineHeight: 18, color: colors.textSecondary, marginTop: 4 },
  pvWarn: { fontSize: 13, lineHeight: 18, color: colors.amberDark },
  container: {
    flex: 1,
    backgroundColor: colors.surface
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 54,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  cancelBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center'
  },
  topBarTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text
  },
  aiBadgeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.purpleLight,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    gap: 4
  },
  aiBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.purple
  },
  draftToast: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accentLight,
    paddingVertical: 6,
    gap: 6
  },
  draftToastText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.accentDark
  },
  scrollContent: {
    padding: 16
  },
  stepContainer: {
    gap: 16
  },
  stepHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4
  },
  stepHeader: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text
  },
  stepSubheader: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
    marginTop: 2
  },
  previewToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4
  },
  previewToggleText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary
  },
  inputGroup: {
    gap: 6
  },
  inputRow: {
    flexDirection: 'row'
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text
  },
  charCount: {
    fontSize: 11,
    color: colors.textMuted
  },
  textInput: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
    fontSize: 14,
    color: colors.text
  },
  textArea: {
    height: 80,
    paddingTop: 10,
    textAlignVertical: 'top'
  },
  fieldHint: {
    fontSize: 11,
    color: colors.textMuted,
    lineHeight: 15
  },
  chipsScroll: {
    gap: 8,
    paddingVertical: 4
  },
  categoryChip: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20
  },
  activeCategoryChip: {
    backgroundColor: colors.primary,
    borderColor: colors.primary
  },
  categoryChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary
  },
  activeCategoryChipText: {
    color: '#FFFFFF'
  },
  imagePresetsScroll: {
    gap: 10,
    paddingVertical: 4
  },
  presetImgWrapper: {
    width: 80,
    height: 60,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent'
  },
  activePresetImgWrapper: {
    borderColor: colors.primary
  },
  presetThumbnail: {
    width: '100%',
    height: '100%'
  },
  presetCheckOverlay: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 10
  },
  sectionSublabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6
  },
  sectionCard: {
    backgroundColor: colors.background,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 8
  },
  sectionCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4
  },
  sectionTypeTag: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 0.5
  },
  statPreviewText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.accentDark,
    marginBottom: 2
  },
  sectionPreviewContent: {
    fontSize: 12,
    color: colors.textSecondary
  },
  addSectionBox: {
    backgroundColor: '#F7F8F9',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 8
  },
  addSectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8
  },
  typeSelectorRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10
  },
  typeBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border
  },
  activeTypeBtn: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary
  },
  typeBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'capitalize'
  },
  activeTypeBtnText: {
    color: colors.primary
  },
  addBlockBtn: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: 8,
    marginTop: 10,
    gap: 6
  },
  addBlockBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700'
  },
  sourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 10,
    borderRadius: 8,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: colors.border
  },
  sourceTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text
  },
  sourcePublication: {
    fontSize: 10,
    color: colors.textSecondary
  },
  addSourceBox: {
    backgroundColor: '#F7F8F9',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 8
  },
  addSourceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.primary,
    gap: 6
  },
  addSourceBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary
  },
  ctaChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  ctaChip: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8
  },
  activeCtaChip: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight
  },
  ctaChipText: {
    fontSize: 12,
    color: colors.textSecondary
  },
  activeCtaChipText: {
    color: colors.primary,
    fontWeight: '700'
  },
  multiSelectRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  multiSelectChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4
  },
  activeMultiSelectChip: {
    backgroundColor: colors.primary,
    borderColor: colors.primary
  },
  multiSelectText: {
    fontSize: 12,
    color: colors.textSecondary
  },
  activeMultiSelectText: {
    color: '#FFFFFF',
    fontWeight: '600'
  },
  durationRow: {
    flexDirection: 'row',
    gap: 8
  },
  durationBtn: {
    flex: 1,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center'
  },
  activeDurationBtn: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary
  },
  durationBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary
  },
  activeDurationBtnText: {
    color: colors.primary,
    fontWeight: '700'
  },
  reachForecastCard: {
    backgroundColor: colors.accentLight,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#BFDCCD',
    marginTop: 8
  },
  reachForecastHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  reachForecastTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.accentDark,
    textTransform: 'none'
  },
  reachForecastNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.accentDark,
    marginVertical: 4
  },
  reachForecastDesc: {
    fontSize: 11,
    color: colors.accentDark,
    lineHeight: 16
  },
  fundingGoalCard: {
    backgroundColor: '#F7F8F9',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border
  },
  fundingGoalTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text
  },
  fundingGoalNotice: {
    fontSize: 11,
    color: colors.amberDark,
    marginVertical: 4,
    fontWeight: '600'
  },
  goalInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    marginVertical: 8
  },
  goalDollar: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textSecondary,
    marginRight: 6
  },
  goalInput: {
    flex: 1,
    height: 48,
    fontSize: 18,
    fontWeight: '700',
    color: colors.text
  },
  goalReachBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    padding: 10,
    borderRadius: 8,
    gap: 8,
    marginVertical: 6
  },
  goalReachText: {
    flex: 1,
    fontSize: 12,
    color: colors.primaryDark,
    lineHeight: 16
  },
  feeBreakdown: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 8,
    gap: 4
  },
  feeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  feeLabel: {
    fontSize: 12,
    color: colors.textSecondary
  },
  feeVal: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text
  },
  reviewSummaryBox: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 6
  },
  reviewSummaryTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  summaryLabel: {
    fontSize: 12,
    color: colors.textSecondary
  },
  summaryValue: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
    textAlign: 'right'
  },
  complianceBox: {
    gap: 10,
    marginTop: 8
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8
  },
  checkboxText: {
    flex: 1,
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18
  },
  bottomBar: {
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
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 4
  },
  backStepBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 4
  },
  backStepBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text
  },
  saveDraftBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: colors.primaryLight,
    gap: 4
  },
  saveDraftBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary
  },
  nextStepBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 10,
    gap: 6
  },
  nextStepBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF'
  },
  submitBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent,
    paddingVertical: 12,
    borderRadius: 10,
    gap: 6
  },
  disabledBtn: {
    opacity: 0.6
  },
  submitBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF'
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'flex-end'
  },
  voiceSheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    gap: 12
  },
  voiceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  voiceHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  voiceTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text
  },
  voiceDesc: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18
  },
  voiceInput: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    height: 70,
    textAlignVertical: 'top',
    color: colors.text
  },
  promptChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6
  },
  promptChip: {
    backgroundColor: colors.purpleLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6
  },
  promptChipText: {
    fontSize: 11,
    color: colors.purple,
    fontWeight: '500'
  },
  generateDraftBtn: {
    backgroundColor: colors.purple,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 6,
    marginTop: 4
  },
  generateDraftBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700'
  },
  successCard: {
    backgroundColor: colors.surface,
    margin: 20,
    borderRadius: 20,
    padding: 22,
    alignItems: 'center',
    alignSelf: 'center',
    width: '90%'
  },
  successIconBubble: {
    marginBottom: 8
  },
  successModalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 6,
    textAlign: 'center'
  },
  successModalSub: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16
  },
  timelineBox: {
    width: '100%',
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16
  },
  timelineItem: {
    flexDirection: 'row',
    gap: 10
  },
  timelineContent: {
    flex: 1
  },
  timelineTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text
  },
  timelineDesc: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1
  },
  successDoneBtn: {
    backgroundColor: colors.primary,
    width: '100%',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center'
  },
  successDoneBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF'
  }
});
