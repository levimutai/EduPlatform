# EduPlatform - Advanced Learning Management System

## Multi-Tenant Architecture

Clean separation of concerns with dedicated folders for scalable development.

## Project Structure

```
EduPlatform/
├── backend/          # Node.js/Express API server
├── frontend/         # HTML/CSS/JavaScript client  
├── shared/           # Constants and types
└── README.md         # This file
```

## Quick Start

### 1. Start Backend (Port 8080)
```bash
cd backend
npm install
npm start
```

### 2. Start Frontend (Port 3000)
```bash
cd frontend
npm install
npm start
```

### 3. Access Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080/api

## Development Workflow

1. **Frontend Development**: Work in `frontend/` folder for UI/UX
2. **Backend Development**: Work in `backend/` folder for API/Database
3. **Shared Resources**: Use `shared/` folder for constants and types
4. **Integration**: Frontend calls Backend APIs

## Features

✅ **Clean Multi-Tenant Architecture**
✅ Separated frontend and backend
✅ Independent development servers
✅ Shared constants and types
✅ Ready for deployment

## Technology Stack
- **Backend**: Node.js, Express, MongoDB
- **Frontend**: HTML5, CSS3, JavaScript
- **Real-time**: Socket.io
- **AI**: OpenAI integration
- **Analytics**: Chart.js
- **Authentication**: JWT