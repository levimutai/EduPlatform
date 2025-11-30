// API Configuration
const API_BASE = window.location.origin;
const TOKEN_STORAGE_KEY = 'eduplatform_token';

const buildHeaders = (customHeaders = {}, includeJson = true) => {
    const headers = includeJson ? { 'Content-Type': 'application/json' } : {};
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }
    return { Accept: 'application/json', ...headers, ...customHeaders };
};

const handleResponse = async (response) => {
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
        throw new Error(payload.message || `Request failed with status ${response.status}`);
    }
    return payload;
};

// API Helper Functions
const api = {
    async get(endpoint, options = {}) {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            method: 'GET',
            headers: buildHeaders(options.headers, false),
            credentials: 'include'
        });
        return handleResponse(response);
    },

    async post(endpoint, data, options = {}) {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            method: 'POST',
            headers: buildHeaders(options.headers),
            credentials: 'include',
            body: JSON.stringify(data)
        });
        return handleResponse(response);
    },

    setToken(token) {
        localStorage.setItem(TOKEN_STORAGE_KEY, token);
    },

    clearToken() {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
};

// Load dashboard data from backend
async function loadDashboardData() {
    try {
        const data = await api.get('/api/dashboard');
        updateDashboardStats(data.stats);
        updateUpcomingClasses(data.upcomingClasses);
    } catch (error) {
        console.error('Unable to load dashboard data:', error);
        showDashboardError('Unable to reach the dashboard service. Please try again later.');
    }
}

function updateDashboardStats(stats) {
    document.querySelector('.stat-info h3').textContent = stats.activeCourses;
    document.querySelectorAll('.stat-info h3')[1].textContent = stats.pendingAssignments;
    document.querySelectorAll('.stat-info h3')[2].textContent = stats.pointsEarned.toLocaleString();
    document.querySelectorAll('.stat-info h3')[3].textContent = `${stats.averageGrade}%`;
}

function updateUpcomingClasses(classes) {
    const classList = document.querySelector('.class-list');
    classList.innerHTML = classes.map(cls => `
        <div class="class-item">
            <div class="class-time">${cls.time}</div>
            <div class="class-info">
                <h4>${cls.title}</h4>
                <p>${cls.instructor} - ${cls.room}</p>
            </div>
            <button class="join-btn">Join</button>
        </div>
    `).join('');
}

// Enhanced AI Chat
async function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();

    if (!message) {
        return;
    }

    addMessage(message, 'user');
    input.value = '';
    toggleChatInputState(true);

    try {
        const response = await api.post('/api/ai/chat', { message });
        addMessage(response.response, 'ai');
    } catch (error) {
        console.error('AI chat failed:', error);
        addMessage('Sorry, I could not reach the AI tutor at the moment. Please try again shortly.', 'ai');
    } finally {
        toggleChatInputState(false);
        input.focus();
    }
}

function toggleChatInputState(disabled) {
    const input = document.getElementById('chatInput');
    const button = document.querySelector('.chat-input button');
    if (input) input.disabled = disabled;
    if (button) button.disabled = disabled;
}

function showDashboardError(message) {
    const header = document.querySelector('.dashboard-header');
    if (!header || header.querySelector('.error-banner')) return;
    const warning = document.createElement('p');
    warning.className = 'error-banner';
    warning.textContent = message;
    header.appendChild(warning);
}

// Load data when page loads
document.addEventListener('DOMContentLoaded', loadDashboardData);