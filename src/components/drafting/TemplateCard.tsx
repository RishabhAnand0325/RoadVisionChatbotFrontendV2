import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Calendar, User, TrendingUp } from "lucide-react";
import { Template } from "@/data/templateSchemas";

interface TemplateCardProps {
  template: Template;
  onUseTemplate: (template: Template) => void;
}

const categoryColors: Record<string, string> = {
  "Dispute Resolution": "from-green to-green/80",
  "Legal Notices": "from-orange to-orange/80",
  "Response Documents": "from-blue to-blue/80",
  "Agreements": "from-violet to-violet/80",
  "Legal Declarations": "from-primary to-primary/80"
};

export function TemplateCard({ template, onUseTemplate }: TemplateCardProps) {
  const gradient = categoryColors[template.category] || "from-violet to-primary";

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-violet/50 cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between mb-2">
          <div className={`p-2 rounded-lg bg-gradient-to-br ${gradient}`}>
            <FileText className="h-5 w-5 text-white" />
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              // Download sample functionality
            }}
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
        <CardTitle className="text-lg leading-tight">{template.title}</CardTitle>
        <CardDescription className="text-xs">
          <span className={`inline-block px-2 py-0.5 rounded-full bg-gradient-to-r ${gradient} text-white font-medium`}>
            {template.category}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {template.description}
        </p>
        
        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{template.lastUpdated}</span>
          </div>
          <div className="flex items-center gap-1">
            <User className="h-3 w-3" />
            <span>{template.createdBy}</span>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            <span>v{template.version}</span>
          </div>
          <div className="flex items-center gap-1">
            <Download className="h-3 w-3" />
            <span>{template.downloads}</span>
          </div>
        </div>

        <Button 
          className={`w-full bg-gradient-to-r ${gradient} hover:opacity-90`}
          onClick={() => onUseTemplate(template)}
        >
          Use Template
        </Button>
      </CardContent>
    </Card>
  );
}
