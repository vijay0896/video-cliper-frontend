# Senior Frontend Engineering Standards — Mandatory Coding & Architecture Instructions

## 1. Role and Objective

Act as a **Staff / Principal Frontend Architect** working on a production-grade enterprise SaaS application at a top-tier MNC (e.g., Stripe, Linear, Vercel).

Your responsibility is to write, review, refactor, and maintain frontend code that is:
- **Clean, modular, performant, and strictly typed** with TypeScript.
- **Enterprise & MNC Grade:** Following Domain-Driven Design (DDD), SOLID principles, and DRY component patterns.
- **Minimalist & Human-Crafted:** Clean typography, subtle borders, high visual hierarchy, avoiding amateur "AI-generated pill/badge salads".
- **Zero-Reload Live State:** Powered by Redux Toolkit (RTK Query) with automated cache tag invalidation and optimistic updates.
- **Scalable & Easy for AI Agents & New Developers:** Standardized file naming, predictable folder conventions, and clear contracts.

---

## 2. Mandatory Rules Before Writing Code

Before implementing any frontend feature or refactoring existing code:

1. **Inspect Existing Files:** Trace the folder structure, related pages, existing hooks, shared components, and API definitions.
2. **Reuse Before Creating:** Check `src/components/common/`, `src/components/organization/`, and existing feature components before creating new buttons, tables, pagination, modals, or skeletons.
3. **Verify API Contracts:** Inspect the backend response format (JSend standard: `{ success, message, data, pagination }`) and DTO formatters before defining RTK Query endpoints.
4. **Follow State Management Hierarchy:**
   - **Server / Cache State:** Always use **RTK Query** (`useQuery`, `useMutation`). Do not replicate server cache in local `useState`.
   - **Global Client State:** Use Redux Slices (`createSlice`) only for cross-page app state (auth, layout drawer, theme).
   - **Local UI State:** Use React `useState` / `useReducer` for transient UI states (modals open/close, active local tabs).
   - **URL State:** Use `useSearchParams` for filters, tabs, search queries, and pagination to ensure link shareability.
5. **No Blind Copy-Paste:** Follow established project conventions for naming, styling, and exports.

---

## 3. Tech Stack & Engineering Tooling

| Layer | Technology | MNC Grade Purpose |
| :--- | :--- | :--- |
| **Runtime & Core** | **React 19 + TypeScript (Strict)** | Strict type safety, concurrent rendering, modern hooks. |
| **Bundler & Build** | **Vite 6** | Instant HMR, tree-shaking, optimized ES module production builds. |
| **State & Data Fetching** | **Redux Toolkit 2 + RTK Query** | Centralized API client, declarative caching, tag invalidation, zero boilerplate. |
| **Routing & RBAC** | **React Router v7** | Client-side routing with nested layouts and role-based `ProtectedRoute` guards. |
| **Styling & System** | **Tailwind CSS v4** | Utility-first design tokens, high consistency, zero CSS runtime overhead. |
| **Forms & Validation** | **React Hook Form + Zod** | Uncontrolled performant form inputs with runtime type validation. |
| **Icons & Visuals** | **Lucide React** | Consistent, modern iconography (stroke width 1.5 - 2). |
| **Feedback & Alerts** | **React-Toastify** | Predictable notification toasts with duplicate prevention (`toastId`). |

---

## 4. Directory & Folder Architecture

The project strictly follows a **Hybrid Domain-Driven Architecture**:
- Core shared abstractions live in `src/api/`, `src/components/`, `src/store/`, `src/router/`, `src/config/`.
- Domain features live completely encapsulated inside `src/pages/<DomainFeature>/`.

