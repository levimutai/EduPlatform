# EduPlatform Frontend

## Independent Frontend Application

This frontend can run completely independently without backend dependencies.

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm start
```

3. Open browser to: http://localhost:3000

## Features

✅ **Independent Operation** - No backend required
✅ **Role-based Dashboards** - Admin, Teacher, Student, Parent
✅ **School Selection Flow** - Multi-tenant school picker
✅ **Responsive Design** - Mobile and tablet friendly
✅ **Mock Authentication** - Frontend-only login simulation

## Navigation

- **Entry Point**: `index.html` - Navigation hub
- **Landing**: `landing.html` - Platform landing page
- **School Selection**: `school-select.html` - School picker
- **Login**: `login.html` - Unified login interface
- **Dashboards**: Role-specific interfaces in subfolders

## File Structure

```
frontend/
├── index.html              # Main entry point
├── landing.html            # Platform landing
├── school-select.html      # School selection
├── login.html              # Login interface
├── admin/dashboard.html    # Admin interface
├── teacher/dashboard.html  # Teacher interface
├── student/dashboard.html  # Student interface (tablet-first)
├── parent/dashboard.html   # Parent interface
├── css/                    # Stylesheets
├── js/                     # JavaScript modules
└── package.json            # Dependencies
```

## Development

The frontend uses `live-server` for development with auto-reload.
All functionality is client-side with localStorage for persistence.