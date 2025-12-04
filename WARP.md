# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

**Ceigall AI Platform** - An AI-powered infrastructure intelligence suite combining document management (DMS), legal operations (LegalIQ), tender analysis (TenderIQ), and conversational AI (Ask CeigallAI).

- **Frontend**: React 18 + TypeScript + Vite + TailwindCSS + shadcn/ui
- **State Management**: Redux Toolkit + React Query (@tanstack/react-query)
- **Backend**: FastAPI (proxied via Vite, not in this repo)
- **UI Components**: Radix UI primitives via shadcn/ui

## Common Commands

### Development
```bash
npm run dev          # Start dev server (port 8080)
npm run build        # Production build
npm run build:dev    # Development mode build
npm run preview      # Preview production build
```

### Code Quality
```bash
npm run lint         # Run ESLint
```

### Notes
- No test framework is currently configured
- Backend API runs on `localhost:5000`, proxied to `/api` by Vite
- Dev server runs on port 8080 and accepts ngrok connections

## Architecture

### Module Structure

This is a **multi-module platform** with four core modules:

1. **Platform Dashboard** (`/`) - Overview and module navigation
2. **DMS/DMSIQ** (`/dms`, `/dmsiq`) - Document management with AI-powered search
3. **TenderIQ** (`/tenderiq/*`) - Tender scraping, analysis, and bid management
4. **LegalIQ** (`/legaliq/*`) - Legal document analysis, drafting, case tracking, research
5. **Ask CeigallAI** (`/ask-ai`) - RAG-powered chat with document access

Each module is **independently designed** with:
- **Page component** in `src/pages/` (e.g., `TenderIQ.tsx`, `DMS.tsx`)
- **Module-specific components** in `src/components/<module>/` (e.g., `components/tenderiq/`)
- **API functions** in `src/lib/api/<module>.ts` (e.g., `api/tenderiq.ts`)
- **Type definitions** in `src/lib/types/<module>.ts`

### Key Architectural Patterns

#### 1. Page ➔ Hook ➔ API ➔ Component Pattern

**Separation of Concerns**:
- **Pages** (`src/pages/`): Route-level components, orchestrate hooks
- **Hooks** (`src/hooks/`): Custom hooks for data fetching with React Query, business logic
- **API Layer** (`src/lib/api/`): API calls, data transformation
- **Components** (`src/components/`): Pure UI, receives data via props

**Example** (TenderIQ Live Tenders):
```typescript
// Page (TenderIQ.tsx) - minimal orchestration
import LiveTenders from "@/components/tenderiq/LiveTenders";

// Component (LiveTenders.tsx) - uses custom hook
const { tenders, isLoading } = useLiveFilters();

// Hook (useLiveFilters.ts) - React Query + business logic
export const useLiveFilters = () => {
  return useQuery({
    queryKey: ['tenders', filters],
    queryFn: () => fetchFilteredTenders(filters)
  });
};

// API (tenderiq.ts) - data fetching + transformation
export const fetchFilteredTenders = async (params) => {
  const response = await fetch(`${API_BASE_URL}/tenderiq/tenders`);
  return transformTenders(response.data);
};
```

#### 2. Routing Architecture

**Two Layout Types**:
- **AppLayout** (`components/layout/AppLayout.tsx`): Standard module wrapper with sidebar/header
- **Standalone**: Full-page layouts (DMS, Ask AI) without AppLayout

```typescript
// Standard module (wrapped in AppLayout)
<Route path="/tenderiq/*" element={
  <ProtectedRoute>
    <AppLayout>
      <TenderIQ />
    </AppLayout>
  </ProtectedRoute>
} />

// Standalone module (no AppLayout)
<Route path="/dms" element={
  <ProtectedRoute>
    <DMS />
  </ProtectedRoute>
} />
```

All routes except `/auth` are wrapped in `<ProtectedRoute>` for authentication.

#### 3. API Integration

**Backend Proxy**:
```typescript
// vite.config.ts proxies /api to http://localhost:5000
'/api': {
  target: 'http://localhost:5000',
  changeOrigin: true,
  rewrite: (path) => path.replace(/^\/api/, '/api/v1')
}
```