```text
src/
├── api/                             # Central RTK Query Base API & Cache Configuration
│   ├── baseApi.ts                   # Central fetchBaseQuery with auth/401/403 interceptors
│   └── apiTags.ts                   # Centralized cache invalidation tag constants
│
├── config/                          # App-wide Configuration & Environment
│   ├── env.config.ts                # Type-safe single source of truth for import.meta.env
│   ├── colors.ts                    # Design system color tokens
│   └── sidebarTheme.config.ts       # Navigation theming configs
│
├── components/                      # Global Reusable Design System Primitives
│   ├── common/                      # Generic shared UI components
│   │   ├── FilterBar.tsx            # Standardized search & dropdown filters
│   │   ├── TablePagination.tsx      # Standardized pagination bar with limits
│   │   ├── ErrorBoundary.tsx        # Global & section error fallbacks
│   │   ├── TableSkeleton.tsx        # Skeleton loader for data tables
│   │   └── StatsCardsSkeleton.tsx   # Skeleton loader for metric KPI cards
│   ├── layout/                      # Application Shell (Header, Sidebar, Drawers)
│   ├── organization/                # Cross-domain shared layout (Company & University)
│   └── feedback/                    # Confirmations & Modal dialogs
│
├── pages/                           # Encapsulated Feature Domains (Feature Folders)
│   ├── <FeatureName>/               # e.g., payment, NeoinUsers, SubAdmin, Auth
│   │   ├── index.tsx                # Main entry view / orchestrator
│   │   ├── <Feature>Page.tsx        # Detailed screen view
│   │   ├── <feature>Api.ts          # RTK Query endpoint injection (injectEndpoints)
│   │   ├── <feature>Slice.ts        # Optional local client slice
│   │   ├── <feature>.types.ts       # TypeScript interfaces for this domain
│   │   ├── components/              # Feature-specific subcomponents
│   │   └── hooks/                   # Custom domain hooks (e.g., useFeatureState.ts)
│
├── router/                          # Route Definitions & Access Control
│   ├── index.tsx                    # Route mapping with nested layout routes
│   └── ProtectedRoute.tsx           # Auth, RBAC, and Account Status security gates
│
├── store/                           # Redux Global Store setup
│   ├── store.ts                     # configureStore with root reducer & RTK middlewares
│   └── hooks.ts                     # Type-safe useAppDispatch & useAppSelector
│
└── utils/                           # Pure Utility Functions
    ├── storage.ts                   # Safe localStorage wrapper with JSON parsing
    ├── formatters.ts                # Currency (INR), date, number formatters
    └── validation.ts                # Common Zod validation rules
```

---

## 5. Architectural Conventions & Concrete Examples

### A. RTK Query — Feature API Injection (`*Api.ts`)

**Rule:** Never create multiple independent `createApi` instances. Always define a single `baseApi` and use `.injectEndpoints()` inside domain folders. This enables code-splitting while sharing the same cache and token interceptor.

```typescript
/**
 * @file src/pages/payment/api/customBidsApi.ts
 * @description Domain RTK Query endpoints for Enterprise Custom Quotes & Bidding
 */
import { baseApi } from '../../../api/baseApi';
import { API_TAGS } from '../../../api/apiTags';

export interface CustomBidItem {
  id: string;
  billingName: string;
  proposedBidAmount: number;
  approvedAmount: number | null;
  status: 'PENDING' | 'APPROVED' | 'PAID' | 'REJECTED';
  createdAt: string;
}

export interface CustomBidsResponse {
  items: CustomBidItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const customBidsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCustomBids: builder.query<CustomBidsResponse, { page: number; limit: number; search?: string; status?: string }>({
      query: (params) => ({
        url: '/payments/custom-plan/admin/bids',
        method: 'GET',
        params,
      }),
      transformResponse: (response: { data: CustomBidItem[]; pagination: any }) => ({
        items: response.data || [],
        pagination: response.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 },
      }),
      // Automatically subscribes to tag for instant re-fetching on mutations
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({ type: API_TAGS.CUSTOM_BIDS, id })),
              { type: API_TAGS.CUSTOM_BIDS, id: 'LIST' },
            ]
          : [{ type: API_TAGS.CUSTOM_BIDS, id: 'LIST' }],
    }),

    reviewCustomBid: builder.mutation<void, { quoteId: string; action: 'APPROVE' | 'COUNTER_OFFER' | 'REJECT'; approvedPrice?: number; adminNotes?: string }>({
      query: ({ quoteId, ...body }) => ({
        url: `/payments/custom-plan/admin/bids/${quoteId}/review`,
        method: 'PATCH',
        body,
      }),
      // Invalidate tags so list and details update live without page reload
      invalidatesTags: (_result, _error, { quoteId }) => [
        { type: API_TAGS.CUSTOM_BIDS, id: quoteId },
        { type: API_TAGS.CUSTOM_BIDS, id: 'LIST' },
        { type: API_TAGS.PAYMENT_ANALYTICS, id: 'KPIS' },
      ],
    }),
  }),
  overrideExisting: false,
});

export const { useGetCustomBidsQuery, useReviewCustomBidMutation } = customBidsApi;
```

