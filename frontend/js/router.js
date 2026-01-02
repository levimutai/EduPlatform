// Frontend-only role-based router
class Router {
    constructor() {
        this.routes = {
            // Public routes (no authentication required)
            public: [
                'landing.html',
                'school-select.html', 
                'login.html',
                'index.html'
            ],
            
            // Protected routes by role
            admin: [
                'admin/dashboard.html',
                'admin/users.html',
                'admin/settings.html'
            ],
            teacher: [
                'teacher/dashboard.html',
                'teacher/courses.html',
                'teacher/assignments.html'
            ],
            student: [
                'student/dashboard.html',
                'student/courses.html',
                'student/assignments.html'
            ],
            parent: [
                'parent/dashboard.html',
                'parent/children.html',
                'parent/reports.html'
            ]
        };
        
        this.init();
    }

    init() {
        // Check authentication on page load
        this.checkAuth();
        
        // Handle browser back/forward navigation
        window.addEventListener('popstate', () => {
            this.checkAuth();
        });
    }

    getCurrentUser() {
        const userStr = localStorage.getItem('currentUser');
        return userStr ? JSON.parse(userStr) : null;
    }

    getCurrentPage() {
        return window.location.pathname.split('/').pop() || 'index.html';
    }

    getCurrentPath() {
        const path = window.location.pathname;
        return path.startsWith('/') ? path.substring(1) : path;
    }

    isPublicRoute(page) {
        return this.routes.public.includes(page);
    }

    hasRoleAccess(userRole, targetPath) {
        if (!userRole || !this.routes[userRole]) return false;
        return this.routes[userRole].some(route => targetPath.includes(route));
    }

    checkAuth() {
        const currentPage = this.getCurrentPage();
        const currentPath = this.getCurrentPath();
        const user = this.getCurrentUser();

        // Allow public routes
        if (this.isPublicRoute(currentPage)) {
            return;
        }

        // Redirect unauthenticated users to login
        if (!user) {
            this.redirectTo('login.html');
            return;
        }

        // Check role-based access
        if (!this.hasRoleAccess(user.role, currentPath)) {
            // Redirect to appropriate dashboard if accessing wrong role area
            this.redirectToRoleDashboard(user.role);
            return;
        }
    }

    redirectTo(page) {
        if (window.location.pathname.split('/').pop() !== page) {
            window.location.href = page;
        }
    }

    redirectToRoleDashboard(role) {
        const dashboards = {
            admin: 'admin/dashboard.html',
            teacher: 'teacher/dashboard.html', 
            student: 'student/dashboard.html',
            parent: 'parent/dashboard.html'
        };
        
        const targetDashboard = dashboards[role];
        if (targetDashboard) {
            this.redirectTo(targetDashboard);
        } else {
            this.redirectTo('login.html');
        }
    }

    // Method to programmatically navigate with auth check
    navigate(path) {
        const user = this.getCurrentUser();
        
        if (!user && !this.isPublicRoute(path)) {
            this.redirectTo('login.html');
            return;
        }
        
        if (user && !this.hasRoleAccess(user.role, path)) {
            this.redirectToRoleDashboard(user.role);
            return;
        }
        
        this.redirectTo(path);
    }

    // Logout method
    logout() {
        localStorage.removeItem('currentUser');
        this.redirectTo('login.html');
    }
}

// Initialize router globally
window.router = new Router();