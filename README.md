# EduPlatform - Advanced Learning Management System

## Features

### For Students
- Interactive dashboard with progress tracking
- AI-powered tutoring and instant help
- Gamified learning with points and badges
- Virtual classrooms with video/audio
- Collaborative study groups
- Mobile-responsive design

### For Teachers
- Smart content creation tools
- Real-time student analytics
- Automated grading with AI
- Virtual classroom management
- Assignment tracking
- Parent communication tools

### For Parents
- Real-time progress reports
- Direct teacher communication
- Learning support resources
- Goal setting and tracking

## Technology Stack
- **Backend**: Node.js, Express, MongoDB
- **Frontend**: HTML5, CSS3, JavaScript
- **Real-time**: Socket.io
- **AI**: OpenAI integration
- **Analytics**: Chart.js
- **Authentication**: JWT

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables in `.env`

3. Start the server:
```bash
npm start
```

4. Open http://localhost:8080

### Environment Variables

Create a `.env` file at the project root with:

```
PORT=8080
MONGODB_URI=mongodb://localhost:27017/eduplatform
JWT_SECRET=replace-with-a-secure-random-string
FRONTEND_URL=http://localhost:8080
```

`JWT_SECRET` is required for the server to start; choose a strong, unique value.

## API Endpoints

- `/api/auth` - Authentication
- `/api/courses` - Course management
- `/api/assignments` - Assignment handling
- `/api/ai` - AI tutoring services
- `/api/analytics` - Learning analytics
- `/api/communication` - Messaging system

## Features Implemented

✅ User authentication and roles
✅ Interactive dashboard
✅ Course management
✅ Assignment system with AI grading
✅ Real-time communication
✅ Learning analytics
✅ Gamification system
✅ Virtual classrooms
✅ AI tutoring assistant
✅ Responsive design
