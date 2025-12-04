import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Save, FileDown, Bot, ChevronLeft, FileText } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { templateSchemas, Template } from "@/data/templateSchemas";
import { TemplateCard } from "@/components/drafting/TemplateCard";
import { DynamicForm } from "@/components/drafting/DynamicForm";
import { Textarea } from "@/components/ui/textarea";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { BackButton } from "@/components/common/BackButton";


export default function DocumentDrafting() {
  const navigate = useNavigate();
  const [view, setView] = useState<"gallery" | "instance">("gallery");
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [content, setContent] = useState("");

  const handleUseTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setFormValues({});
    setContent(template.structure || "");
    setView("instance");
    toast.success(`Template "${template.title}" loaded`);
  };

  const handleBackToGallery = () => {
    setView("gallery");
    setSelectedTemplate(null);
    setFormValues({});
    setContent("");
  };

  const handleFormChange = (fieldLabel: string, value: string) => {
    setFormValues(prev => ({ ...prev, [fieldLabel]: value }));
  };

  const handleGenerateWithAI = () => {
    if (!selectedTemplate) {
      toast.error("Please select a template first");
      return;
    }

    let generatedContent = selectedTemplate.structure || "";

    // Replace placeholders with form values
    Object.entries(formValues).forEach(([key, value]) => {
      const placeholder = `[${key}]`;
      const regex = new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      generatedContent = generatedContent.replace(regex, value);
    });

    // Add current date
    const currentDate = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    generatedContent = generatedContent.replace(/\[Current Date\]/g, currentDate);

    setContent(generatedContent);
    toast.success("Draft generated with AI assistance!");
  };

  const handleSaveTemplate = () => {
    toast.success("Draft saved as template!");
  };

  const handleExportPDF = () => {
    toast.success("Exporting as PDF...");
  };

  const handleAskAI = () => {
    navigate("/ask-ai");
  };

  // Template Gallery View
  if (view === "gallery") {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <BackButton to="/ceigalliq" />
            <h1 className="text-3xl font-bold text-foreground mb-2 mt-2">Document Drafting & Generation</h1>
            <p className="text-muted-foreground">
              Select a template to start creating AI-powered legal documents
            </p>
          </div>
          <Button onClick={handleAskAI} variant="outline" className="gap-2">
            <Bot className="h-4 w-4" />
            Ask AI for Help
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {templateSchemas.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onUseTemplate={handleUseTemplate}
            />
          ))}
        </div>
      </div>
    );
  }

  // Template Instance View
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink 
                onClick={handleBackToGallery}
                className="cursor-pointer hover:text-violet"
              >
                Document Drafting
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{selectedTemplate?.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex gap-2">
          <BackButton onClick={handleBackToGallery} variant="outline" />
          <Button onClick={handleAskAI} variant="outline" className="gap-2">
            <Bot className="h-4 w-4" />
            Ask AI for Help
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Panel: Context & Details Form */}
        <div className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Context & Details</CardTitle>
              <CardDescription>Fill in the fields to generate your document</CardDescription>
            </CardHeader>
            <CardContent>
              {selectedTemplate && (
                <DynamicForm
                  fields={selectedTemplate.fields}
                  values={formValues}
                  onChange={handleFormChange}
                />
              )}
            </CardContent>
          </Card>

          <Button 
            onClick={handleGenerateWithAI} 
            className="w-full gap-2 bg-gradient-to-r from-violet to-primary hover:opacity-90"
          >
            <Sparkles className="h-4 w-4" />
            Generate with LegalAI
          </Button>
        </div>

        {/* Right Panel: AI Edit Document */}
        <div className="space-y-6">
          <Tabs defaultValue="edit" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="edit">Edit</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
            
            <TabsContent value="edit" className="mt-4">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-violet" />
                    AI Edit Document
                  </CardTitle>
                  <CardDescription>Modify the AI-generated draft as needed</CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Click 'Generate with LegalAI' to create your document..."
                    className="min-h-[500px] font-mono text-sm"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="preview" className="mt-4">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Formatted Preview</CardTitle>
                  <CardDescription>See how your document will look</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="min-h-[500px] whitespace-pre-wrap font-serif text-sm leading-relaxed p-8 bg-background rounded border border-border">
                    {content || "Your formatted document will appear here..."}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <Card className="shadow-card">
            <CardContent className="pt-6">
              <div className="grid grid-cols-3 gap-3">
                <Button onClick={handleSaveTemplate} variant="outline" className="gap-2">
                  <Save className="h-4 w-4" />
                  Save Draft
                </Button>
                <Button onClick={handleExportPDF} variant="outline" className="gap-2">
                  <FileDown className="h-4 w-4" />
                  PDF
                </Button>
                <Button onClick={handleExportPDF} className="gap-2 bg-gradient-to-r from-violet to-primary hover:opacity-90">
                  <FileDown className="h-4 w-4" />
                  DOCX
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
