# React Native Mobile Architecture

A modular, scalable React Native architecture demonstrating clean separation of concerns, type-safe state management, feature flags, and comprehensive testing.

## 🏗️ Architecture Overview

This project demonstrates a **feature-based architecture** with clear separation between core infrastructure, shared utilities, and feature modules.

```
src/
├── core/                    # Core infrastructure (framework-agnostic)
│   ├── featureFlags/       # Feature flag system with reactive hooks
│   ├── logging/            # Centralized error handling & logging
│   └── types/              # Shared TypeScript types
├── features/               # Feature modules (isolated, testable)
│   ├── feed/              # Feed feature with screen & tests
│   └── profile/           # Profile feature with screen & tests
└── shared/                 # Shared application code
    ├── navigation/        # Navigation configuration
    └── stores/            # Zustand state management stores
```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18
- Yarn (package manager)
- Expo CLI (installed automatically)

### Installation

```bash
# Install dependencies
yarn install
# or simply
yarn

# Start the development server
yarn start

# Run on iOS simulator
yarn ios

# Run on Android emulator
yarn android
```

## 🧪 Testing

### Run all tests

```bash
yarn test
```

### Run tests in watch mode

```bash
yarn test:watch
```

### Run tests with coverage

```bash
yarn test:coverage
```

### Test Structure

Tests are colocated with features in `__tests__` directories:

- **FeedScreen**: 7 comprehensive tests covering loading, data display, feature flags, errors, and empty states
- **FeatureFlagService**: 6 tests for flag management and subscriptions
- **Logger**: 6 tests for logging, error capture, and memory management

## 🎯 Key Features Implemented

### 1. Navigation System

- **Stack Navigation** using React Navigation
- Two screens: `FeedScreen` and `ProfileScreen`
- Type-safe navigation with TypeScript

### 2. State Management (Zustand)

- **Modular stores**: Separate stores for Feed and Profile
- **Async data fetching** with loading and error states
- **TypeScript-first** with full type inference
- **No providers needed**: Works out of the box

### 3. Feature Flags

- **Type-safe flag definitions**
- **Reactive hooks**: Components auto-update when flags change
- **Observable pattern**: Subscribe to flag changes
- **Easy toggling**: Enable/disable features at runtime
- **Example**: Banner in FeedScreen controlled by `showBanner` flag

**Usage Example**:

```typescript
// In component
const showBanner = useFeatureFlag("showBanner");

// Programmatic control
featureFlagService.enable("showBanner");
featureFlagService.disable("showBanner");
featureFlagService.toggle("showBanner");
```

### 4. Error Handling & Logging

- **Centralized Logger** for consistent logging
- **Error capture** with context and stack traces
- **Log levels**: info, warn, error, debug
- **Memory management**: Bounded log storage
- **Production-ready**: Easy to integrate with Sentry/Firebase

**Usage Example**:

```typescript
logger.info("User action", { userId: "123" });
logger.error("API failed", error, { endpoint: "/api/feed" });
logger.captureError(error, { context: "fetchData" });
```

### 5. Unit Testing

- **Testing Library React Native**: Modern testing approach
- **7+ FeedScreen tests**: Comprehensive coverage
- **Mocked stores**: Isolated component testing
- **Accessibility-first**: Uses testID for reliable queries

## 🔧 Configuration

### TypeScript Path Aliases

Configured in `tsconfig.json`:

```typescript
import { logger } from "@core/logging/Logger";
import { useFeedStore } from "@shared/stores/useFeedStore";
import { FeedScreen } from "@features/feed/FeedScreen";
```

### Jest Configuration

- Preset: `jest-expo`
- Module mapping for path aliases
- Coverage collection from `src/**/*.{ts,tsx}`
- Transform ignore patterns for React Native modules

## 📊 Data Layer Implementation

### Mock Data & API Simulation

The app uses **mock data** with simulated network delays and random failures to demonstrate:

- Loading states
- Error handling
- Retry mechanisms
- User feedback

**Mock Feed Data**:

```typescript
{
  id: string;
  title: string;
  thumbnail: string;
  description: string;
}
```

**Mock Profile Data**:

```typescript
{
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
}
```

## 🎨 UI Components

### FeedScreen

- Displays mock feed items (title + thumbnail)
- Pull-to-refresh functionality
- Loading states with ActivityIndicator
- Error messages with dismiss action
- Feature-flagged banner (toggleable)
- Empty state handling

### ProfileScreen

- Displays user profile data
- Avatar with fallback placeholder
- User details (name, email, bio)
- Loading and error states
- Retry functionality

## 🔄 State Management Deep Dive

### Why Zustand?

1. **Simplicity**: No providers, minimal boilerplate
2. **Performance**: Granular reactivity, no context re-renders
3. **TypeScript**: Excellent type inference
4. **Size**: ~1KB vs Redux ~3KB
5. **DevTools**: Redux DevTools support

### Store Architecture

**Separation of Concerns**:

- `useFeedStore`: Feed data, loading, errors
- `useProfileStore`: Profile data, loading, errors

**Benefits**:

- Independent updates (no global re-renders)
- Easy testing (mock individual stores)
- Clear responsibilities
- Scalable to many stores

## 🚦 Feature Flag System

### How to Enable/Disable Features

**At Runtime** (in code):

```typescript
import { featureFlagService } from "@core/featureFlags/FeatureFlagService";

// Enable
featureFlagService.enable("showBanner");

// Disable
featureFlagService.disable("showBanner");

// Toggle
featureFlagService.toggle("showBanner");
```

**In Components** (reactive):

```typescript
const showBanner = useFeatureFlag("showBanner");
```

### Available Flags

- `showBanner`: Show/hide banner in FeedScreen
- `enableDarkMode`: Dark mode toggle (placeholder)
- `enableAnalytics`: Analytics tracking (placeholder)
- `showNewFeature`: New feature visibility (placeholder)

### Production Integration

In production, integrate with:

- **Firebase Remote Config**
- **LaunchDarkly**
- **Custom API endpoint**

Update `FeatureFlagService.initialize()` to fetch remote flags.

## 🛠️ Type Checking

```bash
yarn type-check
```

Runs TypeScript compiler in check mode (no output) to verify type safety.

## 📱 Development Workflow

1. **Start Expo**: `yarn start`
2. **Run tests in watch mode**: `yarn test:watch`
3. **Make changes** to features in `src/features/`
4. **Add tests** in `__tests__` directories
5. **Type check**: `yarn type-check`

## 🤖 AI Usage Disclosure

**Tool Used**: Claude Code (Anthropic)

**How AI Was Used**:

1. **Architecture Design**: Generated clean architecture structure following React Native best practices
2. **Code Generation**: Created TypeScript components with proper typing
3. **Testing**: Generated comprehensive test cases covering edge cases
4. **Documentation**: Wrote detailed README and REPORT documentation
