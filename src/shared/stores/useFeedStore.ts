/**
 * Feed Store - Zustand
 *
 * Architecture rationale for choosing Zustand:
 * 1. Simplicity: Minimal boilerplate compared to Redux
 * 2. Performance: Fine-grained reactivity without context hell
 * 3. TypeScript: Excellent type inference out of the box
 * 4. No providers: Works without wrapping components
 * 5. DevTools: Supports Redux DevTools for debugging
 * 6. Size: ~1KB vs Redux ~3KB
 */

import { create } from 'zustand';
import { FeedItem } from '@core/types';
import { logger } from '@core/logging/Logger';

interface FeedState {
  items: FeedItem[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchFeed: () => Promise<void>;
  refreshFeed: () => Promise<void>;
  addItem: (item: FeedItem) => void;
  clearError: () => void;
}

// Helper to ensure boolean values
const toBoolean = (value: any): boolean => value === true;

/**
 * Mock data generator
 */
const generateMockFeed = (): FeedItem[] => {
  return Array.from({ length: 10 }, (_, i) => ({
    id: `feed-item-${i + 1}`,
    title: `Feed Item ${i + 1}`,
    thumbnail: `https://via.placeholder.com/150?text=Item+${i + 1}`,
    description: `This is a description for feed item ${i + 1}`,
  }));
};

/**
 * Simulate API call with retry logic
 */
const fetchFeedData = async (): Promise<FeedItem[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Simulate random failure (10% chance)
  if (Math.random() < 0.1) {
    throw new Error('Failed to fetch feed data');
  }

  return generateMockFeed();
};

export const useFeedStore = create<FeedState>((set, get) => ({
  items: [],
  isLoading: false as boolean,
  error: null,

  fetchFeed: async () => {
    const { isLoading } = get();
    if (isLoading === true) return;

    set({ isLoading: true as boolean, error: null });
    logger.info('Fetching feed data');

    try {
      const items = await fetchFeedData();
      set({ items, isLoading: false as boolean });
      logger.info('Feed data fetched successfully', { count: items.length });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      set({ error: errorMessage, isLoading: false as boolean });
      logger.captureError(
        error instanceof Error ? error : new Error(errorMessage),
        { context: 'fetchFeed' }
      );
    }
  },

  refreshFeed: async () => {
    logger.info('Refreshing feed');
    await get().fetchFeed();
  },

  addItem: (item: FeedItem) => {
    set(state => ({
      items: [item, ...state.items],
    }));
    logger.info('Added new feed item', { itemId: item.id });
  },

  clearError: () => {
    set({ error: null });
  },
}));
