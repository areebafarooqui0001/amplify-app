import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
  Animated
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from './src/theme/colors';
import { ErrorBoundary } from './src/components/common/ErrorBoundary';
import { CampaignProvider, useCampaigns } from './src/context/CampaignContext';
import { Campaign } from './src/types/campaign';

// Screens
import { HomeScreen } from './src/screens/HomeScreen';
import { ExploreScreen } from './src/screens/ExploreScreen';
import { CreateHubScreen } from './src/screens/CreateCampaign/CreateHubScreen';
import { ActivityScreen } from './src/screens/ActivityScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { CampaignDetailScreen } from './src/screens/CampaignDetailScreen';
import { BackCampaignModal } from './src/screens/BackCampaignModal';
import { CreatorDashboardModal } from './src/screens/CreatorDashboardModal';
import { AdminReviewModal } from './src/screens/AdminReviewModal';
import { OnboardingScreen, ONBOARDING_KEY } from './src/screens/OnboardingScreen';

type TabName = 'home' | 'explore' | 'create' | 'activity' | 'profile';

const MainAppContent: React.FC = () => {
  const { campaigns, notifications } = useCampaigns();

  const [activeTab, setActiveTab] = useState<TabName>('home');
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [backModalCampaign, setBackModalCampaign] = useState<Campaign | null>(null);
  const [dashboardCampaign, setDashboardCampaign] = useState<Campaign | null>(null);
  const [isAdminPanelVisible, setIsAdminPanelVisible] = useState<boolean>(false);
  const [showOnboarding, setShowOnboarding] = useState<boolean | null>(null);

  // Tab content fade animation
  const [fadeAnim] = useState(() => new Animated.Value(1));

  // Check onboarding state
  useEffect(() => {
    AsyncStorage.getItem(ONBOARDING_KEY).then((value) => {
      setShowOnboarding(value !== 'true');
    }).catch(() => {
      setShowOnboarding(true);
    });
  }, []);

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  const handleSelectCampaignById = (id: string) => {
    const found = campaigns.find(c => c.id === id);
    if (found) {
      setSelectedCampaign(found);
    }
  };

  const handleTabPress = useCallback((tab: TabName) => {
    if (tab === activeTab) return;

    // Haptic feedback on tab press
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }

    // Fade out → switch → fade in
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 80,
      useNativeDriver: true,
    }).start(() => {
      setActiveTab(tab);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }).start();
    });
  }, [activeTab, fadeAnim]);

  const handleOnboardingComplete = useCallback(() => {
    setShowOnboarding(false);
  }, []);

  // Show nothing during loading
  if (showOnboarding === null) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
          <View style={styles.splashLogo}>
            <Ionicons name="megaphone" size={32} color="#FFFFFF" />
          </View>
          <Text style={styles.splashBrand}>Amplify</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Show onboarding on first launch
  if (showOnboarding) {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />

      <View style={styles.container}>
        {/* Main Tab Screen Content with fade animation */}
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          {activeTab === 'home' && (
            <HomeScreen
              onNavigateToExplore={() => handleTabPress('explore')}
              onNavigateToCreate={() => handleTabPress('create')}
              onSelectCampaign={c => setSelectedCampaign(c)}
              onOpenBackModal={c => setBackModalCampaign(c)}
            />
          )}

          {activeTab === 'explore' && (
            <ExploreScreen
              onSelectCampaign={c => setSelectedCampaign(c)}
              onOpenBackModal={c => setBackModalCampaign(c)}
            />
          )}

          {activeTab === 'create' && (
            <CreateHubScreen
              onClose={() => handleTabPress('home')}
              onCampaignCreated={newCampaign => {
                setActiveTab('explore');
                setSelectedCampaign(newCampaign);
              }}
            />
          )}

          {activeTab === 'activity' && (
            <ActivityScreen
              onSelectCampaignById={handleSelectCampaignById}
            />
          )}

          {activeTab === 'profile' && (
            <ProfileScreen
              onSelectCampaign={c => setSelectedCampaign(c)}
              onOpenCreatorDashboard={c => setDashboardCampaign(c)}
              onOpenAdminPanel={() => setIsAdminPanelVisible(true)}
            />
          )}
        </Animated.View>

        {/* Stable 5-Destination Bottom Navigation Bar (Hidden when in wizard to keep focus) */}
        {activeTab !== 'create' && (
          <View style={styles.bottomNav}>
            <TouchableOpacity
              style={styles.navItem}
              onPress={() => handleTabPress('home')}
              activeOpacity={0.8}
            >
              <Ionicons
                name={activeTab === 'home' ? 'home' : 'home-outline'}
                size={22}
                color={activeTab === 'home' ? colors.primary : colors.textSecondary}
              />
              <Text
                style={[
                  styles.navLabel,
                  activeTab === 'home' && styles.activeNavLabel
                ]}
              >
                Home
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navItem}
              onPress={() => handleTabPress('explore')}
              activeOpacity={0.8}
            >
              <Ionicons
                name={activeTab === 'explore' ? 'compass' : 'compass-outline'}
                size={23}
                color={activeTab === 'explore' ? colors.primary : colors.textSecondary}
              />
              <Text
                style={[
                  styles.navLabel,
                  activeTab === 'explore' && styles.activeNavLabel
                ]}
              >
                Explore
              </Text>
            </TouchableOpacity>

            {/* Create Tab Center Highlight */}
            <TouchableOpacity
              style={styles.createNavItem}
              onPress={() => handleTabPress('create')}
              activeOpacity={0.85}
            >
              <View style={styles.createButtonBubble}>
                <Ionicons name="add" size={26} color="#FFFFFF" />
              </View>
              <Text style={styles.createNavLabel}>Create</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navItem}
              onPress={() => handleTabPress('activity')}
              activeOpacity={0.8}
            >
              <View style={styles.iconWithBadge}>
                <Ionicons
                  name={activeTab === 'activity' ? 'notifications' : 'notifications-outline'}
                  size={22}
                  color={activeTab === 'activity' ? colors.primary : colors.textSecondary}
                />
                {unreadNotificationsCount > 0 && (
                  <View style={styles.notifBadge}>
                    <Text style={styles.notifBadgeText}>
                      {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
                    </Text>
                  </View>
                )}
              </View>
              <Text
                style={[
                  styles.navLabel,
                  activeTab === 'activity' && styles.activeNavLabel
                ]}
              >
                Activity
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navItem}
              onPress={() => handleTabPress('profile')}
              activeOpacity={0.8}
            >
              <Ionicons
                name={activeTab === 'profile' ? 'person' : 'person-outline'}
                size={22}
                color={activeTab === 'profile' ? colors.primary : colors.textSecondary}
              />
              <Text
                style={[
                  styles.navLabel,
                  activeTab === 'profile' && styles.activeNavLabel
                ]}
              >
                Profile
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Campaign Detail Modal Overlay */}
        {selectedCampaign && (
          <View style={StyleSheet.absoluteFill}>
            <CampaignDetailScreen
              campaign={selectedCampaign}
              onBack={() => setSelectedCampaign(null)}
              onOpenBackModal={c => setBackModalCampaign(c)}
            />
          </View>
        )}

        {/* Back / Contribution Sheet Modal */}
        <BackCampaignModal
          visible={!!backModalCampaign}
          campaign={backModalCampaign}
          onClose={() => setBackModalCampaign(null)}
          onSuccess={() => {
            // Keep modal open on confirmation until user taps view progress
          }}
        />

        {/* Creator Dashboard & Analytics Modal */}
        <CreatorDashboardModal
          visible={!!dashboardCampaign}
          campaign={dashboardCampaign}
          onClose={() => setDashboardCampaign(null)}
        />

        {/* Reviewer / Admin Audit Modal */}
        <AdminReviewModal
          visible={isAdminPanelVisible}
          onClose={() => setIsAdminPanelVisible(false)}
          onSelectCampaign={c => {
            setIsAdminPanelVisible(false);
            setSelectedCampaign(c);
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <CampaignProvider>
        <ErrorBoundary>
          <MainAppContent />
        </ErrorBoundary>
      </CampaignProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface
  },
  container: {
    flex: 1,
    backgroundColor: colors.background
  },
  content: {
    flex: 1
  },
  splashLogo: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  splashBrand: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.5,
  },
  bottomNav: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: Platform.OS === 'ios' ? 4 : 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 6
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3
  },
  navLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textSecondary
  },
  activeNavLabel: {
    color: colors.primary,
    fontWeight: '700'
  },
  createNavItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -16
  },
  createButtonBubble: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 5,
    elevation: 4
  },
  createNavLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primary,
    marginTop: 3
  },
  iconWithBadge: {
    position: 'relative'
  },
  notifBadge: {
    position: 'absolute',
    top: -3,
    right: -6,
    backgroundColor: colors.rose,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3
  },
  notifBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700'
  }
});
