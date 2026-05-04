# New Components Implementation Plan

## Executive Summary

This plan details the implementation of 5 new components for the `@f0rbit/ui` library:
1. **IconButton** - Icon-optimized button variant
2. **Checkbox** - Standard checkbox input
3. **Toggle/Switch** - Boolean toggle switch
4. **FormField** - Label + input + error wrapper
5. **Timeline** - Activity feed component (with shared abstraction for Stepper)

### Key Findings

**Stepper vs TimelineList Analysis:**
After analyzing both components, there's a clear abstraction opportunity:

| Aspect | Stepper | TimelineList |
|--------|---------|--------------|
| Structure | Indicator + Content + Connector | Icon + Content (implicit connector via CSS) |
| Connector | Explicit `step-connector` div | CSS-based via `.timeline-row` pseudo-elements |
| Indicator | Numbers/icons in circles | Domain-specific icons (git, reddit, etc.) |
| Content | Title + description | Title + metadata + nested content |
| Orientation | Horizontal/Vertical | Vertical only |

**Proposed Abstraction:** Create a shared `VerticalList` base CSS pattern that both `Stepper` (vertical mode) and `Timeline` can use. The key shared elements are:
- Vertical line connecting items
- Left-aligned indicator column
- Right-aligned content column

However, the components are different enough that a shared *component* abstraction would over-engineer. Instead:
- **Share CSS patterns** via `.vlist-*` utility classes
- **Keep components separate** - their APIs and use cases differ significantly

### Breaking Changes

**None** - All new components are additive.

---

## Component Specifications

### 1. IconButton

**Rationale:** The current `Button` has an `icon` prop, but it's a boolean modifier. An `IconButton` component provides better DX for the common case of icon-only buttons with proper aria labels.

**Proposed API:**

```typescript
export interface IconButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  label: string; // Required for accessibility (aria-label)
  children: JSX.Element; // The icon
}
```

**HTML Structure:**
```html
<button class="btn btn-icon btn-ghost btn-sm" aria-label="Delete item">
  <svg>...</svg>
</button>
```

**CSS:** Uses existing `.btn-icon` class. No new CSS needed.

**Example Usage:**
```tsx
import { IconButton } from "@f0rbit/ui";
import TrashIcon from "lucide-solid/icons/trash";

<IconButton label="Delete item" variant="danger">
  <TrashIcon size={16} />
</IconButton>
```

**Estimated LOC:** ~35 lines (component) + ~20 lines (docs)

---

### 2. Checkbox

**Proposed API:**

```typescript
export interface CheckboxProps extends Omit<JSX.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  description?: string;
  error?: boolean;
  indeterminate?: boolean;
}
```

**HTML Structure:**
```html
<label class="checkbox">
  <input type="checkbox" class="checkbox-input" />
  <span class="checkbox-control">
    <svg class="checkbox-check">...</svg>
  </span>
  <span class="checkbox-content">
    <span class="checkbox-label">Label text</span>
    <span class="checkbox-description">Optional description</span>
  </span>
</label>
```

**CSS Classes:**
```css
.checkbox { /* Container - flex row */ }
.checkbox-input { /* Hidden native input */ }
.checkbox-control { /* Custom checkbox appearance */ }
.checkbox-control::before { /* Check mark */ }
.checkbox-check { /* SVG check icon */ }
.checkbox-label { /* Label text */ }
.checkbox-description { /* Description text */ }
.checkbox-error { /* Error state */ }
```

**Example Usage:**
```tsx
import { Checkbox } from "@f0rbit/ui";

<Checkbox 
  label="Accept terms" 
  description="By checking this you agree to our terms"
  checked={accepted()}
  onChange={(e) => setAccepted(e.target.checked)}
/>
```

**Estimated LOC:** ~60 lines (component) + ~45 lines (CSS) + ~50 lines (docs)

---

### 3. Toggle/Switch

**Proposed API:**

```typescript
export interface ToggleProps extends Omit<JSX.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  description?: string;
  size?: "sm" | "md";
}
```

**HTML Structure:**
```html
<label class="toggle">
  <input type="checkbox" class="toggle-input" role="switch" />
  <span class="toggle-track">
    <span class="toggle-thumb" />
  </span>
  <span class="toggle-content">
    <span class="toggle-label">Label text</span>
    <span class="toggle-description">Optional description</span>
  </span>
</label>
```

