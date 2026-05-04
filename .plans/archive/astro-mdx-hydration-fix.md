# Astro MDX Hydration Fix for Tabs, Collapsible, and Stepper

## Executive Summary

SolidJS components using `<Show when={...}>` for conditional rendering lose Astro-rendered children (code blocks, markdown, etc.) when used with `client:load` hydration. The core issue is that SolidJS context isn't available during SSR, causing `<Show when={isActive()}>` to evaluate as `false` and preventing children from being rendered into the initial HTML.

**Solution:** Replace conditional rendering (`<Show>`) with CSS-based visibility (`display: none`). This ensures all content is rendered into the DOM during SSR, and JavaScript only toggles visibility classes.

**Breaking Changes:** None - the public API remains identical. Only internal implementation changes.

## Root Cause Analysis

### How Astro Handles Framework Component Children

When you write:
```mdx
<Tabs defaultValue="tab1" client:load>
  <TabPanel value="tab1">
    ```typescript
    const x = 1;
    ```
  </TabPanel>
</Tabs>
```

Astro:
1. **At build time:** Renders the MDX content (code block) to HTML
2. **Passes to SolidJS:** The pre-rendered HTML is passed as `children` to the SolidJS component
3. **SSR phase:** SolidJS renders the component on the server
4. **Hydration:** The client-side JS takes over the pre-rendered HTML

### The Problem

In `TabPanel.tsx`:
```tsx
export function TabPanel(props: TabPanelProps) {
  const ctx = useContext(TabsContext);
  const isActive = () => ctx?.activeTab() === local.value;
  
  return (
    <Show when={isActive()}>  // ❌ During SSR, ctx is undefined → isActive() = false
      <div class="tab-panel">{local.children}</div>  // ❌ Never renders
    </Show>
  );
}
```

