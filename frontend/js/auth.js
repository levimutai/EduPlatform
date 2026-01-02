// Authentication Management
let currentUser = null;
let socket = null;

// Check if user is already logged in
function checkAuth() {
    const token = api.getToken();
    if (token) {
        // Verify token and get user info
        api.get('/api/auth/me')
            .then(data => {
                currentUser = data.user;
                initializeApp();
            })
            .catch(() => {
                // Token invalid, show login
                api.clearToken();
                showLoginPage();
            });
    } else {
        showLoginPage();
    }
}

// Show login page
function showLoginPage() {
    document.getElementById('loginPage').style.display = 'flex';
    document.getElementById('appContainer').style.display = 'none';
    currentUser = null;
    if (socket) {
        socket.disconnect();
        socket = null;
    }
}

// Show app container
function showAppContainer() {
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('appContainer').style.display = 'block';
}

// Initialize app after login
function initializeApp() {
    if (!currentUser) return;
    
    showAppContainer();
    setupNavigation();
    setupProfile();
    if (window.dashboard && window.dashboard.loadDashboard) {
        window.dashboard.loadDashboard();
    }
    initializeSocket();
    // Show dashboard section by default
    showSection('dashboard');
}

// Setup role-based navigation
function setupNavigation() {
    const navMenu = document.getElementById('navMenu');
    const role = currentUser.role;
    
    let navItems = [];
    
    if (role === 'student') {
        navItems = [
            { section: 'dashboard', label: 'Dashboard', icon: 'home' },
            { section: 'courses', label: 'Courses', icon: 'book' },
            { section: 'assignments', label: 'Assignments', icon: 'tasks' },
            { section: 'analytics', label: 'Analytics', icon: 'chart-line' }
        ];
    } else if (role === 'teacher') {
        navItems = [
            { section: 'dashboard', label: 'Dashboard', icon: 'home' },
            { section: 'courses', label: 'Courses', icon: 'chalkboard-teacher' },
            { section: 'assignments', label: 'Assignments', icon: 'clipboard-list' },
            { section: 'analytics', label: 'Analytics', icon: 'chart-bar' }
        ];
    } else if (role === 'parent') {
        navItems = [
            { section: 'dashboard', label: 'Dashboard', icon: 'home' },
            { section: 'analytics', label: 'Progress', icon: 'chart-line' }
        ];
    }
    
    navMenu.innerHTML = navItems.map((item, index) => `
        <a href="#" class="nav-link ${index === 0 ? 'active' : ''}" data-section="${item.section}">
            <i class="fas fa-${item.icon}"></i> ${item.label}
        </a>
    `).join('');
    
    // Add click handlers
    navMenu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.getAttribute('data-section');
            showSection(section);
            
            // Update active state
            navMenu.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
}

// Show specific section
function showSection(section) {
    // Hide all role dashboards
    document.querySelectorAll('.role-dashboard').forEach(d => d.style.display = 'none');
    
    // Hide all sections
    document.querySelectorAll('.section').forEach(s => s.style.display = 'none');
    
    if (section === 'dashboard') {
        // Show appropriate role dashboard
        const role = currentUser.role;
        if (role === 'student') {
            document.getElementById('studentDashboard').style.display = 'block';
        } else if (role === 'teacher') {
            document.getElementById('teacherDashboard').style.display = 'block';
        } else if (role === 'parent') {
            document.getElementById('parentDashboard').style.display = 'block';
        }
    } else {
        // Show shared sections
        const sectionEl = document.getElementById(section);
        if (sectionEl) {
            sectionEl.style.display = 'block';
        }
    }
}

// Setup profile display
function setupProfile() {
    const profileImg = document.getElementById('profileImg');
    const profileName = document.getElementById('profileName');
    const profileRole = document.getElementById('profileRole');
    
    if (currentUser) {
        const initial = currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U';
        profileImg.textContent = initial;
        profileName.textContent = currentUser.name || 'User';
        profileRole.textContent = currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1);
    }
    
    // Profile dropdown toggle
    profileImg.addEventListener('click', () => {
        const menu = document.getElementById('profileMenu');
        menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
    });
    
    // Logout handler
    document.getElementById('logoutBtn').addEventListener('click', (e) => {
        e.preventDefault();
        logout();
    });
}

// Logout
function logout() {
    api.clearToken();
    currentUser = null;
    if (socket) {
        socket.disconnect();
        socket = null;
    }
    showLoginPage();
}

// Login form handler
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;
    
    const errorDiv = document.getElementById('loginError');
    errorDiv.style.display = 'none';
    
    try {
        const data = await api.post('/api/auth/login', { email, password });
        api.setToken(data.token);
        currentUser = data.user;
        initializeApp();
    } catch (error) {
        errorDiv.textContent = error.message || 'Login failed. Please check your credentials.';
        errorDiv.style.display = 'block';
    }
});

// Register form handler
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const role = document.getElementById('regRole').value;
    
    const errorDiv = document.getElementById('loginError');
    errorDiv.style.display = 'none';
    
    try {
        const data = await api.post('/api/auth/register', { name, email, password, role });
        api.setToken(data.token);
        currentUser = data.user;
        initializeApp();
    } catch (error) {
        errorDiv.textContent = error.message || 'Registration failed. Please try again.';
        errorDiv.style.display = 'block';
    }
});

// Toggle between login and register
document.getElementById('showRegister').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
});

document.getElementById('showLogin').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
});

// Initialize Socket.io connection
function initializeSocket() {
    if (typeof io !== 'undefined' && currentUser) {
        socket = io();
        
        socket.on('connect', () => {
            console.log('Connected to server');
        });
        
        socket.on('notification', (data) => {
            showNotification(data);
            updateNotificationCount();
        });
        
        socket.on('chat-message', (data) => {
            // Handle real-time chat messages
            if (data.classId) {
                // Class chat message
                console.log('Chat message received:', data);
            }
        });
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
});

// Export for use in other files
window.auth = {
    currentUser: () => currentUser,
    logout,
    showSection
};

