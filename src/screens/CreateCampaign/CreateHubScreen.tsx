import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { useCampaigns } from '../../context/CampaignContext';
import { CreateCampaignScreen } from './CreateCampaignScreen';
import type { Campaign } from '../../types/campaign';

interface CreateHubProps {
  onClose: () => void;
  onCampaignCreated: (campaign: Campaign) => void;
}

// Entry point of the Create tab: two ways to start, plus resume for a saved draft.
export const CreateHubScreen: React.FC<CreateHubProps> = ({ onClose, onCampaignCreated }) => {
  const { savedDraft, clearDraft } = useCampaigns();
  const [mode, setMode] = useState<'hub' | 'manual' | 'voice'>('hub');

  if (mode !== 'hub') {
    return (
      <CreateCampaignScreen
        startWithVoice={mode === 'voice'}
        onCancel={() => setMode('hub')}
        onCampaignCreated={onCampaignCreated}
      />
    );
  }

  const hasDraft = !!savedDraft && !!(savedDraft.title || savedDraft.summary || savedDraft.creatorName);

  const startNew = (next: 'manual' | 'voice') => {
    if (!hasDraft) {
      setMode(next);
      return;
    }
    Alert.alert(
      'Replace your saved draft?',
      'Starting a new campaign will discard the draft saved on this device.',
      [
        { text: 'Keep draft', style: 'cancel' },
        {
          text: 'Start new',
          style: 'destructive',
          onPress: async () => {
            await clearDraft();
            setMode(next);
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.topRow}>
        <TouchableOpacity
          style={styles.closeBtn}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close"
        >
          <Ionicons name="close" size={22} color={colors.text} />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Start a campaign</Text>
      <Text style={styles.subtitle}>
        Five short steps: Basics, Story, Visuals, Reach and Submit. Your work saves automatically, so you can leave and come back.
      </Text>

      {hasDraft && (
        <TouchableOpacity
          style={[styles.card, styles.draftCard]}
          onPress={() => setMode('manual')}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Resume your saved draft"
        >
          <View style={styles.iconWrap}>
            <Ionicons name="document-text-outline" size={22} color={colors.primary} />
          </View>
          <View style={styles.cardText}>
            <Text style={styles.cardKicker}>Saved draft</Text>
            <Text style={styles.cardTitle} numberOfLines={2}>
              {savedDraft?.title || 'Untitled campaign'}
            </Text>
            <Text style={styles.cardBody}>Pick up where you left off.</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.card}
        onPress={() => startNew('manual')}
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityLabel="Create manually"
      >
        <View style={styles.iconWrap}>
          <Ionicons name="create-outline" size={22} color={colors.primary} />
        </View>
        <View style={styles.cardText}>
          <Text style={styles.cardTitle}>Create manually</Text>
          <Text style={styles.cardBody}>
            A guided form with tips at each step and a full preview before you submit.
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() => startNew('voice')}
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityLabel="Create with your voice"
      >
        <View style={styles.iconWrap}>
          <Ionicons name="mic-outline" size={22} color={colors.primary} />
        </View>
        <View style={styles.cardText}>
          <Text style={styles.cardTitle}>Create with your voice</Text>
          <Text style={styles.cardBody}>
            Describe your idea aloud. We turn it into a draft, and you can edit or delete anything.
          </Text>
          <Text style={styles.demoTag}>Runs in demo mode in this prototype</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
      </TouchableOpacity>

      <View style={styles.note}>
        <Ionicons name="information-circle-outline" size={18} color={colors.textSecondary} />
        <Text style={styles.noteText}>
          Backers pay for the ads that carry your message. They are not donating to you. A reviewer approves every campaign before it opens for backing.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 40 },
  topRow: { flexDirection: 'row', marginBottom: 8 },
  closeBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border
  },
  title: { fontSize: 28, lineHeight: 34, fontWeight: '700', color: colors.text, fontFamily: 'serif' },
  subtitle: { fontSize: 15, lineHeight: 22, color: colors.textSecondary, marginTop: 8, marginBottom: 20 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    marginBottom: 12,
    minHeight: 72,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border
  },
  draftCard: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryLight
  },
  cardText: { flex: 1 },
  cardKicker: { fontSize: 12, fontWeight: '600', color: colors.primary, marginBottom: 2 },
  cardTitle: { fontSize: 17, lineHeight: 23, fontWeight: '600', color: colors.text },
  cardBody: { fontSize: 14, lineHeight: 20, color: colors.textSecondary, marginTop: 2 },
  demoTag: { fontSize: 12, color: colors.amberDark, marginTop: 6, fontWeight: '600' },
  note: { flexDirection: 'row', gap: 10, marginTop: 12, paddingHorizontal: 4 },
  noteText: { flex: 1, fontSize: 13, lineHeight: 19, color: colors.textSecondary }
});
