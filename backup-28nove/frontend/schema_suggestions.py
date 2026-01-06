"""
Database Schema Suggestions for Ceigall AI Platform Backend
============================================================

This file contains PostgreSQL schema suggestions for the FastAPI backend.
Each schema is designed to support the platform's requirements for:
- Document management (DMSIQ)
- AI-powered chat (Ask CeigallAI)
- Legal operations (LegalIQ)
- Tender analysis (TenderIQ)
- Role-based access control (RBAC)
- Cross-module integration

Schema Design Principles:
1. Normalized structure to prevent data redundancy
2. UUID primary keys for distributed system compatibility
3. Timestamp tracking (created_at, updated_at) for all entities
4. Soft deletes where applicable (deleted_at)
5. JSONB fields for flexible metadata
6. Foreign keys with CASCADE for referential integrity
7. Indexes on frequently queried fields
"""

from datetime import datetime
from typing import Optional, List, Dict, Any
from enum import Enum

# =============================================================================
# ENUMS (PostgreSQL ENUM types)
# =============================================================================

class UserRole(str, Enum):
    """
    User role hierarchy for RBAC
    - employee: Basic access to universal modules
    - department_admin: Can manage users within their department
    - super_admin: Full platform access and user management
    """
    EMPLOYEE = "employee"
    DEPARTMENT_ADMIN = "department_admin"
    SUPER_ADMIN = "super_admin"


class AccountStatus(str, Enum):
    """
    User account status for access control
    - active: Normal access
    - inactive: Temporarily disabled
    - locked: Security lockout (too many failed attempts)
    - pending: Awaiting admin approval
    """
    ACTIVE = "active"
    INACTIVE = "inactive"
    LOCKED = "locked"
    PENDING = "pending"


class DocumentStatus(str, Enum):
    """
    Document lifecycle status
    - pending: Uploaded but not processed
    - processing: Being chunked/embedded by Celery worker
    - active: Ready for use
    - archived: Soft deleted, hidden from normal queries
    """
    PENDING = "pending"
    PROCESSING = "processing"
    ACTIVE = "active"
    ARCHIVED = "archived"


class ConfidentialityLevel(str, Enum):
    """
    Document confidentiality levels (ascending order of restriction)
    - public: Accessible to all authenticated users
    - internal: Department-specific access
    - confidential: Requires explicit permission
    - restricted: Admin-only access
    
    WHY: Supports compliance requirements for sensitive infrastructure data
    """
    PUBLIC = "public"
    INTERNAL = "internal"
    CONFIDENTIAL = "confidential"
    RESTRICTED = "restricted"


class CaseStatus(str, Enum):
    """Legal case status for LegalIQ Case Tracker"""
    ACTIVE = "active"
    CLOSED = "closed"
    PENDING = "pending"


class CasePriority(str, Enum):
    """Case priority levels for workload management"""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class TenderStatus(str, Enum):
    """Tender lifecycle status for TenderIQ"""
    OPEN = "open"
    CLOSED = "closed"
    AWARDED = "awarded"


class ActivityType(str, Enum):
    """
    Activity types for unified activity stream
    WHY: Enables cross-module activity tracking on platform dashboard
    """
    DOCUMENT = "document"
    CHAT = "chat"
    ANALYSIS = "analysis"
    CASE = "case"
    TENDER = "tender"


# =============================================================================
# CORE USER & AUTH TABLES
# =============================================================================

"""
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    employee_id VARCHAR(50) UNIQUE NOT NULL,
    mobile_number VARCHAR(20),
    designation VARCHAR(100),
    department VARCHAR(100) NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    account_status VARCHAR(20) DEFAULT 'pending' CHECK (account_status IN ('active', 'inactive', 'locked', 'pending')),
    is_active BOOLEAN DEFAULT false,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_employee_id ON users(employee_id);
CREATE INDEX idx_users_department ON users(department);
CREATE INDEX idx_users_account_status ON users(account_status);

COMMENT ON TABLE users IS 'Core user table with authentication and profile data';
COMMENT ON COLUMN users.employee_id IS 'Unique company employee identifier for SSO integration';
COMMENT ON COLUMN users.department IS 'Department for role-based module access (e.g., "Contracts & Legal" → LegalIQ)';
COMMENT ON COLUMN users.account_status IS 'Account status affects login ability and access control';
"""

"""
CREATE TABLE user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(30) NOT NULL CHECK (role IN ('employee', 'department_admin', 'super_admin')),
    granted_by UUID REFERENCES users(id),
    granted_at TIMESTAMP DEFAULT NOW(),
    valid_until TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX idx_user_roles_role ON user_roles(role);
CREATE UNIQUE INDEX idx_user_roles_unique ON user_roles(user_id, role);

COMMENT ON TABLE user_roles IS 'User roles for RBAC - separate table to prevent privilege escalation attacks';
COMMENT ON COLUMN user_roles.granted_by IS 'Admin who granted this role for audit trail';
COMMENT ON COLUMN user_roles.valid_until IS 'Optional expiration date for temporary elevated access';

WHY SEPARATE TABLE:
- Prevents privilege escalation via user profile updates
- Enables fine-grained audit trail for role changes
- Supports temporary role grants (e.g., temporary admin access)
- Allows multiple roles per user if needed in future
"""