**CSS Classes:**
```css
.toggle { /* Container */ }
.toggle-input { /* Hidden native checkbox */ }
.toggle-track { /* The track/rail */ }
.toggle-thumb { /* The sliding circle */ }
.toggle-sm { /* Small variant */ }
.toggle-label { /* Label text */ }
.toggle-description { /* Description */ }
```

**Example Usage:**
```tsx
import { Toggle } from "@f0rbit/ui";

<Toggle 
  label="Dark mode"
  description="Enable dark theme"
  checked={darkMode()}
  onChange={(e) => setDarkMode(e.target.checked)}
/>
```

**Estimated LOC:** ~50 lines (component) + ~55 lines (CSS) + ~45 lines (docs)

---

### 4. FormField

**Rationale:** Common pattern of label + input + error message. This is a layout/wrapper component, not a new input type.

**Proposed API:**

```typescript
export interface FormFieldProps extends JSX.HTMLAttributes<HTMLDivElement> {
  label?: string;
  error?: string;
  required?: boolean;
  htmlFor?: string; // ID of the input for label association
  children: JSX.Element;
}
```

**HTML Structure:**
```html
<div class="form-field">
  <label class="label" for="email">
    Email
    <span class="form-field-required">*</span>
  </label>
  <!-- children (Input, Select, etc.) -->
  <span class="form-error">Invalid email address</span>
</div>
```

**CSS Classes:**
```css
.form-field { /* Container with vertical gap */ }
.form-field-required { /* Asterisk for required */ }
/* .label and .form-error already exist */
```

**Example Usage:**
```tsx
import { FormField, Input } from "@f0rbit/ui";

<FormField 
  label="Email"
  error={errors().email}
  required
  htmlFor="email"
>
  <Input id="email" type="email" error={!!errors().email} />
</FormField>
```

**Estimated LOC:** ~40 lines (component) + ~15 lines (CSS) + ~40 lines (docs)

---

### 5. Timeline

**Design Decision:** After analyzing TimelineList from media-timeline, the Timeline component should be:
- **Generic** - Not domain-specific like GitHub commits or Reddit posts
- **Vertical only** - No horizontal variant (unlike Stepper)
- **Flexible content** - Accept any children for item content
- **Shared CSS patterns** - Use `.vlist-*` classes that Stepper can also adopt

**Proposed API:**

```typescript
export type TimelineItemVariant = "default" | "success" | "error" | "warning" | "info";

export interface TimelineProps extends JSX.HTMLAttributes<HTMLDivElement> {
  children: JSX.Element;
}

export interface TimelineItemProps extends JSX.HTMLAttributes<HTMLDivElement> {
  icon?: JSX.Element;
  variant?: TimelineItemVariant;
  timestamp?: string | JSX.Element;
  title?: string;
  children?: JSX.Element; // Additional content below title
}
```

**HTML Structure:**
```html
<div class="timeline">
  <div class="timeline-item timeline-item-success">
    <div class="timeline-indicator">
      <svg>...</svg>
    </div>
    <div class="timeline-connector" />
    <div class="timeline-content">
      <div class="timeline-header">
        <span class="timeline-title">Deployment completed</span>
        <span class="timeline-timestamp">2 hours ago</span>
      </div>
      <div class="timeline-body">
        <!-- children -->
      </div>
    </div>
  </div>
</div>
```

**CSS Classes:**
```css
/* Base timeline */
.timeline { display: flex; flex-direction: column; }
.timeline-item { display: flex; gap: var(--space-sm); position: relative; }
.timeline-indicator { /* Icon container, 24px circle */ }
.timeline-connector { /* Vertical line */ }
.timeline-content { /* Flex column for content */ }
.timeline-header { /* Row with title + timestamp */ }
.timeline-title { /* Title text */ }
.timeline-timestamp { /* Muted timestamp */ }
.timeline-body { /* Children container */ }

/* Variants */
.timeline-item-success .timeline-indicator { color: var(--success-fg); }
.timeline-item-error .timeline-indicator { color: var(--error-fg); }
/* etc */
```

**Shared CSS Pattern with Stepper:**

