export interface QuickModule {
  title: string;
  description: string;
  icon: any;
  url: string;
  gradient: string;
  color: string;
}

export interface UpcomingReminder {
  id: number;
  caseName: string;
  caseId: string;
  nextHearing: string;
  timeLeft: string;
  status: "due-soon" | "upcoming";
}

export interface SummaryWidget {
  title: string;
  value: string;
  icon: any;
  status: string;
  trend: string;
  progress: number;
}

export interface DashboardData {
  quickModules: QuickModule[];
  upcomingReminders: UpcomingReminder[];
  summaryWidgets: SummaryWidget[];
}
