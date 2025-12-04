import { CeigallIQDashboardUI } from "@/components/ceigalliq/CeigallIQDashboardUI";

const ceigalliqModules = [
  {
    id: 'case-tracker',
    name: 'Case Tracker',
    route: '/ceigalliq/cases',
    icon: 'Briefcase',
    description: 'Track and manage your legal cases',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'document-drafting',
    name: 'Document Drafting',
    route: '/ceigalliq/drafting',
    icon: 'FileEdit',
    description: 'Generate legal documents from templates',
    color: 'from-violet-500 to-purple-500',
  },
  {
    id: 'document-anonymization',
    name: 'Anonymization',
    route: '/ceigalliq/anonymization',
    icon: 'ShieldCheck',
    description: 'Anonymize sensitive information in documents',
    color: 'from-green-500 to-emerald-500',
  },
  {
    id: 'legal-research',
    name: 'Legal Research',
    route: '/ceigalliq/research',
    icon: 'Search',
    description: 'Search and analyze legal precedents',
    color: 'from-orange-500 to-amber-500',
  },
  {
    id: 'analyze-document',
    name: 'Analyze Document',
    route: '/ceigalliq/analyze',
    icon: 'FileSearch',
    description: 'Extract insights from legal documents',
    color: 'from-pink-500 to-rose-500',
  },
];

export default function CeigallIQDashboard() {
  return <CeigallIQDashboardUI modules={ceigalliqModules} />;
}
