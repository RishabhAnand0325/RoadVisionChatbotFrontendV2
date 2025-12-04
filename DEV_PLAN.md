# Ceigall AI Platform - Development Plan

## Project Overview
Building a comprehensive AI-powered platform for infrastructure intelligence with modules for document management, legal operations, tender analysis, and AI assistance.

**Backend Stack:** FastAPI + PostgreSQL + Weaviate + Celery + BS4 + Langchain  
**Frontend Stack:** React + TypeScript + Vite + TailwindCSS

---

## Phase 1: Core DMS (Document Management System)
**Priority:** CRITICAL  
**Status:** 🔴 Not Started  
**Dependencies:** None  
**Timeline:** Week 1-3

### 1.1 Database Schema ✅
- [ ] Create `users` and `user_roles` tables (RBAC foundation)
- [ ] Create `folder_structure` table with materialized path pattern for hierarchical organization
- [ ] Create `folder_permissions` table for fine-grained access control
- [ ] Create `document_categories` table for flat metadata tags
- [ ] Create `document_category_assignments` table (many-to-many: documents can have multiple categories)
- [ ] Create `documents` table with S3 storage fields and folder_id reference
- [ ] Create `document_versions` table for version history
- [ ] Create `document_permissions` table (explicit document access)
- [ ] Create `audit_logs` table for compliance tracking
- [ ] Set up PostgreSQL full-text search indexes
- [ ] Create RLS policies for row-level security
- [ ] Create `user_can_access_document()` security definer function
- [ ] Create `user_can_access_folder()` security definer function

### 1.2 Folder System Architecture ✅
**WHY FOLDERS ARE ESSENTIAL:**
- Large corporations have thousands of documents per department
- Hierarchical organization reflects organizational structure (like a file system)
- Department admins need fine-grained access control
- Employees need controlled access to specific folders
- Supports compliance with confidentiality levels

**CRITICAL: FOLDERS vs CATEGORIES:**
- **FOLDERS**: Hierarchical tree structure (parent/child relationships)
  - Each document belongs to ONE folder
  - Folders can contain subfolders and documents
  - Used for organizing documents like a file system
  - Example: /Legal/Contracts/2025/Q1/
  
- **CATEGORIES**: Flat metadata tags (many-to-many)
  - Each document can have MULTIPLE categories
  - Categories are NOT hierarchical
  - Used for cross-cutting classification
  - Example: A document tagged with ["Legal Document", "Contract", "Infrastructure"]

**FOLDER FEATURES:**
- [ ] Hierarchical folder structure with materialized paths
- [ ] Subfolders can contain more subfolders recursively
- [ ] Department-based folder ownership
- [ ] Per-folder permission system (read/write/admin)
- [ ] Folder-level confidentiality inheritance
- [ ] Auto-folder creation for modules (Legal/Cases/2025/, Tenders/Active/, etc.)
- [ ] Folder sharing with expiry dates
- [ ] Folder move/rename with permission validation
- [ ] Breadcrumb navigation for folder hierarchy
- [ ] Tree view navigation with expand/collapse

### 1.3 Permission System ✅
**MULTI-LAYER ACCESS CONTROL:**
1. **Department-based default access** (e.g., Legal dept → Legal folders)
2. **Folder-level permissions** (e.g., Finance user granted access to specific Legal folder)
3. **Document-level permissions** (e.g., Temporary access to confidential document)
4. **Confidentiality levels** (public, internal, confidential, restricted)

**IMPLEMENTATION:**
- [ ] Implement `folder_permissions` table
- [ ] Create middleware for permission checking
- [ ] Build permission inheritance logic (folder → subfolders → documents)
- [ ] Implement temporary access grants (valid_until)
- [ ] Create admin UI for permission management
- [ ] Add permission audit logging