"""
CREATE TABLE module_access (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    module_name VARCHAR(50) NOT NULL,
    granted_by UUID REFERENCES users(id),
    granted_at TIMESTAMP DEFAULT NOW(),
    valid_until TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_module_access_user_id ON module_access(user_id);
CREATE INDEX idx_module_access_module_name ON module_access(module_name);
CREATE UNIQUE INDEX idx_module_access_unique ON module_access(user_id, module_name);

COMMENT ON TABLE module_access IS 'Explicit module access grants (beyond department-based defaults)';
COMMENT ON COLUMN module_access.module_name IS 'Module identifier: ask-ai, legaliq, dmsiq, tenderiq';

WHY THIS TABLE:
- Universal modules (Ask AI, DMSIQ, Dashboard) accessible by default
- Department-based auto-access (e.g., Legal dept → LegalIQ)
- This table handles EXPLICIT grants for cross-department access
- Example: Finance user needs TenderIQ access → admin creates module_access record
"""


# =============================================================================
# DMSIQ - DOCUMENT MANAGEMENT SYSTEM
# =============================================================================

"""
CREATE TABLE document_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    color VARCHAR(50),
    department_restrictions JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_doc_categories_name ON document_categories(name);

COMMENT ON TABLE document_categories IS 'Document categories for DMSIQ organization';
COMMENT ON COLUMN document_categories.department_restrictions IS 'JSON array of departments allowed to access this category, null = all departments';

WHY JSONB FOR RESTRICTIONS:
- Flexible department filtering without complex join tables
- Easy to query with PostgreSQL JSONB operators (@>, ? etc.)
- Example: {"departments": ["Legal", "Finance"], "roles": ["admin"]}
"""

"""
CREATE TABLE folder_structure (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    parent_id UUID REFERENCES folder_structure(id) ON DELETE CASCADE,
    path TEXT NOT NULL UNIQUE,
    department VARCHAR(100),
    confidentiality_level VARCHAR(20) DEFAULT 'internal' CHECK (confidentiality_level IN ('public', 'internal', 'confidential', 'restricted')),
    description TEXT,
    is_system_folder BOOLEAN DEFAULT false,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP
);

CREATE INDEX idx_folder_structure_parent_id ON folder_structure(parent_id);
CREATE INDEX idx_folder_structure_path ON folder_structure(path);
CREATE INDEX idx_folder_structure_department ON folder_structure(department);
CREATE INDEX idx_folder_structure_confidentiality ON folder_structure(confidentiality_level);
CREATE INDEX idx_folder_structure_created_by ON folder_structure(created_by);

COMMENT ON TABLE folder_structure IS 'Hierarchical folder structure for DMS with permission inheritance';
COMMENT ON COLUMN folder_structure.path IS 'Materialized path for fast tree queries (e.g., "/Legal/Cases/2025/")';
COMMENT ON COLUMN folder_structure.confidentiality_level IS 'Default confidentiality for documents in this folder';
COMMENT ON COLUMN folder_structure.is_system_folder IS 'True for auto-created module folders (Legal/, Tenders/, etc.)';

WHY MATERIALIZED PATH:
- Faster than recursive CTEs for tree traversal
- Enables simple LIKE queries for subtree search (path LIKE '/Legal/Cases/%')
- Trade-off: Must update child paths on folder move (acceptable for infrequent operation)

WHY FOLDER CONFIDENTIALITY:
- Folders inherit department restrictions and apply to all contained documents
- Documents can override folder confidentiality if needed
- Supports compliance with organizational security policies
"""

"""
CREATE TABLE folder_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    folder_id UUID NOT NULL REFERENCES folder_structure(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    department VARCHAR(100),
    permission_level VARCHAR(20) NOT NULL CHECK (permission_level IN ('read', 'write', 'admin')),
    inherit_to_subfolders BOOLEAN DEFAULT true,
    granted_by UUID REFERENCES users(id),
    granted_at TIMESTAMP DEFAULT NOW(),
    valid_until TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    
    CONSTRAINT folder_permission_target CHECK (
        (user_id IS NOT NULL AND department IS NULL) OR 
        (user_id IS NULL AND department IS NOT NULL)
    )
);

CREATE INDEX idx_folder_permissions_folder_id ON folder_permissions(folder_id);
CREATE INDEX idx_folder_permissions_user_id ON folder_permissions(user_id);
CREATE INDEX idx_folder_permissions_department ON folder_permissions(department);
CREATE UNIQUE INDEX idx_folder_permissions_user_unique ON folder_permissions(folder_id, user_id) WHERE user_id IS NOT NULL;
CREATE UNIQUE INDEX idx_folder_permissions_dept_unique ON folder_permissions(folder_id, department) WHERE department IS NOT NULL;

COMMENT ON TABLE folder_permissions IS 'Fine-grained folder access control for department admins';
COMMENT ON COLUMN folder_permissions.user_id IS 'Specific user granted access (mutually exclusive with department)';
COMMENT ON COLUMN folder_permissions.department IS 'Entire department granted access (mutually exclusive with user_id)';
COMMENT ON COLUMN folder_permissions.permission_level IS 'read: view only, write: upload/edit, admin: manage permissions';
COMMENT ON COLUMN folder_permissions.inherit_to_subfolders IS 'If true, applies to all subfolders recursively';

WHY FOLDER-LEVEL PERMISSIONS:
- CRITICAL for large enterprises with thousands of documents
- Department admins need to control which employees access specific folders
- Supports temporary contractor access with expiry dates
- Enables cross-department collaboration on specific projects
- Permission inheritance reduces management overhead

PERMISSION LEVELS:
- read: View folder contents and download documents
- write: Everything in read + upload, rename, move documents
- admin: Everything in write + manage folder permissions, delete folder

EXAMPLES:
1. Grant Finance department read access to /Legal/Contracts/ for audit purposes
2. Grant specific engineer write access to /Engineering/ProjectX/ for 6 months
3. Grant Legal admin full control over all /Legal/* folders
"""

