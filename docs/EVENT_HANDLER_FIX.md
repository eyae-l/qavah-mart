# Event Handler Error Fix

## Issue
Build was failing with the following error:
```
Error occurred prerendering page "/_not-found"
Error: Event handlers cannot be passed to Client Component props.
  {onClick: function onClick, className: ..., children: ...}
```

## Root Cause
The `app/not-found.tsx` page was a Server Component (no `'use client'` directive) but contained a `<button>` element with an `onClick` handler that called `window.history.back()`. In Next.js 13+, event handlers cannot be used in Server Components.

## Solution
Converted `app/not-found.tsx` to a Client Component by adding the `'use client'` directive at the top of the file.

### Changes Made
**File: `app/not-found.tsx`**
- Added `'use client';` directive at the top of the file
- This allows the component to use browser APIs like `window.history.back()` and event handlers like `onClick`

## Verification
1. **Build Test**: Production build now succeeds without errors
   ```bash
   npm run build
   ```
   Result: ✓ Build completed successfully

2. **Unit Tests**: All 601 tests still passing
   ```bash
   npm test
   ```
   Result: ✓ 601 tests passed

3. **TypeScript**: No diagnostic errors
   ```bash
   getDiagnostics(['app/not-found.tsx'])
   ```
   Result: ✓ No diagnostics found

## Impact
- The not-found page now works correctly in both development and production
- The "Go Back" button functionality is preserved
- No breaking changes to the component's API or behavior
- All existing tests continue to pass

## Related Files
- `app/not-found.tsx` - Fixed file
- `app/not-found.test.tsx` - Tests (no changes needed)

## Notes
- This is a common pattern in Next.js 13+ where pages that need interactivity must be Client Components
- Server Components cannot use browser APIs or event handlers
- The fix maintains all existing functionality while resolving the build error
