const express = require('express');
const Course = require('../models/Course');
const User = require('../models/User');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Get all courses
router.get('/', auth, async (req, res) => {
    try {
        const courses = await Course.find({ isActive: true })
            .populate('instructor', 'name email')
            .populate('students', 'name email');
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get user's courses
router.get('/my-courses', auth, async (req, res) => {
    try {
        let courses;
        if (req.user.role === 'teacher') {
            courses = await Course.find({ instructor: req.user._id });
        } else {
            courses = await Course.find({ students: req.user._id });
        }
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create course (teachers only)
router.post('/', auth, authorize('teacher'), async (req, res) => {
    try {
        const course = new Course({
            ...req.body,
            instructor: req.user._id
        });
        await course.save();
        res.status(201).json(course);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Enroll in course
router.post('/:id/enroll', auth, authorize('student'), async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        if (!course.students.includes(req.user._id)) {
            course.students.push(req.user._id);
            await course.save();

            await User.findByIdAndUpdate(req.user._id, {
                $push: { courses: course._id }
            });
        }

        res.json({ message: 'Enrolled successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update progress
router.post('/:id/progress', auth, async (req, res) => {
    try {
        const { moduleId, completed } = req.body;
        
        await User.findByIdAndUpdate(req.user._id, {
            $set: {
                'progress.$[elem].percentage': completed ? 100 : 0,
                'progress.$[elem].lastAccessed': new Date()
            }
        }, {
            arrayFilters: [{ 'elem.courseId': req.params.id }],
            upsert: true
        });

        res.json({ message: 'Progress updated' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;