# New Components Implementation Plan

## Overview

This plan covers the extraction and generalization of three components from `dev-blog` into reusable `@f0rbit/ui` library components:

| Component | Source | Priority | Complexity | Est. LOC |
|-----------|--------|----------|------------|----------|
| **ChipInput** | `tag-editor.tsx` | HIGH | Low | ~80 |
| **Tree** | `category-tree.tsx` | MEDIUM-HIGH | Medium | ~150 |
| **MultiSelect** | `project-selector.tsx` | MEDIUM | Medium | ~120 |

**Total estimated effort:** ~350 lines of TypeScript + ~200 lines of CSS

---

## 1. ChipInput Component

### Description
An input field for managing a collection of string values (tags, keywords, etc.) displayed as removable chips/badges. Users can add new values by typing and pressing Enter, and remove existing values by clicking the X button.

### Source Analysis
From `tag-editor.tsx`:
- Simple controlled component with `tags: string[]` and `onChange: (tags: string[]) => void`
- Handles input, Enter key to add, click to remove
- Trims and lowercases input (blog-specific - should be configurable)
- Prevents duplicates
- Uses inline SVG for close icon

### Props API

```typescript
export interface ChipInputProps extends Omit<JSX.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  /** Current list of chip values */
  value: string[];
  
  /** Called when the list changes */
  onChange: (value: string[]) => void;
  
  /** Transform input before adding (e.g., lowercase, trim). Default: trim only */
  transform?: (input: string) => string;
  
  /** Validate input before adding. Return false to prevent. Default: non-empty after transform */
  validate?: (input: string, current: string[]) => boolean;
  
  /** Allow duplicate values. Default: false */
  allowDuplicates?: boolean;
  
  /** Key(s) that trigger adding a chip. Default: ['Enter'] */
  addKeys?: string[];
  
  /** Placeholder text for the input */
  placeholder?: string;
  
  /** Whether the input is disabled */
  disabled?: boolean;
  
  /** Whether the input has an error state */
  error?: boolean;
  
  /** Custom class for the container */
  class?: string;
}
```

### Accessibility Considerations
- Remove buttons must have `aria-label` describing which chip will be removed
- Input should have appropriate `aria-describedby` if used with FormField
- Chips should be focusable for keyboard navigation (consider tab through chips)
- Announce chip additions/removals to screen readers via live region (optional enhancement)

### CSS Classes

```css
.chip-input                    /* Container wrapping chips + input */
.chip-input-chips             /* Flex container for the chip badges */
.chip-input-chip              /* Individual chip (extends .badge) */
.chip-input-chip-remove       /* Remove button within chip */
.chip-input-field             /* The text input field */
.chip-input-disabled          /* Applied to container when disabled */
.chip-input-error             /* Applied to container when error=true */
```

### Usage Examples

```tsx
// Basic usage
<ChipInput
  value={tags()}
  onChange={setTags}
  placeholder="Add a tag..."
/>

// With FormField wrapper
<FormField label="Tags" description="Press Enter to add">
  <ChipInput
    value={tags()}
    onChange={setTags}
    placeholder="Type and press Enter"
  />
</FormField>

// Custom transform (lowercase everything)
<ChipInput
  value={keywords()}
  onChange={setKeywords}
  transform={(s) => s.toLowerCase().trim()}
/>

// Allow comma-separated input
<ChipInput
  value={emails()}
  onChange={setEmails}
  addKeys={['Enter', ',']}
  validate={(email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)}
/>
```

### Implementation Notes
- **Reuse `Badge` component** for displaying chips (with variant="default")
- Keep the inline X icon (SVG) - simpler than adding icon dependency
- Wrap input in container that shows chips inline
- Default transform: `(s) => s.trim()`
- Default validate: `(s, current) => s.length > 0 && !current.includes(s)`
- Use `splitProps` pattern consistent with other components
- Support passing through input props (id, name, etc.) to the actual input element

### Estimated Effort
- **TypeScript:** ~60 lines
- **CSS:** ~40 lines
- **Complexity:** Low

---

## 2. Tree Component

### Description
A hierarchical tree view for displaying and interacting with nested data structures. Supports expand/collapse, visual guide lines connecting parent-child relationships, and per-node actions.

