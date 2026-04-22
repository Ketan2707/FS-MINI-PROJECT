export const API_BASE_URL = 'http://localhost:8080/api';

export const ROLES = {
  ADMIN: 'ADMIN',
  TEACHER: 'TEACHER',
  STUDENT: 'STUDENT',
};

export const FEEDBACK_CATEGORIES = [
  { value: 'ACADEMIC', label: 'Academic' },
  { value: 'BEHAVIOR', label: 'Behavior' },
  { value: 'PARTICIPATION', label: 'Participation' },
  { value: 'OTHER', label: 'Other' },
];

export const TEACHER_FEEDBACK_CATEGORIES = [
  { value: 'TEACHING_QUALITY', label: 'Teaching Quality' },
  { value: 'COMMUNICATION', label: 'Communication' },
  { value: 'KNOWLEDGE', label: 'Knowledge' },
  { value: 'PUNCTUALITY', label: 'Punctuality' },
  { value: 'HELPFULNESS', label: 'Helpfulness' },
  { value: 'OTHER', label: 'Other' }
];

export const DEPARTMENTS = [
  'Computer Science',
  'Electronics',
  'Mechanical',
  'Civil',
  'Mathematics',
];

export const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];
