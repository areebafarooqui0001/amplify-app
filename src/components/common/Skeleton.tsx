import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { colors } from '../../theme/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: object;
}

export const SkeletonBlock: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 16,
  borderRadius = 8,
  style
}) => {
  const [shimmerAnim] = useState(() => new Animated.Value(0));

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [shimmerAnim]);

  const opacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={[
        {
          width: width as number,
          height,
          borderRadius,
          backgroundColor: colors.border,
          opacity,
        },
        style,
      ]}
    />
  );
};

/**
 * Skeleton placeholder for a campaign card. Mimics the layout of CampaignCard.
 */
export const CampaignCardSkeleton: React.FC = () => {
  return (
    <View style={skeletonStyles.card}>
      {/* Image placeholder */}
      <SkeletonBlock width="100%" height={190} borderRadius={0} />

      <View style={skeletonStyles.content}>
        {/* Creator row */}
        <View style={skeletonStyles.creatorRow}>
          <SkeletonBlock width={26} height={26} borderRadius={13} />
          <View style={{ flex: 1, marginLeft: 8 }}>
            <SkeletonBlock width="50%" height={12} />
            <SkeletonBlock width="30%" height={10} style={{ marginTop: 4 }} />
          </View>
        </View>

        {/* Title */}
        <SkeletonBlock width="90%" height={18} style={{ marginTop: 10 }} />
        <SkeletonBlock width="70%" height={18} style={{ marginTop: 6 }} />

        {/* Summary */}
        <SkeletonBlock width="100%" height={12} style={{ marginTop: 10 }} />
        <SkeletonBlock width="85%" height={12} style={{ marginTop: 4 }} />

        {/* Reach banner */}
        <SkeletonBlock width="100%" height={44} borderRadius={10} style={{ marginTop: 12 }} />

        {/* Progress bar */}
        <View style={skeletonStyles.progressRow}>
          <SkeletonBlock width="55%" height={14} />
          <SkeletonBlock width={32} height={14} />
        </View>
        <SkeletonBlock width="100%" height={7} borderRadius={4} style={{ marginTop: 6 }} />

        {/* Meta row */}
        <View style={skeletonStyles.metaRow}>
          <SkeletonBlock width={80} height={12} />
          <SkeletonBlock width={70} height={12} />
        </View>

        {/* Action buttons */}
        <View style={skeletonStyles.actionRow}>
          <SkeletonBlock width="45%" height={38} borderRadius={10} />
          <SkeletonBlock width="52%" height={38} borderRadius={10} />
        </View>
      </View>
    </View>
  );
};

/**
 * Full-screen loading state with multiple skeleton cards.
 */
export const CampaignFeedSkeleton: React.FC<{ count?: number }> = ({ count = 2 }) => {
  return (
    <View>
      {Array.from({ length: count }).map((_, i) => (
        <CampaignCardSkeleton key={i} />
      ))}
    </View>
  );
};

/**
 * Skeleton for the Home screen hero section.
 */
export const HeroSkeleton: React.FC = () => {
  return (
    <View style={skeletonStyles.heroContainer}>
      <SkeletonBlock width={160} height={24} style={{ marginBottom: 8 }} />
      <SkeletonBlock width="90%" height={28} style={{ marginBottom: 6 }} />
      <SkeletonBlock width="70%" height={28} style={{ marginBottom: 12 }} />
      <SkeletonBlock width="100%" height={14} style={{ marginBottom: 4 }} />
      <SkeletonBlock width="85%" height={14} style={{ marginBottom: 16 }} />
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <SkeletonBlock width="55%" height={46} borderRadius={12} />
        <SkeletonBlock width="40%" height={46} borderRadius={12} />
      </View>
    </View>
  );
};

const skeletonStyles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    marginHorizontal: 16,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  content: {
    padding: 16,
  },
  creatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  heroContainer: {
    padding: 20,
    backgroundColor: colors.surface,
  },
});
