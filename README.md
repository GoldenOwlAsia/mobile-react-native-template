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

   The Babel config loads `.env` via [`react-native-dotenv`](https://github.com/goatandsheep/react-native-dotenv) using the `@env` module. A sample variable `API_URL` is listed in `.env.sample`. Use it in React Query fetchers, for example `fetch(\`${API_URL}/users\`)`(add a small`\*.d.ts`for`@env` if TypeScript complains).

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
| `yarn rename-app`  | Interactive app rename (see below)     |

## What’s included

- **TypeScript** with path alias `@/` → `src/` (see `babel.config.js` and `tsconfig.json`).
- **React Navigation** — stack navigator in `src/navigators/Application.tsx`; route param types in `src/types/navigation.d.ts`.
- **Zustand** + **MMKV** — example user session store with persistence (`src/stores/userStore.ts`, `src/stores/mmkvStorage.ts`). `App.tsx` waits for rehydration before rendering.
- **i18next** / **react-i18next** — initialized in `src/translations/index.ts` with English and Vietnamese resources under `src/translations/resources/`.
- **Theming** — tokens in `src/theme/` (colors, spacing, typography, borders).
- **UI primitives** — `Button`, `Input`, `Text`, `SafeAreaView` under `src/components/` (with example tests).
- **Data fetching** — TanStack React Query (`@tanstack/react-query`) with `src/services/queryClient.ts`. `src/services/posts/` + `Home` show a minimal `useQuery` flow (`keys`, `api`, `queries`). `App.tsx` wraps the tree in `QueryClientProvider` and ties query focus to `AppState` on native.

Native gesture handling is set up via `gesture-handler.js` / `gesture-handler.native.js` and imported from `App.tsx`.

## Project layout (high level)

```text
src/
  components/     # Reusable UI
  navigators/     # Navigation containers / stacks
  screens/        # Screen components (e.g. Home, SignIn)
  services/       # API services
  stores/         # Zustand stores + MMKV storage adapter
  theme/          # Design tokens
  translations/   # i18n setup and locale files
  types/          # Shared TypeScript types (navigation, i18n)
  utils/          # Helpers
App.tsx           # Root: SafeAreaProvider, hydration, navigator
```

## Customizing this template

1. **Rename the app** — After cloning, run:

   ```sh
   yarn rename-app
   ```

   The script prompts for three values:

   - **App name** — Internal React Native module name (e.g. `MyCoolApp`). No spaces; used for native registration and iOS/Android project names.
   - **Display name** — Label shown on the home screen (e.g. `My Cool App`). Can contain spaces.
   - **Package name** — Reverse-domain identifier (e.g. `com.acme.mycoolapp`). Sets the Android `applicationId` and iOS bundle identifier.

   Commit or branch before running if your working tree is not clean. After the script finishes:

   ```sh
   yarn install
   yarn pod-install      # macOS only
   cd android && ./gradlew clean && cd ..
   ```

   Optionally delete `ios/build` and `android/app/build` if they exist.
2. **Navigation** — Add screens to `src/screens/`, export them from `src/screens/index.ts`, register routes in `Application.tsx`, and extend `ApplicationStackParamList` in `src/types/navigation.d.ts`.
3. **Locales** — Add namespaces or languages under `src/translations/resources/` and register them in `src/translations/index.ts`.
4. **Auth / gating** — The stack switches between `SignIn` and `Home` based on `useUserStore`’s `isLoggedIn`; replace or extend this flow as needed.
5. **APIs with React Query** — Follow `src/services/posts/`: query keys in `keys.ts`, fetchers in `api.ts`, hooks in `queries.ts` (and `mutations.ts` when you write data). Copy that folder per domain; import from `@/services/<domain>`.

## Testing and quality

- **Jest** — Config in `jest.config.js`; setup in `jest.setup.js`. Test files use the `*.test.ts(x)` pattern.
- **ESLint** — Extends React Native and Airbnb-related rules; run `npm run lint`.

## Troubleshooting

If builds or Metro fail, use the official [React Native troubleshooting guide](https://reactnative.dev/docs/troubleshooting) and confirm your toolchain matches the version pinned in this repo.

## Learn more

- [React Native documentation](https://reactnative.dev/docs/getting-started)
- [React Navigation](https://reactnavigation.org/docs/getting-started)
- [Zustand](https://docs.pmnd.rs/zustand/getting-started/introduction)
