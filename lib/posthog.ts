import PostHog from "posthog-react-native";

const apiKey = process.env.EXPO_PUBLIC_POSTHOG_API_KEY;
const host = process.env.EXPO_PUBLIC_POSTHOG_HOST;

const isPostHogConfigured = !!apiKey && !!host;

if (__DEV__) {
  console.log("PostHog config:", {
    apiKey: apiKey ? "SET" : "NOT SET",
    host: host ? "SET" : "NOT SET",
    isConfigured: isPostHogConfigured,
  });
}

if (!isPostHogConfigured) {
  console.warn(
    "PostHog not configured. Set EXPO_PUBLIC_POSTHOG_API_KEY and " +
      "EXPO_PUBLIC_POSTHOG_HOST in your .env file to enable analytics."
  );
}

export const posthog = new PostHog(apiKey || "placeholder_key", {
  host,
  disabled: !isPostHogConfigured,
  captureAppLifecycleEvents: true,
  flushAt: 20,
  flushInterval: 10000,
  maxBatchSize: 100,
  maxQueueSize: 1000,
  preloadFeatureFlags: true,
  requestTimeout: 10000,
  fetchRetryCount: 3,
  fetchRetryDelay: 3000,
});