During SSR:
- `useContext(TabsContext)` returns `undefined` (context providers don't work the same in SSR)
- `isActive()` returns `false` (because `undefined?.activeTab() === value` is false)
- `<Show when={false}>` doesn't render children
- The Astro-rendered HTML (code block) is discarded and never makes it to the DOM

Same issue affects:
- `Collapsible.tsx` - uses `<Show when={isOpen()}>` for content

## Solution

### Strategy: CSS-Based Visibility

Replace `<Show>` conditional rendering with always-render + CSS hide pattern:

```tsx
// Before: Conditional rendering (broken with Astro)
<Show when={isActive()}>
  <div class="tab-panel">{children}</div>
</Show>

// After: CSS-based visibility (works with Astro)
<div 
  class="tab-panel"
  hidden={!isActive()}
>
  {children}
</div>
```

**Why this works:**
1. All panels render during SSR → Astro children are in the DOM
2. The `hidden` attribute hides inactive panels (native browser behavior: `display: none`)
3. On hydration, SolidJS takes over and toggles the `hidden` attribute reactively
4. The `hidden` attribute provides accessibility semantics

### Components to Fix

| Component | Issue | Fix |
|-----------|-------|-----|
| `TabPanel` | `<Show when={isActive()}>` | Use `hidden` attribute |
| `Collapsible` | `<Show when={isOpen()}>` | Use `hidden` attribute |
| `Step` | `<Show when={local.children}>` | Minor - not context-dependent, but can clean up |

---

## Task Breakdown

### Phase 1: Core Component Fixes (Parallel)

These tasks can be executed in parallel as they modify different files.

---

#### Task 1.1: Fix TabPanel Component

**File:** `/Users/tom/dev/ui/src/components/Tabs.tsx`  
**Estimated Lines Changed:** ~10

**Current Code (lines 105-119):**
```tsx
export function TabPanel(props: TabPanelProps) {
  const [local, rest] = splitProps(props, ["value", "children", "class"]);
  const ctx = useContext(TabsContext);

  const isActive = () => ctx?.activeTab() === local.value;

  const classes = () => `tab-panel ${local.class ?? ""}`.trim();

  return (
    <Show when={isActive()}>
      <div class={classes()} role="tabpanel" {...rest}>
        {local.children}
      </div>
    </Show>
  );
}
```

**New Code:**
```tsx
export function TabPanel(props: TabPanelProps) {
  const [local, rest] = splitProps(props, ["value", "children", "class"]);
  const ctx = useContext(TabsContext);

  const isActive = () => ctx?.activeTab() === local.value;

  const classes = () => `tab-panel ${local.class ?? ""}`.trim();

  return (
    <div class={classes()} role="tabpanel" hidden={!isActive()} {...rest}>
      {local.children}
    </div>
  );
}
```

**Changes:**
1. Remove `<Show when={isActive()}>` wrapper
2. Add `hidden={!isActive()}` attribute to the div
3. Remove `Show` from imports (if no longer used)

---

#### Task 1.2: Fix Collapsible Component

**File:** `/Users/tom/dev/ui/src/components/Collapsible.tsx`  
**Estimated Lines Changed:** ~5

**Current Code (lines 28-38):**
```tsx
return (
  <div class="collapsible">
    <button class="collapsible-trigger" onClick={toggle}>
      {local.trigger}
      <Chevron class="collapsible-chevron" expanded={isOpen()} />
    </button>
    <Show when={isOpen()}>
      <div class="collapsible-content">{local.children}</div>
    </Show>
  </div>
);
```

**New Code:**
```tsx
return (
  <div class="collapsible">
    <button class="collapsible-trigger" onClick={toggle}>
      {local.trigger}
      <Chevron class="collapsible-chevron" expanded={isOpen()} />
    </button>
    <div class="collapsible-content" hidden={!isOpen()}>
      {local.children}
    </div>
  </div>
);
```

**Changes:**
1. Remove `<Show when={isOpen()}>` wrapper
2. Add `hidden={!isOpen()}` attribute to the content div
3. Remove `Show` from imports

---

#### Task 1.3: Review Step Component (Stepper)

**File:** `/Users/tom/dev/ui/src/components/Stepper.tsx`  
**Estimated Lines Changed:** ~0 (no change needed)

**Current Code (lines 110-115):**
```tsx
<Show when={local.description}>
  <div class="step-description">{local.description}</div>
</Show>
<Show when={local.children}>
  <div class="step-body">{local.children}</div>
</Show>
```

**Analysis:**
These `<Show>` usages check for the **presence** of props, not context values. When Astro passes pre-rendered HTML as `children`, it will be truthy, so `<Show when={local.children}>` will pass.

**Decision:** No change needed. The Step component works correctly because:
- `local.children` from Astro will be the pre-rendered HTML (truthy)
- The Show condition isn't dependent on reactive context

---

### Phase 2: Verification & Commit

After Phase 1 agents complete, run a verification agent to:

1. Run typecheck: `bun run typecheck`
2. Run build: `bun run build`
3. Verify no regressions in existing demos
4. Commit changes

---

### Phase 3: Update Astro Wrapper Components (Optional)

**Files:**
- `/Users/tom/dev/ui/docs/src/components/Stepper.astro`
- `/Users/tom/dev/ui/docs/src/components/Step.astro`

**Note:** These are Astro-only wrappers that render static HTML. They already work correctly because they don't use SolidJS at all. They just output the CSS class structure directly.

No changes needed here.

---

### Phase 4: Documentation Updates (Optional)

**File:** `/Users/tom/dev/ui/docs/src/content/docs/components/tabs.mdx`  
**Estimated Lines Added:** ~25

Add a section about Astro usage:

```mdx
## Astro Integration

Tabs works seamlessly with Astro MDX files. You can pass Astro-rendered content (markdown, code blocks, etc.) as children:

```mdx
import { Tabs, TabList, Tab, TabPanel } from "@f0rbit/ui";

<Tabs defaultValue="typescript" client:load>
  <TabList>
    <Tab value="typescript">TypeScript</Tab>
    <Tab value="javascript">JavaScript</Tab>
  </TabList>
  <TabPanel value="typescript">
    ```typescript
    const greeting: string = "Hello, World!";
    ```
  </TabPanel>
  <TabPanel value="javascript">
    ```javascript
    const greeting = "Hello, World!";
    ```
  </TabPanel>
</Tabs>
```

The `client:load` directive ensures the component is interactive. All tab panels are rendered in the HTML during build, ensuring code blocks and other MDX content display correctly.
```

---

## Summary

| Phase | Tasks | Parallelizable | Est. Total Lines |
|-------|-------|----------------|------------------|
| 1 | Fix TabPanel, Fix Collapsible, Review Step | Yes (all 3) | 15 |
| 2 | Typecheck, Build, Commit | Sequential | 0 |
| 3 | Update Astro wrappers | N/A (no changes) | 0 |
| 4 | Documentation | After Phase 2 | 25 |

**Total Estimated Changes:** ~40 lines

---

## Critical Notes

1. **The `hidden` attribute is the key insight** - it's a native HTML attribute that browsers handle as `display: none`. No custom CSS needed.

2. **Import cleanup** - After removing `<Show>`, check if it's still used elsewhere in the file. If not, remove it from imports.

3. **No CSS changes needed** - The `hidden` attribute works natively. The existing `.tab-panel` and `.collapsible-content` CSS rules in `/Users/tom/dev/ui/src/styles/components.css` don't need modification.

4. **Accessibility preserved** - The `hidden` attribute is semantically correct for hiding content and is respected by screen readers.