The vertical Stepper could be refactored to use shared vertical list patterns:
```css
/* Shared vertical list pattern */
.vlist-connector {
  position: absolute;
  left: 16px; /* Adjust based on indicator size */
  top: 32px;
  bottom: 0;
  width: 1px;
  background: var(--border);
}

.vlist-item:last-child .vlist-connector {
  display: none;
}
```

However, this refactoring is **optional** and can be deferred. The new Timeline component will work standalone.

**Example Usage:**
```tsx
import { Timeline, TimelineItem } from "@f0rbit/ui";

<Timeline>
  <TimelineItem 
    icon={<CheckIcon />}
    variant="success"
    title="Deployment completed"
    timestamp="2 hours ago"
  >
    <p>Production build deployed successfully.</p>
  </TimelineItem>
  <TimelineItem 
    icon={<GitIcon />}
    title="Commit pushed"
    timestamp="3 hours ago"
  >
    <code>abc1234</code> - Fix login bug
  </TimelineItem>
  <TimelineItem 
    icon={<UserIcon />}
    title="Review requested"
    timestamp="5 hours ago"
  />
</Timeline>
```

**Estimated LOC:** ~80 lines (component) + ~70 lines (CSS) + ~70 lines (docs)

---

## Implementation Order

Based on dependencies and complexity:

```
Phase 1: Simple Components (parallel)
├── Task 1A: IconButton (~35 LOC)
├── Task 1B: Checkbox (~60 LOC + ~45 CSS)
└── Task 1C: Toggle (~50 LOC + ~55 CSS)
→ Verification: typecheck, commit

Phase 2: FormField (depends on knowing Input patterns)
└── Task 2A: FormField (~40 LOC + ~15 CSS)
→ Verification: typecheck, commit

Phase 3: Timeline (most complex)
└── Task 3A: Timeline (~80 LOC + ~70 CSS)
→ Verification: typecheck, commit

Phase 4: Documentation & Exports
├── Task 4A: Update index.tsx with exports
├── Task 4B: Create docs for all 5 components
└── Task 4C: Add demo components for docs
→ Verification: full build, commit
```

---

## Task Breakdown

### Phase 1: Simple Components

**Task 1A: IconButton**
- Files: `src/components/IconButton.tsx`
- Subtasks:
  1. Create component with props interface
  2. Implement using existing Button CSS patterns
  3. Add aria-label requirement
- Est: 35 LOC
- Dependencies: None

**Task 1B: Checkbox**
- Files: `src/components/Checkbox.tsx`, `src/styles/components.css`
- Subtasks:
  1. Create CheckIcon SVG component
  2. Create Checkbox component with label/description support
  3. Add indeterminate state support
  4. Add CSS for custom checkbox styling
- Est: 60 LOC (TSX) + 45 LOC (CSS)
- Dependencies: None

**Task 1C: Toggle**
- Files: `src/components/Toggle.tsx`, `src/styles/components.css`
- Subtasks:
  1. Create Toggle component
  2. Add size variants (sm, md)
  3. Add CSS for track/thumb animation
- Est: 50 LOC (TSX) + 55 LOC (CSS)
- Dependencies: None

### Phase 2: FormField

**Task 2A: FormField**
- Files: `src/components/FormField.tsx`, `src/styles/components.css`
- Subtasks:
  1. Create FormField wrapper component
  2. Add label association (htmlFor)
  3. Add required indicator styling
  4. Add error message display
- Est: 40 LOC (TSX) + 15 LOC (CSS)
- Dependencies: None (but should test with Input)

### Phase 3: Timeline

**Task 3A: Timeline**
- Files: `src/components/Timeline.tsx`, `src/styles/components.css`
- Subtasks:
  1. Create Timeline container component
  2. Create TimelineItem component with variants
  3. Add connector line CSS
  4. Add variant styling (success, error, warning, info)
  5. Add responsive timestamp positioning
- Est: 80 LOC (TSX) + 70 LOC (CSS)
- Dependencies: None

### Phase 4: Documentation & Exports

**Task 4A: Exports**
- Files: `src/index.tsx`
- Update exports for all 5 new components
- Est: 15 LOC

**Task 4B: Documentation**
- Files: `docs/src/content/docs/components/*.mdx` (5 files)
- Create MDX docs for each component following existing patterns
- Est: 50 LOC per component = 250 LOC total