### 1.4 AWS S3 Storage ✅
- [ ] Configure S3 buckets (dev, staging, prod environments)
- [ ] Set up IAM roles and policies for FastAPI backend
- [ ] Implement bucket policies (encryption at rest, versioning enabled)
- [ ] Configure CORS for presigned URL uploads
- [ ] Set up S3 lifecycle policies (archive to Glacier after 90 days)
- [ ] Enable CloudWatch logging for S3 access audit trail
- [ ] Implement presigned URL generation (upload & download)
- [ ] Create S3 event triggers for processing pipeline

### 1.5 Document Processing Pipeline ✅
- [ ] Celery task: Extract text from uploads (PyPDF2, python-docx, etc.)
- [ ] Celery task: Generate document preview/thumbnail
- [ ] Celery task: Extract metadata (author, creation date, etc.)
- [ ] Celery task: Update document status in PostgreSQL
- [ ] Implement error handling and retry logic
- [ ] Create progress tracking for frontend
- [ ] Set up dead letter queue for failed tasks

### 1.6 API Endpoints ✅
**Folder Management:**
- [ ] `GET /dms/folders` - List folders (permission-filtered)
- [ ] `POST /dms/folders` - Create new folder
- [ ] `GET /dms/folders/{id}` - Get folder details
- [ ] `PATCH /dms/folders/{id}` - Update folder metadata
- [ ] `DELETE /dms/folders/{id}` - Delete folder (if empty)
- [ ] `POST /dms/folders/{id}/move` - Move folder to new parent
- [ ] `GET /dms/folders/{id}/permissions` - Get folder permissions
- [ ] `POST /dms/folders/{id}/permissions` - Grant folder access
- [ ] `DELETE /dms/folders/{id}/permissions/{permission_id}` - Revoke access

**Document Management:**
- [ ] `POST /dms/upload-url` - Generate presigned S3 upload URL
- [ ] `POST /dms/documents/{id}/confirm-upload` - Confirm S3 upload and assign categories
- [ ] `GET /dms/documents` - List documents (filtered by folder, categories, permissions)
- [ ] `GET /dms/documents/{id}` - Get document details with category assignments
- [ ] `GET /dms/documents/{id}/download-url` - Generate presigned download URL
- [ ] `PATCH /dms/documents/{id}` - Update metadata (move to folder, rename, update categories)
- [ ] `POST /dms/documents/{id}/categories` - Assign multiple categories
- [ ] `DELETE /dms/documents/{id}/categories/{category_id}` - Remove category assignment
- [ ] `DELETE /dms/documents/{id}` - Soft delete document
- [ ] `GET /dms/documents/{id}/versions` - Get version history
- [ ] `POST /dms/documents/{id}/permissions` - Grant explicit access
- [ ] `GET /dms/categories` - List all available categories
- [ ] `POST /dms/categories` - Create new category
- [ ] `GET /dms/summary` - Dashboard statistics (total docs, recent uploads, storage)

### 1.7 Frontend Components ✅
- [ ] Hierarchical folder tree navigation with expand/collapse
- [ ] Breadcrumb navigation showing folder path
- [ ] Document upload UI with drag-and-drop (direct S3 upload)
- [ ] Category multi-select during upload (assign multiple categories)
- [ ] Upload progress indicator with Celery task status
- [ ] Document list with sorting/filtering by folder, categories, file type
- [ ] Category filter UI (multi-select, shows documents with any selected category)
- [ ] Clear all filters button
- [ ] Document grid and list view toggle
- [ ] Document preview modal (PDF, images via presigned URLs)
- [ ] AI summary dialog with "Ask AI about this" integration
- [ ] Document actions menu (rename, move, share, delete, edit categories)
- [ ] Version history viewer
- [ ] Folder permissions manager (admin only)
- [ ] Document permissions manager
- [ ] Category management UI (create, edit categories)
- [ ] Multi-category assignment UI for documents
- [ ] Metadata editor
- [ ] Batch operations (move to folder, delete, assign categories)
- [ ] Search within current folder
- [ ] Recent documents widget
- [ ] Storage usage dashboard

