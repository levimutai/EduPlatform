const express = require('express');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get notifications
router.get('/notifications', auth, async (req, res) => {
    try {
        // Simulate notifications based on user activity
        const notifications = [
            {
                id: 1,
                type: 'assignment_due',
                title: 'Assignment Due Soon',
                message: 'Calculus Problem Set #5 is due tomorrow',
                timestamp: new Date(),
                read: false
            },
            {
                id: 2,
                type: 'grade_posted',
                title: 'Grade Posted',
                message: 'Your Physics Lab report has been graded',
                timestamp: new Date(Date.now() - 3600000),
                read: false
            },
            {
                id: 3,
                type: 'achievement',
                title: 'Achievement Unlocked!',
                message: 'You earned the "Study Streak" badge',
                timestamp: new Date(Date.now() - 7200000),
                read: true
            }
        ];
        
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Mark notification as read
router.put('/notifications/:id/read', auth, async (req, res) => {
    try {
        // In a real app, update notification in database
        res.json({ message: 'Notification marked as read' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Send message (for parent-teacher communication)
router.post('/messages', auth, async (req, res) => {
    try {
        const { recipientId, subject, content } = req.body;
        
        // In a real app, save message to database and send notification
        const message = {
            id: Date.now(),
            sender: req.user._id,
            recipient: recipientId,
            subject,
            content,
            timestamp: new Date(),
            read: false
        };
        
        res.status(201).json({
            message: 'Message sent successfully',
            messageId: message.id
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get messages
router.get('/messages', auth, async (req, res) => {
    try {
        // Simulate message history
        const messages = [
            {
                id: 1,
                sender: 'Prof. Johnson',
                subject: 'Assignment Extension Request',
                content: 'Your request for extension has been approved.',
                timestamp: new Date(),
                read: false
            },
            {
                id: 2,
                sender: 'Dr. Smith',
                subject: 'Lab Schedule Change',
                content: 'Tomorrow\'s lab has been moved to 3 PM.',
                timestamp: new Date(Date.now() - 3600000),
                read: true
            }
        ];
        
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get class chat history
router.get('/chat/:classId', auth, async (req, res) => {
    try {
        // Simulate chat history for virtual classroom
        const chatHistory = [
            {
                id: 1,
                user: 'Alex Student',
                message: 'Can you explain the derivative concept again?',
                timestamp: new Date(Date.now() - 300000)
            },
            {
                id: 2,
                user: 'Prof. Johnson',
                message: 'Sure! A derivative represents the rate of change...',
                timestamp: new Date(Date.now() - 240000)
            },
            {
                id: 3,
                user: 'Sarah Student',
                message: 'That makes sense, thank you!',
                timestamp: new Date(Date.now() - 180000)
            }
        ];
        
        res.json(chatHistory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;