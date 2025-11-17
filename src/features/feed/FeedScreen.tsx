/**
 * Feed Screen
 *
 * Displays a list of content items with feature-flagged banner
 */

import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useFeedStore } from '@shared/stores/useFeedStore';
import { useFeatureFlag } from '@core/featureFlags/useFeatureFlag';
import { featureFlagService } from '@core/featureFlags/FeatureFlagService';
import { FeedItem } from '@core/types';

export function FeedScreen() {
  const { items, isLoading, error, fetchFeed, refreshFeed, clearError } = useFeedStore();
  // Use feature flag with a safe default
  const showBanner = useFeatureFlag('showBanner');
  const [isMounted, setIsMounted] = React.useState(false);

  useEffect(() => {
    setIsMounted(true);
    fetchFeed();
  }, []);

  const renderItem = ({ item }: { item: FeedItem }) => (
    <View style={styles.itemContainer} testID={`feed-item-${item.id}`}>
      <Image
        source={{ uri: item.thumbnail }}
        style={styles.thumbnail}
        testID="feed-item-thumbnail"
      />
      <View style={styles.itemContent}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        {item.description && (
          <Text style={styles.itemDescription}>{item.description}</Text>
        )}
      </View>
    </View>
  );

  const renderBanner = () => {
    // Only render banner after component is mounted and feature flag is checked
    if (!isMounted || !showBanner) return null;

    return (
      <View style={styles.banner} testID="feature-banner">
        <Text style={styles.bannerText}>🎉 New features available!</Text>
        <TouchableOpacity
          onPress={() => featureFlagService.disable('showBanner')}
          style={styles.bannerClose}
          testID="banner-close"
        >
          <Text style={styles.bannerCloseText}>✕</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderError = () => {
    if (!error) return null;

    return (
      <View style={styles.errorContainer} testID="error-message">
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={clearError} style={styles.errorButton}>
          <Text style={styles.errorButtonText}>Dismiss</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderEmpty = () => {
    if (isLoading) return null;

    return (
      <View style={styles.emptyContainer} testID="empty-state">
        <Text style={styles.emptyText}>No feed items available</Text>
      </View>
    );
  };

  if (isLoading && items.length === 0) {
    return (
      <View style={styles.loadingContainer} testID="loading-indicator">
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading feed...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container} testID="feed-screen">
      {renderBanner()}
      {renderError()}
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        refreshControl={
          <RefreshControl
            refreshing={isLoading === true}
            onRefresh={refreshFeed}
            testID="refresh-control"
          />
        }
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={items.length === 0 ? styles.emptyList : undefined}
      />
    </View>
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
  banner: {
    backgroundColor: '#007AFF',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bannerText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  bannerClose: {
    padding: 4,
  },
  bannerCloseText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  errorContainer: {
    backgroundColor: '#ff3b30',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  errorText: {
    color: '#fff',
    fontSize: 14,
    flex: 1,
  },
  errorButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
  },
  errorButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  itemContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
    flexDirection: 'row',
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
  },
  itemContent: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: 'center',
  },
});
