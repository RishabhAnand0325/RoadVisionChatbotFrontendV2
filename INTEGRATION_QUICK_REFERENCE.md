# TenderIQ UI Integration - Quick Reference

## TL;DR - The Essentials

**Goal**: Add `/viewtender/:id` route that shows tender details from teammate's design

**Time**: ~4-6 hours total

**Effort Level**: Medium (copy files, create data structure, update one button)

---

## 5-Minute Overview

1. Copy `TenderDetails.tsx` and `AnalyzeTender.tsx` to `src/pages/`
2. Create `src/data/sampleTenders.ts` with mock tender data
3. Add route in `App.tsx`: `<Route path="/viewtender/:id" element={<TenderDetails />} />`
4. Update LiveTenders button to: `onClick={() => navigate('/viewtender/' + tender.id)}`
5. Done! Click "View Tender" and see the new page

---

## Phase-by-Phase Checklist

### Phase 1: Routing (30 min)
- [ ] Open `src/App.tsx`
- [ ] Add import: `import TenderDetails from '@/pages/TenderDetails';`
- [ ] Add route: `<Route path="/viewtender/:id" element={<TenderDetails />} />`
- [ ] Save and verify TypeScript check passes
- [ ] Test build: `npm run build`

### Phase 2: Component Copy (30 min)
- [ ] Copy `/home/autumn/Apache/roadvision/tenderiq/TenderDetails.tsx` → `src/pages/TenderDetails.tsx`
- [ ] Copy `/home/autumn/Apache/roadvision/tenderiq/AnalyzeTender.tsx` → `src/pages/AnalyzeTender.tsx`
- [ ] Run TypeScript check to find missing imports
- [ ] Update imports in both files (see "Import Fixes" section below)

### Phase 3: Data Structure (45 min)
- [ ] Create `src/data/sampleTenders.ts` (see template below)
- [ ] Add sample tender objects with documents
- [ ] Export all required functions
- [ ] Verify TypeScript types match TenderDetails expectations

### Phase 4: Navigation Update (15 min)
- [ ] Open `src/components/tenderiq/LiveTenders.tsx`
- [ ] Import `useNavigate` from react-router-dom at top
- [ ] Find the "View Tender" button (around line 277)
- [ ] Change `onClick` from opening URL to: `onClick={() => navigate('/viewtender/' + tender.id)}`
- [ ] Save and test

### Phase 5: Testing (30 min)
- [ ] Run TypeScript: `npx tsc --noEmit`
- [ ] Build: `npm run build`
- [ ] Start dev server: `npm run dev`
- [ ] Navigate to live tenders list
- [ ] Click "View Tender" button
- [ ] Verify TenderDetails page loads
- [ ] Test wishlist button
- [ ] Test breadcrumb navigation
- [ ] Test quick action buttons (navigate to /analyze/:id)

---

## Import Fixes Needed in Copied Components

### In TenderDetails.tsx
These imports should already work:
```typescript
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Star, FileText, AlertCircle, MapPin, Calendar, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
```

Add this import (needs to be created):
```typescript
import { getTenderById, addToWishlist, isInWishlist } from '@/data/sampleTenders';
```

### In AnalyzeTender.tsx
Should all work:
```typescript
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Upload, Download, FileText, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
```

Add this import (needs to be created):
```typescript
import { getTenderById } from '@/data/sampleTenders';
```

---

## Sample Data File Template

Create `src/data/sampleTenders.ts`:

