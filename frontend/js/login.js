// Mock users for role-based authentication
const MOCK_USERS = {
    // Students
    'john@student.edu': { role: 'student', password: 'student123', name: 'John Doe' },
    'jane@student.edu': { role: 'student', password: '1234', name: 'Jane Smith' },
    'student': { role: 'student', password: 'pass', name: 'Demo Student' },
    
    // Teachers
    'prof@teacher.edu': { role: 'teacher', password: 'teacher123', name: 'Prof. Johnson' },
    'mary@teacher.edu': { role: 'teacher', password: 'teach456', name: 'Mary Wilson' },
    'teacher': { role: 'teacher', password: 'pass', name: 'Demo Teacher' },
    
    // Parents
    'parent@family.com': { role: 'parent', password: 'parent123', name: 'Sarah Parent' },
    'parent': { role: 'parent', password: 'pass', name: 'Demo Parent' },
    
    // Admins
    'admin@school.edu': { role: 'admin', password: 'admin123', name: 'Admin User' },
    'admin': { role: 'admin', password: 'pass', name: 'Demo Admin' }
};

// School branding configuration
const SCHOOL_BRANDING = {
    1: { theme: 'school-harvard', logo: 'H', color: '#a41034' },
    2: { theme: 'school-stanford', logo: 'S', color: '#8c1515' },
    3: { theme: 'school-mit', logo: 'MIT', color: '#750014' },
    4: { theme: 'school-berkeley', logo: 'UC', color: '#003262' },
    5: { theme: 'school-yale', logo: 'Y', color: '#00356b' },
    default: { theme: '', logo: '🎓', color: '#4f46e5' }
};

class UnifiedLogin {
    constructor() {
        this.loginForm = document.getElementById('loginForm');
        this.usernameInput = document.getElementById('username');
        this.passwordInput = document.getElementById('password');
        
        this.init();
    }

    init() {
        this.setupSchoolBranding();
        this.initEventListeners();
    }

    setupSchoolBranding() {
        const selectedSchool = localStorage.getItem('selectedSchool');
        
        if (!selectedSchool) {
            window.location.href = 'school-select.html';
            return;
        }

        const school = JSON.parse(selectedSchool);
        const branding = SCHOOL_BRANDING[school.id] || SCHOOL_BRANDING.default;
        
        // Apply school branding
        document.body.className = branding.theme;
        document.getElementById('schoolName').textContent = school.name;
        document.getElementById('schoolCode').textContent = `Code: ${school.code}`;
        document.getElementById('schoolLogo').textContent = branding.logo;
        
        // Set CSS custom properties for dynamic theming
        document.documentElement.style.setProperty('--school-color', branding.color);
    }

    initEventListeners() {
        this.loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });
    }

    handleLogin() {
        const username = this.usernameInput.value.trim().toLowerCase();
        const password = this.passwordInput.value;
        
        if (!username || !password) {
            this.showError('Please enter both username and password');
            return;
        }

        // Check mock users
        const user = MOCK_USERS[username];
        if (!user || user.password !== password) {
            this.showError('Invalid username or password');
            return;
        }

        // Store user session
        localStorage.setItem('currentUser', JSON.stringify({
            username,
            name: user.name,
            role: user.role,
            loginTime: new Date().toISOString()
        }));

        // Role-based redirect
        this.redirectByRole(user.role);
    }

    redirectByRole(role) {
        const redirects = {
            student: 'student/dashboard.html',
            teacher: 'teacher/dashboard.html',
            parent: 'parent/dashboard.html',
            admin: 'admin/dashboard.html'
        };

        const targetPage = redirects[role] || 'login.html';
        
        // Show success message briefly before redirect
        this.showSuccess(`Welcome! Redirecting to ${role} dashboard...`);
        
        setTimeout(() => {
            window.location.href = targetPage;
        }, 1500);
    }

    showError(message) {
        this.showMessage(message, 'error');
    }

    showSuccess(message) {
        this.showMessage(message, 'success');
    }

    showMessage(message, type) {
        // Remove existing messages
        const existingMessage = document.querySelector('.login-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create message element
        const messageEl = document.createElement('div');
        messageEl.className = `login-message ${type}`;
        messageEl.textContent = message;
        messageEl.style.cssText = `
            padding: 0.75rem;
            margin-bottom: 1rem;
            border-radius: 6px;
            font-size: 0.875rem;
            text-align: center;
            ${type === 'error' ? 
                'background: #fef2f2; color: #dc2626; border: 1px solid #fecaca;' : 
                'background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0;'
            }
        `;

        // Insert before form
        this.loginForm.parentNode.insertBefore(messageEl, this.loginForm);

        // Auto-remove error messages after 5 seconds
        if (type === 'error') {
            setTimeout(() => {
                if (messageEl.parentNode) {
                    messageEl.remove();
                }
            }, 5000);
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new UnifiedLogin();
});