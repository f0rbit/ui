# UI Library Migration Analysis: media-timeline Project

**Last Updated:** January 2026  
**Status:** Ready for Implementation

---

## Executive Summary

The `@f0rbit/ui` library can now replace **~45-50%** of the UI-related code in media-timeline, an increase from the original 35-40% estimate. The addition of **Checkbox**, **Toggle**, **FormField**, and **Timeline** components, combined with the IconButton merge into Button, enables significantly more migration.

**Revised Impact Estimate:**
- **CSS Reduction:** ~800-1,000 LOC removable (out of 2,436)
- **TSX Reduction:** ~250-350 LOC removable (out of ~3,500)
- **Net Benefit:** ~1,050-1,350 LOC removed, ~80-120 LOC added (imports/adapters)
- **True Net Reduction:** ~950-1,230 LOC (~18-22% of UI code)

---

## 1. What Changed Since Last Analysis

### New Components Available

| Component | Description | media-timeline Use Cases |
|-----------|-------------|-------------------------|
| **Checkbox** | Styled checkbox with label, description, indeterminate | Repo visibility toggles, filter toggles |
| **Toggle** | Switch component (sm/md sizes) | Settings toggles, visibility badges |
| **FormField** | Label + input + error wrapper | All form fields in ProfileEditor, FilterEditor, RedditCredentialsForm |
| **Timeline** | Activity feed with variants | Could potentially replace simpler parts of TimelineList |

### IconButton Merged into Button

**Before:** Separate `IconButton` component  
**After:** `<Button icon label="...">` prop pattern

```tsx
// Old pattern (media-timeline)
<button class="icon-btn" onClick={handleRefresh} title="Refresh data">
  <RefreshIcon />
</button>

// New pattern (UI library)
<Button icon variant="ghost" label="Refresh data" onClick={handleRefresh}>
  <RefreshIcon />
</Button>
```

### CSS Simplifications

1. **`.btn` is now primary by default** - no need for `btn-primary` class
2. **State classes use `.active`** - consistent with UI lib patterns
3. **Checkbox/Toggle sizes are em-based** - scale with font-size

### New Design Tokens

- `--info` and `--info-fg` for info status color
- All status colors now have complete light/dark mode support

---

## 2. Updated Component Mapping

### Direct Replacements (Drop-in)

| media-timeline | UI Library | Props Mapping | LOC Saved |
|---------------|-----------|---------------|-----------|
| `ChevronIcon.tsx` | `Chevron` | `expanded={bool}` | 21 TSX |
| `StatusBadge.tsx` | `Status` | `state="active\|inactive\|error"` (map "not_configured" to "inactive") | 24 TSX |
| `StatCard.tsx` | `Stat` | `value={val} label={text}` | 13 TSX |
| `.icon-btn` usages | `<Button icon variant="ghost">` | Add `label` for accessibility | ~80 CSS |
| `.spinner` CSS | `Spinner` component | `size="sm\|md\|lg"` | ~25 CSS |

### Form Components (Use FormField + Input)

| media-timeline Pattern | UI Library | Notes |
|----------------------|-----------|-------|
| `.form-row` with label/input/error | `FormField` | Wrap existing inputs |
| `input[type="text"]` styling | `Input` | Add `error` prop |
| `textarea` styling | `Textarea` | Same API |
| `select` styling | `Select` | Same API |
| `.filter-toggle` checkbox | `Checkbox` | Direct replacement with label |

### Modal Pattern (ProfileEditor, FilterEditor)

**Before:**
```tsx
<div class="modal-overlay" onClick={handleOverlayClick} onKeyDown={handleKeyDown}>
  <div class="modal-card">
    <div class="modal-header">
      <h3>Title</h3>
      <button class="modal-close">...</button>
    </div>
    <form class="modal-form">...</form>
  </div>
</div>
```

