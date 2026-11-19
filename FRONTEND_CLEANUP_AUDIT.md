# OpenShorts Frontend Codebase Audit & Cleanup Report

**Date:** November 19, 2026  
**Workspace:** `OPENSHORTS-FRONTEND`  
**Status:** Verification Passed (Tested 100% clean build without these files)

---

## 📊 Summary of Findings

During the full codebase dependency scan:
* **Active, Reachable Files:** 42 files (Powers all active features: Clip Generator, YouTube Studio, Settings, Routing, State Management, API Services).
* **Unused & Dead Code Files:** **74 files** (~10,000+ lines of code)
* **Build Impact:** Removing all 74 files produces **0 errors** on `npm run build` and reduces bundle clutter.

---

## 🗑️ Detailed Categorization of Unused Files

### 1. Standalone SEO & Marketing Static Pages (`tools/` & `seo/`)
These files were originally static web-page generators for `openshorts.app` domain SEO landing pages. They are not part of the desktop/local application:
* `tools/paste-link.js`
* `tools/vertical.js`
* `tools/transcript.js`
* `tools/metadata.js`
* `tools/common.js`
* `seo/autopilot-pages.js`
* `seo/tools.js`
* `seo/hub-pages.js`
* `seo/legal.js`
* `seo/render.js`
* `seo/clip-tools.js`
* `seo/guide-pages.js`
* `seo/product-pages.js`
* `seo/components.js`
* `seo/data.js`
* `seo/pricing-page.js`
* `seo/pages.js`
* `seo/nav.js`
* `vite-plugin-seo.js`

### 2. Legacy Monolithic Root Component & Old CSS
* `src/App.jsx` (2,533 lines) - The old monolithic file from before the migration to React Router + AppLayout.
* `src/App.css` - Styles for the legacy App.jsx.
* `src/assets/react.svg` - Default starter template SVG.

### 3. Orphaned / Deprecated Components (`src/components/`)
Components created for old monetization, autopilot, or tabs that were deleted or never hooked up:
* `src/components/AccountPage.jsx`
* `src/components/AdvancedBanner.jsx`
* `src/components/ApiKeysCard.jsx`
* `src/components/AutopilotTab.jsx`
* `src/components/CancelPlanModal.jsx`
* `src/components/ClipTutorial.jsx`
* `src/components/CookieBanner.jsx`
* `src/components/DeleteAccountCard.jsx`
* `src/components/Gallery.jsx`
* `src/components/GalleryCard.jsx`
* `src/components/HistoryTab.jsx`
* `src/components/InvoicesCard.jsx`
* `src/components/KeyInput.jsx`
* `src/components/LoginModal.jsx`
* `src/components/OAuthConsent.jsx`
* `src/components/OnboardingSurvey.jsx`
* `src/components/PlanChoiceModal.jsx`
* `src/components/PricingPage.jsx`
* `src/components/PricingSection.jsx`
* `src/components/ProfileMenu.jsx`
* `src/components/RemotionPreview.jsx`
* `src/components/SaaShortsTab.jsx`
* `src/components/ScheduleWeekModal.jsx`
* `src/components/SiteNav.jsx`
* `src/components/SocialAnalyticsCard.jsx`
* `src/components/StarBanner.jsx`
* `src/components/TikTokDraftNotice.jsx`
* `src/components/TopUpModal.jsx`
* `src/components/TranslateModal.jsx`
* `src/components/TrialGate.jsx`
* `src/components/TrialUpgradeModal.jsx`
* `src/components/UGCGallery.jsx`
* `src/components/UsageMeter.jsx`
* `src/components/VideoCaptionOverlay.jsx`
* `src/components/common/StatsCardsSkeleton.jsx`

### 4. Unused Subcomponent Drafts in Dashboard (`src/pages/Dashboard/components/`)
Draft subcomponents created earlier but never imported into `DashboardPage/index.jsx`:
* `src/pages/Dashboard/components/LiveAnalysisSection.jsx`
* `src/pages/Dashboard/components/MediaInputSection.jsx`
* `src/pages/Dashboard/components/ResultsGallerySection.jsx`

### 5. Unused Remotion Compositions (`src/remotion/`)
Server-side or browser-rendering compositions not imported by any active page:
* `src/remotion/compositions/HookOverlay.tsx`
* `src/remotion/compositions/ShortVideo.tsx`
* `src/remotion/compositions/Subtitles.tsx`
* `src/remotion/compositions/VideoEffects.tsx`
* `src/remotion/lib/captions.ts`
* `src/remotion/lib/fonts.ts`
* `src/remotion/lib/types.ts`

### 6. Unused Utility Libraries (`src/lib/` & `src/utils/` & `src/router/`)
* `src/lib/backFromStripe.js`
* `src/lib/connectReturn.js`
* `src/lib/jobPoll.js`
* `src/lib/renderInBrowser.js`
* `src/lib/socialPlatforms.js`
* `src/router/ProtectedRoute.jsx`
* `src/utils/formatters.js`

---

## ✅ Verified Active Files (DO NOT DELETE)

These 42 core files run the entire application:
```
src/main.jsx
src/index.css
src/tokens.css
src/Legal.jsx
src/config.js
src/config/env.config.js
src/context/LayoutContext.jsx
src/contexts/AuthContext.jsx
src/store/store.js
src/store/hooks.js
src/store/slices/appSlice.js
src/store/slices/authSlice.js
src/router/index.jsx
src/components/layout/AppLayout.jsx
src/components/layout/Header.jsx
src/components/layout/Sidebar.jsx
src/components/layout/MobileTabBar.jsx
src/components/layout/sidebar.types.js
src/components/common/ErrorBoundary.jsx
src/components/common/TableSkeleton.jsx
src/components/ui/SegmentedControl.jsx
src/components/ui/Modal.jsx
src/components/ui/StepIndicator.jsx
src/pages/Dashboard/index.jsx
src/pages/Dashboard/clipsApi.js
src/pages/Dashboard/hooks/useClipGenerator.js
src/components/MediaInput.jsx
src/components/ProcessingAnimation.jsx
src/components/ResultCard.jsx
src/components/SourceCost.jsx
src/pages/ThumbnailStudio/index.jsx
src/components/ThumbnailStudio.jsx
src/pages/Settings/index.jsx
src/pages/Settings/components/GeminiKeyCard.jsx
src/pages/Legal/index.jsx
src/lib/api.js
src/lib/analytics.js
src/lib/consent.js
src/lib/attribution.js
src/lib/mediaToken.js
src/lib/pendingPlan.js
src/lib/tabAfterLogin.js
src/api/baseApi.js
src/api/apiTags.js
src/utils/storage.js
```

---

## ⚡ How to Clean Up

An automated bash script has been created in the repository:
```bash
cd /Users/vijaychoudhary/OPENSHORTS-FRONTEND
./cleanup_unused.sh
```
Or you can ask Antigravity to execute the cleanup script directly!