### Source Analysis
From `category-tree.tsx`:
- Builds tree from flat array using `parent` field
- Recursive `TreeNodeItem` component
- Visual guides: vertical lines, corners, and tee connectors
- Per-node action buttons (add child, delete)
- Tracks `ancestorIsLast` array for proper guide rendering
- Hardcoded "root" node handling (blog-specific)

### Props API

```typescript
export interface TreeNode<T = unknown> {
  /** Unique identifier for the node */
  id: string;
  
  /** Display label for the node */
  label: string;
  
  /** Child nodes */
  children?: TreeNode<T>[];
  
  /** Optional user data attached to node */
  data?: T;
}

export interface TreeProps<T = unknown> {
  /** Tree data - can be a single root or array of roots */
  nodes: TreeNode<T>[] | TreeNode<T>;
  
  /** Render function for node content. Default: renders label */
  renderNode?: (node: TreeNode<T>, depth: number) => JSX.Element;
  
  /** Render function for node actions (right side) */
  renderActions?: (node: TreeNode<T>, depth: number) => JSX.Element;
  
  /** Show connecting guide lines. Default: true */
  showGuides?: boolean;
  
  /** Initial expanded state. Default: all expanded */
  defaultExpanded?: boolean | string[];
  
  /** Controlled expanded state */
  expanded?: string[];
  
  /** Called when expansion state changes */
  onExpandedChange?: (expanded: string[]) => void;
  
  /** Empty state message */
  emptyMessage?: string;
  
  /** Custom class for container */
  class?: string;
}

// Also export a utility for building trees from flat data
export interface FlatTreeItem {
  id: string;
  label: string;
  parentId?: string | null;
  [key: string]: unknown;
}

export function buildTree<T extends FlatTreeItem>(items: T[]): TreeNode<T>[];
```

### Accessibility Considerations
- Use `role="tree"` on container, `role="treeitem"` on nodes
- `aria-expanded` on expandable nodes
- `aria-level` to indicate depth
- `aria-setsize` and `aria-posinset` for position within siblings
- Arrow key navigation (optional enhancement for v2)

### CSS Classes

```css
.tree                          /* Root container */
.tree-node                     /* Individual node row */
.tree-node-guides              /* Container for guide lines */
.tree-guide                    /* Base guide element */
.tree-guide--line              /* Vertical continuation line */
.tree-guide--empty             /* Empty space (no line) */
.tree-guide--corner            /* L-shaped corner for last child */
.tree-guide--tee               /* T-shaped connector for non-last children */
.tree-node-expand              /* Expand/collapse button */
.tree-node-content             /* Node label/content area */
.tree-node-actions             /* Actions container (right side) */
.tree-empty                    /* Empty state message */
```

### Usage Examples

```tsx
// Simple tree with data
const nodes: TreeNode[] = [
  {
    id: '1',
    label: 'Documents',
    children: [
      { id: '1.1', label: 'Work' },
      { id: '1.2', label: 'Personal' },
    ]
  },
  { id: '2', label: 'Downloads' }
];

<Tree nodes={nodes} />

// With actions
<Tree
  nodes={categories}
  renderActions={(node) => (
    <>
      <button onClick={() => addChild(node.id)}>+</button>
      <button onClick={() => deleteNode(node.id)}>-</button>
    </>
  )}
/>

// From flat data
const flat = [
  { id: '1', label: 'Root', parentId: null },
  { id: '2', label: 'Child', parentId: '1' },
];

<Tree nodes={buildTree(flat)} />

// Custom node rendering
<Tree
  nodes={files}
  renderNode={(node) => (
    <span class="flex items-center gap-2">
      <FileIcon type={node.data?.type} />
      {node.label}
    </span>
  )}
/>
```

### Implementation Notes
- **Extract `buildTree` as utility** - useful standalone function
- The guide line rendering logic is clever - preserve it
- Make expand/collapse optional (some trees are always fully expanded)
- Consider: should leaf nodes (no children) show expand toggle? Probably not
- Internal state for uncontrolled expand/collapse
- Default to all expanded (matches source behavior)
- `renderNode` and `renderActions` give full customization without bloating props

### Estimated Effort
- **TypeScript:** ~120 lines (including buildTree utility)
- **CSS:** ~60 lines
- **Complexity:** Medium (recursive rendering, guide logic)

---

## 3. MultiSelect Component

### Description
A dropdown-based component for selecting multiple items from a list. Displays selected items as removable badges and provides a searchable dropdown for adding more.