**Success Criteria:**
- Users can create and navigate hierarchical folders with subfolders
- Folders and categories work independently (folders = hierarchy, categories = tags)
- Documents can be assigned multiple categories
- Folder tree shows document counts accurately
- Department admins can control folder-level permissions
- Direct S3 upload/download works via presigned URLs
- Document processing pipeline completes within 30s
- Permissions prevent unauthorized access at all levels
- Category filters work correctly with multi-category documents
- All actions logged in audit trail
- Frontend reflects permission-filtered data
- AI summary integration redirects to Ask AI module

---

## Phase 2: DMSIQ (AI Extension over DMS)
**Priority:** HIGH  
**Status:** 🔴 Not Started  
**Dependencies:** Phase 1 (DMS)  
**Timeline:** Week 4-5

### 2.1 Vector Database Setup ✅
- [ ] Configure Weaviate schema for document chunks
- [ ] Create embedding generation pipeline (Langchain)
- [ ] Implement permission-aware chunking (inherit from parent document)
- [ ] Set up hybrid search (keyword + semantic)
- [ ] Create document ingestion Celery task
- [ ] Implement incremental updates for modified docs

### 2.2 AI Features for DMS ✅
- [ ] AI document summarization endpoint
- [ ] Automatic tag suggestion based on content
- [ ] Document similarity/duplicate detection
- [ ] Auto-categorization suggestions
- [ ] Content-based search (semantic search)
- [ ] Document relationship mapping

**Success Criteria:**
- Documents automatically embedded in Weaviate after upload
- AI summaries generated within 10s
- Semantic search respects folder/document permissions
- Tag suggestions are accurate and relevant

---

## Phase 3: Ask CeigallAI with RAG
**Priority:** HIGH  
**Status:** 🟡 Partially Complete (basic chat exists)  
**Dependencies:** Phase 2 (DMSIQ)  
**Timeline:** Week 6-7

### 2.1 Vector Database Setup ✅
- [ ] Configure Weaviate schema for document chunks
- [ ] Create embedding generation pipeline (Langchain)
- [ ] Implement vector similarity search
- [ ] Set up hybrid search (keyword + semantic)
- [ ] Create document ingestion Celery task
- [ ] Implement incremental updates for modified docs

### 2.2 RAG Implementation ✅
- [ ] Build context retrieval function
- [ ] Implement permission-aware filtering
- [ ] Create prompt engineering templates
- [ ] Set up LLM integration (via Langchain)
- [ ] Implement source citation extraction
- [ ] Add confidence scoring for sources

### 3.1 RAG Implementation ✅
- [ ] Build context retrieval function using Weaviate
- [ ] Implement permission-aware filtering (only search user-accessible documents)
- [ ] Create prompt engineering templates
- [ ] Set up LLM integration (via Langchain)
- [ ] Implement source citation extraction with page numbers
- [ ] Add confidence scoring for sources

### 3.2 Enhanced Chat API ✅
- [ ] Update `POST /chats/{chat_id}/messages` with RAG
- [ ] Return sources with page numbers and folder paths
- [ ] Add streaming support for responses
- [ ] Implement conversation memory management
- [ ] Create context window management
- [ ] Add fallback for no relevant context

### 3.3 DMS Integration ✅
- [ ] Create "Import from DMS" endpoint
- [ ] Build folder/document browser API for chat
- [ ] Link chat documents to DMS records
- [ ] Implement auto-ingestion on import
- [ ] Add real-time sync for updated docs
- [ ] Create "Save to DMS" for uploaded chat docs

**Success Criteria:**
- AI answers questions using company documents from DMS
- Responses include accurate source citations with folder paths
- Permission system prevents unauthorized document access
- Users can browse and import DMS folders into chats
- Chat documents can be saved back to DMS

---

