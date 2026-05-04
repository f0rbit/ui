# State Class Consolidation Analysis

## Executive Summary

This analysis identifies all state-related CSS classes across the codebase and evaluates whether they could be consolidated to use the `.active` class pattern, following the precedent set by the recent consolidation of `.chevron-expanded` and `.dropdown-item-active` → `.active`.

## Already Consolidated (Reference)

These classes have already been consolidated to `.active`:
- `.chevron-expanded` → `.active` (in Chevron.tsx)
- `.dropdown-item-active` → `.active` (in Dropdown.tsx)

The `.active` class is now used with:
- `.chevron.active` - rotates chevron to expanded state
- `.chevron-down.active` - rotates down-facing chevron to expanded state
- `.dropdown-item.active` - highlights active dropdown item
- `.tab.active` - styles active tab
- `.collapsible-chevron.active` - rotates collapsible chevron (Note: already uses `.active`, using Chevron component with `expanded` prop)
- `.color-swatch.active` - highlights selected color in theme playground

---

## Analysis of Remaining State Classes

### 1. SHOULD CONSOLIDATE

#### 1.1 `.collapsible-chevron.open` / `.collapsible-chevron-open`
**Status:** ⚠️ Already consolidated - the CSS now shows `.collapsible-chevron.active`

However, there's legacy CSS that was likely cleaned up. The Collapsible component uses the Chevron component with `expanded` prop which adds `.active` class. The `.collapsible-chevron` class is added for additional styling (position/shrink).

**Location:** `src/styles/components.css` (line 545-553)
**Component:** `src/components/Collapsible.tsx`
**Verdict:** ✅ Already using `.active` pattern via Chevron component

---

### 2. SHOULD NOT CONSOLIDATE

These classes should NOT be consolidated because they:
- Represent different semantic concepts (not binary on/off states)
- Are variant modifiers rather than state toggles
- Could conflict if multiple states are needed on the same element

#### 2.1 Status Component States
**Classes:**
- `.status-active` (line 349-351)
- `.status-inactive` (line 353-355)
- `.status-error` (line 357-359)
- `.status-pending` (line 361-363)

**Location:** `src/styles/components.css`
**Component:** `src/components/Status.tsx`

**Why NOT consolidate:**
- These are **semantic variants**, not toggle states
- A status can only be ONE of these at a time - they're mutually exclusive variants
- Naming follows `component-variant` pattern (like `btn-secondary`, `badge-success`)
- `.active` would be confusing - is "active" the state or the variant?
- The Status component uses `state` prop with union type `"active" | "inactive" | "error" | "pending"`

**Recommendation:** ❌ Keep as-is. These are semantic status indicators, not interactive states.

---

#### 2.2 Stepper Component States
**Classes:**
- `.step-completed` (lines 612-616, 644-647, 672-675)
- `.step-current` (lines 607-611, 668-671)
- `.step-upcoming` (lines 676-680 - implied, no explicit styles yet)

**Location:** `src/styles/components.css`
**Component:** `src/components/Stepper.tsx`

**Why NOT consolidate:**
- These represent **distinct step states** in a multi-step workflow
- A step needs to be one of: completed, current, or upcoming
- Using `.active` only for `.step-current` would lose semantic meaning
- The visual distinction between "completed" and "current" is important

**Recommendation:** ❌ Keep as-is. These represent workflow state progression, not a simple toggle.

---

#### 2.3 Clamp Component State
**Class:** `.clamp-clamped` (lines 497-503)

**Location:** `src/styles/components.css`
**Component:** `src/components/Clamp.tsx`

**Why NOT consolidate:**
- This is applied when content IS clamped (truncated)
- The component toggles between clamped and expanded states
- Could use `.active` for expanded state, but:
  - The CSS applies `display: -webkit-box` and line-clamp - these are the "default/clamped" state
  - Removing the class = expanded (no line clamp)
  
**Current logic:**
```typescript
const contentClasses = () => (expanded() ? "clamp-content" : "clamp-content clamp-clamped");
```

**Alternative consideration:**
If we wanted consistency, we could:
- Keep `.clamp-clamped` as default
- OR flip logic: `.clamp-content.active` = expanded (remove line-clamp)

**Recommendation:** ⚠️ **Possible but questionable**. The current naming `.clamp-clamped` is clearer about what the class DOES (applies line-clamping). Using `.active` would require understanding that "active = expanded = no clamping" which is less intuitive.

---

#### 2.4 Input Error State
**Class:** `.input-error` (line 209-211)

**Location:** `src/styles/components.css`
**Components:** `src/components/Input.tsx` (Input, Textarea, Select)

**Why NOT consolidate:**
- This is an **error state**, not an "active" state
- Semantically different from toggle/selection states
- Applied when form validation fails

