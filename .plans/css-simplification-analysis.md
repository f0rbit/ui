# CSS Architecture Simplification Analysis (Updated)

## Executive Summary

Following the **completed** CSS simplifications:
1. Made `.btn` include primary styles by default (removed need for `btn-primary`)
2. Consolidated state classes to use `.active` consistently (replaced `.chevron-expanded`, `.dropdown-item-active`, etc.)
3. Removed redundant `.demo-row` class (consolidated to `.cluster`)

This updated analysis identifies **7 additional opportunities** for CSS structure improvements. The recommendations are prioritized by impact, risk, and effort.

**Key Findings:**
1. **Badge and Status have significant structural overlap** - potential for consolidation
2. **Unused CSS selector** exists that should be removed (`collapsible-chevron-open`)
3. **Demo-specific layout classes** still duplicate existing utilities
4. **Missing CSS class** referenced in component code (`step-upcoming`)
5. **`badge-info` hardcodes colors** instead of using a token
6. **Card shadow modifier** could use CSS custom property pattern
7. **Duplicate collapsible chevron selectors** after `.active` migration

---

## Detailed Recommendations

### 1. Add Missing `step-upcoming` CSS Class

**Priority:** High | **Effort:** Low | **Risk:** Low

**Current State:**
The `Stepper.tsx` component references `step-upcoming` but this class doesn't exist in CSS:

```tsx
// Stepper.tsx line 23-27
const statusClasses: Record<StepStatus, string> = {
  completed: "step-completed",
  current: "step-current",
  upcoming: "step-upcoming",  // <- Not defined in CSS!
};
```

**Problem:** The class is applied to upcoming steps but no styles exist, relying on default step styles which works but is implicit.

**Recommendation:**
Add the missing class to `components.css` for explicitness:

```css
/* After .step-completed (around line 616) */
.step-upcoming .step-indicator {
  /* Uses default styles - no changes needed */
}

.step-upcoming .step-title {
  color: var(--fg-faint);
}
```

**Alternative:** If default styling is intentional, add a comment in CSS noting the class exists but intentionally has no overrides:
```css
/* .step-upcoming intentionally uses default step styles */
```

**Impact:** Fixes potential confusion, completes the component API

**Estimated lines:** ~5-8 lines

---

### 2. Remove Redundant `collapsible-chevron.open` and `collapsible-chevron-open`

**Priority:** High | **Effort:** Low | **Risk:** Low

**Current State:**
After the `.active` consolidation, the Collapsible component now uses Chevron which adds `.active` for expanded state. But the CSS still has:

```css
/* components.css lines 551-554 */
.collapsible-chevron.open,
.collapsible-chevron-open {
  transform: rotate(90deg);
}
```

And Chevron.tsx now uses `.active`:
```tsx
if (local.expanded) {
  parts.push("active");
}
```

**Problem:** The `.open` and `-open` selectors are dead code since:
- Chevron component adds `.active` (not `.open`)
- Collapsible uses the Chevron component directly

**Recommendation:**
Update the selector to match `.active`:

```css
/* Before */
.collapsible-chevron.open,
.collapsible-chevron-open {
  transform: rotate(90deg);
}

/* After */
.collapsible-chevron.active {
  transform: rotate(90deg);
}
```

**Impact:** Removes dead CSS selectors, ensures collapsible chevron animation works

**Estimated lines:** ~2 lines changed

---

### 3. Add `--info` Token for Consistency

**Priority:** Medium | **Effort:** Low | **Risk:** Low

**Current State:**
The `badge-info` class hardcodes OKLCH values while other status variants use tokens:

```css
/* badge-info hardcodes (line 102-106) */
.badge-info {
  background: oklch(0.95 0.05 240);
  color: oklch(0.4 0.15 240);
  border-color: transparent;
}

/* badge-success uses tokens */
.badge-success {
  background: var(--success);
  color: var(--success-fg);
}
```

