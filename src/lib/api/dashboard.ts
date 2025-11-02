import { DashboardData } from "@/lib/types/dashboard";
import {
  FileSearch,
  PenLine,
  Scale,
  BookOpen,
  BookText,
  Calendar,
  Clock,
  FileCheck,
  Briefcase,
} from "lucide-react";

const API_BASE_URL = "/api/v1";

export async function getDashboardData(): Promise<DashboardData> {
  // TODO: Replace with actual API call
  // const response = await fetch(`${API_BASE_URL}/dashboard`);
  // return response.json();

  // Hardcoded data for now
  return {
    quickModules: [
      {
        title: "Analyze Document",
        description: "Extract insights from legal documents with AI",
        icon: FileSearch,
        url: "/analyze",
        gradient: "from-green to-success",
        color: "green",
      },
      {
        title: "Document Drafting & Generation",
        description: "Create and edit AI-powered legal documents",
        icon: PenLine,
        url: "/drafting",
        gradient: "from-violet to-primary",
        color: "violet",
      },
      {
        title: "Case Tracker",
        description: "Monitor case status and deadlines",
        icon: Briefcase,
        url: "/cases",
        gradient: "from-blue to-info",
        color: "blue",
      },
      {
        title: "Legal Research",
        description: "Search case laws and statutes",
        icon: BookOpen,
        url: "/research",
        gradient: "from-orange to-warning",
        color: "orange",
      },
      {
        title: "Document Anonymization",
        description: "Automatically hide sensitive data",
        icon: BookText,
        url: "/anonymization",
        gradient: "from-violet to-primary-light",
        color: "violet",
      },
    ],
    upcomingReminders: [
      {
        id: 1,
        caseName: "ABC Infrastructure Ltd. vs XYZ Construction Co.",
        caseId: "CC/2025/38572",
        nextHearing: "2025-10-30",
        timeLeft: "in 2 days",
        status: "due-soon",
      },
      {
        id: 2,
        caseName: "National Highway Authority vs Metro Contractors",
        caseId: "CC/2024/27384",
        nextHearing: "2025-11-05",
        timeLeft: "in 8 days",
        status: "upcoming",
      },
      {
        id: 3,
        caseName: "City Corporation vs Infrastructure Solutions Ltd.",
        caseId: "CC/2025/45621",
        nextHearing: "2025-11-12",
        timeLeft: "in 15 days",
        status: "upcoming",
      },
    ],
    summaryWidgets: [
      { 
        title: "Ongoing Cases", 
        value: "24", 
        icon: Scale, 
        status: "Active",
        trend: "+3 this month",
        progress: 68
      },
      { 
        title: "Pending Replies", 
        value: "12", 
        icon: Clock, 
        status: "In Review",
        trend: "5 urgent",
        progress: 45
      },
      { 
        title: "Upcoming Hearings", 
        value: "8", 
        icon: Calendar, 
        status: "Scheduled",
        trend: "Next: 2 days",
        progress: 88
      },
      { 
        title: "Documents Awaiting Review", 
        value: "6", 
        icon: FileCheck, 
        status: "Drafted",
        trend: "2 new today",
        progress: 33
      },
    ],
  };
}
