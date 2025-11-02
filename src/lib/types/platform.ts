/**
 * Platform-level types for Ceigall AI Platform
 */

export interface PlatformModule {
  id: string;
  name: string;
  description: string;
  icon: string;
  route: string;
  accessLevel: 'universal' | 'department' | 'admin';
  departments?: string[];
  color: string;
}

export interface PlatformSummary {
  activeUsers: number;
  activeUsersTrend: number;
  aiQueriesToday: number;
  aiQueriesTodayTrend: number;
  tendersAnalyzed: number;
  activeCases?: number;
}

export interface UserProfile {
  id: string;
  fullName: string;
  employeeId: string;
  email: string;
  mobileNumber: string;
  department: string;
  designation: string;
  profilePicture?: string;
  accountStatus: 'Active' | 'Inactive' | 'Locked' | 'Pending';
  createdAt: string;
  lastLogin?: string;
  moduleAccess: string[];
}

export interface RecentActivity {
  id: string;
  type: 'document' | 'chat' | 'analysis' | 'case' | 'tender';
  title: string;
  module: string;
  timestamp: string;
  status: 'complete' | 'in_progress' | 'pending';
  icon: string;
}
