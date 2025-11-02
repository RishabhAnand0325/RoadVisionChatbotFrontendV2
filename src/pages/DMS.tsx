import { useQuery } from "@tanstack/react-query";
import { getDMSSummary, getDocuments, getFolders, getCategories } from "@/lib/api/dms";
import { DMSUI } from "@/components/dms/DMSUI";

export default function DMS() {
  const { data: summary, isLoading: summaryLoading } = useQuery({
    queryKey: ["dms-summary"],
    queryFn: getDMSSummary,
  });

  const { data: documents, isLoading: docsLoading } = useQuery({
    queryKey: ["dms-documents"],
    queryFn: getDocuments,
  });

  const { data: folders, isLoading: foldersLoading } = useQuery({
    queryKey: ["dms-folders"],
    queryFn: getFolders,
  });

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["dms-categories"],
    queryFn: getCategories,
  });

  if (summaryLoading || docsLoading || foldersLoading || categoriesLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading DMSIQ...</p>
        </div>
      </div>
    );
  }

  if (!summary || !documents || !folders || !categories) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">Failed to load DMS data</p>
      </div>
    );
  }

  return (
    <DMSUI 
      summary={summary} 
      documents={documents} 
      folders={folders}
      categories={categories}
    />
  );
}
