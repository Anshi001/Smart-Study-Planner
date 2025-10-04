export interface Task {
  id: string;
  title: string;
  description: string;
  subject: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  completed: boolean;
  createdAt: string;
  completedAt?: string;
}

export interface StudyGoal {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  progress: number;
  tasks: string[];
  createdAt: string;
}

export interface StudySession {
  id: string;
  subject: string;
  duration: number;
  date: string;
  notes?: string;
}