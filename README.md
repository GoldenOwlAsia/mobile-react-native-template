# Golden Owl React Native app template

Template for a React Native app on **0.84.x** with TypeScript, navigation, persisted state, i18n, and a small UI layer. Use it as a base: rename the app, adjust env and API code, then build your product.

## Prerequisites

- [React Native environment setup](https://reactnative.dev/docs/set-up-your-environment) (Xcode, Android SDK, etc.)
- **Node.js** `>= 22.11.0` (see `package.json` `engines`)

## First-time setup

1. **Install dependencies**

   ```sh
   yarn install
   ```

2. **Environment variables**

   Copy the sample env file and edit values as needed:

   ```sh
   cp .env.sample .env
   ```

   The Babel config loads `.env` via [`react-native-dotenv`](https://github.com/goatandsheep/react-native-dotenv) using the `@env` module. A sample variable `API_URL` is listed in `.env.sample`. Import it where needed, for example `import { API_URL } from '@env'` (add a small `*.d.ts` for `@env` if TypeScript complains). The starter `src/services/api.ts` references `process.env.API_URL`; switch it to `@env` (or your preferred approach) so the value from `.env` is actually applied at build time.

3. **iOS — CocoaPods**

   From the project root:

   ```sh
   yarn pod-install
   ```

   Or use `bundle install` and `bundle exec pod install` under `ios/` if you rely on the Gemfile there.

## Running the app

```sh
yarn android
# or
yarn ios
```

## Scripts

| Script             | Purpose                                |
| ------------------ | -------------------------------------- |
| `yarn start`       | Start Metro                            |
| `yarn android`     | Run on Android                         |
| `yarn ios`         | Run on iOS                             |
| `yarn pod-install` | Install iOS pods via `npx pod-install` |
| `yarn test`        | Run Jest                               |
| `yarn lint`        | Run ESLint                             |

## What’s included

- **TypeScript** with path alias `@/` → `src/` (see `babel.config.js` and `tsconfig.json`).
- **React Navigation** — stack navigator in `src/navigators/Application.tsx`; route param types in `src/types/navigation.d.ts`.
- **Zustand** + **MMKV** — example user session store with persistence (`src/stores/userStore.ts`, `src/stores/mmkvStorage.ts`). `App.tsx` waits for rehydration before rendering.
- **i18next** / **react-i18next** — initialized in `src/translations/index.ts` with English and Vietnamese resources under `src/translations/resources/`.
- **Theming** — tokens in `src/theme/` (colors, spacing, typography, borders).
- **UI primitives** — `Button`, `Input`, `Text`, `SafeAreaView` under `src/components/` (with example tests).
- **API helper** — `src/services/api.ts` as a starting point for `fetch`-based calls.

Native gesture handling is set up via `gesture-handler.js` / `gesture-handler.native.js` and imported from `App.tsx`.

## Project layout (high level)

```text
src/
  components/     # Reusable UI
  navigators/     # Navigation containers / stacks
  screens/        # Screen components (e.g. Home, SignIn)
  services/       # API and similar
  stores/         # Zustand stores + MMKV storage adapter
  theme/          # Design tokens
  translations/   # i18n setup and locale files
  types/          # Shared TypeScript types (navigation, i18n)
  utils/          # Helpers
App.tsx           # Root: SafeAreaProvider, hydration, navigator
```

## Customizing this template

1. **Rename the app** — Update `name` and `displayName` in `app.json` and the `name` field in `package.json` to match your product.
2. **Navigation** — Add screens to `src/screens/`, export them from `src/screens/index.ts`, register routes in `Application.tsx`, and extend `ApplicationStackParamList` in `src/types/navigation.d.ts`.
3. **Locales** — Add namespaces or languages under `src/translations/resources/` and register them in `src/translations/index.ts`.
4. **Auth / gating** — The stack switches between `SignIn` and `Home` based on `useUserStore`’s `isLoggedIn`; replace or extend this flow as needed.

## Testing and quality

- **Jest** — Config in `jest.config.js`; setup in `jest.setup.js`. Test files use the `*.test.ts(x)` pattern.
- **ESLint** — Extends React Native and Airbnb-related rules; run `npm run lint`.

## Troubleshooting

If builds or Metro fail, use the official [React Native troubleshooting guide](https://reactnative.dev/docs/troubleshooting) and confirm your toolchain matches the version pinned in this repo.

## Learn more

- [React Native documentation](https://reactnative.dev/docs/getting-started)
- [React Navigation](https://reactnavigation.org/docs/getting-started)
- [Zustand](https://docs.pmnd.rs/zustand/getting-started/introduction)
