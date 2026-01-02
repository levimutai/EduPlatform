// Dashboard Management for all roles

// Load dashboard data based on user role
async function loadDashboard() {
    const user = window.auth?.currentUser();
    if (!user) return;
    
    const role = user.role;
    
    if (role === 'student') {
        await loadStudentDashboard();
    } else if (role === 'teacher') {
        await loadTeacherDashboard();
    } else if (role === 'parent') {
        await loadParentDashboard();
    }
}

// Load Student Dashboard
async function loadStudentDashboard() {
    try {
        // Update student name
        const studentName = document.getElementById('studentName');
        if (studentName && window.auth?.currentUser()) {
            studentName.textContent = window.auth.currentUser().name || 'Student';
        }
        
        // Load dashboard analytics
        const data = await api.get('/api/analytics/dashboard');
        
        // Update stats
        updateElement('studentActiveCourses', data.stats?.activeCourses || 0);
        updateElement('studentPendingAssignments', data.stats?.pendingAssignments || 0);
        updateElement('studentPoints', (data.stats?.pointsEarned || 0).toLocaleString());
        updateElement('studentAverageGrade', `${data.stats?.averageGrade || 0}%`);
        
        // Update progress
        const progress = data.stats?.averageGrade || 0;
        updateProgressCircle('studentProgressCircle', 'studentProgressText', progress);
        
        // Update upcoming classes
        if (data.upcomingClasses && data.upcomingClasses.length > 0) {
            const container = document.getElementById('studentUpcomingClasses');
            container.innerHTML = data.upcomingClasses.map(cls => `
                <div class="class-item">
                    <div class="class-time">${cls.time}</div>
                    <div class="class-info">
                        <h4>${cls.title}</h4>
                        <p>${cls.instructor} - ${cls.room}</p>
                    </div>
                    <button class="join-btn" data-class-id="${cls.id || ''}">Join</button>
                </div>
            `).join('');
        }
        
        // Update achievements
        const achievements = window.auth?.currentUser()?.achievements || [];
        if (achievements.length > 0) {
            const container = document.getElementById('studentAchievements');
            container.innerHTML = achievements.slice(0, 3).map(ach => `
                <div class="achievement-item">
                    <i class="fas fa-trophy ${ach.icon || 'gold'}"></i>
                    <div>
                        <h4>${ach.title}</h4>
                        <p>${ach.description}</p>
                    </div>
                </div>
            `).join('');
        }
        
        // Load pending assignments
        await loadStudentAssignments();
        
    } catch (error) {
        console.error('Error loading student dashboard:', error);
    }
}

// Load Teacher Dashboard
async function loadTeacherDashboard() {
    try {
        const data = await api.get('/api/analytics/teacher-dashboard');
        
        // Update stats
        updateElement('teacherTotalCourses', data.stats?.totalCourses || 0);
        updateElement('teacherTotalStudents', data.stats?.totalStudents || 0);
        updateElement('teacherTotalAssignments', data.stats?.totalAssignments || 0);
        updateElement('teacherTotalSubmissions', data.stats?.totalSubmissions || 0);
        
        // Update course performance
        if (data.coursePerformance && data.coursePerformance.length > 0) {
            const container = document.getElementById('teacherCoursePerformance');
            container.innerHTML = `
                <table class="performance-table-content">
                    <thead>
                        <tr>
                            <th>Course</th>
                            <th>Students</th>
                            <th>Avg Grade</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.coursePerformance.map(course => `
                            <tr>
                                <td>${course.title}</td>
                                <td>${course.studentCount}</td>
                                <td>${course.averageGrade || 'N/A'}%</td>
                                <td>
                                    <button class="btn-sm btn-secondary">View</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        }
        
    } catch (error) {
        console.error('Error loading teacher dashboard:', error);
    }
}

// Load Parent Dashboard
async function loadParentDashboard() {
    try {
        // For parent, we'd typically load child's data
        // This would require a child ID or relationship
        const data = await api.get('/api/analytics/dashboard');
        
        updateElement('parentAverageGrade', `${data.stats?.averageGrade || 0}%`);
        updateElement('parentPoints', (data.stats?.pointsEarned || 0).toLocaleString());
        updateElement('parentCompletedAssignments', data.stats?.completedAssignments || 0);
        
        // Update progress
        const progress = data.stats?.averageGrade || 0;
        updateElement('parentProgressPercent', `${progress}%`);
        const progressBar = document.getElementById('parentOverallProgress');
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
        
    } catch (error) {
        console.error('Error loading parent dashboard:', error);
    }
}

// Load Student Assignments
async function loadStudentAssignments() {
    try {
        const assignments = await api.get('/api/assignments/my-submissions');
        const container = document.getElementById('studentPendingAssignmentsList');
        
        if (assignments && assignments.length > 0) {
            container.innerHTML = assignments.slice(0, 5).map(assignment => `
                <div class="assignment-item">
                    <div class="assignment-info">
                        <h4>${assignment.assignment?.title || 'Assignment'}</h4>
                        <p>${assignment.assignment?.course || 'Course'}</p>
                    </div>
                    <div class="assignment-status">
                        ${assignment.submission?.grade !== undefined 
                            ? `<span class="grade-badge">${assignment.submission.grade}%</span>`
                            : '<span class="status-pending">Pending</span>'
                        }
                    </div>
                </div>
            `).join('');
        } else {
            container.innerHTML = '<div class="empty-state">No assignments available</div>';
        }
    } catch (error) {
        console.error('Error loading assignments:', error);
    }
}

// Helper Functions
function updateElement(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = value;
    }
}

function updateProgressCircle(circleId, textId, percentage) {
    const circle = document.getElementById(circleId);
    const text = document.getElementById(textId);
    
    if (circle && text) {
        const circumference = 2 * Math.PI * 50; // radius = 50
        const offset = circumference - (percentage / 100) * circumference;
        circle.style.strokeDashoffset = offset;
        text.textContent = `${Math.round(percentage)}%`;
    }
}

// Show notification
function showNotification(data) {
    const container = document.getElementById('notificationList');
    if (container) {
        const notification = document.createElement('div');
        notification.className = 'notification-item';
        notification.innerHTML = `
            <div class="notification-icon">
                <i class="fas fa-${data.type === 'achievement' ? 'trophy' : 'bell'}"></i>
            </div>
            <div class="notification-content">
                <h4>${data.title}</h4>
                <p>${data.message}</p>
            </div>
        `;
        container.insertBefore(notification, container.firstChild);
    }
}

// Update notification count
function updateNotificationCount() {
    const countEl = document.getElementById('notificationCount');
    const list = document.getElementById('notificationList');
    if (countEl && list) {
        const count = list.querySelectorAll('.notification-item').length;
        countEl.textContent = count;
        countEl.style.display = count > 0 ? 'block' : 'none';
    }
}

// Notification panel toggle
document.addEventListener('DOMContentLoaded', () => {
    const bell = document.getElementById('notificationBell');
    const panel = document.getElementById('notificationPanel');
    const closeBtn = document.getElementById('closeNotificationsBtn');
    
    if (bell && panel) {
        bell.addEventListener('click', () => {
            panel.classList.toggle('active');
        });
    }
    
    if (closeBtn && panel) {
        closeBtn.addEventListener('click', () => {
            panel.classList.remove('active');
        });
    }
});

// Export
window.dashboard = {
    loadDashboard,
    loadStudentDashboard,
    loadTeacherDashboard,
    loadParentDashboard
};