## Phase 4: Module Integration Points
**Priority:** MEDIUM  
**Status:** 🔴 Not Started  
**Dependencies:** Phase 1 (DMS), Phase 3 (Ask AI)  
**Timeline:** Week 8-9

### 4.1 TenderIQ → DMS Integration ✅
- [ ] Create `POST /tenders/{id}/save-to-dms` endpoint
- [ ] Implement auto-folder creation (DMS/Tenders/Year/Name)
- [ ] Save tender PDFs and analysis reports
- [ ] Link tender records to DMS folders
- [ ] Tag documents with `tender_id`

### 4.2 LegalIQ → DMS Integration ✅
- [ ] Create "Save to DMS" for drafted documents
- [ ] Implement auto-folder (DMS/Legal/CaseID/Type)
- [ ] Link case records to DMS folders
- [ ] Tag with `case_id` and `document_type`
- [ ] Enforce confidentiality levels

### 4.3 TenderIQ → Ask AI Integration ✅
- [ ] Create "Ask AI about tender" workflow
- [ ] Pre-load tender analysis as chat context
- [ ] Auto-import tender documents from DMS
- [ ] Link AI conversations to tender records

### 4.4 LegalIQ → Ask AI Integration ✅
- [ ] Create "Ask AI about case" workflow
- [ ] Pre-load case documents as context from DMS
- [ ] Link conversations to case records
- [ ] Implement case law lookup integration

### 4.5 Unified Activity Stream ✅
- [ ] Create `activity_log` table
- [ ] Implement activity logging in all modules
- [ ] Create `GET /platform/recent-activity` endpoint
- [ ] Build activity feed UI component
- [ ] Add filtering by module
- [ ] Implement permission-aware display

**Success Criteria:**
- All modules can save/link to DMS
- Cross-module workflows are seamless
- Activity stream shows unified view
- Permissions respected across integrations

---

## Phase 5: Role-Based Access Control (RBAC)
**Priority:** CRITICAL  
**Status:** 🟡 Partial (basic auth exists)  
**Dependencies:** None (foundational)  
**Timeline:** Week 2-3 (parallel with Phase 1)

### 4.1 Database Schema ✅
- [ ] Create `user_roles` table (employee, dept_admin, super_admin)
- [ ] Create `module_access` table
- [ ] Create `document_permissions` table (already in Phase 1)
- [ ] Set up role-based RLS policies

### 4.2 Access Control Logic ✅
- [ ] Implement role checking middleware
- [ ] Create document permission checker
- [ ] Build module access validator
- [ ] Implement department-based filtering
- [ ] Create confidentiality level enforcement

### 4.3 API Endpoints ✅
- [ ] `GET /users/modules` - Get accessible modules
- [ ] `POST /admin/users/{id}/modules` - Grant module access
- [ ] Create permission checking utilities
- [ ] Implement audit logging for access denials

### 4.4 Frontend Components ✅
- [ ] Module access checker HOC
- [ ] Admin user management interface
- [ ] Role assignment UI
- [ ] Permission denied error pages

**Success Criteria:**
- Role system prevents unauthorized access
- Admins can manage user permissions
- Department-based auto-access works
- All access attempts logged

---

## Phase 6: Search & Discovery
**Priority:** MEDIUM  
**Status:** 🔴 Not Started  
**Dependencies:** Phase 1 (DMS), Phase 2 (DMSIQ)  
**Timeline:** Week 10

### 5.1 Global Search ✅
- [ ] Create `GET /search` endpoint
- [ ] Implement cross-module search
- [ ] Build permission-aware filtering
- [ ] Add result grouping by module
- [ ] Implement advanced filters
- [ ] Create search UI component

### 6.2 DMS Search ✅
- [ ] Implement full-text search on content
- [ ] Add metadata search
- [ ] Create folder-scoped search
- [ ] Build advanced filter UI
- [ ] Add search history tracking
- [ ] Implement search within current folder only