### Source Analysis
From `project-selector.tsx`:
- Shows selected items as badges with remove buttons
- Toggle button to open/close dropdown
- Dropdown lists available (unselected) items
- Has refresh functionality (blog-specific API call)
- Uses `createResource` for data fetching (blog-specific)

### Props API

```typescript
export interface MultiSelectOption<T = string> {
  /** Unique value for the option */
  value: T;
  
  /** Display label */
  label: string;
  
  /** Optional description shown in dropdown */
  description?: string;
  
  /** Whether option is disabled */
  disabled?: boolean;
}

export interface MultiSelectProps<T = string> {
  /** All available options */
  options: MultiSelectOption<T>[];
  
  /** Currently selected values */
  value: T[];
  
  /** Called when selection changes */
  onChange: (value: T[]) => void;
  
  /** Placeholder when nothing selected */
  placeholder?: string;
  
  /** Text for the toggle button when closed. Default: "Add" */
  addLabel?: string;
  
  /** Text for the toggle button when open. Default: "Done" */
  doneLabel?: string;
  
  /** Message when no more options available */
  emptyMessage?: string;
  
  /** Enable search/filter in dropdown. Default: false */
  searchable?: boolean;
  
  /** Search placeholder text */
  searchPlaceholder?: string;
  
  /** Maximum number of selections. Default: unlimited */
  max?: number;
  
  /** Whether component is disabled */
  disabled?: boolean;
  
  /** Custom class for container */
  class?: string;
  
  /** Render custom badge content */
  renderBadge?: (option: MultiSelectOption<T>) => JSX.Element;
  
  /** Render custom option content in dropdown */
  renderOption?: (option: MultiSelectOption<T>) => JSX.Element;
}
```

### Composition Analysis

**Can MultiSelect be composed from existing components?**

Yes, partially:
- `Badge` - for selected items (but needs remove button variant)
- `Dropdown` / `DropdownMenu` / `DropdownItem` - for the options list
- `Input` - for search (if searchable)

However, the interaction pattern differs from standard `Dropdown`:
- Dropdown stays open when clicking items (toggle selection)
- Need separate "Done" button to close
- Selected items shown outside dropdown

**Recommendation:** Create as standalone but **internally compose with**:
- `Badge` for selected items
- Custom dropdown (not using `Dropdown` component - different behavior)

### Accessibility Considerations
- Container should have `role="listbox"` with `aria-multiselectable="true"`
- Each option has `role="option"` with `aria-selected` state
- Selected badges should be in a region with proper labeling
- Toggle button should indicate current state
- Search input (if present) should filter options without removing focus

### CSS Classes

```css
.multi-select                  /* Root container */
.multi-select-selected         /* Container for selected badges */
.multi-select-badge            /* Selected item badge */
.multi-select-badge-remove     /* Remove button on badge */
.multi-select-placeholder      /* Shown when nothing selected */
.multi-select-controls         /* Toggle + optional actions */
.multi-select-toggle           /* Add/Done button */
.multi-select-dropdown         /* Dropdown container */
.multi-select-search           /* Search input in dropdown */
.multi-select-option           /* Individual option in dropdown */
.multi-select-option-disabled  /* Disabled option */
.multi-select-empty            /* No options message */
.multi-select-disabled         /* Component disabled state */
```

### Usage Examples

```tsx
// Basic usage
const options = [
  { value: 'react', label: 'React' },
  { value: 'solid', label: 'SolidJS' },
  { value: 'vue', label: 'Vue' },
];

<MultiSelect
  options={options}
  value={selected()}
  onChange={setSelected}
  placeholder="No frameworks selected"
/>

// With search and descriptions
<MultiSelect
  options={projects.map(p => ({
    value: p.id,
    label: p.name,
    description: p.description
  }))}
  value={selectedProjects()}
  onChange={setSelectedProjects}
  searchable
  searchPlaceholder="Search projects..."
/>

// With max selections
<MultiSelect
  options={tags}
  value={selectedTags()}
  onChange={setSelectedTags}
  max={5}
  placeholder="Select up to 5 tags"
/>

// Custom rendering
<MultiSelect
  options={users}
  value={selectedUsers()}
  onChange={setSelectedUsers}
  renderOption={(opt) => (
    <div class="flex items-center gap-2">
      <Avatar src={opt.data?.avatar} size="sm" />
      <span>{opt.label}</span>
    </div>
  )}
/>
```

