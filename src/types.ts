export type CategoryType = 'urgent' | 'alert' | 'info';
export type AudienceType = 'all' | 'parents' | 'students';
export type EventType = 'exam' | 'meeting' | 'holiday' | 'event';
export type RoleType = 'admin' | 'teacher' | 'parent' | 'student';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: RoleType;
  departmentOrClass?: string;
  status: 'active' | 'suspended';
  lastAccess?: string;
  avatarUrl?: string;
}

export interface SchoolSettings {
  schoolName: string;
  academicYear: string;
  currentTerm: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  requireParentConfirmation: boolean;
}

export interface AuditLog {
  id: string;
  user: string;
  role: RoleType;
  action: string;
  timestamp: string;
  category: 'security' | 'academic' | 'communication' | 'system';
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  category: CategoryType;
  sender: string;
  audience: AudienceType;
  confirmedBy: string[]; // List of roles or user identifiers who clicked 'Confirm'
}

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  type: EventType;
  targetClass: string;
}

export interface Homework {
  id: string;
  title: string;
  subject: string;
  description: string;
  dueDate: string; // YYYY-MM-DD
  completedBy: string[]; // List of user roles (student)
}

export interface Message {
  id: string;
  sender: string;
  senderRole: RoleType;
  receiverRole: RoleType;
  text: string;
  timestamp: string;
}

export interface StudentStats {
  attendanceRate: number;
  averageGrade: number;
  behaviorScore: string;
  recentGrades: { subject: string; value: number; type: string }[];
}