**API Configuration** (`src/lib/config/api.ts`):
```typescript
export const API_BASE_URL = '/api'; // Proxied in dev, configurable for prod
```

**Authentication**: JWT Bearer tokens managed in Redux (`authSlice`), attached via `getAuthHeaders()` helper.

#### 4. State Management

**Redux for Auth** (`src/lib/redux/store.ts`):
```typescript
// Single slice: auth
export const store = configureStore({
  reducer: {
    auth: authReducer, // Manages user, token, isAuthenticated
  },
});
```

**React Query for Server State**: All data fetching uses React Query for caching, loading states, refetching.

**Local State**: Component-level state with `useState` for UI interactions only.

#### 5. Type System

**Strict TypeScript with Flexibility**:
```json
{
  "noImplicitAny": false,
  "strictNullChecks": false,
  "noUnusedLocals": false
}
```

Types live in `src/lib/types/<module>.ts`. API responses are transformed to match frontend types.

### Directory Structure

```
src/
├── pages/              # Route-level components
│   ├── TenderIQ.tsx
│   ├── DMS.tsx
│   ├── AskAI.tsx
│   └── ...
├── components/
│   ├── ui/             # shadcn/ui primitives (Button, Dialog, etc.)
│   ├── layout/         # AppLayout, nav components
│   ├── tenderiq/       # TenderIQ-specific components
│   ├── dms/            # DMS-specific components
│   ├── legaliq/        # LegalIQ-specific components
│   └── ask-ai/         # Ask AI-specific components
├── lib/
│   ├── api/            # API functions per module
│   ├── types/          # TypeScript types per module
│   ├── redux/          # Redux store (auth only)
│   ├── utils/          # Utility functions
│   ├── config/         # Config (API base URL, etc.)
│   └── mock/           # Mock data for development
├── hooks/              # Custom React hooks
├── contexts/           # React contexts (ThemeContext)
└── data/               # Static data files
```

### Module Details

#### TenderIQ

**Purpose**: Track live government tenders, analyze documents, manage bids

**Key Features**:
- Live tenders list with date/category/location/value filters
- Tender details view with documents, wishlist, risk assessment
- AI-powered tender analysis
- Bid synopsis generation
- Bid evaluation
- Wishlist/history tracking

**Data Flow**:
- Backend scrapes tenders daily, stores in PostgreSQL
- API returns tenders grouped by query/category
- Frontend transforms API response (`ScrapedTender` → `Tender`)
- Currency parsing handles "₹X Cr", "Ref Document", etc.

**Important Files**:
- `pages/TenderIQ.tsx` - Main entry (renders LiveTenders)
- `components/tenderiq/LiveTenders.tsx` - Main list view
- `pages/TenderDetails/TenderDetails.tsx` - Individual tender details
- `hooks/useLiveFilters.ts` - Data fetching with filters
- `lib/api/tenderiq.ts` - API calls, currency parsing, transformations

#### DMS/DMSIQ

**Purpose**: Document management with AI-powered semantic search

**Key Features**:
- Hierarchical folder structure
- Multi-category tagging (folders = hierarchy, categories = flat tags)
- Permission-based access control (folder-level, document-level)
- S3 direct upload/download via presigned URLs
- AI document summarization
- Full-text and semantic search

**Data Flow**:
- Documents stored in S3, metadata in PostgreSQL
- Frontend fetches folders, categories, documents separately
- React Query caches responses
- Celery pipeline processes uploads (text extraction, embeddings, thumbnails)

**Important Files**:
- `pages/DMS.tsx` - Main page (standalone layout)
- `components/dms/DMSUI.tsx` - Main UI component
- `lib/api/dms.ts` - DMS API functions

#### LegalIQ

**Purpose**: Legal document operations - analysis, drafting, anonymization, case tracking, research

**Key Features**:
- Document analysis (contract risk, compliance)
- AI-assisted document drafting with templates
- PII detection and anonymization
- Case tracker with timeline
- Legal research integration

**Important Files**:
- `pages/LegalIQDashboard.tsx` - Module dashboard
- `pages/AnalyzeDocument.tsx`, `DocumentDrafting.tsx`, etc.
- `lib/api/analyze-document.ts`, `document-drafting.ts`, etc.

