export interface Milestone {
  dayCount: number;
  date: Date;
  description: string;
}

export interface LoveNote {
  id: string;
  content: string;
  type: 'message' | 'date-idea' | 'poem' | 'quote';
  createdAt: Date;
}

export const START_DATE_STRING = "2025-10-25";