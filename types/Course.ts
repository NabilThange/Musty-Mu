export interface CourseMetadata {
  id: string;
  name: string;
  icon?: string;
  coverImage?: string;
  
  // Institutional Details
  professor?: string;
  email?: string;
  website?: string;
  courseCode?: string;
  
  // Course Status
  status: 'Not Started' | 'In Progress' | 'Completed';
  semester?: string;
  year?: string;
}

export interface Topic {
  id: string;
  courseId: string;
  name: string;
  date: string;
  mastery: 'Not Started' | 'Learning' | 'Mastered';
  details?: string;
}

export interface Assignment {
  id: string;
  courseId: string;
  name: string;
  dueDate: string;
  status: 'Pending' | 'Completed' | 'Overdue';
  submissionLink?: string;
}

export interface Exam {
  id: string;
  courseId: string;
  name: string;
  date: string;
  syllabus?: string;
  prepStatus: 'Not Started' | 'Studying' | 'Ready';
}

export interface Review {
  id: string;
  courseId: string;
  topicName: string;
  lastReviewed: string;
  reviewNotes?: string;
}

export interface Analytics {
  id: string;
  courseId: string;
  subject: string;
  topicsMastered: number;
  totalTopics: number;
  score?: number;
}

export interface CourseEvent {
  id: string;
  courseId: string;
  title: string;
  date: string;
  type: 'lecture' | 'assignment' | 'exam' | 'review';
  description?: string;
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