import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Briefcase,
  FileEdit,
  ShieldCheck,
  Search,
  FileSearch,
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
  Briefcase,
  FileEdit,
  ShieldCheck,
  Search,
  FileSearch,
};

export function LegalIQDashboardUI({ modules }: LegalIQDashboardUIProps) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">LegalIQ</h1>
        <p className="text-lg text-muted-foreground">
          Your complete legal workflow management platform
        </p>
      </div>

      {/* Modules Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {modules.map((module) => {
          const Icon = iconMap[module.icon];

          return (
            <Card 
              key={module.id} 
              className="group relative overflow-hidden transition-all hover:shadow-lg"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${module.color} opacity-5 group-hover:opacity-10 transition-opacity`} />
              
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className={`rounded-lg p-3 bg-gradient-to-br ${module.color} text-white`}>
                    {Icon && <Icon className="h-6 w-6" />}
                  </div>
                </div>
                <CardTitle className="mt-4">{module.name}</CardTitle>
                <CardDescription>{module.description}</CardDescription>
              </CardHeader>
              
              <CardContent>
                <Button asChild variant="ghost" className="w-full group/btn">
                  <Link to={module.route}>
                    Access Module
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2">
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
      </div>
    </div>
  );
}
