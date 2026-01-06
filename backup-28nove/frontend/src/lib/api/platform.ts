/**
 * Platform-level API calls for Ceigall AI Platform
 */

import { API_BASE_URL } from '@/lib/config/api';
import { PlatformSummary, UserProfile, RecentActivity } from '@/lib/types/platform';

/**
 * Get platform-wide summary statistics
 */
export async function getPlatformSummary(): Promise<PlatformSummary> {
  try {
    const response = await fetch(`${API_BASE_URL}/dashboard/summary`);
    if (!response.ok) {
      throw new Error('Failed to fetch platform summary');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching platform summary:', error);
    // Fallback to mock data if API fails
    return {
      activeUsers: 156,
      activeUsersTrend: 12,
      aiQueriesToday: 342,
      aiQueriesTodayTrend: 8,
      tendersAnalyzed: 28,
      activeCases: 14,
    };
  }
}

/**
 * Get current user profile
 */
export async function getCurrentUserProfile(): Promise<UserProfile> {
  // TODO: Implement actual user profile fetching from /auth/users/me
  // For now, keep mock data as requested scope was dashboard stats
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
  try {
    const response = await fetch(`${API_BASE_URL}/dashboard/activity/recent`);
    if (!response.ok) {
      throw new Error('Failed to fetch recent activity');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    // Fallback to mock data
    return [];
  }
}