```typescript
// Type definitions
export interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'excel';
  pages?: number;
  isAIGenerated?: boolean;
}

export interface Tender {
  id: string;
  title: string;
  authority: string;
  value: number;              // in rupees
  dueDate: string;            // ISO date: "2025-12-15"
  status: 'live' | 'analyzed' | 'synopsis' | 'evaluated' | 'won' | 'lost' | 'pending';
  category: string;
  ePublishedDate: string;     // ISO date
  bidSecurity: number;        // in rupees
  emd: number;                // Earnest Money Deposit, in rupees
  location: string;
  length?: string;            // e.g., "120 km"
  costPerKm?: number;
  progressPct: number;        // 0-100
  documents: Document[];
  riskLevel?: 'high' | 'medium' | 'low';
}

// Sample tender data
const sampleTenders: Tender[] = [
  {
    id: '1',
    title: 'Construction of 4-lane highway with interchanges, service roads, and drainage',
    authority: 'National Highways Authority',
    value: 900000000,          // 90 crore
    dueDate: '2025-12-15',
    status: 'live',
    category: 'Civil',
    ePublishedDate: '2025-11-01',
    bidSecurity: 900000,       // 9 lakh
    emd: 900000000,            // 9 crore
    location: 'Maharashtra',
    length: '120 km',
    costPerKm: 7500000,
    progressPct: 0,
    documents: [
      { id: 'd1', name: 'RFP_Document.pdf', type: 'pdf', pages: 45 },
      { id: 'd2', name: 'Technical_Specifications.pdf', type: 'pdf', pages: 32 },
      { id: 'd3', name: 'BOQ.xlsx', type: 'excel' },
      { id: 'd4', name: 'Forms_Schedule.pdf', type: 'pdf', pages: 28 }
    ],
    riskLevel: 'medium'
  },
  {
    id: '2',
    title: 'Development of Smart City Infrastructure',
    authority: 'Urban Development Authority',
    value: 500000000,
    dueDate: '2025-11-30',
    status: 'live',
    category: 'Infrastructure',
    ePublishedDate: '2025-10-15',
    bidSecurity: 500000,
    emd: 500000000,
    location: 'Karnataka',
    progressPct: 0,
    documents: [
      { id: 'd5', name: 'Smart_City_RFP.pdf', type: 'pdf', pages: 60 },
      { id: 'd6', name: 'Technical_Bid_Form.xlsx', type: 'excel' },
      { id: 'd7', name: 'Financial_Bid_Template.xlsx', type: 'excel' }
    ],
    riskLevel: 'high'
  },
  // Add more sample tenders as needed
];

// Wishlist (in localStorage)
const WISHLIST_KEY = 'tenderiq_wishlist';

// Get tender by ID
export function getTenderById(id: string): Tender | null {
  return sampleTenders.find(t => t.id === id) || null;
}

// Wishlist functions
export function addToWishlist(id: string): void {
  const wishlist = getWishlistArray();
  if (!wishlist.includes(id)) {
    wishlist.push(id);
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
  }
}

export function removeFromWishlist(id: string): void {
  const wishlist = getWishlistArray();
  const index = wishlist.indexOf(id);
  if (index > -1) {
    wishlist.splice(index, 1);
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
  }
}

export function isInWishlist(id: string): boolean {
  return getWishlistArray().includes(id);
}

export function getWishlistTenders(): Tender[] {
  const wishlist = getWishlistArray();
  return sampleTenders.filter(t => wishlist.includes(t.id));
}

// Helper
function getWishlistArray(): string[] {
  const stored = localStorage.getItem(WISHLIST_KEY);
  return stored ? JSON.parse(stored) : [];
}

export default sampleTenders;
```

---

## LiveTenders Button Update

**File**: `src/components/tenderiq/LiveTenders.tsx`

**Change 1**: Add import at top
```typescript
import { useNavigate } from 'react-router-dom';
```

**Change 2**: Add useNavigate hook in component
```typescript
const { toast } = useToast();
const navigate = useNavigate();  // ADD THIS LINE
```

**Change 3**: Update button onClick (around line 277-280)

Before:
```typescript
<Button
  size="sm"
  className="hover-scale"
  onClick={() => tender.driveUrl && window.open(tender.driveUrl, '_blank')}
  disabled={!tender.driveUrl}
>
```

After:
```typescript
<Button
  size="sm"
  className="hover-scale"
  onClick={() => navigate(`/viewtender/${tender.id}`)}
>
```

Note: Remove the `disabled={!tender.driveUrl}` since we no longer need driveUrl

---

## Routing Setup

**File**: `src/App.tsx`

