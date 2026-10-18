import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { Campaign } from '../types/campaign';
import { useCampaigns } from '../context/CampaignContext';
import { StatusBadge } from '../components/common/Badge';

interface AdminReviewModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectCampaign: (campaign: Campaign) => void;
}

export const AdminReviewModal: React.FC<AdminReviewModalProps> = ({
  visible,
  onClose,
  onSelectCampaign
}) => {
  const {
    campaigns,
    adminApproveCampaign,
    adminRequestChanges,
    adminRejectCampaign
  } = useCampaigns();

  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [feedbackInput, setFeedbackInput] = useState<string>('');

  const pendingCampaigns = campaigns.filter(
    c => c.status === 'under_review' || c.status === 'changes_requested'
  );

  const handleApprove = (c: Campaign) => {
    adminApproveCampaign(c.id);
    setSelectedCampaign(null);
    Alert.alert(
      'Campaign approved',
      `"${c.title}" has been approved and is now live on the Explore feed for community funding.`
    );
  };

  const handleRequestChanges = (c: Campaign) => {
    if (!feedbackInput.trim()) {
      alert('Please enter change requests or citation verification requirements.');
      return;
    }
    adminRequestChanges(c.id, feedbackInput.trim());
    setSelectedCampaign(null);
    setFeedbackInput('');
    Alert.alert('Changes Requested', 'Feedback sent to creator.');
  };

  const handleReject = (c: Campaign) => {
    adminRejectCampaign(c.id, feedbackInput.trim() || 'Violates community accuracy policies');
    setSelectedCampaign(null);
    setFeedbackInput('');
    Alert.alert('Campaign Ineligible', 'Campaign was rejected.');
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={styles.title}>Reviewer & Editorial Audit</Text>
            <Text style={styles.subtitle}>Platform Compliance Panel</Text>
          </View>
          <View style={styles.badgeCount}>
            <Text style={styles.badgeCountText}>{pendingCampaigns.length} pending</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {selectedCampaign ? (
            /* Detailed Review Inspector */
            <View style={styles.inspectorContainer}>
              <TouchableOpacity
                style={styles.backToListBtn}
                onPress={() => setSelectedCampaign(null)}
              >
                <Ionicons name="chevron-back" size={16} color={colors.primary} />
                <Text style={styles.backToListText}>Back to Review Queue</Text>
              </TouchableOpacity>

              {/* Campaign Basic Info */}
              <View style={styles.card}>
                <Image
                  source={{ uri: selectedCampaign.coverImage }}
                  style={styles.inspectImage}
                />
                <View style={styles.inspectMeta}>
                  <StatusBadge status={selectedCampaign.status} size="sm" />
                  <Text style={styles.inspectTitle}>{selectedCampaign.title}</Text>
                  <Text style={styles.inspectAuthor}>
                    By {selectedCampaign.creatorName} ({selectedCampaign.creatorOrg || 'Independent'})
                  </Text>
                  <Text style={styles.inspectSummary}>{selectedCampaign.summary}</Text>
                </View>
              </View>

              {/* Source Verification Audit */}
              <View style={styles.card}>
                <View style={styles.sectionHeaderRow}>
                  <Ionicons name="shield-checkmark" size={18} color={colors.accentDark} />
                  <Text style={styles.sectionTitle}>Cited Sources Audit ({selectedCampaign.sources.length})</Text>
                </View>
                {selectedCampaign.sources.length === 0 ? (
                  <Text style={styles.warningText}>
                    No external sources cited. Reviewer action required.
                  </Text>
                ) : (
                  selectedCampaign.sources.map((s, idx) => (
                    <View key={idx} style={styles.sourceBox}>
                      <Text style={styles.sourceTitleText}>{s.title}</Text>
                      <Text style={styles.sourcePubText}>{s.publication} · {s.url}</Text>
                    </View>
                  ))
                )}
              </View>

              {/* Proposed Ad Copy & Channels */}
              <View style={styles.card}>
                <Text style={styles.sectionTitle}>Proposed Ad Creative & Targeting</Text>
                <Text style={styles.adHeadline}>
                  Ad Headline: &ldquo;{selectedCampaign.adCreative.headline}&rdquo;
                </Text>
                <Text style={styles.adBody}>
                  Ad Description: &ldquo;{selectedCampaign.adCreative.description}&rdquo;
                </Text>
                <Text style={styles.adMeta}>
                  Target Channels: {selectedCampaign.targeting.channels.join(', ')}
                </Text>
                <Text style={styles.adMeta}>
                  Funding Goal: ${selectedCampaign.funding.goalAmount.toLocaleString()} USD
                </Text>
              </View>

              {/* Reviewer Action Form */}
              <View style={styles.card}>
                <Text style={styles.sectionTitle}>Review Decision</Text>
                <TextInput
                  style={styles.feedbackInput}
                  placeholder="Feedback notes, source clarification, or change requests..."
                  placeholderTextColor={colors.textMuted}
                  value={feedbackInput}
                  onChangeText={setFeedbackInput}
                  multiline
                  numberOfLines={3}
                />

                <View style={styles.actionButtonsRow}>
                  <TouchableOpacity
                    style={styles.approveBtn}
                    onPress={() => handleApprove(selectedCampaign)}
                  >
                    <Ionicons name="checkmark-circle" size={16} color="#FFFFFF" />
                    <Text style={styles.approveBtnText}>Approve & Go Live</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.changesBtn}
                    onPress={() => handleRequestChanges(selectedCampaign)}
                  >
                    <Ionicons name="create-outline" size={16} color={colors.amberDark} />
                    <Text style={styles.changesBtnText}>Request Changes</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.rejectBtn}
                    onPress={() => handleReject(selectedCampaign)}
                  >
                    <Ionicons name="close-circle-outline" size={16} color={colors.rose} />
                    <Text style={styles.rejectBtnText}>Reject</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ) : (
            /* Queue List */
            <View>
              <Text style={styles.queueHeading}>Submitted Campaigns Awaiting Verification</Text>
              <Text style={styles.queueSubheading}>
                Reviewers audit factual claims, cited links, and advertising targets before approving community funding.
              </Text>

              {pendingCampaigns.length === 0 ? (
                <View style={styles.emptyQueue}>
                  <Ionicons name="checkmark-done-circle-outline" size={48} color={colors.accent} />
                  <Text style={styles.emptyQueueTitle}>All submissions reviewed!</Text>
                  <Text style={styles.emptyQueueSubtitle}>
                    When new campaigns are created, they will appear here for editorial inspection.
                  </Text>
                </View>
              ) : (
                pendingCampaigns.map(c => (
                  <TouchableOpacity
                    key={c.id}
                    style={styles.queueCard}
                    onPress={() => setSelectedCampaign(c)}
                    activeOpacity={0.8}
                  >
                    <Image source={{ uri: c.coverImage }} style={styles.queueThumb} />
                    <View style={styles.queueInfo}>
                      <StatusBadge status={c.status} size="sm" />
                      <Text style={styles.queueTitle} numberOfLines={2}>{c.title}</Text>
                      <Text style={styles.queueAuthor}>By {c.creatorName}</Text>
                      <Text style={styles.queueSourcesCount}>
                        {c.sources.length} sources attached
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
                  </TouchableOpacity>
                ))
              )}
            </View>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
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
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerText: {
    flex: 1,
    marginLeft: 10
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text
  },
  subtitle: {
    fontSize: 11,
    color: colors.textSecondary
  },
  badgeCount: {
    backgroundColor: colors.amberLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12
  },
  badgeCountText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.amberDark
  },
  scrollContent: {
    padding: 16
  },
  queueHeading: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text
  },
  queueSubheading: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
    marginBottom: 16,
    lineHeight: 17
  },
  emptyQueue: {
    alignItems: 'center',
    paddingVertical: 50,
    gap: 8
  },
  emptyQueueTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text
  },
  emptyQueueSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    maxWidth: 260
  },
  queueCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 10,
    gap: 12
  },
  queueThumb: {
    width: 60,
    height: 60,
    borderRadius: 10
  },
  queueInfo: {
    flex: 1,
    gap: 3
  },
  queueTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text
  },
  queueAuthor: {
    fontSize: 11,
    color: colors.textSecondary
  },
  queueSourcesCount: {
    fontSize: 10,
    color: colors.primary,
    fontWeight: '600'
  },
  inspectorContainer: {
    gap: 14
  },
  backToListBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4
  },
  backToListText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8
  },
  inspectImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginBottom: 8
  },
  inspectMeta: {
    gap: 4
  },
  inspectTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text
  },
  inspectAuthor: {
    fontSize: 12,
    color: colors.textSecondary
  },
  inspectSummary: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
    marginTop: 4
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text
  },
  warningText: {
    fontSize: 12,
    color: colors.amberDark,
    fontWeight: '600'
  },
  sourceBox: {
    backgroundColor: colors.background,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border
  },
  sourceTitleText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text
  },
  sourcePubText: {
    fontSize: 11,
    color: colors.textSecondary
  },
  adHeadline: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text
  },
  adBody: {
    fontSize: 12,
    color: colors.textSecondary
  },
  adMeta: {
    fontSize: 11,
    color: colors.textMuted
  },
  feedbackInput: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 10,
    height: 70,
    textAlignVertical: 'top',
    fontSize: 13,
    color: colors.text
  },
  actionButtonsRow: {
    gap: 8,
    marginTop: 8
  },
  approveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent,
    paddingVertical: 12,
    borderRadius: 10,
    gap: 6
  },
  approveBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700'
  },
  changesBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.amberLight,
    paddingVertical: 12,
    borderRadius: 10,
    gap: 6
  },
  changesBtnText: {
    color: colors.amberDark,
    fontSize: 13,
    fontWeight: '700'
  },
  rejectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.roseLight,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6
  },
  rejectBtnText: {
    color: colors.rose,
    fontSize: 12,
    fontWeight: '700'
  }
});
