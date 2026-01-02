# EduPlatform Backend

## Multi-Tenant Architecture
This backend serves multiple tenants with shared resources from `/shared` folder.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env`

3. Start server:
```bash
npm start
```

Backend runs on: http://localhost:8080

## Structure
- `server.js` - Express server
- `routes/` - API endpoints
- `models/` - Database models
- `middleware/` - Authentication middleware