"""
CREATE TABLE document_category_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES document_categories(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP DEFAULT NOW(),
    assigned_by UUID REFERENCES users(id),
    
    UNIQUE(document_id, category_id)
);

CREATE INDEX idx_doc_category_assignments_document_id ON document_category_assignments(document_id);
CREATE INDEX idx_doc_category_assignments_category_id ON document_category_assignments(category_id);

COMMENT ON TABLE document_category_assignments IS 'Many-to-many relationship between documents and categories';
COMMENT ON COLUMN document_category_assignments.document_id IS 'Reference to document';
COMMENT ON COLUMN document_category_assignments.category_id IS 'Reference to category';

WHY SEPARATE CATEGORY ASSIGNMENT TABLE:
- Enables multiple categories per document
- Categories are metadata tags, not hierarchical like folders
- Supports flexible document organization without rigid folder constraints
- Example: A contract can be tagged with "Legal", "Finance", and "Confidential" categories
- Easy to query documents by category without complex JSON operations
"""

"""
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    size_bytes BIGINT NOT NULL,
    
    -- AWS S3 Storage fields
    storage_provider VARCHAR(20) DEFAULT 's3' CHECK (storage_provider IN ('s3', 'local')),
    storage_path TEXT NOT NULL,
    s3_bucket VARCHAR(100),
    s3_etag VARCHAR(100),
    s3_version_id VARCHAR(100),
    
    -- Folder relationship (hierarchical organization)
    folder_id UUID REFERENCES folder_structure(id),
    folder_path TEXT,
    
    -- Status and confidentiality
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'active', 'archived')),
    confidentiality_level VARCHAR(20) DEFAULT 'internal' CHECK (confidentiality_level IN ('public', 'internal', 'confidential', 'restricted')),
    
    -- Flexible metadata
    tags JSONB DEFAULT '[]',
    metadata JSONB DEFAULT '{}',
    version INTEGER DEFAULT 1,
    
    -- Audit fields
    uploaded_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP
);

CREATE INDEX idx_documents_folder_id ON documents(folder_id);
CREATE INDEX idx_documents_folder_path ON documents(folder_path);
CREATE INDEX idx_documents_status ON documents(status);
CREATE INDEX idx_documents_confidentiality ON documents(confidentiality_level);
CREATE INDEX idx_documents_uploaded_by ON documents(uploaded_by);
CREATE INDEX idx_documents_created_at ON documents(created_at DESC);
CREATE INDEX idx_documents_tags ON documents USING GIN(tags);
CREATE INDEX idx_documents_metadata ON documents USING GIN(metadata);

-- Full-text search index
CREATE INDEX idx_documents_search ON documents USING GIN(to_tsvector('english', name || ' ' || COALESCE(metadata->>'description', '')));

COMMENT ON TABLE documents IS 'Central document registry for all modules';
COMMENT ON COLUMN documents.storage_path IS 'Full S3 key (e.g., documents/2024/01/uuid.pdf)';
COMMENT ON COLUMN documents.s3_bucket IS 'S3 bucket name for multi-environment support';
COMMENT ON COLUMN documents.s3_etag IS 'S3 ETag for integrity verification';
COMMENT ON COLUMN documents.s3_version_id IS 'S3 native version ID if versioning enabled';
COMMENT ON COLUMN documents.folder_path IS 'Denormalized path for fast filtering';
COMMENT ON COLUMN documents.tags IS 'JSON array of tag strings for ad-hoc categorization';
COMMENT ON COLUMN documents.metadata IS 'Flexible JSON for module-specific fields (case_id, tender_id, etc.)';

CRITICAL DISTINCTION - FOLDERS vs CATEGORIES:
- FOLDERS: Hierarchical organization (tree structure with parent/child relationships)
  * Used for organizing documents like a file system
  * Each document belongs to ONE folder
  * Folders can contain subfolders and documents
  * Example: /Legal/Contracts/2025/Q1/
  
- CATEGORIES: Flat metadata tags (many-to-many relationship)
  * Used for cross-cutting classification
  * Each document can have MULTIPLE categories
  * Categories are not hierarchical
  * Example: A single document tagged with ["Contract", "Finance", "Confidential"]
  
- TAGS: Free-form text labels (stored in JSONB array)
  * User-defined, ad-hoc labels
  * Example: ["urgent", "needs-review", "client-ABC"]

WHY S3 INTEGRATION:
- storage_provider: Flexibility for hybrid storage (S3 + local fallback)
- s3_bucket: Multi-bucket strategy (dev/staging/prod, or archival vs active)
- s3_etag: S3's MD5-based integrity check, faster than recalculating checksums
- s3_version_id: Leverages S3 native versioning for compliance and audit trails
- storage_path: Full S3 key enables direct boto3 operations without path construction

WHY METADATA JSONB:
- Different modules need different fields (tender_id, case_id, contract_type)
- Avoids creating module-specific tables for simple key-value pairs
- PostgreSQL JSONB supports indexes and efficient queries
- Example: metadata = {"case_id": "uuid", "contract_type": "NDA", "expiry_date": "2025-12-31"}

EXAMPLE DOCUMENT WITH FULL METADATA:
- Document: "Q1_2025_Infrastructure_Contract.pdf"
- Folder: /Legal/Contracts/2025/Q1/ (hierarchical location)
- Categories: ["Legal Document", "Contract", "Infrastructure"] (multiple tags via document_category_assignments)
- Tags: ["high-priority", "needs-legal-review", "expires-2026"] (free-form)
- Metadata: {"contract_type": "Infrastructure", "value": "$5M", "expiry_date": "2026-12-31"}
"""

