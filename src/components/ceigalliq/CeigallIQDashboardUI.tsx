import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  FileEdit,
  ShieldCheck,
  Search,
  FileSearch,
} from "lucide-react";
import { BackButton } from "@/components/common/BackButton";

interface SubModule {
  id: string;
  name: string;
  route: string;
  icon: string;
  description: string;
  color: string;
}

interface CeigallIQDashboardUIProps {
  modules: SubModule[];
}

const iconMap: Record<string, any> = {
  Briefcase,
  FileEdit,
  ShieldCheck,
  Search,
  FileSearch,
};

export function CeigallIQDashboardUI({ modules }: CeigallIQDashboardUIProps) {
  const navigate = useNavigate();

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="space-y-3">
        <BackButton to="/" />
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Ceigall IQ</h1>
          <p className="text-lg text-muted-foreground mt-2">
            Your complete legal workflow management platform
          </p>
        </div>
      </div>

      {/* Modules Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {modules.map((module) => {
          const Icon = iconMap[module.icon];

          return (
            <Card 
              key={module.id} 
              className="group relative overflow-hidden transition-all cursor-pointer hover:shadow-xl hover:border-primary/50"
              onClick={() => navigate(module.route)}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${module.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
              
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-1">{module.name}</CardTitle>
                    <CardDescription className="text-sm">{module.description}</CardDescription>
                  </div>
                  <div className={`rounded-lg p-3 bg-gradient-to-br ${module.color} text-white flex-shrink-0`}>
                    {Icon && <Icon className="h-6 w-6" />}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="flex items-center text-primary font-medium text-sm group-hover:translate-x-1 transition-transform">
                  Access Module
                  <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Available Modules
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{modules.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Workflows
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">5</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <span className="text-sm font-medium">Active</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Last Updated
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium">Today</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