**Recommendation:**
Add info tokens to `tokens.css`:

```css
/* In :root (around line 18) */
--info: oklch(0.95 0.05 240);
--info-fg: oklch(0.4 0.15 240);

/* In @media (prefers-color-scheme: dark) (around line 78) */
--info: oklch(0.35 0.05 240);
--info-fg: oklch(0.85 0.1 240);
```

Then update `badge-info` in `components.css`:
```css
.badge-info {
  background: var(--info);
  color: var(--info-fg);
  border-color: transparent;
}
```

**Impact:** Enables theme customization of info color, consistency with other status colors

**Estimated lines:** ~8 lines

---

### 4. Remove Remaining Demo Layout Duplicates

**Priority:** Medium | **Effort:** Low | **Risk:** Low

**Current State:**
In `docs/src/styles/custom.css`, demo-specific layout classes duplicate existing utilities:

```css
/* custom.css lines 59-79 */
.demo-row-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.demo-stack {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  width: 100%;
  max-width: 320px;
}

.demo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: var(--space-sm);
  width: 100%;
}
```

**Problem:** 
- `.demo-row-between` ≈ `.row.row-between`
- `.demo-stack` ≈ `.stack.stack-sm` (with max-width)
- `.demo-grid` ≈ `.grid` (with different min-width)

**Usage found:**
- `StatusDemo.tsx`: `demo-stack`
- `StatDemo.tsx`: `demo-grid`
- `InputDemo.tsx`: `demo-stack` (3 times)

**Recommendation:**
Replace usages with utilities + inline styles for max-width:

```tsx
// Before
<div class="demo-stack">

// After
<div class="stack stack-sm" style="max-width: 320px">
// Or add a utility: .max-w-xs { max-width: 320px }
```

Then remove the demo classes from custom.css.

**Impact:** Reduces CSS by ~20 lines, improves consistency

**Estimated lines:** ~20 lines removed

---

### 5. Consolidate Badge and Status Base Styles

**Priority:** Low | **Effort:** Medium | **Risk:** Medium

**Current State:**
Badge and Status have nearly identical structure:

```css
/* Badge (lines 71-82) */
.badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  padding: 2px var(--space-sm);
  font-size: var(--text-xs);
  font-weight: 500;
  border-radius: 9999px;
  background: var(--bg-alt);
  color: var(--fg-muted);
  border: 1px solid var(--border);
}

/* Status (lines 331-340) */
.status {
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  font-size: var(--text-xs);
  padding: 2px var(--space-sm);
  border-radius: 9999px;
  background: var(--bg-alt);
  border: 1px solid var(--border);
}
```

**Difference:** Badge has `font-weight: 500` and `color: var(--fg-muted)`.

**Recommendation (Option A - CSS consolidation):**
Extract shared "pill" styles:

```css
/* Shared pill base */
.badge,
.status {
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  padding: 2px var(--space-sm);
  font-size: var(--text-xs);
  border-radius: 9999px;
  background: var(--bg-alt);
  border: 1px solid var(--border);
}

/* Badge-specific */
.badge {
  font-weight: 500;
  color: var(--fg-muted);
}
```

**Risk:** Medium - if someone is relying on selector specificity, combining selectors could affect cascade.

**Impact:** Reduces CSS by ~12 lines, clearer relationship between components

**Estimated lines:** ~12 lines reduced

---

### 6. Convert `.card-flat` to CSS Custom Property

**Priority:** Low | **Effort:** Low | **Risk:** Low

**Current State:**
`.card-flat` is a single-property modifier used in one place:

```css
/* components.css lines 122-124 */
.card-flat {
  box-shadow: none;
}
```

**Usage:** Only in `FeatureGrid.astro` (landing page)

**Recommendation:**
Use CSS custom property for shadow instead:

```css
.card {
  /* ... existing styles ... */
  box-shadow: var(--card-shadow, var(--shadow));
}
```

