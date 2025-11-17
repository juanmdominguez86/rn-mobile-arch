/**
 * Root App Component
 *
 * Initializes core services and navigation
 */

import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AppNavigator } from './src/shared/navigation/AppNavigator';
import { featureFlagService } from './src/core/featureFlags/FeatureFlagService';
import { logger } from './src/core/logging/Logger';

export default function App() {
  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    // Initialize feature flags on app start
    const initializeApp = async () => {
      try {
        await featureFlagService.initialize();
        logger.info('App initialized');
        setIsReady(true);
      } catch (error) {
        logger.captureError(
          error instanceof Error ? error : new Error('App initialization failed')
        );
        // Still set ready to true to prevent app from hanging
        setIsReady(true);
      }
    };

    initializeApp();

    return () => {
      logger.info('App unmounting');
    };
  }, []);

  // Show loading screen while initializing
  if (!isReady) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="light" />
      <AppNavigator />
    </>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