"""
CREATE TABLE document_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    
    -- S3 Storage fields for versions
    storage_path TEXT NOT NULL,
    s3_bucket VARCHAR(100),
    s3_etag VARCHAR(100),
    s3_version_id VARCHAR(100),
    
    size_bytes BIGINT NOT NULL,
    uploaded_by UUID NOT NULL REFERENCES users(id),
    change_summary TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

COMMENT ON TABLE document_versions IS 'Version history using S3 versioning';
COMMENT ON COLUMN document_versions.s3_version_id IS 'S3 native version ID for compliance';

WHY VERSION S3 FIELDS:
- Each version may be stored in different S3 buckets (archival vs active)
- S3 version IDs enable native S3 versioning features and lifecycle policies
- Allows independent lifecycle policies per version (e.g., archive to Glacier after 90 days)
"""

CREATE INDEX idx_doc_versions_document_id ON document_versions(document_id);
CREATE INDEX idx_doc_versions_version ON document_versions(document_id, version_number DESC);

COMMENT ON TABLE document_versions IS 'Version history for document updates';
COMMENT ON COLUMN document_versions.change_summary IS 'Optional description of what changed in this version';

WHY VERSION TRACKING:
- Compliance requirement for infrastructure documents
- Enables rollback and audit trail
- Version number matches documents.version for integrity
"""

"""
CREATE TABLE document_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    permission_level VARCHAR(20) NOT NULL CHECK (permission_level IN ('read', 'write', 'admin')),
    granted_by UUID REFERENCES users(id),
    granted_at TIMESTAMP DEFAULT NOW(),
    valid_until TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_doc_permissions_document_id ON document_permissions(document_id);
CREATE INDEX idx_doc_permissions_user_id ON document_permissions(user_id);
CREATE UNIQUE INDEX idx_doc_permissions_unique ON document_permissions(document_id, user_id);

COMMENT ON TABLE document_permissions IS 'Explicit document-level permissions (beyond role/department access)';

WHY DOCUMENT-LEVEL PERMISSIONS:
- Department-based access is default (all Legal users see Legal docs)
- This table adds EXPLICIT grants (e.g., Finance user needs access to specific Legal contract)
- Supports temporary access grants with valid_until
- Admin can revoke individual document access
"""

"""
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(50) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id UUID,
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);

COMMENT ON TABLE audit_logs IS 'Comprehensive audit trail for security and compliance';
COMMENT ON COLUMN audit_logs.action IS 'Action performed: view, download, upload, delete, update, access_denied, etc.';
COMMENT ON COLUMN audit_logs.details IS 'Additional context (e.g., changed fields, query used)';

WHY COMPREHENSIVE LOGGING:
- Compliance requirement for infrastructure companies
- Security investigation capabilities
- User activity monitoring
- Tracks both successful and denied access attempts
"""


# =============================================================================
# ASK CEIGALLAI - CHAT & RAG SYSTEM
# =============================================================================

"""
CREATE TABLE chats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP
);

CREATE INDEX idx_chats_user_id ON chats(user_id);
CREATE INDEX idx_chats_updated_at ON chats(updated_at DESC);