Then remove `.card-flat` and update usage:
```html
<!-- Before -->
<div class="card card-flat">

<!-- After -->
<div class="card" style="--card-shadow: none">
```

**Alternative:** Keep `.card-flat` if you expect it to be used more widely. It's clear and explicit.

**Decision:** **Optional change** - the current approach is fine.

**Impact:** Minor - removes one class, adds flexibility

---

### 7. Document/Remove Unused Utilities

**Priority:** Low | **Effort:** Low | **Risk:** None

**Current State:**
Some utilities appear unused in the component library itself (though users may use them):

| Utility | Used in Library | Notes |
|---------|-----------------|-------|
| `.text-primary`, `.text-muted`, etc. | No | Semantic text colors - keep |
| `.font-medium`, `.font-bold` | No | Typography helpers - keep |
| `.center-narrow`, `.center-wide` | No | Layout variations - keep |
| `.interactive`, `.interactive-color` | No | Hover helpers - keep |
| `.animate-pulse` | No | Animation helper - keep |

**Recommendation:** Keep all utilities. They're part of the public API and users expect them.

**No action needed.**

---

## Summary of Actions

| # | Recommendation | Priority | Effort | Risk | Est. Lines |
|---|---------------|----------|--------|------|------------|
| 1 | Add `step-upcoming` class | High | Low | Low | +5 |
| 2 | Fix collapsible chevron selector | High | Low | Low | ~2 |
| 3 | Add `--info` token | Medium | Low | Low | +8 |
| 4 | Remove demo layout duplicates | Medium | Low | Low | -20 |
| 5 | Consolidate badge/status CSS | Low | Medium | Medium | -12 |
| 6 | Card shadow via custom prop | Low | Low | Low | Optional |
| 7 | Audit unused utilities | Low | Low | None | None |

**Net estimated impact:** ~-17 lines of CSS (simplified/removed)

---

## Execution Phases

### Phase 1: Quick Wins (Can be parallelized)
All low-risk, isolated changes:

- **Task 1A:** Add `step-upcoming` CSS class
  - File: `src/styles/components.css`
  - Lines: ~5
  
- **Task 1B:** Fix collapsible chevron selector (`.open` → `.active`)
  - File: `src/styles/components.css`
  - Lines: ~2
  
- **Task 1C:** Add `--info` and `--info-fg` tokens, update `badge-info`
  - Files: `src/styles/tokens.css`, `src/styles/components.css`
  - Lines: ~8

### Phase 2: Demo Cleanup
Requires updating demo components:

- **Task 2A:** Replace demo layout class usage in demo components
  - Files: `docs/src/components/demos/StatusDemo.tsx`, `StatDemo.tsx`, `InputDemo.tsx`
  - Lines: ~6 changes
  
- **Task 2B:** Remove `.demo-stack`, `.demo-row-between`, `.demo-grid` from custom.css
  - File: `docs/src/styles/custom.css`
  - Lines: -20

### Phase 3: Optional Consolidation (Needs approval)
Breaking change territory:

- **Task 3A:** Consolidate badge/status base styles
  - File: `src/styles/components.css`
  - Risk: Could affect specificity for consumers
  - Lines: ~12 reduced

---

## Breaking Changes

**Phase 1-2 changes are NOT breaking.**

Phase 3 changes should be considered breaking if:
- Users rely on `.badge` and `.status` having different selector specificity
- Users override these classes expecting specific source order

---

## Not Recommended (Considered but rejected)

1. **Data-attribute migration for states** - Already completed via `.active` consolidation. Further migration to `data-*` attributes would be a larger breaking change with minimal benefit now that `.active` is consistent.

2. **Removing `.card-flat`** - It's used and clear. Custom property approach adds flexibility but isn't necessary.

3. **Removing text/font utilities** - These provide semantic value even if not heavily used internally.

4. **Size modifier custom property pattern** - Considered `[data-size="sm"]` pattern but explicit classes like `.btn-sm` are more debuggable.