### Implementation Notes
- **Don't use existing `Dropdown` component** - behavior is too different
- Build custom dropdown that stays open on item click
- Filter logic for searchable: match label case-insensitively
- When `max` is reached, don't close dropdown but disable unselected options
- Click outside to close (like Dropdown)
- Consider keyboard: arrow keys to navigate options, Enter to toggle
- Reuse Badge styling but add remove button

### Estimated Effort
- **TypeScript:** ~100 lines
- **CSS:** ~80 lines  
- **Complexity:** Medium (dropdown behavior, search filtering)

---

## Implementation Order

### Recommended Sequence

1. **ChipInput** (first)
   - Simplest component
   - No dependencies on other new components
   - High priority from stakeholder
   - Good warmup for the patterns

2. **Tree** (second)
   - Independent of other components
   - Utility function `buildTree` has standalone value
   - Medium complexity - good middle ground

3. **MultiSelect** (third)
   - Can reference patterns established in ChipInput (badge + remove button)
   - Benefits from seeing dropdown patterns in Tree (if actions use dropdowns)
   - Most complex dropdown behavior

### Shared Patterns to Extract

Before implementing, consider adding these shared elements:

#### 1. Remove Button Pattern
Both ChipInput and MultiSelect need small "X" buttons on badges. Create a shared pattern:

```css
/* In components.css */
.badge-removable {
  padding-right: var(--space-xs);
}

.badge-remove {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-left: var(--space-xs);
  padding: 2px;
  border: none;
  background: transparent;
  color: currentColor;
  opacity: 0.6;
  cursor: pointer;
  border-radius: var(--radius);
  transition: opacity var(--transition);
}

.badge-remove:hover {
  opacity: 1;
}
```

Or expose from Badge component:
```tsx
<Badge removable onRemove={() => ...}>Tag</Badge>
```

#### 2. Close Icon SVG
Create small reusable X icon (12x12) used by ChipInput and MultiSelect:

```tsx
// src/components/icons/Close.tsx
export const CloseIcon = (props: { size?: number; class?: string }) => (
  <svg 
    class={props.class}
    width={props.size ?? 12} 
    height={props.size ?? 12} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    stroke-width="2" 
    stroke-linecap="round" 
    stroke-linejoin="round"
  >
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);
```

---

## Task Breakdown

### Phase 1: Shared Infrastructure (~30 LOC)
- [ ] Add `CloseIcon` to icons
- [ ] Add `.badge-removable` and `.badge-remove` CSS patterns

### Phase 2: ChipInput (~80 LOC)
**Can run in parallel with Phase 1**
- [ ] Create `src/components/ChipInput.tsx`
- [ ] Add CSS to `components.css`
- [ ] Export from `index.tsx`
- [ ] Add to docs

### Phase 3: Tree (~150 LOC)
**Can run in parallel with Phase 2**
- [ ] Create `src/components/Tree.tsx` (including `buildTree` utility)
- [ ] Add CSS to `components.css`
- [ ] Export from `index.tsx`
- [ ] Add to docs

### Phase 4: MultiSelect (~120 LOC)
**Depends on Phase 1 (shared CSS)**
- [ ] Create `src/components/MultiSelect.tsx`
- [ ] Add CSS to `components.css`
- [ ] Export from `index.tsx`
- [ ] Add to docs

### Phase 5: Integration Testing
- [ ] Test all components in docs site
- [ ] Verify dark mode styling
- [ ] Test keyboard navigation
- [ ] Test with FormField wrapper

---

## Limitations & Future Considerations

### Not in Scope (v1)
- **Tree:** Drag-and-drop reordering
- **Tree:** Virtualization for large trees
- **Tree:** Lazy loading of children
- **MultiSelect:** Async option loading
- **MultiSelect:** Create new options inline
- **ChipInput:** Drag to reorder chips

### Potential Future Enhancements
- **Tree:** Checkbox selection mode
- **MultiSelect:** Grouped options
- **ChipInput:** Autocomplete/suggestions
- All: Animation/transitions on add/remove

---

## Breaking Changes

**None** - these are all new components with no existing API to maintain.

However, if `Badge` is enhanced to support `removable` prop, ensure existing Badge usage continues to work (the prop should be optional and default to false).
