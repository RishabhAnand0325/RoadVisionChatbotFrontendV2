# Codebase Refactoring Guide

## Overview
This document outlines the refactoring needed to align the codebase with established patterns for separating concerns between data fetching, business logic, and UI presentation.

## Completed Tasks ✅

### 1. LiveTenders.tsx Refactoring
- **Created:** `src/lib/utils/tender-filters.ts` - Filtering and transformation utilities
- **Created:** `src/hooks/useLiveFilters.ts` - Custom hook for data fetching with React Query
- **Updated:** `src/components/tenderiq/LiveTenders.tsx` - Now uses hook and utilities
- **Result:** Reduced component complexity, isolated API calls, reusable logic

### 2. DateSelector.tsx Refactoring
- **Created:** `src/hooks/useDateSelector.ts` - Custom hook for date data fetching
- **Updated:** `src/components/tenderiq/DateSelector.tsx` - Now pure UI component
- **Result:** Eliminated duplicate date grouping logic, centralized API call

### 3. TenderHistory.tsx Refactoring
- **Created:** `src/data/tenderHistory.ts` - Extracted hardcoded tender and stats data
- **Updated:** `src/components/tenderiq/TenderHistory.tsx` - Now imports data from external file
- **Result:** Separated static data from UI component, easier to replace with API calls

## Remaining Tasks 🔄

### HIGH PRIORITY

#### 4. AskAI.tsx Page Component Refactoring (450+ lines)
**Issues:**
- Multiple side effects handling SSE, uploads, messages
- Complex state management (8+ useState hooks)
- API calls mixed throughout component
- Manual XHR upload handling

**Refactoring Plan:**

**Step 1:** Create `src/hooks/useAskAIChat.ts`
```typescript
// Manages:
// - Chat list fetching and management
// - Current chat data loading (messages, documents)
// - Chat CRUD operations (create, delete, rename)
// - Loading states and error handling

interface UseAskAIChatResult {
  chats: ChatMetadata[];
  currentChat: ChatMetadata | null;
  messages: Message[];
  documents: ChatDocumentsResponse | null;
  isLoading: boolean;
  error: Error | null;

  // Actions
  selectChat: (id: string) => Promise<void>;
  createNewChat: () => Promise<void>;
  deleteChat: (id: string) => Promise<void>;
  renameChat: (id: string, title: string) => Promise<void>;
  loadChatData: (id: string) => Promise<void>;
}

export const useAskAIChat = (): UseAskAIChatResult => {
  // Implementation using React Query + useEffect
}
```

**Step 2:** Create `src/hooks/useSSESubscription.ts`
```typescript
// Manages:
// - SSE connection setup and cleanup
// - Automatic reconnection on error
// - Document updates from server

interface UseSSESubscriptionResult {
  documents: ChatDocumentsResponse | null;
  isConnected: boolean;
}

export const useSSESubscription = (chatId: string | null): UseSSESubscriptionResult => {
  // Encapsulate SSE logic in hook with proper cleanup
}
```

**Step 3:** Create `src/hooks/useFileUpload.ts`
```typescript
// Manages:
// - Multiple file uploads with progress tracking
// - XHR abort/cancel functionality
// - Upload state per file

interface UploadTask {
  id: string;
  file: File;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  error?: string;
}

interface UseFileUploadResult {
  uploadTasks: UploadTask[];
  uploadFiles: (chatId: string, files: File[]) => Promise<void>;
  cancelUpload: (id: string) => void;
}

export const useFileUpload = (onProgress?: () => void): UseFileUploadResult => {
  // Implementation
}
```

**Step 4:** Create `src/hooks/useAskAIMessages.ts`
```typescript
// Manages:
// - Sending messages
// - Message list updates
// - Error handling for failed messages

export const useAskAIMessages = (chatId: string | null): UseAskAIMessagesResult => {
  // Implementation
}
```

**Step 5:** Refactor `src/pages/AskAI.tsx`
```typescript
// Now ONLY handles:
export default function AskAI() {
  const navigate = useNavigate();

  // Use composed hooks
  const { chats, currentChat, messages, documents, selectChat, createNewChat, deleteChat, renameChat } = useAskAIChat();
  const { documents: sseDocuments, isConnected } = useSSESubscription(currentChat?.id || null);
  const { uploadTasks, uploadFiles, cancelUpload } = useFileUpload();
  const { sendMessage, isLoading: isMessageLoading } = useAskAIMessages(currentChat?.id || null);

  // UI State only
  const [showDocPanel, setShowDocPanel] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Simple event handlers that delegate to hooks
  const handleSendMessage = (text: string) => sendMessage(text);
  const handleFileUpload = (files: File[]) => uploadFiles(currentChat?.id!, files);

  // Render
  return (/* Clean JSX with data from hooks */);
}
```

**Benefits:**
- Reduces AskAI.tsx from 450+ lines to ~150 lines
- Hooks are reusable in other components
- Easier to unit test
- Clear separation of concerns

---

#### 5. BidEvaluate.tsx Refactoring
**Issues:**
- Mock data hardcoded
- No real API integration
- Results are static

**Refactoring Plan:**

1. Create `src/hooks/useBidEvaluation.ts`
   - Handle document upload
   - Call API to evaluate bid
   - Manage evaluation state and results

2. Update API types in `src/lib/types/tenderiq.ts`:
   ```typescript
   export interface BidEvaluationRequest {
     rfpFile: File;
     bidFiles: File[];
   }

   export interface BidEvaluationResult {
     score: number;
     completeness: number;
     issues: string[];
     recommendations: string[];
   }
   ```