**After:**
```tsx
<Modal open={isOpen()} onClose={props.onClose}>
  <ModalHeader>
    <ModalTitle>Title</ModalTitle>
  </ModalHeader>
  <ModalBody>
    <form>...</form>
  </ModalBody>
  <ModalFooter>
    <Button variant="secondary" onClick={props.onClose}>Cancel</Button>
    <Button type="submit">Save</Button>
  </ModalFooter>
</Modal>
```

### Settings Collapsible Pattern

**Before (GitHubSettings.tsx):**
```tsx
<div class="settings-section">
  <button type="button" class="settings-header" onClick={toggleExpanded}>
    <ChevronIcon expanded={expanded()} />
    <h6 class="settings-title tertiary text-sm font-medium">Repository Visibility</h6>
  </button>
  <Show when={expanded()}>
    <div class="settings-content">...</div>
  </Show>
</div>
```

**After:**
```tsx
<Collapsible 
  trigger={<span class="settings-title">Repository Visibility</span>}
  defaultOpen={false}
>
  <div class="settings-content">...</div>
</Collapsible>
```

### Checkbox Pattern (Repo Visibility)

**Before (GitHubSettings.tsx):**
```tsx
<label class={`repo-item ${isHidden() ? "repo-hidden" : ""}`}>
  <input type="checkbox" checked={!isHidden()} onChange={() => toggleRepo(repo.full_name)} />
  <span class="repo-name mono text-sm">{repo.full_name}</span>
</label>
```

**After:**
```tsx
<Checkbox
  checked={!isHidden()}
  onChange={() => toggleRepo(repo.full_name)}
  label={repo.full_name}
  description={repo.is_private ? "(private)" : undefined}
  class={isHidden() ? "opacity-50" : ""}
/>
```

### Dropdown Pattern (ProfileSelector)

**Before:**
```tsx
<div class="profile-selector">
  <button class="profile-selector-button" onClick={() => setIsOpen(!isOpen())}>
    <ProfileIcon />
    <span>{buttonLabel()}</span>
    <ChevronDownIcon />
  </button>
  <Show when={isOpen()}>
    <div class="profile-selector-dropdown">
      <For each={profiles()}>
        {p => <button class="profile-selector-item" onClick={() => select(p.slug)}>{p.name}</button>}
      </For>
    </div>
  </Show>
</div>
```

**After:**
```tsx
<Dropdown>
  <DropdownTrigger>
    <Button variant="secondary">
      <ProfileIcon />
      <span>{buttonLabel()}</span>
      <Chevron facing="down" expanded={false} />
    </Button>
  </DropdownTrigger>
  <DropdownMenu>
    <For each={profiles()}>
      {p => (
        <DropdownItem active={currentSlug() === p.slug} onClick={() => select(p.slug)}>
          {p.name}
        </DropdownItem>
      )}
    </For>
    <DropdownDivider />
    <DropdownItem>Manage Profiles</DropdownItem>
  </DropdownMenu>
</Dropdown>
```

---

## 3. CSS Removal Analysis (Updated)

### Removable CSS Sections

| Section | Lines | Remove? | Notes |
|---------|-------|---------|-------|
| Button styles (`.button-reset`, `.icon-btn`, `.oauth-button`, `.btn-secondary`) | ~80 | **YES** | Use `.btn` variants |
| Modal styles (`.modal-*`) | ~80 | **YES** | Use Modal components |
| Status badge (`.status-badge`, `.status-*`) | ~60 | **YES** | Use Status component |
| Spinner (`.spinner`) | ~15 | **YES** | Use Spinner component |
| Form field styles (`.form-row`) | ~30 | **YES** | Use FormField |
| Profile selector dropdown | ~120 | **YES** | Use Dropdown |
| Settings collapsible (`.settings-*`, `.chevron-icon`) | ~50 | **YES** | Use Collapsible |
| Filter toggle (`.filter-toggle`, `.filter-toggles`) | ~20 | **YES** | Use Checkbox |
| Empty state (`.empty-state`) | ~25 | **YES** | Use Empty |
| Card styles (`.card`, `.card-*`) | ~30 | **PARTIAL** | Keep `.card-inactive`, `.card-setup` |
| Input/textarea/select base | ~100 | **PARTIAL** | Keep app-specific styling |
| **Subtotal Removable** | **~610** | | |

