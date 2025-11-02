/**
 * Ceigall AI Platform module definitions
 */

import { PlatformModule } from '@/lib/types/platform';

export const PLATFORM_MODULES: PlatformModule[] = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    description: 'Platform overview and quick access',
    icon: 'LayoutDashboard',
    route: '/',
    accessLevel: 'universal',
    color: 'text-slate-500',
  },
  {
    id: 'ask-ai',
    name: 'Ask CeigallAI',
    description: 'Chat with AI for instant infrastructure insights',
    icon: 'MessageSquare',
    route: '/ask-ai',
    accessLevel: 'universal',
    color: 'text-blue-500',
  },
  {
    id: 'dms',
    name: 'DMS',
    description: 'Custom document management system',
    icon: 'FolderOpen',
    route: '/dms',
    accessLevel: 'universal',
    color: 'text-green-500',
  },
  {
    id: 'legaliq',
    name: 'LegalIQ',
    description: 'AI-powered legal and contract intelligence',
    icon: 'Scale',
    route: '/legaliq',
    accessLevel: 'universal',
    color: 'text-purple-500',
  },
  {
    id: 'dmsiq',
    name: 'DMSIQ',
    description: 'AI extension for document intelligence',
    icon: 'Brain',
    route: '/dmsiq',
    accessLevel: 'universal',
    color: 'text-cyan-500',
  },
  {
    id: 'tenderiq',
    name: 'TenderIQ',
    description: 'Comprehensive tender analysis and summaries',
    icon: 'FileText',
    route: '/tenderiq',
    accessLevel: 'universal',
    color: 'text-orange-500',
  },
];

export const LEGALIQ_SUBMODULES = [
  {
    id: 'legal-dashboard',
    name: 'Dashboard',
    route: '/legaliq',
    icon: 'LayoutDashboard',
  },
  {
    id: 'case-tracker',
    name: 'Case Tracker',
    route: '/legaliq/cases',
    icon: 'Briefcase',
  },
  {
    id: 'document-drafting',
    name: 'Document Drafting',
    route: '/legaliq/drafting',
    icon: 'FileEdit',
  },
  {
    id: 'document-anonymization',
    name: 'Anonymization',
    route: '/legaliq/anonymization',
    icon: 'ShieldCheck',
  },
  {
    id: 'legal-research',
    name: 'Legal Research',
    route: '/legaliq/research',
    icon: 'Search',
  },
  {
    id: 'analyze-document',
    name: 'Analyze Document',
    route: '/legaliq/analyze',
    icon: 'FileSearch',
  },
];
