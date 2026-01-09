import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import {
  Plus,
  Upload,
  MessageSquare,
  Scale,
  FileText,
  Clock,
  TrendingUp,
  Calendar,
  AlertCircle,
  FileSearch,
  FileEdit,
  Landmark,
  BookOpen,
  ShieldCheck,
} from "lucide-react";

interface SubModule {
  id: string;
  name: string;
  route: string;
  icon: string;
  description: string;
  color: string;
}

interface LegalIQDashboardUIProps {
  modules: SubModule[];
}

const iconMap: Record<string, any> = {
  FileSearch,
  FileEdit,
  Landmark,
  BookOpen,
  ShieldCheck,
  Briefcase: Landmark,
  Search: BookOpen,
};

const moduleColors: Record<string, { border: string; bg: string; icon: string }> = {
  'analyze-document': { border: 'border-t-pink-400', bg: 'bg-pink-100', icon: 'text-pink-600' },
  'document-drafting': { border: 'border-t-violet-500', bg: 'bg-violet-100', icon: 'text-violet-600' },
  'case-tracker': { border: 'border-t-amber-400', bg: 'bg-amber-100', icon: 'text-amber-600' },
  'legal-research': { border: 'border-t-orange-400', bg: 'bg-orange-100', icon: 'text-orange-600' },
  'document-anonymization': { border: 'border-t-purple-400', bg: 'bg-purple-100', icon: 'text-purple-600' },
};

const moduleIcons: Record<string, any> = {
  'analyze-document': FileSearch,
  'document-drafting': FileEdit,
  'case-tracker': Landmark,
  'legal-research': BookOpen,
  'document-anonymization': ShieldCheck,
};

const reminders = [
  {
    title: "ABC Infrastructure Ltd. vs XYZ...",
    caseId: "CC/2025/38572",
    date: "Next: 2025-10-30",
    daysLeft: "in 2 days",
    status: "Due Soon",
    statusColor: "text-red-600 border-red-200 bg-red-50",
  },
  {
    title: "National Highway Authority vs...",
    caseId: "CC/2024/27384",
    date: "Next: 2025-11-05",
    daysLeft: "in 8 days",
    status: "Upcoming",
    statusColor: "text-green-600 border-green-200 bg-green-50",
  },
  {
    title: "City Corporation vs Infrastructu...",
    caseId: "CC/2025/45621",
    date: "Next: 2025-11-12",
    daysLeft: "in 15 days",
    status: "Upcoming",
    statusColor: "text-green-600 border-green-200 bg-green-50",
  },
];

export function LegalIQDashboardUI({ modules }: LegalIQDashboardUIProps) {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome to LegalIQ</h1>
          <p className="text-muted-foreground">
            AI-powered Legal & Contract Management Platform
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" />
            Add New Case
          </Button>
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Upload Document
          </Button>
          <Button variant="outline" onClick={() => navigate("/legaliq/ask-ai")}>
            <MessageSquare className="mr-2 h-4 w-4" />
            Ask LegalAI
          </Button>
        </div>
      </div>

      {/* Stats and Reminders Grid */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Stats Cards */}
        <div className="lg:col-span-2 space-y-4">
          {/* Top Stats Row */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="border-l-4 border-l-primary">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Ongoing Cases
                </CardTitle>
                <Scale className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">24</div>
                <div className="flex items-center justify-between mt-2">
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Active
                  </Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    +3 this month
                  </span>
                </div>
                <div className="mt-3 h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full w-3/4 bg-primary rounded-full" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Pending Replies
                </CardTitle>
                <Clock className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">12</div>
                <div className="flex items-center justify-between mt-2">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    In Review
                  </Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    5 urgent
                  </span>
                </div>
                <div className="mt-3 h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full w-1/2 bg-blue-500 rounded-full" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bottom Stats Row */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="border-l-4 border-l-cyan-500">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Upcoming Hearings
                </CardTitle>
                <Calendar className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">8</div>
                <div className="flex items-center justify-between mt-2">
                  <Badge variant="outline" className="bg-cyan-50 text-cyan-700 border-cyan-200">
                    Scheduled
                  </Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    Next: 2 days
                  </span>
                </div>
                <div className="mt-3 h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full w-2/3 bg-cyan-500 rounded-full" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-emerald-500">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Documents Awaiting Review
                </CardTitle>
                <FileText className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">6</div>
                <div className="flex items-center justify-between mt-2">
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                    Drafted
                  </Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    2 new today
                  </span>
                </div>
                <div className="mt-3 h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full w-1/3 bg-emerald-500 rounded-full" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Upcoming Reminders */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Calendar className="h-5 w-5 text-primary" />
              Upcoming Reminders
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {reminders.map((reminder, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
              >
                <div className="h-2 w-2 rounded-full bg-amber-400 mt-2 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium text-sm truncate">{reminder.title}</p>
                    <Badge variant="outline" className={`shrink-0 text-xs ${reminder.statusColor}`}>
                      {reminder.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{reminder.caseId}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <Clock className="h-3 w-3" />
                    {reminder.date} · {reminder.daysLeft}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Access Modules */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Quick Access Modules</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((module) => {
            const colors = moduleColors[module.id] || { border: 'border-t-primary', bg: 'bg-primary/10', icon: 'text-primary' };
            const Icon = moduleIcons[module.id] || FileSearch;

            return (
              <Link key={module.id} to={module.route}>
                <Card className={`group cursor-pointer transition-all hover:shadow-md border-t-4 ${colors.border}`}>
                  <CardContent className="pt-6">
                    <div className={`inline-flex p-3 rounded-xl ${colors.bg} mb-4`}>
                      <Icon className={`h-6 w-6 ${colors.icon}`} />
                    </div>
                    <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                      {module.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {module.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Alert Banner */}
      <Card className="bg-amber-50 border-amber-200">
        <CardContent className="flex items-center gap-4 py-4">
          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-amber-100">
            <AlertCircle className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <p className="font-semibold flex items-center gap-2">
              <span>⚖️</span>
              Hearing Today - Action Required
            </p>
            <p className="text-sm text-muted-foreground">
              Case ID <span className="font-medium">38572/2025</span> - Saket District Court at <span className="font-medium">2:00 PM</span>
            </p>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