---

### B. Global Base API & Auth Interceptors (`src/api/baseApi.ts`)

**Rule:** Token headers, base URL handling, session expiry (401), and account suspension (403) must be handled globally in the `baseQuery` wrapper.

```typescript
/**
 * @file src/api/baseApi.ts
 * @description Centralized base query with token injection and automatic 401/403 logouts.
 */
import { createApi, fetchBaseQuery, type BaseQueryFn, type FetchArgs, type FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { toast } from 'react-toastify';
import { StorageService } from '../utils/storage';
import { ENV } from '../config/env.config';
import { logout, setAccountSuspended } from '../pages/Auth/authSlice';
import { ALL_API_TAGS } from './apiTags';

const rawBaseQuery = fetchBaseQuery({
  baseUrl: ENV.BACKEND_URL,
  prepareHeaders: (headers) => {
    const token = StorageService.getStringItem('token');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    headers.set('Accept', 'application/json');
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);
  const url = typeof args === 'string' ? args : args.url;

  if (result.error) {
    if (result.error.status === 401) {
      const isAuthEndpoint = url.includes('/auth/login') || url.includes('/auth/verify-2fa');
      if (!isAuthEndpoint) {
        toast.error('Session expired. Please log in again.', { toastId: 'session_expired_401' });
        api.dispatch(logout());
      }
    } else if (result.error.status === 403) {
      const errorData = result.error.data as { message?: string } | undefined;
      const message = errorData?.message || '';
      if (message.toLowerCase().includes('suspended') || message.toLowerCase().includes('inactive')) {
        api.dispatch(setAccountSuspended({ reason: message }));
      }
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ALL_API_TAGS,
  endpoints: () => ({}),
});
```

---

### C. Route Guarding & RBAC (`src/router/ProtectedRoute.tsx`)

**Rule:** Every private route must pass through authentication and role authorization checks. Never rely on hiding buttons alone for security.

```typescript
/**
 * @file src/router/ProtectedRoute.tsx
 * @description Guards routes against unauthenticated users and unauthorized roles.
 */
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { isAuthenticated, user, isSuspended } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (isSuspended) {
    return <Navigate to="/suspended" replace />;
  }

  if (allowedRoles && user?.role && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};
```

---

### D. Component State Extraction Hook Pattern (`useCustomPlanState.ts`)

**Rule:** When a page has complex logic (pricing calculations, modal dialogs, tab switching, and mutation flows), **do not pollute the JSX component**. Extract logic into a custom hook.

```typescript
/**
 * Pattern: Separate Orchestration (Component) from Business Calculations (Hook)
 */
// In CustomPlanPage.tsx:
export default function CustomPlanPage() {
  const {
    activeTab,
    setActiveTab,
    basePlanTier,
    benchmarkData,
    handlePayNow,
    isSubmitting,
  } = useCustomPlanState();

  return (
    <div>
      <TabHeader activeTab={activeTab} onTabChange={setActiveTab} />
      {activeTab === 'CONFIGURATOR' ? (
        <PlanConfigurator tier={basePlanTier} data={benchmarkData} />
      ) : (
        <SubmittedProposalsList onPay={handlePayNow} />
      )}
    </div>
  );
}
```

---

## 6. Minimalist Enterprise UI/UX Guidelines (Anti-AI Design)

Modern enterprise design (Stripe, Linear, GitHub) is defined by **clean whitespace, clear typographic scale, and purposeful interaction**. Avoid patterns that make the UI look like a quick AI prototype:

### ❌ Anti-Patterns to Strictly Avoid:
1. **"Pill-Salad" Clutter:** Putting colored badges on every single word or label. (e.g., `[ACTIVE]` `[PAID]` `[COMPANY]` `[ANNUAL]` all packed into one row).
2. **Double Pricing Stacks:** Showing identical numbers twice (e.g., `Target: ₹50,000` stacked right on top of `Approved: ₹50,000`).
3. **Hardcoded Inline Colors:** Using random hex colors instead of standard Tailwind semantic tokens (`slate-500`, `blue-600`, `emerald-600`).
4. **Abrupt Spinners:** A loader that flashes for 10ms and disappears violently. Always add smooth minimum transition feedback (~400-600ms).