COMMENT ON TABLE chats IS 'Chat conversations for Ask CeigallAI';
"""

"""
CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chat_id UUID NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
    sender VARCHAR(20) NOT NULL CHECK (sender IN ('user', 'assistant')),
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_chat_messages_chat_id ON chat_messages(chat_id);
CREATE INDEX idx_chat_messages_created_at ON chat_messages(created_at);

COMMENT ON TABLE chat_messages IS 'Individual messages within chats';
COMMENT ON COLUMN chat_messages.metadata IS 'Stores sources, model used, token count, etc.';
"""

"""
CREATE TABLE chat_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chat_id UUID NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
    document_id UUID REFERENCES documents(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    storage_path TEXT,
    size_bytes BIGINT,
    mime_type VARCHAR(100),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'finished', 'failed')),
    celery_job_id VARCHAR(100),
    error_message TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_chat_documents_chat_id ON chat_documents(chat_id);
CREATE INDEX idx_chat_documents_document_id ON chat_documents(document_id);
CREATE INDEX idx_chat_documents_status ON chat_documents(status);

COMMENT ON TABLE chat_documents IS 'Documents uploaded to chats (may or may not be in DMSIQ)';
COMMENT ON COLUMN chat_documents.document_id IS 'Links to DMSIQ if saved there, null for chat-only uploads';
COMMENT ON COLUMN chat_documents.celery_job_id IS 'Celery task ID for processing status tracking';

WHY SEPARATE FROM DOCUMENTS TABLE:
- Chat uploads may be temporary (not saved to DMSIQ)
- Processing status tracked per chat (same doc in multiple chats)
- Allows "Import from DMSIQ" workflow (creates chat_documents record linking to existing document)
"""

"""
CREATE TABLE drive_folders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chat_id UUID NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
    drive_folder_id VARCHAR(255) NOT NULL,
    drive_url TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_drive_folders_chat_id ON drive_folders(chat_id);

COMMENT ON TABLE drive_folders IS 'Google Drive folders linked to chats';
"""


# =============================================================================
# WEAVIATE SCHEMA (Vector Database for RAG)
# =============================================================================

"""
Weaviate Collection Schema (defined in Python/JSON, not SQL)

WHY WEAVIATE OVER PGVECTOR:
- Better performance for large-scale vector search
- Built-in hybrid search (keyword + semantic)
- Optimized for RAG use cases
- Horizontal scaling capabilities

Collection: DocumentChunks
{
    "class": "DocumentChunk",
    "vectorizer": "none",  # We generate embeddings via Langchain
    "properties": [
        {
            "name": "documentId",
            "dataType": ["string"],
            "description": "UUID of source document in PostgreSQL"
        },
        {
            "name": "chunkIndex",
            "dataType": ["int"],
            "description": "Sequential index of chunk within document"
        },
        {
            "name": "content",
            "dataType": ["text"],
            "description": "Chunk text content"
        },
        {
            "name": "metadata",
            "dataType": ["object"],
            "description": "JSON with page, section, tokens, etc."
        },
        {
            "name": "departmentRestrictions",
            "dataType": ["string[]"],
            "description": "Departments allowed to access (from parent document)"
        },
        {
            "name": "confidentialityLevel",
            "dataType": ["string"],
            "description": "Inherited from parent document for filtering"
        },
        {
            "name": "createdAt",
            "dataType": ["date"]
        }
    ]
}

CHUNKING STRATEGY:
- Use Langchain RecursiveCharacterTextSplitter
- Target chunk size: 512 tokens (overlap: 50 tokens)
- Preserve sentence boundaries
- Store page numbers for citation

EMBEDDING STRATEGY:
- Model: Use OpenAI text-embedding-3-small or similar
- Dimension: 1536 (standard for most models)
- Generate embeddings in Celery worker to avoid blocking
- Batch processing for efficiency

PERMISSION-AWARE SEARCH:
1. User queries "What are the safety requirements?"
2. Backend gets user's departments: ["Engineering", "Safety"]
3. Weaviate query filters: departmentRestrictions contains ANY(["Engineering", "Safety"])
4. Further filter by confidentiality level based on user role
5. Return only chunks user is authorized to see
"""


# =============================================================================
# LEGALIQ TABLES
# =============================================================================

"""
CREATE TABLE legal_cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_number VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'closed', 'pending')),
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    assigned_to UUID REFERENCES users(id),
    next_hearing TIMESTAMP,
    metadata JSONB DEFAULT '{}',
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP
);

CREATE INDEX idx_legal_cases_status ON legal_cases(status);
CREATE INDEX idx_legal_cases_priority ON legal_cases(priority);
CREATE INDEX idx_legal_cases_assigned_to ON legal_cases(assigned_to);
CREATE INDEX idx_legal_cases_next_hearing ON legal_cases(next_hearing);

COMMENT ON TABLE legal_cases IS 'Legal case tracking for LegalIQ Case Tracker module';
"""

"""
CREATE TABLE case_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID NOT NULL REFERENCES legal_cases(id) ON DELETE CASCADE,
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    document_type VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_case_documents_case_id ON case_documents(case_id);
CREATE INDEX idx_case_documents_document_id ON case_documents(document_id);
CREATE UNIQUE INDEX idx_case_documents_unique ON case_documents(case_id, document_id);