**Task 4C: Demo Components**
- Files: `docs/src/components/demos/*.tsx` (5 files)
- Create interactive demos for docs
- Est: 40 LOC per demo = 200 LOC total

---

## Total Estimates

| Component | TSX LOC | CSS LOC | Docs LOC | Total |
|-----------|---------|---------|----------|-------|
| IconButton | 35 | 0 | 70 | 105 |
| Checkbox | 60 | 45 | 90 | 195 |
| Toggle | 50 | 55 | 85 | 190 |
| FormField | 40 | 15 | 80 | 135 |
| Timeline | 80 | 70 | 110 | 260 |
| Exports | 15 | 0 | 0 | 15 |
| **Total** | **280** | **185** | **435** | **900** |

---

## Architectural Decisions Requiring Approval

### 1. Stepper/Timeline Shared CSS

**Question:** Should we refactor Stepper to use shared `.vlist-*` classes that Timeline would also use?

**Recommendation:** No, implement Timeline standalone first. Refactoring Stepper is a separate task that risks breaking existing consumers. The CSS duplication is minimal (~15 lines).

### 2. Checkbox Indeterminate State

**Question:** Should Checkbox support `indeterminate` state (common for "select all" patterns)?

**Recommendation:** Yes, include it. It's native HTML functionality and adds minimal complexity.

### 3. Toggle vs Switch Naming

**Question:** Name the component `Toggle` or `Switch`?

**Recommendation:** `Toggle` - it's clearer that this is a boolean toggle. "Switch" could be confused with switch/case logic.

### 4. FormField vs Field Naming

**Question:** Name the component `FormField` or just `Field`?

**Recommendation:** `FormField` - more explicit about its purpose, avoids potential confusion with other "field" concepts.

---

## File Changes Summary

### New Files
- `src/components/IconButton.tsx`
- `src/components/Checkbox.tsx`
- `src/components/Toggle.tsx`
- `src/components/FormField.tsx`
- `src/components/Timeline.tsx`
- `docs/src/content/docs/components/icon-button.mdx`
- `docs/src/content/docs/components/checkbox.mdx`
- `docs/src/content/docs/components/toggle.mdx`
- `docs/src/content/docs/components/form-field.mdx`
- `docs/src/content/docs/components/timeline.mdx`
- `docs/src/components/demos/IconButtonDemo.tsx`
- `docs/src/components/demos/CheckboxDemo.tsx`
- `docs/src/components/demos/ToggleDemo.tsx`
- `docs/src/components/demos/FormFieldDemo.tsx`
- `docs/src/components/demos/TimelineDemo.tsx`

### Modified Files
- `src/index.tsx` - Add exports
- `src/styles/components.css` - Add new component styles
- `docs/src/data/components.ts` - Add component metadata (if exists)

---

## Testing Strategy

Since this is a UI component library, testing focuses on:

1. **Unit Tests (Pure Functions):** None needed - components are declarative
2. **Component Rendering Tests:** Not in scope for this plan (library uses visual verification via docs)
3. **Integration Tests:** The docs site serves as the integration test - each component has an interactive demo

**Manual Verification Checklist:**
- [ ] All components render in docs
- [ ] Dark mode works for all variants
- [ ] Keyboard navigation works (focus, enter/space for toggles)
- [ ] Screen reader announces labels correctly
- [ ] No TypeScript errors in build
- [ ] CSS animations are smooth (60fps)

---

## Migration Guide for media-timeline

After implementing Timeline, the media-timeline project can:

1. Replace domain-specific `TimelineList` with composition:
```tsx
import { Timeline, TimelineItem } from "@f0rbit/ui";

// Before: <TimelineList groups={groups} />
// After:
<Timeline>
  <For each={items()}>
    {item => (
      <TimelineItem
        icon={<PlatformIcon platform={item.platform} />}
        variant={getVariant(item)}
        title={item.title}
        timestamp={formatRelativeTime(item.timestamp)}
      >
        <ItemContent item={item} />
      </TimelineItem>
    )}
  </For>
</Timeline>
```

2. Keep domain-specific rendering logic (CommitGroupRow, PullRequestRow, etc.) as separate components that can be used as Timeline children.

3. The Timeline CSS provides the vertical line and indicator styling; domain components add platform-specific colors/icons.

This is a **gradual migration** - the media-timeline can adopt Timeline incrementally without breaking changes.
