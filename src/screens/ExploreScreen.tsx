import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { CampaignFeedSkeleton } from '../components/common/Skeleton';
import { Campaign, CampaignCategory } from '../types/campaign';
import { useCampaigns } from '../context/CampaignContext';
import { CampaignCard } from '../components/cards/CampaignCard';

interface ExploreScreenProps {
  onSelectCampaign: (campaign: Campaign) => void;
  onOpenBackModal: (campaign: Campaign) => void;
}

const CATEGORIES: ('All' | CampaignCategory)[] = [
  'All',
  'Environment',
  'Health',
  'Science',
  'Education',
  'Public Policy',
  'Economic Policy',
  'Community',
  'Arts & Culture',
  'Business'
];

type SortOption = 'trending' | 'progress' | 'reach' | 'recent';

export const ExploreScreen: React.FC<ExploreScreenProps> = ({
  onSelectCampaign,
  onOpenBackModal
}) => {
  const { campaigns, bookmarkedCampaignIds, toggleBookmark } = useCampaigns();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 700);
    return () => clearTimeout(t);
  }, []);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | CampaignCategory>('All');
  const [selectedSort, setSelectedSort] = useState<SortOption>('trending');
  const [statusFilter, setStatusFilter] = useState<'all' | 'funding' | 'promoting'>('all');

  const filteredCampaigns = useMemo(() => {
    return campaigns
      .filter(c => {
        // Exclude internal drafts unless under review / published
        if (c.status === 'draft') return false;

        // Search match
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = c.title.toLowerCase().includes(q);
          const matchSummary = c.summary.toLowerCase().includes(q);
          const matchCreator = c.creatorName.toLowerCase().includes(q);
          const matchCategory = c.category.toLowerCase().includes(q);
          if (!matchTitle && !matchSummary && !matchCreator && !matchCategory) {
            return false;
          }
        }

        // Category match
        if (selectedCategory !== 'All' && c.category !== selectedCategory) {
          return false;
        }

        // Status match
        if (statusFilter !== 'all') {
          if (c.status !== statusFilter) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (selectedSort === 'trending') {
          return b.funding.backerCount - a.funding.backerCount;
        }
        if (selectedSort === 'progress') {
          const ratioA = a.funding.currentAmount / a.funding.goalAmount;
          const ratioB = b.funding.currentAmount / b.funding.goalAmount;
          return ratioB - ratioA;
        }
        if (selectedSort === 'reach') {
          return b.targeting.estimatedReachTotal - a.targeting.estimatedReachTotal;
        }
        if (selectedSort === 'recent') {
          return (b.createdAt || '').localeCompare(a.createdAt || '');
        }
        return 0;
      });
  }, [campaigns, searchQuery, selectedCategory, selectedSort, statusFilter]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedSort('trending');
    setStatusFilter('all');
  };

  return (
    <View style={styles.container}>
      {/* Search Header */}
      <View style={styles.header}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search campaigns, causes, or researchers..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Category Pills Carousel */}
      <View style={styles.categoryContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryChip,
                selectedCategory === cat && styles.activeCategoryChip
              ]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === cat && styles.activeCategoryText
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Filter and Sort Sub-bar */}
      <View style={styles.filterBar}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {/* Status filters */}
          <TouchableOpacity
            style={[
              styles.filterPill,
              statusFilter === 'all' && styles.activeFilterPill
            ]}
            onPress={() => setStatusFilter('all')}
          >
            <Text
              style={[
                styles.filterPillText,
                statusFilter === 'all' && styles.activeFilterPillText
              ]}
            >
              All Status
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterPill,
              statusFilter === 'funding' && styles.activeFilterPill
            ]}
            onPress={() => setStatusFilter('funding')}
          >
            <Text
              style={[
                styles.filterPillText,
                statusFilter === 'funding' && styles.activeFilterPillText
              ]}
            >
              Funding Active
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterPill,
              statusFilter === 'promoting' && styles.activeFilterPill
            ]}
            onPress={() => setStatusFilter('promoting')}
          >
            <Text
              style={[
                styles.filterPillText,
                statusFilter === 'promoting' && styles.activeFilterPillText
              ]}
            >
              Promoting
            </Text>
          </TouchableOpacity>

          <View style={styles.filterDivider} />

          {/* Sort pills */}
          <TouchableOpacity
            style={[
              styles.sortPill,
              selectedSort === 'trending' && styles.activeSortPill
            ]}
            onPress={() => setSelectedSort('trending')}
          >
            <Ionicons name="flame-outline" size={13} color={selectedSort === 'trending' ? colors.primary : colors.textSecondary} />
            <Text style={[styles.sortText, selectedSort === 'trending' && styles.activeSortText]}>
              Most Backed
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.sortPill,
              selectedSort === 'reach' && styles.activeSortPill
            ]}
            onPress={() => setSelectedSort('reach')}
          >
            <Ionicons name="megaphone-outline" size={13} color={selectedSort === 'reach' ? colors.primary : colors.textSecondary} />
            <Text style={[styles.sortText, selectedSort === 'reach' && styles.activeSortText]}>
              Top Reach
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.sortPill,
              selectedSort === 'progress' && styles.activeSortPill
            ]}
            onPress={() => setSelectedSort('progress')}
          >
            <Ionicons name="trending-up-outline" size={13} color={selectedSort === 'progress' ? colors.primary : colors.textSecondary} />
            <Text style={[styles.sortText, selectedSort === 'progress' && styles.activeSortText]}>
              Goal %
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Results Header */}
      <View style={styles.resultsCountRow}>
        <Text style={styles.resultsCountText}>
          {filteredCampaigns.length} {filteredCampaigns.length === 1 ? 'campaign' : 'campaigns'} found (demo data)
        </Text>
        {(searchQuery || selectedCategory !== 'All' || statusFilter !== 'all') && (
          <TouchableOpacity onPress={handleResetFilters}>
            <Text style={styles.clearFiltersText}>Reset</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Campaign List */}
      {isLoading ? (
        <CampaignFeedSkeleton count={2} />
      ) : (
      <FlatList
        data={filteredCampaigns}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <CampaignCard
            campaign={item}
            onPress={() => onSelectCampaign(item)}
            onBackPress={() => onOpenBackModal(item)}
            isBookmarked={bookmarkedCampaignIds.includes(item.id)}
            onToggleBookmark={() => toggleBookmark(item.id)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={48} color={colors.textMuted} />
            <Text style={styles.emptyStateTitle}>No campaigns match filters</Text>
            <Text style={styles.emptyStateDesc}>
              Try adjusting your search query, selecting another category, or clearing status filters.
            </Text>
            <TouchableOpacity
              style={styles.resetBtn}
              onPress={handleResetFilters}
            >
              <Text style={styles.resetBtnText}>Clear All Filters</Text>
            </TouchableOpacity>
          </View>
        }
        contentContainerStyle={styles.listContent}
      />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
  },
  header: {
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.text
  },
  categoryContainer: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight
  },
  categoryScroll: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8
  },
  categoryChip: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20
  },
  activeCategoryChip: {
    backgroundColor: colors.primary,
    borderColor: colors.primary
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary
  },
  activeCategoryText: {
    color: '#FFFFFF'
  },
  filterBar: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  filterScroll: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
    alignItems: 'center'
  },
  filterPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    backgroundColor: colors.background
  },
  activeFilterPill: {
    backgroundColor: colors.primaryLight
  },
  filterPillText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500'
  },
  activeFilterPillText: {
    color: colors.primary,
    fontWeight: '700'
  },
  filterDivider: {
    width: 1,
    height: 16,
    backgroundColor: colors.border,
    marginHorizontal: 4
  },
  sortPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    backgroundColor: colors.background
  },
  activeSortPill: {
    backgroundColor: colors.primaryLight
  },
  sortText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500'
  },
  activeSortText: {
    color: colors.primary,
    fontWeight: '700'
  },
  resultsCountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 10
  },
  resultsCountText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600'
  },
  clearFiltersText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary
  },
  listContent: {
    paddingBottom: 24
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    marginTop: 40
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginTop: 12
  },
  emptyStateDesc: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18
  },
  resetBtn: {
    marginTop: 16,
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 8
  },
  resetBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF'
  }
});
