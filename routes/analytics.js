const express = require('express');
const User = require('../models/User');
const Course = require('../models/Course');
const Assignment = require('../models/Assignment');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Get student dashboard analytics
router.get('/dashboard', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('courses');
        
        // Get assignment statistics
        const assignments = await Assignment.find({
            'submissions.student': req.user._id
        });
        
        const submittedCount = assignments.length;
        const totalGrades = assignments.reduce((sum, assignment) => {
            const submission = assignment.submissions.find(
                sub => sub.student.toString() === req.user._id.toString()
            );
            return sum + (submission?.grade || 0);
        }, 0);
        
        const averageGrade = submittedCount > 0 ? totalGrades / submittedCount : 0;
        
        // Get pending assignments
        const allCourseAssignments = await Assignment.find({
            course: { $in: user.courses.map(c => c._id) }
        });
        
        const pendingAssignments = allCourseAssignments.filter(assignment => 
            !assignment.submissions.some(sub => 
                sub.student.toString() === req.user._id.toString()
            )
        );
        
        res.json({
            stats: {
                activeCourses: user.courses.length,
                pendingAssignments: pendingAssignments.length,
                pointsEarned: user.points,
                averageGrade: Math.round(averageGrade)
            },
            recentActivity: [
                {
                    type: 'assignment_completed',
                    title: 'Calculus Problem Set #5',
                    date: new Date(),
                    grade: 85
                },
                {
                    type: 'course_progress',
                    title: 'Advanced Mathematics',
                    date: new Date(),
                    progress: 70
                }
            ],
            upcomingClasses: [
                {
                    time: '10:00',
                    title: 'Advanced Mathematics',
                    instructor: 'Prof. Johnson',
                    room: 'Room 204'
                },
                {
                    time: '14:30',
                    title: 'Physics Lab',
                    instructor: 'Dr. Smith',
                    room: 'Lab 3'
                }
            ]
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get teacher analytics
router.get('/teacher-dashboard', auth, authorize('teacher'), async (req, res) => {
    try {
        const courses = await Course.find({ instructor: req.user._id })
            .populate('students', 'name email');
        
        const totalStudents = courses.reduce((sum, course) => sum + course.students.length, 0);
        
        const assignments = await Assignment.find({ instructor: req.user._id });
        const totalSubmissions = assignments.reduce((sum, assignment) => 
            sum + assignment.submissions.length, 0
        );
        
        res.json({
            stats: {
                totalCourses: courses.length,
                totalStudents,
                totalAssignments: assignments.length,
                totalSubmissions
            },
            coursePerformance: courses.map(course => ({
                courseId: course._id,
                title: course.title,
                studentCount: course.students.length,
                averageGrade: 85 // Calculate from actual submissions
            }))
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get learning progress
router.get('/progress/:courseId', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const progress = user.progress.find(p => 
            p.courseId.toString() === req.params.courseId
        );
        
        res.json({
            courseId: req.params.courseId,
            percentage: progress?.percentage || 0,
            lastAccessed: progress?.lastAccessed || null,
            weeklyProgress: [
                { week: 1, progress: 20 },
                { week: 2, progress: 45 },
                { week: 3, progress: 70 },
                { week: 4, progress: progress?.percentage || 0 }
            ]
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;