COMMENT ON TABLE case_documents IS 'Links cases to documents in DMSIQ';
COMMENT ON COLUMN case_documents.document_type IS 'e.g., "contract", "evidence", "correspondence"';
"""

"""
CREATE TABLE legal_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    template_content TEXT NOT NULL,
    fields_schema JSONB NOT NULL,
    version VARCHAR(20),
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_legal_templates_category ON legal_templates(category);

COMMENT ON TABLE legal_templates IS 'Document templates for LegalIQ Document Drafting';
COMMENT ON COLUMN legal_templates.template_content IS 'Template with placeholders (e.g., {{party_name}})';
COMMENT ON COLUMN legal_templates.fields_schema IS 'JSON schema defining required fields and validation';
"""


# =============================================================================
# TENDERIQ TABLES
# =============================================================================

"""
CREATE TABLE tenders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    organization VARCHAR(255) NOT NULL,
    tender_number VARCHAR(100) UNIQUE,
    deadline TIMESTAMP,
    status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'closed', 'awarded')),
    document_id UUID REFERENCES documents(id),
    metadata JSONB DEFAULT '{}',
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP
);

CREATE INDEX idx_tenders_status ON tenders(status);
CREATE INDEX idx_tenders_deadline ON tenders(deadline);
CREATE INDEX idx_tenders_document_id ON tenders(document_id);

COMMENT ON TABLE tenders IS 'Tender tracking for TenderIQ module';
"""

"""
CREATE TABLE tender_analysis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tender_id UUID NOT NULL REFERENCES tenders(id) ON DELETE CASCADE,
    compliance_score DECIMAL(5,2),
    technical_score DECIMAL(5,2),
    financial_score DECIMAL(5,2),
    overall_score DECIMAL(5,2),
    key_findings JSONB DEFAULT '[]',
    recommendations JSONB DEFAULT '[]',
    analysis_metadata JSONB DEFAULT '{}',
    analyzed_at TIMESTAMP DEFAULT NOW(),
    analyzed_by UUID REFERENCES users(id)
);

CREATE INDEX idx_tender_analysis_tender_id ON tender_analysis(tender_id);

COMMENT ON TABLE tender_analysis IS 'AI-generated tender analysis results';
COMMENT ON COLUMN tender_analysis.key_findings IS 'JSON array of finding objects';
COMMENT ON COLUMN tender_analysis.analysis_metadata IS 'Model used, processing time, confidence scores';
"""


# =============================================================================
# CROSS-MODULE INTEGRATION TABLES
# =============================================================================

"""
CREATE TABLE activity_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    module VARCHAR(50) NOT NULL,
    activity_type VARCHAR(50) NOT NULL CHECK (activity_type IN ('document', 'chat', 'analysis', 'case', 'tender')),
    title VARCHAR(255) NOT NULL,
    resource_id UUID,
    status VARCHAR(20) DEFAULT 'complete' CHECK (status IN ('complete', 'in_progress', 'pending')),
    icon VARCHAR(50),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_activity_log_user_id ON activity_log(user_id);
CREATE INDEX idx_activity_log_module ON activity_log(module);
CREATE INDEX idx_activity_log_created_at ON activity_log(created_at DESC);
CREATE INDEX idx_activity_log_type ON activity_log(activity_type);

COMMENT ON TABLE activity_log IS 'Unified activity stream for platform dashboard';
COMMENT ON COLUMN activity_log.resource_id IS 'ID of the related resource (document, chat, case, tender)';

WHY UNIFIED ACTIVITY LOG:
- Platform dashboard shows cross-module activity
- Single query to fetch recent user activities
- Easier to implement "what did I work on recently" features
- Denormalized for read performance
"""


# =============================================================================
# CELERY TASK TRACKING
# =============================================================================

"""
CREATE TABLE celery_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id VARCHAR(255) UNIQUE NOT NULL,
    task_name VARCHAR(255) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'started', 'success', 'failure', 'retry')),
    result JSONB,
    error_message TEXT,
    user_id UUID REFERENCES users(id),
    resource_type VARCHAR(50),
    resource_id UUID,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_celery_tasks_task_id ON celery_tasks(task_id);
CREATE INDEX idx_celery_tasks_user_id ON celery_tasks(user_id);
CREATE INDEX idx_celery_tasks_status ON celery_tasks(status);

COMMENT ON TABLE celery_tasks IS 'Track Celery async task status for frontend polling';
COMMENT ON COLUMN celery_tasks.resource_type IS 'document, embedding, analysis, etc.';

WHY TRACK CELERY TASKS:
- Frontend needs to poll task status (document processing, AI analysis)
- User-friendly progress updates
- Debugging failed background jobs
- Resource linking (e.g., document upload task → document_id)
"""


# =============================================================================
# ANALYTICS & METRICS
# =============================================================================

"""
CREATE TABLE usage_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    module VARCHAR(50) NOT NULL,
    metric_type VARCHAR(50) NOT NULL,
    metric_value DECIMAL(10,2),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_usage_metrics_user_id ON usage_metrics(user_id);
