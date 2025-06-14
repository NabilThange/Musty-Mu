export interface Topic {
  id?: string;
  name: string;
  date: string;
  details: string;
  status: string;
  priority?: 'low' | 'medium' | 'high';
  completed?: boolean;
  completedAt?: number;
}

export interface Assignment {
  id?: string;
  name: string;
  date: string;
  details: string;
  status: string;
  weight?: number; // Percentage of course grade
  completed?: boolean;
  completedAt?: number;
}

export interface Exam {
  id?: string;
  name: string;
  date: string;
  details: string;
  status: string;
  type?: 'midterm' | 'final' | 'quiz';
  completed?: boolean;
  completedAt?: number;
}

export interface Course {
  id: string;
  name: string;
  subtext: string;
  thumbnailText?: string;
  cardBgColor: string;
  professor?: string;
  email?: string;
  website?: string;
  courseCode?: string;
  status: string;
  topics: Topic[];
  assignments: Assignment[];
  exams: Exam[];
  
  // New metadata fields
  createdAt: number;
  lastUpdated: number;
  archived: boolean;
  archivedAt?: number;
} 