import { MessageSquare } from "lucide-react";

interface WelcomeScreenProps {
  onPromptClick: (prompt: string) => void;
}

const examplePrompts = [
  {
    title: "Summarize document",
    text: "Please provide a comprehensive summary of the uploaded document.",
  },
  {
    title: "Key findings",
    text: "What are the key findings and main points in this document?",
  },
  {
    title: "Legal analysis",
    text: "Provide a legal analysis of the terms and conditions in this document.",
  },
  {
    title: "Risk assessment",
    text: "Identify potential risks and issues in this agreement.",
  },
];

export function WelcomeScreen({ onPromptClick }: WelcomeScreenProps) {
  return (
    <div className="flex-1 overflow-y-auto bg-muted/50 flex flex-col items-center justify-center">
      <div className="text-center max-w-lg mx-auto p-4 lg:p-8 flex flex-col items-center justify-center">
        <div className="w-24 h-24 bg-card text-primary-foreground rounded-lg flex items-center justify-center shadow-xl mb-8">
          <MessageSquare className="w-12 h-12 text-primary" />
        </div>
        <h1 className="text-4xl font-bold mb-4">Chat with AI</h1>
        <p className="text-muted-foreground text-lg mb-8">
          Start a conversation or upload a document to get started.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left w-full">
          {examplePrompts.map((prompt, i) => (
            <div
              key={i}
              onClick={() => onPromptClick(prompt.text)}
              className="p-4 bg-card border rounded-lg hover:bg-accent hover:border-primary cursor-pointer transition-all"
            >
              <p className="font-semibold text-sm">{prompt.title}</p>
              <p className="text-muted-foreground text-sm mt-1">{prompt.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
