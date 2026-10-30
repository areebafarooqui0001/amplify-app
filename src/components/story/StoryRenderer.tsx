import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Linking
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { StorySection, SourceReference } from '../../types/campaign';

interface StoryRendererProps {
  story: StorySection[];
  sources: SourceReference[];
  audienceActionAdvice?: string;
}

export const StoryRenderer: React.FC<StoryRendererProps> = ({
  story,
  sources,
  audienceActionAdvice
}) => {
  const openLink = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      }
    } catch (e) {
      console.warn('Cannot open url:', url);
    }
  };

  return (
    <View style={styles.container}>
      {/* Editorial Story Body */}
      {story.map(section => {
        switch (section.type) {
          case 'heading':
            return (
              <Text key={section.id} style={styles.heading}>
                {section.content}
              </Text>
            );

          case 'paragraph':
            return (
              <Text key={section.id} style={styles.paragraph}>
                {section.content}
              </Text>
            );

          case 'quote':
            return (
              <View key={section.id} style={styles.quoteCard}>
                <View style={styles.quoteBar} />
                <View style={styles.quoteContent}>
                  <Ionicons name="chatbubbles-outline" size={18} color={colors.primary} />
                  <Text style={styles.quoteText}>&ldquo;{section.content}&rdquo;</Text>
                </View>
              </View>
            );

          case 'stat':
            return (
              <View key={section.id} style={styles.statCard}>
                <View style={styles.statPill}>
                  <Text style={styles.statValue}>{section.statValue}</Text>
                </View>
                <View style={styles.statInfo}>
                  <Text style={styles.statLabel}>{section.statLabel}</Text>
                  <Text style={styles.statContext}>{section.content}</Text>
                </View>
              </View>
            );

          case 'image':
            return (
              <View key={section.id} style={styles.imageBlock}>
                {section.imageUrl && (
                  <Image
                    source={{ uri: section.imageUrl }}
                    style={styles.inlineImage}
                    resizeMode="cover"
                  />
                )}
                {(section.caption || section.credit) && (
                  <Text style={styles.caption}>
                    {section.caption}
                    {section.caption && section.credit ? ' · ' : ''}
                    {section.credit ? `Photo: ${section.credit}` : ''}
                  </Text>
                )}
              </View>
            );

          default:
            return null;
        }
      })}

      {/* Suggested Audience Actions */}
      {audienceActionAdvice && (
        <View style={styles.actionAdviceCard}>
          <View style={styles.actionAdviceHeader}>
            <Ionicons name="bulb-outline" size={18} color={colors.purple} />
            <Text style={styles.actionAdviceTitle}>What Readers Can Do</Text>
          </View>
          <Text style={styles.actionAdviceText}>{audienceActionAdvice}</Text>
        </View>
      )}

      {/* Supporting Sources Section */}
      <View style={styles.sourcesContainer}>
        <View style={styles.sourcesHeader}>
          <Ionicons name="shield-checkmark" size={18} color={colors.accent} />
          <Text style={styles.sourcesTitle}>Sources & evidence</Text>
        </View>
        <Text style={styles.sourcesSubtitle}>
          The platform audits each cited source before approving message distribution.
        </Text>

        {sources.length === 0 ? (
          <Text style={styles.emptySources}>No external sources attached.</Text>
        ) : (
          sources.map((src, index) => (
            <TouchableOpacity
              key={src.id || index}
              style={styles.sourceItem}
              onPress={() => openLink(src.url)}
              activeOpacity={0.7}
            >
              <View style={styles.sourceNumberWrapper}>
                <Text style={styles.sourceNumber}>[{index + 1}]</Text>
              </View>
              <View style={styles.sourceTextWrapper}>
                <View style={styles.sourceTitleRow}>
                  <Text style={styles.sourceTitle} numberOfLines={1}>
                    {src.title}
                  </Text>
                </View>
                <Text style={styles.sourcePublication}>
                  {src.publication} {src.date ? `· ${src.date}` : ''}
                </Text>
                <Text style={styles.sourceUrl} numberOfLines={1}>
                  {src.url}
                </Text>
              </View>
              <Ionicons name="open-outline" size={16} color={colors.primary} />
            </TouchableOpacity>
          ))
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8
  },
  heading: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    lineHeight: 28,
    marginTop: 18,
    marginBottom: 10
  },
  paragraph: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: 14
  },
  quoteCard: {
    flexDirection: 'row',
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    padding: 14,
    marginVertical: 14,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary
  },
  quoteBar: {
    width: 0
  },
  quoteContent: {
    flex: 1,
    gap: 6
  },
  quoteText: {
    fontSize: 15,
    fontStyle: 'italic',
    color: colors.primaryDark,
    lineHeight: 22,
    fontWeight: '500'
  },
  statCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F8F9',
    borderRadius: 14,
    padding: 14,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12
  },
  statPill: {
    backgroundColor: colors.accentLight,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 70
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.accentDark
  },
  statInfo: {
    flex: 1
  },
  statLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text
  },
  statContext: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2
  },
  imageBlock: {
    marginVertical: 14
  },
  inlineImage: {
    width: '100%',
    height: 200,
    borderRadius: 12
  },
  caption: {
    fontSize: 12,
    color: colors.textMuted,
    fontStyle: 'italic',
    marginTop: 6,
    textAlign: 'center'
  },
  actionAdviceCard: {
    backgroundColor: colors.purpleLight,
    borderRadius: 12,
    padding: 14,
    marginTop: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#C9D8DE'
  },
  actionAdviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6
  },
  actionAdviceTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.purple
  },
  actionAdviceText: {
    fontSize: 13,
    color: colors.text,
    lineHeight: 20
  },
  sourcesContainer: {
    backgroundColor: '#F7F8F9',
    borderRadius: 14,
    padding: 16,
    marginTop: 18,
    borderWidth: 1,
    borderColor: colors.border
  },
  sourcesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4
  },
  sourcesTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text
  },
  sourcesSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 12,
    lineHeight: 17
  },
  emptySources: {
    fontSize: 13,
    color: colors.textMuted,
    fontStyle: 'italic'
  },
  sourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.borderLight,
    gap: 8
  },
  sourceNumberWrapper: {
    alignSelf: 'flex-start',
    marginTop: 2
  },
  sourceNumber: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textMuted
  },
  sourceTextWrapper: {
    flex: 1
  },
  sourceTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  sourceTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    flex: 1
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accentLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    gap: 3
  },
  verifiedText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.accentDark
  },
  sourcePublication: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2
  },
  sourceUrl: {
    fontSize: 11,
    color: colors.primary,
    marginTop: 2
  }
});
