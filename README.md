# Employee Insights Dashboard

## Intentional Bug (Required)
**Bug type:** Memory leak from a missing cleanup.

**Where:** `src/features/list/useVirtual.ts`

**What happens:**
The `resize` event listener is registered on `window` but intentionally **not** removed on cleanup. If the List page is mounted/unmounted multiple times, listeners accumulate and the calculation function keeps firing, which is a performance leak.

**Why I chose it:**
It is a realistic, easy-to-detect performance bug that does not break the UI immediately, and it is simple to explain during review.

**How to verify:**
1. Navigate between `/list` and another page several times.
2. Trigger a window resize.
3. The resize handler runs multiple times (stacked listeners).

---

## Virtualization Math (Custom List)
The list renders **only the visible rows** plus a small buffer (overscan).

**Definitions**
- `itemHeight`: fixed height of each row (e.g. `56px`).
- `scrollTop`: current scroll position in the container.
- `viewHeight`: visible height of the container.
- `overscan`: extra rows rendered above and below to avoid blank gaps during fast scrolls.

**Core math**
- `startIndex = floor(scrollTop / itemHeight) - overscan`
- `endIndex = ceil((scrollTop + viewHeight) / itemHeight) + overscan`
- `offsetTop = startIndex * itemHeight`
- `totalHeight = totalCount * itemHeight`

**Rendering strategy**
1. The container is scrollable with a fixed height.
2. A spacer div simulates the **full height** (`totalHeight`).
3. Only rows between `startIndex` and `endIndex` are rendered.
4. The visible block is shifted using `translateY(offsetTop)` so rows appear in the correct scroll position.

This keeps DOM nodes minimal while preserving correct scrolling behavior.