### CSS to Keep (Domain-Specific)

| Section | Lines | Reason |
|---------|-------|--------|
| Timeline rendering (`.timeline-flat`, `.timeline-row`, etc.) | ~150 | Complex domain-specific layout |
| Dashboard (`.stats-row`, `.activity-*`, etc.) | ~350 | Analytics visualizations |
| Platform colors (`.platform-github`, etc.) | ~25 | Brand-specific |
| Reddit-specific (`.reddit-*`) | ~60 | Domain-specific styling |
| Filter editor form | ~80 | Complex include/exclude UI |
| Responsive breakpoints | ~100 | App-specific layouts |

---

## 4. File-by-File Migration Guide

### Phase 1: Foundation & Drop-in Replacements

**Task 1.1: Add UI Library Dependency**
```bash
cd /Users/tom/dev/media-timeline/apps/website
bun add @f0rbit/ui
```

**Task 1.2: Import CSS in Layout**
```astro
<!-- src/layouts/Layout.astro -->
---
import "@f0rbit/ui/styles";
---
```

**Task 1.3: Create Token Override File**

Create `src/styles/ui-overrides.css`:
```css
/* Map media-timeline tokens to UI library tokens */
:root {
  /* UI lib uses these, media-timeline defines similar */
  --bg: var(--bg-primary);
  --fg: var(--text-primary);
  --fg-muted: var(--text-secondary);
  --fg-subtle: var(--text-tertiary);
  --fg-faint: var(--text-muted);
  --accent: var(--text-link);
  --border: var(--input-border);
  --bg-alt: var(--input-background);
  
  /* Map status colors */
  --success: var(--item-green);
  --error: var(--item-red);
}
```

Import after UI library CSS in layout.

**Task 1.4: Replace ChevronIcon**

`src/components/solid/ChevronIcon.tsx` - **DELETE** and update imports:
```tsx
// Before
import ChevronIcon from "../ChevronIcon";
<ChevronIcon expanded={expanded()} />

// After
import { Chevron } from "@f0rbit/ui";
<Chevron expanded={expanded()} />
```

**Files to update:** `GitHubSettings.tsx`, `RedditSettings.tsx`, `TwitterSettings.tsx`, `BlueskySettings.tsx`, `DevpadSettings.tsx`, `YouTubeSettings.tsx`

**Task 1.5: Replace StatusBadge**

`src/components/solid/StatusBadge.tsx` - **DELETE** and update:
```tsx
// Before
import StatusBadge from "./StatusBadge";
<StatusBadge state={connectionState} />

// After
import { Status } from "@f0rbit/ui";
// Map "not_configured" to "inactive"
const mapState = (s: ConnectionState): StatusState => 
  s === "not_configured" ? "inactive" : s;
<Status state={mapState(connectionState)} />
```

**Files to update:** `PlatformCard.tsx`, `ConnectionCard.tsx`

**Task 1.6: Replace StatCard**

`src/components/solid/Dashboard/StatCard.tsx` - **DELETE** and update:
```tsx
// Before
<StatCard value={123} label="Total Items" />

// After
import { Stat } from "@f0rbit/ui";
<Stat value={123} label="Total Items" />
```

**Files to update:** `DashboardStats.tsx`

### Phase 2: Form Components

**Task 2.1: Update ProfileEditor**

