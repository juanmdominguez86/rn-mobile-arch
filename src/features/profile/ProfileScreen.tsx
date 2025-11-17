/**
 * Profile Screen
 *
 * Displays user profile information
 */

import React, { useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { useProfileStore } from '@shared/stores/useProfileStore';
import { useFeatureFlag } from '@core/featureFlags/useFeatureFlag';
import { featureFlagService } from '@core/featureFlags/FeatureFlagService';

export function ProfileScreen() {
  const { profile, isLoading, error, fetchProfile, clearError } = useProfileStore();
  const showBanner = useFeatureFlag('showBanner');

  useEffect(() => {
    fetchProfile();
  }, []);

  if (isLoading && !profile) {
    return (
      <View style={styles.loadingContainer} testID="loading-indicator">
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer} testID="error-state">
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={fetchProfile} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.emptyContainer} testID="empty-state">
        <Text style={styles.emptyText}>No profile data available</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} testID="profile-screen">
      <View style={styles.header}>
        {profile.avatar ? (
          <Image
            source={{ uri: profile.avatar }}
            style={styles.avatar}
            testID="profile-avatar"
          />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]} testID="avatar-placeholder">
            <Text style={styles.avatarText}>
              {profile.name.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
        <Text style={styles.name} testID="profile-name">
          {profile.name}
        </Text>
        <Text style={styles.email} testID="profile-email">
          {profile.email}
        </Text>
      </View>

      {profile.bio && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bio</Text>
          <Text style={styles.bio} testID="profile-bio">
            {profile.bio}
          </Text>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Details</Text>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>User ID:</Text>
          <Text style={styles.detailValue} testID="profile-id">
            {profile.id}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Feature Flags</Text>
        <Text style={styles.sectionDescription}>
          Toggle feature flags to control app behavior
        </Text>

        <View style={styles.featureFlagRow}>
          <View style={styles.featureFlagInfo}>
            <Text style={styles.featureFlagLabel}>Show Banner</Text>
            <Text style={styles.featureFlagDescription}>
              Display the "New features available" banner on Feed screen
            </Text>
          </View>
          <Switch
            value={showBanner}
            onValueChange={(value) => {
              if (value) {
                featureFlagService.enable('showBanner');
              } else {
                featureFlagService.disable('showBanner');
              }
            }}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={showBanner ? '#007AFF' : '#f4f3f4'}
            testID="banner-toggle"
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 32,
  },
  errorText: {
    fontSize: 16,
    color: '#ff3b30',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  header: {
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  avatarPlaceholder: {
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 40,
    color: '#fff',
    fontWeight: '600',
  },
  name: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: '#666',
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 16,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  bio: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  detailLabel: {
    fontSize: 16,
    color: '#666',
  },
  detailValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  featureFlagRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  featureFlagInfo: {
    flex: 1,
    marginRight: 12,
  },
  featureFlagLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
    marginBottom: 4,
  },
  featureFlagDescription: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
});