3. Add API function in `src/lib/api/tenderiq.ts`:
   ```typescript
   export const evaluateBid = (request: BidEvaluationRequest): Promise<BidEvaluationResult> => {
     // Implementation
   }
   ```

4. Update component to use hook and pure UI

---

#### 6. TenderCompare.tsx Refactoring
**Issues:**
- No document upload handling
- No comparison logic
- Results are hardcoded

**Refactoring Plan:**

1. Create `src/hooks/useTenderComparison.ts`
   - Handle document uploads
   - Call comparison API
   - Manage comparison results

2. Update API types in `src/lib/types/tenderiq.ts`:
   ```typescript
   export interface TenderComparisonRequest {
     document1: File;
     document2: File;
   }

   export interface TenderComparisonResult {
     totalChanges: number;
     adverseChanges: number;
     riskAssessment: string;
     changes: Change[];
   }
   ```

3. Add API function in `src/lib/api/tenderiq.ts`

4. Update component to use hook and pure UI

---

### MEDIUM PRIORITY

#### 7. TenderIQ.tsx Page Component
**Issues:**
- Nested component definitions (AnalyzeTenderModule, ModuleSelectionView)
- Complex routing logic

**Refactoring Plan:**

1. Extract `AnalyzeTenderModule` to `src/components/tenderiq/AnalyzeTenderModule.tsx`
2. Extract `ModuleSelectionView` to `src/components/tenderiq/ModuleSelectionView.tsx`
3. Keep page component as pure router/orchestrator

---

#### 8. Move Page Components from /components
**Task:** Identify and move any page-level components from `/components` to `/pages`

**Process:**
- Page components: Manage routes, multiple sub-components, orchestration
- Feature components: Single feature, located in `/components`
- UI components: Reusable UI, in `/components/ui`

---

### LOW PRIORITY

#### 9. Review Type Definitions Location
**Objective:** Ensure all interfaces are in `src/lib/types/` or `src/lib/api/`

**Current State:**
- ✅ Most types are in `src/lib/types/modulename.ts`
- Check for any types defined in components
- Consolidate if needed

---

## Established Pattern

### Structure
```
src/
├── lib/
│   ├── api/
│   │   ├── tenderiq.ts          # API functions + types
│   │   └── ask-ai.ts            # API functions + types
│   ├── types/
│   │   ├── tenderiq.ts          # Type definitions
│   │   └── ask-ai.ts            # Type definitions
│   ├── utils/
│   │   └── tender-filters.ts    # Utility functions
│   └── config/
├── hooks/
│   ├── useLiveFilters.ts        # Data fetching with React Query
│   ├── useDateSelector.ts       # Data fetching with React Query
│   └── ...
├── components/
│   ├── ui/                       # Reusable UI components
│   ├── tenderiq/
│   │   ├── LiveTenders.tsx       # Feature component (uses hooks)
│   │   ├── DateSelector.tsx      # Feature component (uses hooks)
│   │   └── ...
│   └── ...
├── pages/
│   ├── AskAI.tsx                # Page component (uses hooks)
│   ├── TenderIQ.tsx             # Page component
│   └── ...
└── data/
    └── tenderHistory.ts         # Static/mock data
```

### Pattern Rules

#### Custom Hooks (src/hooks/)
- Handle ALL data fetching
- Use React Query for caching
- Manage loading, error, and data states
- Use useEffect for side effects
- Return clean interface

```typescript
export const useCustomData = (params): {
  data: DataType;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  // Actions
  doSomething: (arg: T) => Promise<void>;
} => {
  // Implementation
}
```

#### API Functions (src/lib/api/)
- Define TypeScript interfaces for requests/responses
- Handle HTTP calls with proper headers
- Return transformed data matching frontend types
- No side effects or state

```typescript
export interface SomeType { }
export const fetchSomething = async (params): Promise<SomeType[]> => {
  // HTTP call
  // Transform response
  // Return data
}
```

#### Components (src/components/)
- Accept props, call hooks
- Manage UI-only state (collapsed, focused, etc.)
- Delegate data operations to hooks
- Pure presentation logic

```typescript
const MyComponent = ({ onAction }) => {
  const { data, isLoading } = useCustomData();
  const [uiState, setUiState] = useState(false); // UI only

  return isLoading ? <Loading /> : <Display data={data} />
}
```

---

## Checklist

- [x] Extract LiveTenders data fetching to hook
- [x] Extract DateSelector data fetching to hook
- [x] Extract TenderHistory static data
- [ ] Refactor AskAI.tsx with multiple hooks
- [ ] Refactor BidEvaluate.tsx
- [ ] Refactor TenderCompare.tsx
- [ ] Extract TenderIQ nested components
- [ ] Move any page components from /components to /pages
- [ ] Review all type definitions in lib/types

---

## Testing After Refactoring

For each refactored component:

1. **Functionality:** Component still works as before
2. **Data Loading:** Proper loading states shown
3. **Error Handling:** Errors displayed to user
4. **Performance:** React Query caching working
5. **Code Quality:** Reduced lines, better separation

---

## Notes

- React Query is configured and working (used in TenderDetails)
- All API functions are in `src/lib/api/` already
- Type definitions are well-organized in `src/lib/types/`
- Use `useToast()` hook for error messages
- Follow the established pattern from LiveTenders.tsx
