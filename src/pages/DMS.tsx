import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getDMSSummary, getDocuments, getFolders, getCategories } from "@/lib/api/dms";
import { DMSUI } from "@/components/dms/DMSUI";

export default function DMS() {
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);

  const { data: summary, isLoading: summaryLoading } = useQuery({
    queryKey: ["dms-summary"],
    queryFn: getDMSSummary,
  });

  const { data: documents, isLoading: docsLoading } = useQuery({
    queryKey: ["dms-documents", currentFolder],
    queryFn: () => getDocuments({ folder_id: currentFolder ?? undefined }),
  });

  const { data: folders, isLoading: foldersLoading } = useQuery({
    queryKey: ["dms-folders"],
    queryFn: getFolders,
  });

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["dms-categories"],
    queryFn: getCategories,
  });

  if (summaryLoading || (docsLoading && !documents) || foldersLoading || categoriesLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading DMSIQ...</p>
        </div>
      </div>
    );
  }

  if (!summary || !folders || !categories) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">Failed to load essential DMS data</p>
      </div>
    );
  }

  return (
    <DMSUI 
      summary={summary} 
      documents={documents || []} 
      folders={folders}
      categories={categories}
      currentFolder={currentFolder}
      setCurrentFolder={setCurrentFolder}
    />
  );
}
