import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { DashboardData } from "@/lib/types/dashboard";
import {
  Plus,
  Upload,
  Bot,
  Calendar,
  Clock,
  AlertCircle,
  TrendingUp,
} from "lucide-react";

interface DashboardUIProps {
  data: DashboardData;
  onNavigate: (path: string) => void;
}

export function DashboardUI({ data, onNavigate }: DashboardUIProps) {
  const { quickModules, upcomingReminders, summaryWidgets } = data;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Welcome to LegalIQ
          </h1>
          <p className="text-muted-foreground text-lg">
            AI-powered Legal & Contract Management Platform
          </p>
        </div>
        
        {/* Quick Action Bar */}
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => onNavigate("/cases")} className="gap-2">
            <Plus className="h-4 w-4" />
            Add New Case
          </Button>
          <Button onClick={() => onNavigate("/analyze")} variant="outline" className="gap-2">
            <Upload className="h-4 w-4" />
            Upload Document
          </Button>
          <Button onClick={() => onNavigate("/ask-ai")} variant="outline" className="gap-2">
            <Bot className="h-4 w-4" />
            Ask LegalAI
          </Button>
        </div>
      </div>

      {/* Summary Widgets & Reminders */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Summary Widgets - 2 columns on large screens */}
        <div className="lg:col-span-2 grid gap-6 md:grid-cols-2">
          {summaryWidgets.map((widget) => (
            <Card key={widget.title} className="shadow-md hover:shadow-lg transition-shadow border-primary/10">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {widget.title}
                </CardTitle>
                <widget.icon className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground mb-2">{widget.value}</div>
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">
                    {widget.status}
                  </Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    {widget.trend}
                  </span>
                </div>
                <Progress value={widget.progress} className="h-1.5" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Reminders Section */}
        <div className="lg:col-span-1">
          <Card className="shadow-md h-full">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Upcoming Reminders
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingReminders.map((reminder) => (
                <div
                  key={reminder.id}
                  className={`p-3 rounded-lg border-l-4 ${
                    reminder.status === "due-soon"
                      ? "border-l-orange bg-orange/5"
                      : "border-l-green bg-green/5"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-foreground line-clamp-1">
                        {reminder.caseName}
                      </p>
                      <p className="text-xs text-muted-foreground">{reminder.caseId}</p>
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        reminder.status === "due-soon"
                          ? "border-orange text-orange"
                          : "border-green text-green"
                      }`}
                    >
                      {reminder.status === "due-soon" ? "Due Soon" : "Upcoming"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>Next: {reminder.nextHearing}</span>
                    <span className="font-medium">{reminder.timeLeft}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Access Modules */}
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-6">Quick Access Modules</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {quickModules.map((module) => (
            <Card
              key={module.title}
              className="cursor-pointer transition-all hover:shadow-xl hover:-translate-y-1 border-primary/10 overflow-hidden group"
              onClick={() => onNavigate(module.url)}
            >
              <div className={`h-2 w-full bg-gradient-to-r ${module.gradient}`} />
              <CardHeader>
                <div className={`h-14 w-14 rounded-xl bg-gradient-to-r ${module.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <module.icon className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-xl">{module.title}</CardTitle>
                <CardDescription className="text-base">{module.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      {/* Today's Hearings Alert */}
      {data.todayHearing && (
        <Card className="border-l-4 border-l-warning bg-warning/5 shadow-md">
          <CardHeader>
            <div className="flex items-center gap-3">
              <AlertCircle className="h-6 w-6 text-warning" />
              <div>
                <CardTitle className="text-lg">⚖️ Hearing Today - Action Required</CardTitle>
                <CardDescription className="text-base">
                  Case ID <strong>{data.todayHearing.caseId}</strong> - {data.todayHearing.court} at <strong>{data.todayHearing.time}</strong>
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>
      )}
    </div>
  );
}
