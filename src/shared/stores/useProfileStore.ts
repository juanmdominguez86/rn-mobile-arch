/**
 * Profile Store - Zustand
 *
 * Manages user profile state
 */

import { create } from 'zustand';
import { UserProfile } from '@core/types';
import { logger } from '@core/logging/Logger';

interface ProfileState {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchProfile: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => void;
  clearError: () => void;
}

/**
 * Mock profile data
 */
const generateMockProfile = (): UserProfile => ({
  id: 'user-123',
  name: 'John Doe',
  email: 'john.doe@example.com',
  avatar: 'https://via.placeholder.com/150',
  bio: 'Mobile developer passionate about React Native',
});

/**
 * Simulate API call
 */
const fetchProfileData = async (): Promise<UserProfile> => {
  await new Promise(resolve => setTimeout(resolve, 800));

  if (Math.random() < 0.05) {
    throw new Error('Failed to fetch profile');
  }

  return generateMockProfile();
};

export const useProfileStore = create<ProfileState>((set, get) => ({
  profile: null,
  isLoading: false,
  error: null,

  fetchProfile: async () => {
    const { isLoading } = get();
    if (isLoading) return;

    set({ isLoading: true, error: null });
    logger.info('Fetching profile data');

    try {
      const profile = await fetchProfileData();
      set({ profile, isLoading: false });
      logger.info('Profile data fetched successfully', { userId: profile.id });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      set({ error: errorMessage, isLoading: false });
      logger.captureError(
        error instanceof Error ? error : new Error(errorMessage),
        { context: 'fetchProfile' }
      );
    }
  },

  updateProfile: (updates: Partial<UserProfile>) => {
    set(state => ({
      profile: state.profile ? { ...state.profile, ...updates } : null,
    }));
    logger.info('Profile updated', { updates });
  },

  clearError: () => {
    set({ error: null });
  },
}));
