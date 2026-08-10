# Best Practices — Blocks Game

## Component Architecture

### Folder Structure
Every reusable component gets its own folder with co-located files:
```
components/ui/GameButton/
├── GameButton.tsx          # Component implementation
├── useButtonAnimation.ts   # Animation hook (if needed)
├── types.ts                # Props & variant types
└── index.ts                # Barrel export
```

### Separation of Concerns
- **Types** → `types.ts` — All prop interfaces, variant unions, and type helpers.
- **Hooks** → `use*.ts` — Animation logic, gesture handlers, state machines.
- **Component** → `ComponentName.tsx` — Pure rendering + composing hooks.
- **Constants** → `constants.ts` — Magic numbers, config objects, mappings.
- **Logic** → keep in `lib/` or `utils/` — No business logic inside components.

### Barrel Exports
Every component folder must have an `index.ts` that re-exports the component and its types:
```ts
export { default as GameButton } from "./GameButton";
export type { GameButtonProps, ButtonVariant } from "./types";
```

---

## Theming

### Color Usage
- **NEVER use explicit colors** (`text-red-500`, `bg-[#FF0000]`, `style={{ color: 'red' }}`).
- **ALWAYS use theme tokens** (`text-primary`, `bg-surface`, `border-accent`).
- All colors are defined in `tailwind.config.js` under `theme.extend.colors`.
- When adding a new color, add it to the theme config first, then reference by name.

### Theme Token Naming
```
primary     → Main brand / action color
secondary   → Supporting color
accent      → Highlight / attention color
surface     → Card / container backgrounds
background  → Screen background
text        → Default text color hierarchy (DEFAULT, muted, inverse)
border      → Border colors
block.*     → Game piece colors (red, orange, yellow, green, blue, purple, pink, cyan)
success     → Positive feedback
warning     → Caution feedback
danger      → Destructive / error feedback
```

### Dark Mode Ready
- Design with dark backgrounds as the primary theme (games feel better dark).
- Use `surface` variants for layered elevation (surface < surface-elevated < surface-bright).
- Ensure sufficient contrast ratios for accessibility.

---

## Animation Patterns

### Reanimated Conventions
- Use `useSharedValue` for all animated values.
- Use `useAnimatedStyle` to connect shared values to styles.
- Use `withSpring` for interactive feedback (buttons, drags).
- Use `withTiming` for predictable UI transitions (modals, fades).
- Extract animation logic into custom `use*Animation` hooks.

### Spring Configs
Define reusable spring configs as constants:
```ts
export const SPRING_PRESS = { damping: 15, stiffness: 150 };
export const SPRING_BOUNCE = { damping: 8, stiffness: 200 };
export const SPRING_GENTLE = { damping: 20, stiffness: 100 };
```

### Gesture + Animation Pattern
```ts
// Always pair Gesture Handler with Reanimated:
const scale = useSharedValue(1);
const gesture = Gesture.Tap()
  .onBegin(() => { scale.value = withSpring(0.95, SPRING_PRESS); })
  .onFinalize(() => { scale.value = withSpring(1, SPRING_BOUNCE); });
const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
```

---

## Performance Rules

### Memoization
- `React.memo` → wrap components receiving stable props in lists or grids.
- `useMemo` → expensive derivations (grid calculations, shape rotations).
- `useCallback` → functions passed as props to memoized children.
- Do NOT over-memoize — only memoize where profiling shows a need or where the pattern is obviously beneficial (e.g., 64 grid cells).

### Rendering
- Avoid inline object/array creation in JSX (`style={{ margin: 10 }}` creates a new object every render).
- Extract static styles as constants outside the component.
- Use `keyExtractor` with stable keys in FlatList.

---

## Import Conventions

### Order
1. React / React Native core
2. Expo packages (`expo-*`)
3. Third-party (`react-native-reanimated`, `react-native-gesture-handler`)
4. Internal absolute (`@/components/*`, `@/lib/*`, `@/utils/*`)
5. Relative imports (`./types`, `./useAnimation`)
6. Type-only imports (`import type { ... }`)

### Path Aliases
- Always use `@/` for anything outside the current folder's scope.
- Use relative `./` only for co-located files within the same component folder.

---

## Naming Conventions

| Item              | Convention              | Example                        |
| ----------------- | ----------------------- | ------------------------------ |
| Component         | PascalCase              | `GameButton.tsx`               |
| Component folder  | PascalCase              | `components/ui/GameButton/`    |
| Hook              | camelCase, `use` prefix | `useButtonAnimation.ts`        |
| Utility function  | camelCase               | `calculateScore.ts`            |
| Constant          | UPPER_SNAKE_CASE        | `SPRING_PRESS`, `GRID_SIZE`    |
| Type/Interface    | PascalCase              | `GameButtonProps`              |
| Enum-like union   | PascalCase values       | `type Variant = "primary" \| "secondary"` |
| Event handler     | `handle` + Event        | `handlePress`, `handleDrop`    |
| Boolean prop      | `is`/`has`/`should`     | `isDisabled`, `hasIcon`        |

---

## Error Prevention

- Always handle `undefined` from indexed access (`array[i]`, `obj[key]`).
- Use exhaustive switch statements with `never` default for union types.
- Validate all external data at the boundary (AsyncStorage, API, etc.).
- Prefer early returns over deeply nested conditionals.
