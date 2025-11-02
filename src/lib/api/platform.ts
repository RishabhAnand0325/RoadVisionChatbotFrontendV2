/**
 * Platform-level API calls for Ceigall AI Platform
 */

import { PlatformSummary, UserProfile, RecentActivity } from '@/lib/types/platform';

const API_BASE_URL = '/api/v1';

/**
 * Get platform-wide summary statistics
 */
export async function getPlatformSummary(): Promise<PlatformSummary> {
  // TODO: Replace with actual API call
  return {
    activeUsers: 156,
    activeUsersTrend: 12,
    aiQueriesToday: 342,
    aiQueriesTodayTrend: 8,
    tendersAnalyzed: 28,
    activeCases: 14,
  };
}

/**
 * Get current user profile
 */
export async function getCurrentUserProfile(): Promise<UserProfile> {
  // TODO: Replace with actual API call
  return {
    id: 'user-001',
    fullName: 'John Doe',
    employeeId: 'EMP-2024-001',
    email: 'john.doe@ceigall.com',
    mobileNumber: '+91 98765 43210',
    department: 'Contracts & Legal',
    designation: 'Senior Legal Officer',
    accountStatus: 'Active',
    createdAt: '2024-01-15T10:00:00Z',
    lastLogin: '2025-01-28T09:30:00Z',
    moduleAccess: ['dashboard', 'ask-ai', 'dmsiq', 'legaliq'],
  };
}

/**
 * Get recent user activity
 */
export async function getRecentActivity(): Promise<RecentActivity[]> {
  // TODO: Replace with actual API call
  return [
    {
      id: 'activity-1',
      type: 'chat',
      title: 'Contract analysis query',
      module: 'Ask CeigallAI',
      timestamp: '2025-01-28T14:30:00Z',
      status: 'complete',
      icon: 'MessageSquare',
    },
    {
      id: 'activity-2',
      type: 'case',
      title: 'Added hearing for Case CC/2025/38572',
      module: 'LegalIQ',
      timestamp: '2025-01-28T11:15:00Z',
      status: 'complete',
      icon: 'Briefcase',
    },
    {
      id: 'activity-3',
      type: 'document',
      title: 'Anonymized DFE7393A_Contract.pdf',
      module: 'LegalIQ',
      timestamp: '2025-01-28T09:45:00Z',
      status: 'complete',
      icon: 'FileText',
    },
    {
      id: 'activity-4',
      type: 'analysis',
      title: 'Document analysis in progress',
      module: 'Ask CeigallAI',
      timestamp: '2025-01-27T16:20:00Z',
      status: 'in_progress',
      icon: 'FileSearch',
    },
    {
      id: 'activity-5',
      type: 'document',
      title: 'Uploaded vendor agreement template',
      module: 'LegalIQ',
      timestamp: '2025-01-27T14:00:00Z',
      status: 'complete',
      icon: 'Upload',
    },
  ];
}
