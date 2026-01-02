// Shared constants for multi-tenant architecture
module.exports = {
  USER_ROLES: {
    STUDENT: 'student',
    TEACHER: 'teacher',
    ADMIN: 'admin'
  },
  
  ASSIGNMENT_TYPES: {
    MULTIPLE_CHOICE: 'multiple-choice',
    ESSAY: 'essay',
    CODE: 'code'
  },
  
  API_ENDPOINTS: {
    AUTH: '/api/auth',
    COURSES: '/api/courses',
    ASSIGNMENTS: '/api/assignments',
    AI: '/api/ai',
    ANALYTICS: '/api/analytics',
    COMMUNICATION: '/api/communication'
  },
  
  PORTS: {
    BACKEND: 8080,
    FRONTEND: 3000
  }
};