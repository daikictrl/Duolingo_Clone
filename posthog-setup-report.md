<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Vexora language learning app. The integration covers the full user acquisition funnel, authentication events, language selection, and in-app learning engagement. All events are captured using the `posthog-react-native` SDK via the `usePostHog()` hook, with a standalone client in `lib/posthog.ts` and screen tracking in the root layout.

## What was set up

- **`lib/posthog.ts`** — Standalone PostHog client using `EXPO_PUBLIC_POSTHOG_API_KEY` / `EXPO_PUBLIC_POSTHOG_HOST` env vars
- **`app/_layout.tsx`** — `PostHogProvider` now uses the standalone client, added manual screen tracking via `usePathname`, and user identification via Clerk `userId` on sign-in
- **5 screens** instrumented with `posthog.capture()` calls

## Events

| Event | Description | File |
|---|---|---|
| `onboarding_get_started_tapped` | User tapped Get Started on the onboarding screen — top of acquisition funnel | `app/onboarding.tsx` |
| `sign_up_submitted` | User submitted the email/password sign-up form | `app/(auth)/signup.tsx` |
| `sign_up_completed` | User successfully verified email and completed sign-up | `app/(auth)/signup.tsx` |
| `sign_up_oauth_completed` | User completed sign-up via Google or Apple OAuth | `app/(auth)/signup.tsx` |
| `sign_in_submitted` | User submitted the email sign-in form | `app/(auth)/signin.tsx` |
| `sign_in_completed` | User successfully verified email code and completed sign-in | `app/(auth)/signin.tsx` |
| `sign_in_oauth_completed` | User completed sign-in via Google or Apple OAuth | `app/(auth)/signin.tsx` |
| `language_selected` | User confirmed their target language selection | `app/language-selection.tsx` |
| `lesson_completed` | User completed a lesson from the home screen daily plan | `app/(tabs)/index.tsx` |
| `continue_learning_tapped` | User tapped the Continue Learning card on the home screen | `app/(tabs)/index.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics dashboard](/dashboard/1624165)
- [Acquisition Funnel](/insights/KVD5Pga4) — full user journey from onboarding to first lesson
- [Daily Sign-ups](/insights/862Aqiz6) — email vs OAuth new users over time
- [Lessons Completed per Day](/insights/IsXP6yfe) — daily learning engagement
- [Language Selection Rate](/insights/XW8Nvysy) — sign-up to language selection churn indicator
- [Continue Learning Taps](/insights/yfQvmsyy) — home screen re-engagement metric

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