**Add this import** near the top with other page imports:
```typescript
import TenderDetails from '@/pages/TenderDetails';
import AnalyzeTender from '@/pages/AnalyzeTender';
```

**Add these routes** in your route definitions (find where TenderIQ routes are):
```typescript
<Route path="/viewtender/:id" element={<TenderDetails />} />
<Route path="/analyze/:id" element={<AnalyzeTender />} />
```

---

## Expected File Tree After Integration

```
src/
├── pages/
│   ├── TenderIQ.tsx                    (existing)
│   ├── TenderDetails.tsx               (COPIED from teammate)
│   ├── AnalyzeTender.tsx               (COPIED from teammate)
│   └── ...existing pages...
│
├── components/tenderiq/
│   ├── LiveTenders.tsx                 (UPDATED button)
│   ├── DateSelector.tsx                (existing)
│   └── ...other components...
│
├── data/
│   └── sampleTenders.ts                (CREATED)
│
├── App.tsx                             (UPDATED routes)
└── ...rest of codebase...
```

---

## Verification Checklist

After completing all phases:

```
TypeScript Check
- [ ] npx tsc --noEmit (no errors)

Build
- [ ] npm run build (succeeds)

Development Server
- [ ] npm run dev (starts without errors)

Navigation Flow
- [ ] Dashboard → TenderIQ → Live Tenders works
- [ ] Click "View Tender" on any tender
- [ ] TenderDetails page loads with correct data
- [ ] Wishlist button works
- [ ] Breadcrumb navigation works
- [ ] Quick Actions navigate correctly
  - [ ] "Analyze Document" → /analyze/:id
  - [ ] "Draft Bid Synopsis" → /synopsis/:id (shows error if no route, that's ok)

Data Display
- [ ] Tender title, authority display correctly
- [ ] Metadata (Value, EMD, Due Date, Location) shows correct formatting
- [ ] Documents list displays with correct file info
- [ ] Status badge shows with correct color
- [ ] Risk assessment displays (if riskLevel set)

Responsive Design
- [ ] Desktop: 3-column layout looks good
- [ ] Tablet: Stacked layout works
- [ ] Mobile: All content readable and buttons clickable

Browser Console
- [ ] No TypeScript errors
- [ ] No runtime errors
```

---

## Common Issues & Fixes

### Issue: "Cannot find module '@/data/sampleTenders'"
**Fix**: Make sure `sampleTenders.ts` is in `src/data/` and is exported correctly

### Issue: "useNavigate is not defined"
**Fix**: Import at top: `import { useNavigate } from 'react-router-dom';` and call `const navigate = useNavigate();` in component

### Issue: "getTenderById is not a function"
**Fix**: Make sure function is exported in sampleTenders.ts: `export function getTenderById(...)`

### Issue: Tender data not showing
**Fix**: Check tender ID matches. In LiveTenders, tender.id should match sample data id (string comparison)

### Issue: Build fails with type errors
**Fix**: Run `npx tsc --noEmit` to see exact errors. Usually missing imports or type mismatches.

---

## If You Get Stuck

1. **Start with Phase 1 only** - Get routing working first
2. **Test each phase** - Don't move to next phase until current works
3. **Check imports** - Most issues are missing imports
4. **Look at original files** - The teammate's files in `/home/autumn/Apache/roadvision/tenderiq/` have the "source of truth"
5. **Read INTEGRATION_PLAN.md** - It has more detailed explanations

---

## Success Criteria

✅ You can navigate from Live Tenders list → View Tender button → Tender Details page
✅ The page shows all tender information correctly
✅ Wishlist button works
✅ Quick action buttons navigate (or show appropriate errors if routes don't exist yet)
✅ TypeScript check passes
✅ Project builds successfully

---

## Next: After Integration Completes

Once this works, you can:
1. Copy other components (Dashboard, Wishlist, CompareTenders, BidSynopsis, EvaluateBid)
2. Add more routes for those pages
3. Connect real API endpoints instead of sample data
4. Integrate with actual AI analysis service
5. Add real document upload/viewing

---

**Questions?** Check INTEGRATION_PLAN.md for detailed explanations of each step!
