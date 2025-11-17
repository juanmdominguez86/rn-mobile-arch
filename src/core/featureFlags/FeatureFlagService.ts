/**
 * Feature Flag Service
 *
 * Architecture rationale:
 * - Centralized feature flag management
 * - Type-safe flag definitions
 * - Easy to integrate with remote config (Firebase, LaunchDarkly, etc.)
 * - Supports runtime flag toggling for A/B testing
 * - Observable pattern for UI updates when flags change
 */

type FeatureFlag =
  | 'showBanner'
  | 'enableDarkMode'
  | 'enableAnalytics'
  | 'showNewFeature';

type FeatureFlagConfig = Record<FeatureFlag, boolean>;

type Subscriber = (flags: FeatureFlagConfig) => void;

class FeatureFlagService {
  private flags: FeatureFlagConfig;
  private subscribers: Set<Subscriber> = new Set();
  private initialized: boolean = false;

  constructor() {
    // Initialize flags synchronously with explicit boolean values
    this.flags = {
      showBanner: true as boolean,
      enableDarkMode: false as boolean,
      enableAnalytics: false as boolean,
      showNewFeature: false as boolean,
    };
  }

  /**
   * Check if a feature is enabled
   */
  isEnabled(flag: FeatureFlag): boolean {
    const value = this.flags[flag];
    // Ensure we always return a primitive boolean
    return value === true;
  }

  /**
   * Enable a feature flag
   */
  enable(flag: FeatureFlag): void {
    this.setFlag(flag, true);
  }

  /**
   * Disable a feature flag
   */
  disable(flag: FeatureFlag): void {
    this.setFlag(flag, false);
  }

  /**
   * Toggle a feature flag
   */
  toggle(flag: FeatureFlag): void {
    this.setFlag(flag, !this.flags[flag]);
  }

  /**
   * Set a specific flag value
   */
  setFlag(flag: FeatureFlag, value: boolean): void {
    const boolValue = Boolean(value);
    if (this.flags[flag] !== boolValue) {
      this.flags[flag] = boolValue;
      this.notifySubscribers();
    }
  }

  /**
   * Get all flags (useful for debugging)
   */
  getAllFlags(): FeatureFlagConfig {
    return { ...this.flags };
  }

  /**
   * Subscribe to flag changes
   * Returns unsubscribe function
   */
  subscribe(callback: Subscriber): () => void {
    this.subscribers.add(callback);

    return () => {
      this.subscribers.delete(callback);
    };
  }

  /**
   * Initialize flags from remote config
   * In production, this would fetch from Firebase/LaunchDarkly
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    // Mock remote config fetch with small delay to simulate async operation
    await new Promise(resolve => setTimeout(resolve, 10));

    // In production: const remoteFlags = await fetchRemoteConfig();
    // Ensure all flag values are primitive booleans
    const flags: FeatureFlag[] = ['showBanner', 'enableDarkMode', 'enableAnalytics', 'showNewFeature'];
    flags.forEach((flag) => {
      this.flags[flag] = this.flags[flag] === true;
    });

    this.initialized = true;

    // Notify subscribers after initialization
    this.notifySubscribers();
  }

  private notifySubscribers(): void {
    const currentFlags = this.getAllFlags();
    this.subscribers.forEach(callback => callback(currentFlags));
  }
}

// Singleton instance
export const featureFlagService = new FeatureFlagService();
export type { FeatureFlag, FeatureFlagConfig };
