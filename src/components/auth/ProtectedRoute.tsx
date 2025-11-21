/**
 * Protected Route Component
 * Redirects to auth page if user is not authenticated
 * Uses Redux for auth state management
 */

import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { RootState } from "@/lib/redux/store";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Give a brief moment for Redux state to hydrate from localStorage
    const timer = setTimeout(() => {
      setIsChecking(false);
      if (!isAuthenticated) {
        navigate("/auth");
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isAuthenticated, navigate]);

  // Show nothing while checking auth (prevents flash of content)
  if (isChecking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
