/**
 * Platform Dashboard Page
 * Main landing page for Ceigall AI Platform
 */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlatformDashboardUI } from "@/components/platform/PlatformDashboardUI";
import { getPlatformSummary, getRecentActivity, getCurrentUserProfile } from "@/lib/api/platform";
import { PlatformSummary, RecentActivity, UserProfile } from "@/lib/types/platform";

export default function PlatformDashboard() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState<PlatformSummary | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    Promise.all([
      getPlatformSummary(),
      getRecentActivity(),
      getCurrentUserProfile(),
    ]).then(([summaryData, activityData, profileData]) => {
      setSummary(summaryData);
      setRecentActivity(activityData);
      setUserProfile(profileData);
    });
  }, []);

  if (!summary || !userProfile) {
    return <div>Loading...</div>;
  }

  return (
    <PlatformDashboardUI
      summary={summary}
      recentActivity={recentActivity}
      userDepartment={userProfile.department}
      onNavigate={navigate}
    />
  );
}
