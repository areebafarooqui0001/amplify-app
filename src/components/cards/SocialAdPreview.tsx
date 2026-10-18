import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { AdCreative } from '../../types/campaign';

interface SocialAdPreviewProps {
  adCreative: AdCreative;
  creatorName: string;
}

export const SocialAdPreview: React.FC<SocialAdPreviewProps> = ({
  adCreative,
  creatorName
}) => {
  const [platform, setPlatform] = useState<'instagram' | 'facebook'>('instagram');

  return (
    <View style={styles.container}>
      {/* Platform Selector Tabs */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tab, platform === 'instagram' && styles.activeTab]}
          onPress={() => setPlatform('instagram')}
          activeOpacity={0.8}
        >
          <Ionicons
            name="logo-instagram"
            size={16}
            color={platform === 'instagram' ? colors.primary : colors.textSecondary}
          />
          <Text
            style={[
              styles.tabText,
              platform === 'instagram' && styles.activeTabText
            ]}
          >
            Instagram Feed
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, platform === 'facebook' && styles.activeTab]}
          onPress={() => setPlatform('facebook')}
          activeOpacity={0.8}
        >
          <Ionicons
            name="logo-facebook"
            size={16}
            color={platform === 'facebook' ? colors.primary : colors.textSecondary}
          />
          <Text
            style={[
              styles.tabText,
              platform === 'facebook' && styles.activeTabText
            ]}
          >
            Facebook Mobile
          </Text>
        </TouchableOpacity>
      </View>

      {/* Simulated Social Ad Card */}
      <View style={styles.adCard}>
        {/* Ad Header */}
        <View style={styles.adHeader}>
          <View style={styles.sponsorAvatar}>
            <Ionicons name="megaphone" size={14} color="#FFFFFF" />
          </View>
          <View style={styles.headerText}>
            <View style={styles.nameRow}>
              <Text style={styles.sponsorName}>Amplify Community</Text>
            </View>
            <Text style={styles.sponsoredTag}>
              Sponsored · Message by {creatorName}
            </Text>
          </View>
          <Ionicons name="ellipsis-horizontal" size={18} color={colors.textSecondary} />
        </View>

        {/* Ad Creative Image */}
        <View style={styles.adImageWrapper}>
          <Image
            source={{ uri: adCreative.imageUrl }}
            style={styles.adImage}
            resizeMode="cover"
          />
          <View style={styles.amplifiedBadge}>
            <Ionicons name="sparkles" size={11} color="#FFFFFF" />
            <Text style={styles.amplifiedBadgeText}>Community Amplified</Text>
          </View>
        </View>

        {/* Ad Call to Action Bar */}
        <View style={styles.ctaBar}>
          <View style={styles.ctaTextContainer}>
            <Text style={styles.adHeadline} numberOfLines={1}>
              {adCreative.headline}
            </Text>
            <Text style={styles.domainText}>amplify-campaigns.org</Text>
          </View>
          <View style={styles.ctaButton}>
            <Text style={styles.ctaButtonText}>{adCreative.ctaText}</Text>
          </View>
        </View>

        {/* Caption */}
        <View style={styles.captionContainer}>
          <Text style={styles.caption}>
            <Text style={styles.captionBold}>Amplify Community </Text>
            {adCreative.description}
          </Text>
        </View>
      </View>

      <Text style={styles.disclaimerText}>
        * Live preview of community-funded ad placement across Meta inventory.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: 10,
    padding: 3,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6
  },
  activeTab: {
    backgroundColor: colors.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1
  },
  tabText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary
  },
  activeTabText: {
    fontWeight: '700',
    color: colors.primary
  },
  adCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2
  },
  adHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    gap: 8
  },
  sponsorAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerText: {
    flex: 1
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  sponsorName: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text
  },
  sponsoredTag: {
    fontSize: 10,
    color: colors.textSecondary
  },
  adImageWrapper: {
    height: 220,
    width: '100%',
    position: 'relative'
  },
  adImage: {
    width: '100%',
    height: '100%'
  },
  amplifiedBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4
  },
  amplifiedBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600'
  },
  ctaBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#F7F8F9',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.borderLight
  },
  ctaTextContainer: {
    flex: 1,
    marginRight: 8
  },
  adHeadline: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text
  },
  domainText: {
    fontSize: 10,
    color: colors.textMuted
  },
  ctaButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 6
  },
  ctaButtonText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF'
  },
  captionContainer: {
    padding: 10
  },
  caption: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16
  },
  captionBold: {
    fontWeight: '700',
    color: colors.text
  },
  disclaimerText: {
    fontSize: 11,
    color: colors.textMuted,
    fontStyle: 'italic',
    marginTop: 6,
    textAlign: 'center'
  }
});