CREATE INDEX idx_usage_metrics_module ON usage_metrics(module);
CREATE INDEX idx_usage_metrics_type ON usage_metrics(metric_type);
CREATE INDEX idx_usage_metrics_created_at ON usage_metrics(created_at);

COMMENT ON TABLE usage_metrics IS 'Track platform usage for analytics dashboard';
COMMENT ON COLUMN usage_metrics.metric_type IS 'e.g., "chat_message_sent", "document_uploaded", "analysis_run"';

EXAMPLES:
- metric_type: "chat_message_sent", metric_value: 1
- metric_type: "document_uploaded", metric_value: file_size_mb
- metric_type: "tender_analyzed", metric_value: processing_time_seconds
"""


# =============================================================================
# DATABASE FUNCTIONS & TRIGGERS
# =============================================================================

"""
-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ... repeat for all tables with updated_at
"""

"""
-- Function to check user folder access
CREATE OR REPLACE FUNCTION user_can_access_folder(
    p_user_id UUID,
    p_folder_id UUID,
    p_required_permission VARCHAR(20) DEFAULT 'read'
) RETURNS BOOLEAN AS $$
DECLARE
    user_dept VARCHAR(100);
    folder_dept VARCHAR(100);
    folder_path TEXT;
    user_role VARCHAR(30);
    has_explicit_permission BOOLEAN;
    permission_level VARCHAR(20);
