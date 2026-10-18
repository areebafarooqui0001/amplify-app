import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { CampaignStatus } from '../../types/campaign';

interface StatusBadgeProps {
  status: CampaignStatus;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const conf = colors.status[status] || { bg: '#EDEFF1', text: '#4A5660', label: status };

  return (
    <View style={[styles.badge, { backgroundColor: conf.bg }, size === 'sm' && styles.badgeSm]}>
      <View style={[styles.dot, { backgroundColor: conf.text }]} />
      <Text style={[styles.text, { color: conf.text }, size === 'sm' && styles.textSm]}>
        {conf.label}
      </Text>
    </View>
  );
};

interface CategoryBadgeProps {
  category: string;
  size?: 'sm' | 'md';
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category, size = 'md' }) => {
  return (
    <View style={[styles.categoryBadge, size === 'sm' && styles.categoryBadgeSm]}>
      <Text style={[styles.categoryText, size === 'sm' && styles.categoryTextSm]}>
        {category}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    alignSelf: 'flex-start',
    gap: 6
  },
  badgeSm: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    gap: 4
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.2
  },
  textSm: {
    fontSize: 11
  },
  categoryBadge: {
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    alignSelf: 'flex-start'
  },
  categoryBadgeSm: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.4,
    textTransform: 'none'
  },
  categoryTextSm: {
    fontSize: 10
  }
});
