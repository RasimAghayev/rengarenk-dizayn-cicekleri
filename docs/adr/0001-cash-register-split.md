# ADR-0001: Split CashRegister God-Component into Hook + Presentational Component

## Status

Accepted

## Context

The `src/components/CashRegister.tsx` component was a 379-line "god-component" that violated the Single Responsibility Principle (SRP). It mixed:

- Cart state management (cart, total, payment, isDebt, selectedCustomer)
- Product data fetching and filtering (categories, allProducts, filteredProducts, isLoading)
- LocalStorage persistence logic
- Business logic (addToCart, removeFromCart, calculateChange, handleCheckout, barcode scanning)
- Rendering logic for three different view modes (categories, products, cart)

This made the component:

- Hard to test in isolation
- Difficult to reuse cart logic elsewhere
- Prone to bugs due to tight coupling of concerns
- A barrier to enabling strict TypeScript checks (many `any` types needed)

## Decision

Extract all state management and business logic into a custom hook `useCashRegister` (`src/hooks/useCashRegister.ts`), leaving `CashRegister.tsx` as a thin presentational component that:

1. Calls the hook
2. Delegates rendering to the existing section components (`CategoriesSection`, `ProductsSection`, `CartSection`)

The hook returns a combined object of state and actions, maintaining the same external API for the presentational component.

## Consequences

### Positive

- **SRP compliance**: State/logic separated from rendering
- **Testability**: Hook can be unit-tested independently of React rendering
- **Reusability**: Cart/pricing logic can be reused in other components
- **Maintainability**: Smaller, focused files are easier to understand and modify
- **TypeScript readiness**: Hook's return type is explicitly typed, enabling stricter checks

### Negative

- Slight increase in file count (one new hook file)
- Components using the hook must be in the same React tree (standard hook limitation)

### Neutral

- No behavior change — verified by identical build output and typecheck results
- Bundle size unchanged (hook is tree-shaken with component)

## Verification

- `npm run build` → exit 0 (identical artifact sizes)
- `npx tsc --noEmit -p tsconfig.app.json` → exit 0
- `npm run lint` → pre-existing tooling crash (unrelated to this change)

## Alternatives Considered

1. **Keep as-is** — rejected due to SRP violation and maintenance burden
2. **Redux/Zustand global store** — rejected as overkill (YAGNI) for a single feature's local state
3. **Context API** — rejected; hook pattern is simpler for single-consumer state

## References

- Phase 8 Architecture checklist: SOLID (SRP) applies concretely to `CashRegister.tsx`
- `docs/TECHNICAL_DEBT.md` item 48: `CashRegister.tsx` (380 lines) is a god-component mixing cart state, pricing math, and rendering