### 5.3 Smart Search Features ✅
- [ ] Implement search suggestions
- [ ] Add recent searches
- [ ] Create search analytics
- [ ] Build "did you mean" functionality

**Success Criteria:**
- Users can find anything they have access to
- Search respects all permissions
- Results are relevant and fast
- Advanced filters work correctly

---

## Phase 7: LegalIQ Modules
**Priority:** MEDIUM  
**Status:** 🟡 Partial (UI exists, backend TBD)  
**Dependencies:** Phase 1 (DMS), Phase 3 (Ask AI)  
**Timeline:** Week 11-12

### 6.1 Case Tracker ✅
- [ ] Create `cases` table schema
- [ ] Implement case CRUD endpoints
- [ ] Build case timeline tracking
- [ ] Add hearing date management
- [ ] Create case-document linking
- [ ] Implement case status workflows

### 6.2 Document Drafting ✅
- [ ] Create templates database
- [ ] Implement template engine
- [ ] Build `POST /legal/drafting/generate` endpoint
- [ ] Add AI-assisted clause generation
- [ ] Create template management UI
- [ ] Implement DOCX generation

### 6.3 Document Anonymization ✅
- [ ] Implement PII detection with NER
- [ ] Create anonymization rules engine
- [ ] Build `POST /legal/anonymize` endpoint
- [ ] Add customizable field selection
- [ ] Implement redaction preview

### 6.4 Legal Research ✅
- [ ] Integrate legal database API
- [ ] Implement `POST /legal/research` endpoint
- [ ] Build citation parser
- [ ] Add jurisdiction filtering
- [ ] Create relevance ranking
- [ ] Implement case law summarization

### 6.5 Analyze Document ✅
- [ ] Build document analysis pipeline
- [ ] Implement contract risk detection
- [ ] Create compliance checking
- [ ] Add key clause extraction
- [ ] Build comparison functionality

**Success Criteria:**
- All LegalIQ submodules functional
- AI-powered features work accurately
- Documents integrate with DMS
- Case tracking is comprehensive

---

## Phase 8: TenderIQ Enhancements
**Priority:** LOW  
**Status:** 🟡 Basic mock data exists  
**Dependencies:** Phase 1 (DMSIQ), Phase 2 (RAG)  
**Timeline:** Week 6

### 7.1 Tender Analysis ✅
- [ ] Build tender parsing pipeline
- [ ] Implement compliance scoring
- [ ] Create technical evaluation
- [ ] Add financial analysis
- [ ] Build comparison matrix

### 7.2 API Implementation ✅
- [ ] Replace mock data with real backend
- [ ] Implement tender CRUD
- [ ] Create analysis generation endpoint
- [ ] Add tender-document linking

**Success Criteria:**
- Tender analysis provides accurate scores
- Integration with DMS works
- Reports can be exported

---

## Phase 9: Platform-Level Features
**Priority:** LOW  
**Status:** 🔴 Not Started  
**Dependencies:** All previous phases  
**Timeline:** Week 8

### 8.1 Analytics & Reporting ✅
- [ ] Create usage analytics tables
- [ ] Implement activity tracking
- [ ] Build dashboard metrics API
- [ ] Create admin analytics UI
- [ ] Add export functionality

### 8.2 Notifications ✅
- [ ] Implement notification system
- [ ] Create email alerts
- [ ] Add in-app notifications
- [ ] Build notification preferences

### 8.3 Audit & Compliance ✅
- [ ] Comprehensive audit logging
- [ ] Create compliance reports
- [ ] Build admin audit viewer
- [ ] Implement data retention policies

**Success Criteria:**
- Admins have visibility into usage
- Users receive timely notifications
- Audit trail is complete

---

## Technical Debt & Optimizations

### Performance ✅
- [ ] Implement response caching (Redis)
- [ ] Optimize database queries
- [ ] Add pagination to all list endpoints
- [ ] Implement connection pooling
- [ ] Set up CDN for file downloads