BEGIN
    -- Get user department and role
    SELECT department INTO user_dept FROM users WHERE id = p_user_id;
    SELECT role INTO user_role FROM user_roles WHERE user_id = p_user_id LIMIT 1;
    
    -- Get folder details
    SELECT department, path INTO folder_dept, folder_path FROM folder_structure WHERE id = p_folder_id;
    
    -- Super admins can access everything
    IF user_role = 'super_admin' THEN
        RETURN TRUE;
    END IF;
    
    -- Check explicit user permission on this folder or parent folders
    SELECT fp.permission_level INTO permission_level
    FROM folder_permissions fp
    JOIN folder_structure fs ON fp.folder_id = fs.id
    WHERE fp.user_id = p_user_id
    AND (fp.folder_id = p_folder_id OR (fp.inherit_to_subfolders = true AND folder_path LIKE fs.path || '%'))
    AND (fp.valid_until IS NULL OR fp.valid_until > NOW())
    ORDER BY LENGTH(fs.path) DESC
    LIMIT 1;
    
    IF permission_level IS NOT NULL THEN
        -- Check if user has required permission level
        IF p_required_permission = 'read' THEN
            RETURN TRUE;
        ELSIF p_required_permission = 'write' AND permission_level IN ('write', 'admin') THEN
            RETURN TRUE;
        ELSIF p_required_permission = 'admin' AND permission_level = 'admin' THEN
            RETURN TRUE;
        END IF;
    END IF;
    
    -- Check department-based permission
    SELECT fp.permission_level INTO permission_level
    FROM folder_permissions fp
    JOIN folder_structure fs ON fp.folder_id = fs.id
    WHERE fp.department = user_dept
    AND (fp.folder_id = p_folder_id OR (fp.inherit_to_subfolders = true AND folder_path LIKE fs.path || '%'))
    AND (fp.valid_until IS NULL OR fp.valid_until > NOW())
    ORDER BY LENGTH(fs.path) DESC
    LIMIT 1;
    
    IF permission_level IS NOT NULL THEN
        IF p_required_permission = 'read' THEN
            RETURN TRUE;
        ELSIF p_required_permission = 'write' AND permission_level IN ('write', 'admin') THEN
            RETURN TRUE;
        ELSIF p_required_permission = 'admin' AND permission_level = 'admin' THEN
            RETURN TRUE;
        END IF;
    END IF;
    
    -- Default department access (if folder belongs to user's department)
    IF folder_dept = user_dept THEN
        RETURN TRUE;
    END IF;
    
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION user_can_access_folder IS 'Centralized permission check for folder access with inheritance';

-- Function to check user document access (enhanced with folder permissions)
CREATE OR REPLACE FUNCTION user_can_access_document(
    p_user_id UUID,
    p_document_id UUID,
    p_required_permission VARCHAR(20) DEFAULT 'read'
) RETURNS BOOLEAN AS $$
DECLARE
    user_dept VARCHAR(100);
    doc_confidentiality VARCHAR(20);
    doc_folder_id UUID;
    user_role VARCHAR(30);
    has_explicit_permission BOOLEAN;
    doc_permission_level VARCHAR(20);
BEGIN
    -- Get user department and role
    SELECT department INTO user_dept FROM users WHERE id = p_user_id;
    SELECT role INTO user_role FROM user_roles WHERE user_id = p_user_id LIMIT 1;
    
    -- Get document details
    SELECT confidentiality_level, folder_id INTO doc_confidentiality, doc_folder_id 
    FROM documents WHERE id = p_document_id;
    
    -- Super admins can access everything
    IF user_role = 'super_admin' THEN
        RETURN TRUE;
    END IF;
    
    -- Check explicit document permission
    SELECT permission_level INTO doc_permission_level
    FROM document_permissions 
    WHERE document_id = p_document_id 
    AND user_id = p_user_id
    AND (valid_until IS NULL OR valid_until > NOW())
    LIMIT 1;
    
    IF doc_permission_level IS NOT NULL THEN
        IF p_required_permission = 'read' THEN
            RETURN TRUE;
        ELSIF p_required_permission = 'write' AND doc_permission_level IN ('write', 'admin') THEN
            RETURN TRUE;
        ELSIF p_required_permission = 'admin' AND doc_permission_level = 'admin' THEN
            RETURN TRUE;
        END IF;
    END IF;
    
    -- Check folder-based access
    IF doc_folder_id IS NOT NULL AND user_can_access_folder(p_user_id, doc_folder_id, p_required_permission) THEN
        -- Additional confidentiality check
        IF doc_confidentiality = 'restricted' AND user_role != 'department_admin' THEN
            RETURN FALSE;
        END IF;
        RETURN TRUE;
    END IF;
    
    -- Public documents accessible to all authenticated users
    IF doc_confidentiality = 'public' THEN
        RETURN TRUE;
    END IF;
    
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION user_can_access_document IS 'Centralized permission check for document access with folder inheritance';
"""


# =============================================================================
# MIGRATION NOTES
# =============================================================================

"""
MIGRATION STRATEGY:

1. Initial Setup (Development):
   - Create all tables in order (respect foreign key dependencies)
   - Insert seed data (admin user, default categories, sample templates)
   - Create indexes
   - Set up triggers

2. Production Deployment:
   - Use Alembic for schema migrations
   - Zero-downtime migrations for additive changes
   - Feature flags for breaking changes

3. Data Backups:
   - Daily automated PostgreSQL backups
   - Weaviate vector store backups
   - Document storage (S3) versioning enabled

4. Performance Tuning:
   - Monitor query performance with pg_stat_statements
   - Add composite indexes based on actual query patterns
   - Implement partitioning for audit_logs and usage_metrics (by month)
   - Connection pooling with PgBouncer

5. Scaling Considerations:
   - Separate read replicas for analytics queries
   - Redis caching layer for frequently accessed data
   - Weaviate horizontal scaling for vector search
   - Celery worker scaling for document processing
"""


# =============================================================================
# SEED DATA EXAMPLES
# =============================================================================

"""
-- Create super admin user
INSERT INTO users (email, full_name, employee_id, department, hashed_password, account_status, is_active)
VALUES ('admin@ceigall.com', 'Admin User', 'EMP001', 'Administration', '$2b$...', 'active', true);

-- Assign super admin role
INSERT INTO user_roles (user_id, role, granted_by)
SELECT id, 'super_admin', id FROM users WHERE email = 'admin@ceigall.com';

-- Create default document categories
INSERT INTO document_categories (name, description, icon, color) VALUES
('Contracts', 'Legal contracts and agreements', 'FileText', 'text-blue-500'),
('Tenders', 'Tender documents and proposals', 'FileText', 'text-orange-500'),
('Reports', 'Project and technical reports', 'FileBarChart', 'text-green-500'),
('Compliance', 'Regulatory and compliance documents', 'ShieldCheck', 'text-purple-500');

-- Create default folder structure
INSERT INTO folder_structure (name, parent_id, path, department) VALUES
('Legal', NULL, '/Legal/', 'Contracts & Legal'),
('Cases', (SELECT id FROM folder_structure WHERE path = '/Legal/'), '/Legal/Cases/', 'Contracts & Legal'),
('Contracts', (SELECT id FROM folder_structure WHERE path = '/Legal/'), '/Legal/Contracts/', 'Contracts & Legal'),
('Tenders', NULL, '/Tenders/', 'Tender & Bidding'),
('Engineering', NULL, '/Engineering/', 'Engineering');
"""

# =============================================================================
# API INTEGRATION NOTES
# =============================================================================

"""
FASTAPI INTEGRATION CHECKLIST:

1. Pydantic Models:
   - Create Pydantic models matching these schemas
   - Use Enums defined above for validation
   - Separate Request/Response models from ORM models

2. SQLAlchemy ORM:
   - Define declarative models matching these schemas
   - Use relationships for joins (lazy loading by default)
   - Implement soft deletes with deleted_at filter

3. Alembic Migrations:
   - Auto-generate migrations from ORM models
   - Review and edit before applying
   - Test rollback procedures

4. Database Sessions:
   - Use FastAPI dependency injection for sessions
   - Implement connection pooling
   - Handle transactions properly

5. Query Optimization:
   - Use select_in loading for relationships
   - Implement pagination for all list endpoints
   - Add query result caching with Redis

6. Error Handling:
   - Custom exception for permission denied
   - Proper 404 for missing resources
   - Validation errors with field-specific messages

7. Testing:
   - Unit tests with SQLite in-memory
   - Integration tests with PostgreSQL test database
   - Mock Weaviate for vector search tests
"""
