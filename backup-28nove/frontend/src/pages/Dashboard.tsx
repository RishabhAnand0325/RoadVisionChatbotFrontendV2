import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDashboardData } from "@/lib/api/dashboard";
import { DashboardData } from "@/lib/types/dashboard";
import { DashboardUI } from "@/components/dashboard/DashboardUI";

export default function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    getDashboardData().then(setData);
  }, []);

  if (!data) {
    return <div>Loading...</div>;
  }

  return <DashboardUI data={data} onNavigate={navigate} />;
}
