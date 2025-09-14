export const API_BASE_URL = 'http://localhost:5001/api';

export const ROLES = {
  ADMIN: 'admin',
  EMPLOYEE: 'employee'
};

export const DEPARTMENTS = [
  'service',
  'finance',
  'hr',
  'it',
  'operations',
  'marketing'
];

export const INCIDENT_STATUS = {
  NEW: 'new',
  IN_REVIEW: 'in-review',
  RESOLVED: 'resolved'
};

export const NOTIFICATION_TYPES = {
  POLICY_UPDATE: 'policy_update',
  OVERDUE_ACK: 'overdue_ack',
  INCIDENT_UPDATE: 'incident_update'
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  ONBOARDING: '/onboarding',
  DASHBOARD: '/dashboard',
  POLICIES: '/policies',
  TRAININGS: '/trainings',
  INCIDENTS: '/incidents',
  COMPLIANCE: '/compliance',
  NOTIFICATIONS: '/notifications',
  AUDIT: '/audit',
  USERS: '/users'
};