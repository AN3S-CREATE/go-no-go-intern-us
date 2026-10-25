// Feature card for Intern Us platform
export interface InnovationCard {
  id: string;
  title: string;
  what: string;
  why: string;
  how?: string; // Added for implementation details
  category: 'ai-features' | 'non-ai-features' | 'gimmicky-ai' | 'info-card';
  isInfoCard?: boolean; // Flag for intro/info cards
}

export interface SwipeDecision {
  id: string;
  user: string;
  innovationCard: string;
  timestamp: string;
  notes: string;
  managementDecision?: 'opt-pending' | 'opt-approve' | 'opt-defer' | 'opt-cost' | 'opt-pilot';
  decisionMaker?: string;
}

export interface ManagementResponse {
  id: string;
  summaryDate: string;
  totalSwipes: number;
  executiveSummary: string;
  managementResponse: string;
  actionTaken: 'opt-none' | 'opt-reviewed' | 'opt-actioned';
}
