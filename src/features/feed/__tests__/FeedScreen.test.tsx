/**
 * FeedScreen Unit Tests
 *
 * Tests for FeedScreen component functionality
 */

import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react-native';
import { FeedScreen } from '../FeedScreen';
import { useFeedStore } from '@shared/stores/useFeedStore';
import { featureFlagService } from '@core/featureFlags/FeatureFlagService';

// Mock navigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));

describe('FeedScreen', () => {
  beforeEach(() => {
    // Reset store state before each test
    useFeedStore.setState({
      items: [],
      isLoading: false,
      error: null,
    });

    // Reset feature flags
    featureFlagService.enable('showBanner');
  });

  /**
   * Test 1: Initial loading state
   */
  it('should display loading indicator on initial load', () => {
    useFeedStore.setState({ isLoading: true });

    render(<FeedScreen />);

    const loadingIndicator = screen.getByTestId('loading-indicator');
    expect(loadingIndicator).toBeTruthy();
    expect(screen.getByText('Loading feed...')).toBeTruthy();
  });

  /**
   * Test 2: Display feed items after successful fetch
   */
  it('should display feed items when data is loaded', async () => {
    const mockItems = [
      {
        id: 'item-1',
        title: 'Test Item 1',
        thumbnail: 'https://example.com/thumb1.jpg',
        description: 'Description 1',
      },
      {
        id: 'item-2',
        title: 'Test Item 2',
        thumbnail: 'https://example.com/thumb2.jpg',
        description: 'Description 2',
      },
    ];

    // Mock fetchFeed to immediately set items
    const mockFetchFeed = jest.fn(() => {
      useFeedStore.setState({
        items: mockItems,
        isLoading: false,
        error: null,
      });
      return Promise.resolve();
    });

    useFeedStore.setState({
      items: [],
      isLoading: false,
      error: null,
      fetchFeed: mockFetchFeed,
    });

    render(<FeedScreen />);

    await waitFor(() => {
      expect(screen.getByText('Test Item 1')).toBeTruthy();
      expect(screen.getByText('Test Item 2')).toBeTruthy();
      expect(screen.getByText('Description 1')).toBeTruthy();
      expect(screen.getByText('Description 2')).toBeTruthy();
    });

    // Check that feed items have correct testIDs
    expect(screen.getByTestId('feed-item-item-1')).toBeTruthy();
    expect(screen.getByTestId('feed-item-item-2')).toBeTruthy();
  });

  /**
   * Test 3: Feature flag banner visibility
   */
  it('should show banner when showBanner feature flag is enabled', () => {
    featureFlagService.enable('showBanner');

    render(<FeedScreen />);

    const banner = screen.getByTestId('feature-banner');
    expect(banner).toBeTruthy();
    expect(screen.getByText('🎉 New features available!')).toBeTruthy();
  });

  /**
   * Test 4: Feature flag banner dismissal
   */
  it('should hide banner when close button is pressed', async () => {
    featureFlagService.enable('showBanner');

    // Mock fetchFeed to do nothing
    useFeedStore.setState({
      items: [],
      isLoading: false,
      error: null,
      fetchFeed: jest.fn(() => Promise.resolve()),
    });

    render(<FeedScreen />);

    // Banner should be visible initially
    let banner = screen.getByTestId('feature-banner');
    expect(banner).toBeTruthy();

    // Press close button
    const closeButton = screen.getByTestId('banner-close');
    fireEvent.press(closeButton);

    // Wait for banner to be removed
    await waitFor(() => {
      expect(screen.queryByTestId('feature-banner')).toBeNull();
    });
  });

  /**
   * Test 5: Error state display
   */
  it('should display error message when fetch fails', async () => {
    const errorMessage = 'Failed to fetch feed data';

    // Mock fetchFeed to set error
    const mockFetchFeed = jest.fn(() => {
      useFeedStore.setState({
        items: [],
        isLoading: false,
        error: errorMessage,
      });
      return Promise.resolve();
    });

    useFeedStore.setState({
      items: [],
      isLoading: false,
      error: null,
      fetchFeed: mockFetchFeed,
    });

    render(<FeedScreen />);

    await waitFor(() => {
      const errorContainer = screen.getByTestId('error-message');
      expect(errorContainer).toBeTruthy();
      expect(screen.getByText(errorMessage)).toBeTruthy();
    });
  });

  /**
   * Test 6: Empty state display
   */
  it('should display empty state when no items are available', async () => {
    // Mock fetchFeed to set empty items
    const mockFetchFeed = jest.fn(() => {
      useFeedStore.setState({
        items: [],
        isLoading: false,
        error: null,
      });
      return Promise.resolve();
    });

    useFeedStore.setState({
      items: [],
      isLoading: false,
      error: null,
      fetchFeed: mockFetchFeed,
    });

    render(<FeedScreen />);

    await waitFor(() => {
      const emptyState = screen.getByTestId('empty-state');
      expect(emptyState).toBeTruthy();
      expect(screen.getByText('No feed items available')).toBeTruthy();
    });
  });

  /**
   * Test 7: Banner hidden when feature flag is disabled
   */
  it('should not show banner when showBanner feature flag is disabled', () => {
    featureFlagService.disable('showBanner');

    render(<FeedScreen />);

    const banner = screen.queryByTestId('feature-banner');
    expect(banner).toBeNull();
  });
});