```tsx
// src/components/solid/ProfileEditor.tsx
import { Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter, Button, FormField, Input, Textarea } from "@f0rbit/ui";

export default function ProfileEditor(props: ProfileEditorProps) {
  // ... existing state logic ...

  return (
    <Modal open={true} onClose={props.onClose}>
      <ModalHeader>
        <ModalTitle>{isEditMode() ? "Edit Profile" : "Create Profile"}</ModalTitle>
      </ModalHeader>
      
      <ModalBody>
        <form onSubmit={handleSubmit} class="stack gap-md">
          <FormField label="Name" required error={undefined}>
            <Input 
              value={name()} 
              onInput={e => setName(e.currentTarget.value)} 
              placeholder="My Profile"
            />
          </FormField>

          <FormField label="Slug" required error={slugError() ?? undefined} description="lowercase letters, numbers, and hyphens only">
            <Input 
              value={slug()} 
              onInput={e => handleSlugInput(e.currentTarget.value)}
              placeholder="my-profile"
              error={!!slugError()}
            />
          </FormField>

          <FormField label="Description">
            <Textarea 
              value={description()} 
              onInput={e => setDescription(e.currentTarget.value)}
              placeholder="A brief description..."
              rows={3}
            />
          </FormField>

          <Show when={error()}>
            <div class="form-error">{error()}</div>
          </Show>
        </form>
      </ModalBody>

      <ModalFooter>
        <Button variant="secondary" onClick={props.onClose} disabled={saving()}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={!canSubmit()}>
          {saving() ? "Saving..." : isEditMode() ? "Save Changes" : "Create Profile"}
        </Button>
      </ModalFooter>
    </Modal>
  );
}
```

**Task 2.2: Update FilterEditor**

Similar pattern to ProfileEditor. Key changes:
- Wrap entire modal with `<Modal>`
- Use `FormField` for each form row
- Use `Select` for dropdowns
- Use `Input` for text fields
- Use `Button` for actions

**Task 2.3: Update ConnectionActions**

```tsx
// Before
<button class="icon-btn" onClick={handleRefresh} disabled={refreshing()} title="Refresh data">
  <RefreshIcon spinning={refreshing()} />
</button>

// After
import { Button } from "@f0rbit/ui";
<Button icon variant="ghost" label="Refresh data" onClick={handleRefresh} disabled={refreshing()}>
  <RefreshIcon spinning={refreshing()} />
</Button>
```

### Phase 3: Settings Components

**Task 3.1: Update GitHubSettings (and other Settings components)**

```tsx
import { Collapsible, Checkbox } from "@f0rbit/ui";

export default function GitHubSettings(props: Props) {
  // ... existing logic ...

  return (
    <Collapsible
      trigger={
        <>
          <span class="settings-title">Repository Visibility</span>
          <Show when={repos()?.length}>
            <span class="muted text-xs">({visibleCount()}/{repos()?.length} visible)</span>
          </Show>
        </>
      }
    >
      <Show when={repos()} keyed>
        {repoList => (
          <div class="repo-list">
            <For each={repoList}>
              {repo => (
                <Checkbox
                  checked={!hiddenRepos().has(repo.full_name)}
                  onChange={() => toggleRepo(repo.full_name)}
                  label={repo.full_name}
                  description={repo.is_private ? "(private)" : isHidden() ? "(hidden)" : undefined}
                  disabled={repoUpdating() === repo.full_name}
                  class={`mono text-sm ${hiddenRepos().has(repo.full_name) ? "opacity-50" : ""}`}
                />
              )}
            </For>
          </div>
        )}
      </Show>
    </Collapsible>
  );
}
```

### Phase 4: Dropdown Components

**Task 4.1: Update ProfileSelector**