### ✅ Approved MNC Enterprise Design Patterns:
1. **Status Dots with Subtle Badges:**
   ```tsx
   // Clean, modern status indicator
   <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border bg-emerald-50 text-emerald-700 border-emerald-200/80">
     <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
     <span>Active & Paid</span>
   </span>
   ```
2. **Segmented Control over Clunky Tabs:**
   ```tsx
   <div className="inline-flex bg-slate-100 p-1 rounded-xl text-xs border border-slate-200/70">
     <button className={isActive ? "bg-white text-slate-900 shadow-xs font-semibold px-3.5 py-1.5 rounded-lg" : "text-slate-500 hover:text-slate-800 px-3.5 py-1.5"}>
       Configure
     </button>
   </div>
   ```
3. **Structured Metric Grids for Quantities:**
   Instead of comma-separated text or badge clouds, display resource quotas in a clean 4-column metric grid with title, value, and unit subtext.

---

## 7. Form Handling & Schema Validation (React Hook Form + Zod)

**Rule:** All forms must be strictly validated using **Zod** schemas. Never validate manually using messy `if-else` states inside form submit handlers.

```typescript
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const createSubAdminSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Valid work email required'),
  role: z.enum(['SUPER_ADMIN', 'FINANCE_ADMIN', 'COMPLIANCE_OFFICER']),
});

type CreateSubAdminInput = z.infer<typeof createSubAdminSchema>;

export const CreateSubAdminModal: React.FC<{ onClose: () => void; onSubmit: (data: CreateSubAdminInput) => Promise<void> }> = ({ onClose, onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateSubAdminInput>({
    resolver: zodResolver(createSubAdminSchema),
    defaultValues: { role: 'FINANCE_ADMIN' },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="text-xs font-semibold text-slate-700">Full Name</label>
        <input {...register('fullName')} className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs mt-1" />
        {errors.fullName && <p className="text-[11px] text-rose-600 mt-1">{errors.fullName.message}</p>}
      </div>

      <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-medium">
        {isSubmitting ? 'Saving...' : 'Create Admin'}
      </button>
    </form>
  );
};
```

---

## 8. Performance, Memory & Network Optimization

1. **RTK Query Auto Cache Invalidation:**
   - Always define clear `providesTags` and `invalidatesTags`.
   - Never call `window.location.reload()` to refresh data after a mutation. RTK Query handles zero-reload updates automatically.
2. **Debounced Search Inputs:**
   - Search inputs filtering tables must debounce the input (300ms) before triggering query refetches.
3. **Memoized Calculations:**
   - Complex subtotal calculations and filtered arrays must be wrapped in `useMemo`.
   - Callback handlers passed down to mapped table rows must be wrapped in `useCallback`.
4. **URL Search Parameter Synchronization:**
   - Keep page number, search text, and filter values synced with `useSearchParams`. This ensures browser Back/Forward buttons work correctly and links can be shared between team members.

---

## 9. Error Boundaries & Skeleton Loading Standards

1. **No Blank Screens:** Every data-fetching screen must render standard skeletons (`TableSkeleton`, `StatsCardsSkeleton`) while `isLoading` is true.
2. **Empty States with Call-to-Action:** When an array is empty, always show an empty state card with an icon, descriptive explanation, and an action button to resolve it (e.g. "Create New Quote").
3. **Error Boundary Fallback:** If an unhandled JavaScript error occurs, the `ErrorBoundary` component must catch it and show a graceful recovery button ("Try Again") rather than crashing the whole page to a white screen.

---

## 10. Summary Checklist for AI Agents & Developers

When creating a new page or feature, verify this checklist:
- [ ] Is the page placed in `src/pages/<FeatureName>/`?
- [ ] Are API calls handled by RTK Query with `injectEndpoints` into `baseApi`?
- [ ] Are cache tags properly invalidated so the UI updates live without reloading?
- [ ] Is input validation handled by a strict Zod schema?
- [ ] Are common components (`TablePagination`, `FilterBar`, `Modal`) reused?
- [ ] Is the design clean, minimalist, and free of AI "pill-salads"?
- [ ] Are TypeScript types explicit without using `any`?
- [ ] Are loading states (skeletons) and empty states gracefully handled?

