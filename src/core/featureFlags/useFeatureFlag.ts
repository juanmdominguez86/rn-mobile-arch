/**
 * React hook for feature flags
 * Provides reactive updates when flags change
 */

import { useState, useEffect } from 'react';
import { featureFlagService, FeatureFlag } from './FeatureFlagService';

export function useFeatureFlag(flag: FeatureFlag): boolean {
  const [isEnabled, setIsEnabled] = useState<boolean>(() => {
    // Get initial value and ensure it's a primitive boolean
    const value = featureFlagService.isEnabled(flag);
    return value === true;
  });

  useEffect(() => {
    // Subscribe to flag changes
    const unsubscribe = featureFlagService.subscribe((flags) => {
      // Ensure the value is always a primitive boolean
      const value = flags[flag];
      setIsEnabled(value === true);
    });

    return unsubscribe;
  }, [flag]);

  return isEnabled;
}