```tsx
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, DropdownDivider, Button, Chevron } from "@f0rbit/ui";

// Replace custom dropdown implementation with:
<Dropdown>
  <DropdownTrigger>
    <Button variant="secondary" class="profile-selector-button">
      <ProfileIcon />
      <span class="profile-selector-label">{buttonLabel()}</span>
      <Chevron facing="down" size={14} />
    </Button>
  </DropdownTrigger>
  <DropdownMenu>
    <For each={profileList()}>
      {profile => (
        <DropdownItem 
          active={currentSlug() === profile.slug}
          onClick={() => handleSelect(profile.slug)}
        >
          <span class="profile-selector-radio">
            {currentSlug() === profile.slug ? <CheckIcon /> : null}
          </span>
          {profile.name}
        </DropdownItem>
      )}
    </For>
    <DropdownDivider />
    <DropdownItem as="a" href={buildUrl("/connections", currentSlug())}>
      <PlusIcon />
      Manage Profiles
    </DropdownItem>
  </DropdownMenu>
</Dropdown>
```

### Phase 5: CSS Cleanup

**Task 5.1: Remove Replaced CSS Sections**

Delete from `main.css`:
- Lines 627-668 (button reset, submit, icon-btn)
- Lines 670-684 (oauth-button) - but keep if distinct styling needed
- Lines 2062-2155 (modal styles)
- Lines 1125-1156 (status badge)
- Lines 385-396 (spinner)
- Lines 592-621 (filter-toggle, filter-toggles)
- Lines 1175-1218 (settings-section, settings-header, etc.)
- Lines 2176-2315 (profile-selector styles)
- Lines 466-488 (empty-state)

**Task 5.2: Keep/Adapt These CSS Sections**

- Timeline styles (lines 871-999) - domain-specific
- Dashboard styles (lines 1476-1837) - domain-specific
- Platform colors (lines 1084-1107) - brand-specific
- Reddit-specific styles - domain-specific
- Filter editor advanced styles (include/exclude coloring)

---

## 5. Updated LOC Estimates

### Phase-by-Phase Breakdown

| Phase | Task | TSX Change | CSS Change | Effort |
|-------|------|------------|------------|--------|
| **1: Foundation** | | | | **2-3 hours** |
| 1.1 | Add dependency | +5 | 0 | 10 min |
| 1.2 | Import CSS | +2 | 0 | 5 min |
| 1.3 | Token overrides | +20 | 0 | 30 min |
| 1.4 | Replace ChevronIcon | -21, +30 imports | 0 | 30 min |
| 1.5 | Replace StatusBadge | -24, +15 imports | -60 | 30 min |
| 1.6 | Replace StatCard | -13, +10 imports | -30 | 20 min |
| **2: Forms** | | | | **3-4 hours** |
| 2.1 | ProfileEditor | ~-30 | -40 | 1.5 hours |
| 2.2 | FilterEditor | ~-50 | -60 | 2 hours |
| 2.3 | ConnectionActions | ~-20 | -30 | 30 min |
| **3: Settings** | | | | **2-3 hours** |
| 3.1 | GitHubSettings | ~-25 | -50 | 45 min |
| 3.2-3.6 | Other Settings (5) | ~-75 | 0 | 1.5 hours |
| **4: Dropdown** | | | | **2-3 hours** |
| 4.1 | ProfileSelector | ~-40 | -120 | 2 hours |
| **5: CSS Cleanup** | | | | **1-2 hours** |
| 5.1 | Remove replaced CSS | 0 | -200 | 1 hour |
| 5.2 | Audit remaining | 0 | -50 | 30 min |

### Summary

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| TSX LOC | ~3,500 | ~3,200 | -300 (~8.5%) |
| CSS LOC | 2,436 | ~1,600 | -836 (~34%) |
| **Total** | ~5,936 | ~4,800 | **-1,136 (~19%)** |

---

## 6. Gaps Still Remaining

### Cannot Replace (Domain-Specific)

| Component | Reason |
|-----------|--------|
| `TimelineList.tsx` | Complex GitHub/Reddit/Twitter rendering logic |
| `Dashboard/*.tsx` | Analytics charts, activity grid |
| `PlatformIcon.tsx` | Platform-specific SVG icons |
| Filter include/exclude UI | Complex color-coded toggle buttons |