**Recommendation:** ❌ Keep as-is. Error states are semantically distinct from active states.

---

#### 2.5 Utility Classes
**Classes:**
- `.hidden` (line 222-224 in utilities.css)
- `.sr-only` (lines 211-220 in utilities.css)

**Why NOT consolidate:**
- These are utility classes, not component states
- `.hidden` is the opposite of "visible/active"
- `.sr-only` is for accessibility, not state

**Recommendation:** ❌ Keep as-is. These are utility modifiers.

---

### 3. NEEDS INVESTIGATION

#### 3.1 Theme Playground `.color-swatch.active`
**Class:** `.color-swatch.active` (line 59-61 in landing.css)

**Location:** `docs/src/styles/landing.css`
**Component:** `docs/src/components/landing/ThemePlayground.tsx`

**Current usage:**
```tsx
classList={{ active: settings().accentHue === preset.hue }}
```

**Verdict:** ✅ Already using `.active` correctly! This is a proper use case - the swatch is "active" when it's the selected color.

---

## Summary Table

| Class | File | Line | Component | Consolidate? | Reason |
|-------|------|------|-----------|--------------|--------|
| `.chevron.active` | components.css | 420 | Chevron.tsx | ✅ Done | Already consolidated |
| `.chevron-down.active` | components.css | 428 | Chevron.tsx | ✅ Done | Already consolidated |
| `.dropdown-item.active` | components.css | 476 | Dropdown.tsx | ✅ Done | Already consolidated |
| `.tab.active` | components.css | 713 | Tabs.tsx | ✅ Done | Already using `.active` |
| `.collapsible-chevron.active` | components.css | 551 | Collapsible.tsx | ✅ Done | Uses Chevron component |
| `.color-swatch.active` | landing.css | 59 | ThemePlayground.tsx | ✅ Done | Already using `.active` |
| `.status-active` | components.css | 349 | Status.tsx | ❌ No | Semantic variant |
| `.status-inactive` | components.css | 353 | Status.tsx | ❌ No | Semantic variant |
| `.status-error` | components.css | 357 | Status.tsx | ❌ No | Semantic variant |
| `.status-pending` | components.css | 361 | Status.tsx | ❌ No | Semantic variant |
| `.step-current` | components.css | 607 | Stepper.tsx | ❌ No | Workflow state |
| `.step-completed` | components.css | 612 | Stepper.tsx | ❌ No | Workflow state |
| `.step-upcoming` | components.css | - | Stepper.tsx | ❌ No | Workflow state |
| `.clamp-clamped` | components.css | 497 | Clamp.tsx | ⚠️ Maybe | Less intuitive naming |
| `.input-error` | components.css | 209 | Input.tsx | ❌ No | Error state |
| `.hidden` | utilities.css | 222 | (utility) | ❌ No | Utility class |
| `.sr-only` | utilities.css | 211 | (utility) | ❌ No | Accessibility utility |

---

## Recommendations

### No Further Action Required

The codebase is already well-organized with the `.active` pattern. All appropriate state classes have been consolidated:

1. **Interactive toggle states** → Use `.active`
   - Chevron expanded/collapsed
   - Dropdown item selection
   - Tab selection
   - Color swatch selection

2. **Semantic variants** → Keep component-specific naming
   - Status states (active, inactive, error, pending)
   - Stepper states (current, completed, upcoming)

3. **Conditional modifiers** → Keep descriptive naming
   - `.clamp-clamped` - describes what it does
   - `.input-error` - describes error state

### Design Principle Established

The `.active` class should be used for:
- **Binary toggle states** where an element is either "on" or "off"
- **Selection states** where one item is selected among siblings
- **Expansion states** where content is shown/hidden

The `.active` class should NOT be used for:
- Semantic variants that describe what something IS (status types, step states)
- Error/warning/validation states
- Utility classes that describe CSS behavior

---

## Appendix: All State-Related Classes Found

### In `src/styles/components.css`:
- Line 420: `.chevron.active`
- Line 428: `.chevron-down.active`
- Line 476: `.dropdown-item.active`
- Line 497: `.clamp-clamped`
- Line 551: `.collapsible-chevron.active`
- Line 349-363: `.status-active`, `.status-inactive`, `.status-error`, `.status-pending`
- Line 607-676: `.step-current`, `.step-completed`, `.step-upcoming`
- Line 713: `.tab.active`
- Line 209: `.input-error`

### In `src/styles/utilities.css`:
- Line 222: `.hidden`
- Line 211: `.sr-only`

### In `docs/src/styles/landing.css`:
- Line 59: `.color-swatch.active`

### In `docs/src/styles/starlight.css`:
- Line 102-104: `[aria-current="page"]` (Starlight framework, not our code)
