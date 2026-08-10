# Skills — Blocks Game (Expo / React Native)

## Project Overview

**Blocks Game** is a mobile puzzle/block game built with **Expo SDK 54**, **React Native 0.81**, **TypeScript 5.9**, and **Expo Router v6** (file-based routing). Styling uses **NativeWind v4** (TailwindCSS 3 for React Native). The project uses **Bun** as the package manager and runtime.

---

## Tech Stack

| Layer            | Technology                                      |
| ---------------- | ----------------------------------------------- |
| Framework        | Expo SDK 54 (`expo ~54.0.33`)                   |
| UI               | React Native 0.81.5, React 19.1                 |
| Routing          | Expo Router v6 (file-based, typed routes)       |
| Styling          | NativeWind v4 + TailwindCSS 3.4                 |
| Animations       | React Native Reanimated v4, Worklets            |
| Gestures         | React Native Gesture Handler v2.28              |
| Language         | TypeScript 5.9 (strict mode)                    |
| Package Manager  | Bun                                             |
| Linting          | ESLint 9 with `eslint-config-expo` (flat config) |
| Git Hooks        | Husky v9                                        |

---

## Directory Structure

```
blocks-game/
├── app/                    # Expo Router file-based routes
│   ├── _layout.tsx         # Root layout (Stack navigator)
│   └── index.tsx           # Home / entry screen
├── assets/                 # Static assets (images, fonts, etc.)
├── .expo/                  # Expo internal cache
├── .husky/                 # Git hook scripts
├── .vscode/                # Editor configuration
├── .gemini/                # Gemini AI agent configuration
├── global.css              # Global TailwindCSS entry point
├── tailwind.config.js      # TailwindCSS / NativeWind config
├── babel.config.js         # Babel presets (expo + nativewind)
├── metro.config.js         # Metro bundler configuration
├── tsconfig.json           # TypeScript configuration (strict)
├── eslint.config.js        # ESLint flat config
├── app.json                # Expo app manifest
└── package.json            # Dependencies & scripts
```

---

## Key Patterns & Conventions

### TypeScript
- **Strict mode** is enabled with all extra checks: `noUnusedLocals`, `noUnusedParameters`, `noImplicitReturns`, `noImplicitAny`, `noUncheckedSideEffectImports`, `noUncheckedIndexedAccess`.
- Use the `@/*` path alias for root-relative imports (maps to `./*`).
- All files must be `.ts` or `.tsx` — no plain JavaScript.

### Routing (Expo Router v6)
- Routes live in `app/` using file-based routing.
- `_layout.tsx` files define navigators (Stack, Tabs, etc.).
- Typed routes are enabled via `experiments.typedRoutes: true`.
- Use `expo-router` imports (`Link`, `useRouter`, `Stack`, `Tabs`, etc.).

### Styling (NativeWind v4)
- Use `className` prop with Tailwind utility classes on React Native components.
- Babel is configured with `jsxImportSource: "nativewind"` and the `nativewind/babel` preset.
- `global.css` is imported in the root `_layout.tsx`.
- Extend the theme in `tailwind.config.js` under `theme.extend`.
- Content paths include `./app/**/*.{js,jsx,ts,tsx}` and `./components/**/*.{js,jsx,ts,tsx}`.

### Animations & Gestures
- Use `react-native-reanimated` for performant, worklet-based animations.
- Use `react-native-gesture-handler` for gesture recognition.
- `react-native-worklets` is available for offloading computation to the UI thread.

### Scripts
| Command             | Description                        |
| ------------------- | ---------------------------------- |
| `bun run start`     | Start the Expo dev server          |
| `bun run android`   | Start on Android                   |
| `bun run ios`       | Start on iOS                       |
| `bun run web`       | Start on web                       |
| `bun run lint`      | Run ESLint                         |
| `bun run type:check`| TypeScript + lint check            |

---

## Architecture Guidelines

### Component Organization
```
components/
├── ui/              # Reusable, generic UI primitives (Button, Card, etc.)
├── game/            # Game-specific components (Board, Block, Grid, etc.)
└── layout/          # Layout wrappers (SafeArea, Container, etc.)
```

### State Management
- Prefer **React state** (`useState`, `useReducer`) for local/component state.
- For global game state, use **React Context** with `useReducer` or a lightweight state library like Zustand if complexity warrants it.
- Keep game logic pure and separate from rendering — extract into `lib/` or `utils/` modules.

### Game Logic
- Game engine logic (grid state, collision detection, scoring, level progression) belongs in `lib/game/` or `utils/game/`.
- Keep rendering and game logic decoupled — the game loop should be framework-agnostic where possible.
- Use Reanimated shared values for real-time animations (block movement, rotations, drop effects).
- Use Gesture Handler for drag-and-drop block placement.

### Performance
- Use `React.memo` for components that receive stable props.
- Avoid anonymous functions in render for frequently re-rendered components.
- Use `useCallback` and `useMemo` where appropriate.
- Leverage Reanimated worklets to keep animations off the JS thread.

---

## File Naming Conventions

| Type        | Convention                | Example                     |
| ----------- | ------------------------- | --------------------------- |
| Component   | PascalCase                | `GameBoard.tsx`             |
| Hook        | camelCase, `use` prefix   | `useGameState.ts`           |
| Utility     | camelCase                 | `calculateScore.ts`         |
| Type file   | camelCase                 | `gameTypes.ts`              |
| Constant    | camelCase                 | `gameConstants.ts`          |
| Route       | kebab-case (Expo Router)  | `app/game-over.tsx`         |
| Test        | `.test.ts(x)` suffix     | `GameBoard.test.tsx`        |

---

## Import Order

1. React / React Native
2. Expo packages
3. Third-party libraries
4. Internal `@/` aliased imports
5. Relative imports
6. Type-only imports (use `import type`)