### Potential Future UI Library Additions

1. **ActivityGrid** - GitHub-style contribution heatmap
2. **DistributionBar** - Horizontal bar with label/value
3. **SkeletonLoader** - Loading placeholder (for `.auth-loading`)

### Visual Adjustments Needed

After migration, verify:
1. Button padding matches expected visual
2. Modal width/max-height works for filter editor
3. Checkbox sizing in repo list is appropriate
4. Status badge pill shape matches design

---

## 7. Task List for Implementation

### Prerequisites
- [ ] Ensure `@f0rbit/ui` is published and accessible via npm/bun

### Phase 1: Foundation (Parallel Safe)
- [ ] **1.1** Add `@f0rbit/ui` dependency
- [ ] **1.2** Import CSS in Layout.astro
- [ ] **1.3** Create `ui-overrides.css` token mapping
- [ ] **1.4** Replace `ChevronIcon` with `Chevron` (6 files)
- [ ] **1.5** Replace `StatusBadge` with `Status` (2 files)
- [ ] **1.6** Replace `StatCard` with `Stat` (1 file)
- [ ] **Verify:** Run build, check no visual regressions

### Phase 2: Forms (Sequential)
- [ ] **2.1** Refactor `ProfileEditor.tsx` to use Modal + FormField + Input
- [ ] **2.2** Refactor `FilterEditor.tsx` to use Modal + FormField + Select
- [ ] **2.3** Update `ConnectionActions.tsx` to use Button (icon variant)
- [ ] **Verify:** Test create/edit profile, add/remove filter, connection actions

### Phase 3: Settings (Parallel Safe after Phase 2)
- [ ] **3.1** Refactor `GitHubSettings.tsx` with Collapsible + Checkbox
- [ ] **3.2** Refactor `RedditSettings.tsx`
- [ ] **3.3** Refactor `TwitterSettings.tsx`
- [ ] **3.4** Refactor `BlueskySettings.tsx`
- [ ] **3.5** Refactor `DevpadSettings.tsx`
- [ ] **3.6** Refactor `YouTubeSettings.tsx`
- [ ] **Verify:** Test expanding/collapsing, toggle repo visibility

### Phase 4: Dropdown (After Phase 1)
- [ ] **4.1** Refactor `ProfileSelector.tsx` to use Dropdown components
- [ ] **Verify:** Test profile switching, dropdown open/close, keyboard nav

### Phase 5: CSS Cleanup (After All Above)
- [ ] **5.1** Remove replaced CSS sections from `main.css`
- [ ] **5.2** Audit for any orphaned styles
- [ ] **5.3** Run full visual regression check
- [ ] **Final:** Verify dark mode works correctly

---

## 8. Breaking Changes to Consider

1. **CSS Layer Order**: UI library uses `@layer`, ensure media-timeline's CSS loads after
2. **Dark Mode**: UI lib supports `data-theme` attribute - may need to add theme toggle
3. **Button Default**: `.btn` is now primary-styled by default - remove any `.btn-primary` classes
4. **Status State**: Map `"not_configured"` to `"inactive"` for Status component

---

## 9. Conclusion

This migration is now **more valuable** than originally estimated due to the new components. The ~19% total LOC reduction (~1,136 lines) significantly reduces maintenance burden, especially for:

- **Form handling**: FormField provides consistent error/label/description patterns
- **Checkboxes**: Proper accessibility, em-based sizing, indeterminate support
- **Settings**: Collapsible replaces custom expand/collapse logic
- **Modals**: Built-in escape/click-outside handling, Portal rendering

The domain-specific components (timeline, dashboard, platform icons) correctly remain in media-timeline as they encode business logic that doesn't belong in a generic UI library.

**Recommended approach**: Implement phases sequentially with verification after each phase. This allows catching regressions early and maintains a working application throughout the migration.
