// General App Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Attach event listeners for AI chat buttons (will work after auth)
    setTimeout(() => {
        const openAIChatBtn = document.getElementById('openAIChatBtn');
        if (openAIChatBtn) {
            openAIChatBtn.addEventListener('click', openAIChat);
        }

        const closeAIChatBtn = document.getElementById('closeAIChatBtn');
        if (closeAIChatBtn) {
            closeAIChatBtn.addEventListener('click', closeAIChat);
        }

        const sendChatBtn = document.getElementById('sendChatBtn');
        if (sendChatBtn) {
            sendChatBtn.addEventListener('click', sendChatMessage);
        }
    }, 100);

    // Animate progress circles when they appear
    setTimeout(() => {
        animateProgressCircles();
        animateStats();
    }, 500);
});

// AI Chat functionality
function openAIChat() {
    document.getElementById('aiChatModal').style.display = 'block';
}

function closeAIChat() {
    document.getElementById('aiChatModal').style.display = 'none';
}

function addMessage(text, sender) {
    const messagesContainer = document.getElementById('chatMessages');
    if (!messagesContainer) return;
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    const lines = String(text).split('\n');
    lines.forEach((line, index) => {
        if (index > 0) messageDiv.appendChild(document.createElement('br'));
        messageDiv.appendChild(document.createTextNode(line));
    });
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Progress circle animation
function animateProgressCircles() {
    const circles = document.querySelectorAll('.progress-circle');
    circles.forEach(circle => {
        const dashArray = circle.getAttribute('stroke-dasharray');
        const dashOffset = circle.getAttribute('stroke-dashoffset');
        
        // Start from full circle
        circle.style.strokeDashoffset = dashArray;
        
        // Animate to target offset
        setTimeout(() => {
            circle.style.strokeDashoffset = dashOffset;
        }, 500);
    });
}

// Stats animation
function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-info h3');
    
    statNumbers.forEach(stat => {
        const finalValue = parseInt(stat.textContent);
        let currentValue = 0;
        const increment = finalValue / 50;
        
        const timer = setInterval(() => {
            currentValue += increment;
            if (currentValue >= finalValue) {
                stat.textContent = finalValue;
                clearInterval(timer);
            } else {
                stat.textContent = Math.floor(currentValue);
            }
        }, 30);
    });
}

// Filter functionality
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('filter-btn') || e.target.classList.contains('tab-btn')) {
        // Remove active class from siblings
        const siblings = e.target.parentNode.querySelectorAll('.filter-btn, .tab-btn');
        siblings.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked button
        e.target.classList.add('active');
    }
});

// Close modal when clicking outside
window.addEventListener('click', function(e) {
    const modal = document.getElementById('aiChatModal');
    if (e.target === modal) {
        closeAIChat();
    }
});

// Enter key for chat input
document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && e.target.id === 'chatInput') {
        sendChatMessage();
    }
});

// Notification bell animation
const notificationBell = document.querySelector('.notification-bell');
if (notificationBell) {
    notificationBell.addEventListener('click', function() {
        this.style.animation = 'none';
        setTimeout(() => {
            this.style.animation = 'pulse 0.5s ease';
        }, 10);
    });
}

// Add hover effects to cards
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.stat-card, .dashboard-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});

// Simulate real-time updates
setInterval(() => {
    const notificationCount = document.querySelector('.notification-count');
    if (!notificationCount) {
        return;
    }
    const currentCount = parseInt(notificationCount.textContent);
    
    // Randomly update notification count
    if (Math.random() > 0.95) {
        notificationCount.textContent = currentCount + 1;
        notificationCount.style.animation = 'pulse 0.5s ease';
    }
}, 5000);

// Achievement unlock animation
function unlockAchievement(title, description) {
    const achievement = document.createElement('div');
    achievement.className = 'achievement-notification';
    achievement.innerHTML = `
        <div style="background: linear-gradient(135deg, #FFD700, #FFA500); color: white; padding: 1rem; border-radius: 10px; position: fixed; top: 100px; right: 20px; z-index: 3000; animation: slideInRight 0.5s ease;">
            <h4><i class="fas fa-trophy"></i> Achievement Unlocked!</h4>
            <p><strong>${title}</strong></p>
            <p>${description}</p>
        </div>
    `;
    
    document.body.appendChild(achievement);
    
    setTimeout(() => {
        achievement.remove();
    }, 4000);
}

// Simulate achievement unlock
setTimeout(() => {
    unlockAchievement('Study Streak', 'Completed 7 days of continuous learning!');
}, 10000);