#### Ask CeigallAI

**Purpose**: RAG-powered chat with access to company documents

**Key Features**:
- Multi-chat management
- Document upload to chat context
- Import documents from DMS
- SSE (Server-Sent Events) for real-time updates
- Source citations from DMS documents

**Data Flow**:
- Vector search in Weaviate for RAG
- Permission-aware: only searches user-accessible documents
- SSE connection for document processing status

**Important Files**:
- `pages/AskAI.tsx` - Chat interface (450+ lines, needs refactoring per REFACTORING_GUIDE.md)
- `lib/api/ask-ai.ts` - Chat API functions

### UI Component System

**Built on shadcn/ui** (Radix UI + Tailwind):
- All UI primitives in `src/components/ui/`
- Configured via `components.json`
- Tailwind config in `tailwind.config.ts`

**Theme System** (`contexts/ThemeContext.tsx`):
- Supports `light`, `dark`, `professional` themes
- Module-level theme overrides possible
- Persisted in localStorage

**Path Alias**: `@` maps to `./src` (configured in `vite.config.ts` and `tsconfig.json`)

### Backend API Contract

**Expected Response Format**:
- Dates: ISO 8601 (`YYYY-MM-DDTHH:mm:ssZ`)
- UUIDs: Standard v4 format
- Errors: `{ error: string }`
- Authentication: `Authorization: Bearer <token>`
- Pagination: All list endpoints support `skip`, `limit`

**API Endpoints** (see `openapi-official.json` for full spec):
- `/api/v1/tenderiq/*` - Tender operations
- `/api/v1/dms/*` - Document management
- `/api/v1/legaliq/*` - Legal operations
- `/api/v1/chat/*` - Ask AI chat
- `/api/v1/auth/*` - Authentication

## Development Patterns

### Adding a New Module Feature

1. **Define types** in `src/lib/types/<module>.ts`
2. **Create API function** in `src/lib/api/<module>.ts`
3. **Create custom hook** (if complex logic) in `src/hooks/`
4. **Build component** in `src/components/<module>/`
5. **Add page** (if route needed) in `src/pages/`
6. **Update routing** in `src/App.tsx`

### Data Fetching Pattern

Always use React Query for server state:

```typescript
// In hook or component
const { data, isLoading, error } = useQuery({
  queryKey: ['resource', id],
  queryFn: () => fetchResource(id),
});
```

### Error Handling

API calls throw errors, React Query catches them:

```typescript
// In API function
if (!response.ok) {
  throw new Error(`Failed: ${response.status}`);
}
```

### Authentication

Check auth state from Redux:

```typescript
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';

const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
```

## Project History & Context

- Built with **Lovable** (AI development platform) - see README.md
- Started as tender analysis tool, expanded to full platform
- Multiple dev documentation files (DEV_PLAN.md, INTEGRATION_*.md, REFACTORING_GUIDE.md)
- Backend in separate FastAPI repository (not included here)

### Known Tech Debt

See `REFACTORING_GUIDE.md` for detailed refactoring plans:
- `AskAI.tsx` needs hook extraction (450+ lines)
- Some components have hardcoded mock data
- Test framework not yet configured

### Important Documentation Files

- `DEV_PLAN.md` - Comprehensive development roadmap with phases
- `REFACTORING_GUIDE.md` - Patterns for separating concerns
- `START_HERE_TEAMMATE_UI.md` - Guide for TenderIQ UI integration
- `INTEGRATION_*.md` - Module integration guides

## Code Style

- Use functional components with hooks
- Prefer `const` over `let`
- Use TypeScript for new code (but implicit any is allowed)
- Follow existing import order: React → external libs → internal (@/ imports)
- Use Tailwind for styling, shadcn/ui for components
- ESLint configured, unused vars warning disabled

## Important Notes

- Always use `@/` import alias for `src/` files
- API responses may differ from types - check transformation functions
- TenderIQ currency parsing handles Indian numbering ("Cr", "Lakh")
- DMS uses **folders** (hierarchy) and **categories** (flat tags) separately
- Ask AI uses SSE - ensure proper cleanup in useEffect
- All dates should be ISO 8601 format
- Protected routes require authentication token in Redux state
