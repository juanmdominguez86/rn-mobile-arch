/**
 * FeatureFlagService Unit Tests
 */

import { featureFlagService, FeatureFlag } from '../FeatureFlagService';

describe('FeatureFlagService', () => {
  beforeEach(() => {
    // Reset to default state
    featureFlagService.setFlag('showBanner', true);
    featureFlagService.setFlag('enableDarkMode', false);
    featureFlagService.setFlag('enableAnalytics', false);
    featureFlagService.setFlag('showNewFeature', false);
  });

  it('should check if a feature is enabled', () => {
    expect(featureFlagService.isEnabled('showBanner')).toBe(true);
    expect(featureFlagService.isEnabled('enableDarkMode')).toBe(false);
  });

  it('should enable a feature flag', () => {
    featureFlagService.enable('enableDarkMode');
    expect(featureFlagService.isEnabled('enableDarkMode')).toBe(true);
  });

  it('should disable a feature flag', () => {
    featureFlagService.disable('showBanner');
    expect(featureFlagService.isEnabled('showBanner')).toBe(false);
  });

  it('should toggle a feature flag', () => {
    const initialState = featureFlagService.isEnabled('enableAnalytics');
    featureFlagService.toggle('enableAnalytics');
    expect(featureFlagService.isEnabled('enableAnalytics')).toBe(!initialState);
  });

  it('should notify subscribers when flags change', () => {
    const mockCallback = jest.fn();
    const unsubscribe = featureFlagService.subscribe(mockCallback);

    featureFlagService.enable('enableDarkMode');

    expect(mockCallback).toHaveBeenCalledWith(
      expect.objectContaining({
        enableDarkMode: true,
      })
    );

    unsubscribe();
  });

  it('should not notify after unsubscribe', () => {
    const mockCallback = jest.fn();
    const unsubscribe = featureFlagService.subscribe(mockCallback);

    unsubscribe();
    featureFlagService.enable('showNewFeature');

    expect(mockCallback).not.toHaveBeenCalled();
  });
});
