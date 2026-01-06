/**
 * Platform Dashboard UI Component
 * Displays platform-wide overview and quick actions
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlatformSummary, RecentActivity } from "@/lib/types/platform";
import { PLATFORM_MODULES } from "@/lib/constants/modules";
import {
  Users,
  MessageSquare,
  FileText,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Briefcase,
  FileSearch,
  Upload,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PlatformDashboardUIProps {
  summary: PlatformSummary;
  recentActivity: RecentActivity[];
  userDepartment: string;
  onNavigate: (route: string) => void;
}

const getActivityIcon = (iconName: string) => {
  const icons: Record<string, any> = {
    MessageSquare,
    Briefcase,
    FileText,
    FileSearch,
    Upload,
  };
  return icons[iconName] || FileText;
};

export function PlatformDashboardUI({
  summary,
  recentActivity,
  userDepartment,
  onNavigate
}: PlatformDashboardUIProps) {
  // Filter modules based on access
  const accessibleModules = PLATFORM_MODULES.filter(module => {
    if (module.accessLevel === 'universal') return true;
    if (module.accessLevel === 'department' && module.departments?.includes(userDepartment)) return true;
    return false;
  });

  const quickActionModules = accessibleModules.filter(m => m.id !== 'dashboard' && m.id !== 'dms').slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome to Ceigall AI Platform - Your centralized AI solutions suite
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        {/* <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.activeUsers}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              {summary.activeUsersTrend > 0 ? (
                <TrendingUp className="h-3 w-3 text-green-500" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500" />
              )}
              <span className={summary.activeUsersTrend > 0 ? 'text-green-500' : 'text-red-500'}>
                {Math.abs(summary.activeUsersTrend)}%
              </span>
              <span>from last month</span>
            </p>
          </CardContent>
        </Card> */}

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Queries Today</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.aiQueriesToday}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">


            </p>
          </CardContent>
        </Card>

        {/* <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tenders Analyzed</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.tendersAnalyzed}</div>
            <p className="text-xs text-muted-foreground mt-1">
              This month
            </p>
          </CardContent>
        </Card> */}

        {summary.activeCases && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Cases</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.activeCases}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Legal cases tracked
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {quickActionModules.map((module) => {
            const IconComponent = getActivityIcon(module.icon);
            return (
              <Card
                key={module.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => onNavigate(module.route)}
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-primary/10`}>
                      <IconComponent className={`h-5 w-5 ${module.color}`} />
                    </div>
                    <CardTitle className="text-base">{module.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">
                    {module.description}
                  </CardDescription>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-3 p-0 h-auto"
                  >
                    Open module <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Recent Activity</h2>
        <Card>
          <CardHeader>
            <CardTitle>Your Latest Interactions</CardTitle>
            <CardDescription>Track your recent AI interactions and uploads</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => {
                const IconComponent = getActivityIcon(activity.icon);
                return (
                  <div
                    key={activity.id}
                    className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0"
                  >
                    <div className="p-2 rounded-lg bg-muted">
                      <IconComponent className="h-4 w-4" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">{activity.title}</p>
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-muted-foreground">{activity.module}</p>
                        <span className="text-xs text-muted-foreground">•</span>
                        <p className="text-xs text-muted-foreground">
                          {new Date(activity.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={activity.status === 'complete' ? 'default' : 'secondary'}
                      className="capitalize"
                    >
                      {activity.status.replace('_', ' ')}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