### Security ✅
- [ ] Implement rate limiting
- [ ] Add input validation schemas (Pydantic)
- [ ] Set up CSRF protection
- [ ] Implement API key rotation
- [ ] Add security headers
- [ ] Conduct penetration testing

### DevOps ✅
- [ ] Set up CI/CD pipeline
- [ ] Implement automated testing
- [ ] Create deployment scripts
- [ ] Set up monitoring (Prometheus/Grafana)
- [ ] Implement logging aggregation
- [ ] Create backup strategies

### Documentation ✅
- [ ] Complete API documentation
- [ ] Write deployment guide
- [ ] Create user guides
- [ ] Document architecture
- [ ] Write troubleshooting guide

---

## Current Priorities (January 2025)

### Week 1-3: DMS Foundation (CRITICAL)
1. **DMS Core** (Phase 1.1-1.7)
   - Folder system with hierarchical permissions
   - S3 direct upload/download
   - Document processing pipeline
   - Department-based access control
2. **RBAC Setup** (Phase 5.1-5.2) - Parallel

### Week 4-5: AI Layer over DMS
1. **DMSIQ** (Phase 2.1-2.2)
   - Vector embeddings for semantic search
   - AI summarization and tagging
   - Document intelligence features

### Week 6-7: Conversational AI
1. **Ask CeigallAI with RAG** (Phase 3.1-3.3)
   - Chat with company documents
   - DMS integration for chat
   - Permission-aware RAG

### Week 8-9: Module Integration
1. **Cross-Module Integration** (Phase 4)
   - TenderIQ and LegalIQ save to DMS
   - Activity stream
   - Unified workflows

### Week 10: Search & Discovery
1. **Search Implementation** (Phase 6)
   - Global search
   - Folder-scoped search
   - Smart search features

### Week 11-13: Specialized Modules
1. **LegalIQ** (Phase 7)
2. **TenderIQ** (Phase 8)

### Week 14-16: Polish & Production
1. **Platform Features** (Phase 9)
2. **Performance Optimization**
3. **Testing & Documentation**

---

## Backend-Frontend Sync Points

### Critical API Contracts
- All endpoints must match OpenAPI spec exactly
- Frontend expects specific response structures (see types/)
- Error responses must include `{ error: string }` format
- Authentication uses JWT Bearer tokens
- All list endpoints support pagination, filtering, sorting

### Data Format Standards
- Dates: ISO 8601 format (`YYYY-MM-DDTHH:mm:ssZ`)
- UUIDs: Standard UUID v4 format
- File sizes: Bytes (integer)
- Confidentiality levels: `["public", "internal", "confidential", "restricted"]`
- User roles: `["employee", "department_admin", "super_admin"]`

### File Upload Constraints
- Max file size: 20MB
- Allowed types: PDF, DOCX, XLSX, TXT, MD
- Multipart form-data encoding
- Progress tracking via Celery job IDs

---

## Risk Register

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Weaviate vector search slow for large datasets | High | Medium | Implement caching, optimize chunking strategy |
| Permission system complexity causes bugs | High | High | Comprehensive testing, clear documentation |
| RAG hallucinations provide incorrect info | Critical | Medium | Add confidence thresholds, human-in-loop validation |
| Document processing queue bottleneck | Medium | Medium | Scale Celery workers, implement priority queues |
| Cross-module data consistency issues | High | Medium | Use database transactions, implement event sourcing |

---

## Success Metrics

### Technical KPIs
- API response time p95 < 500ms
- Document processing time < 30s per MB
- RAG answer accuracy > 90%
- System uptime > 99.5%
- Search results relevance > 85%

### Business KPIs
- User adoption rate across modules
- Daily active users
- Documents uploaded per week
- AI queries per day
- User satisfaction score

---

**Last Updated:** 2025-01-XX  
**Next Review:** Weekly during development
