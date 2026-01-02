const express = require('express');
const Assignment = require('../models/Assignment');
const User = require('../models/User');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Get assignments for a course
router.get('/course/:courseId', auth, async (req, res) => {
    try {
        const assignments = await Assignment.find({ course: req.params.courseId })
            .populate('instructor', 'name');
        res.json(assignments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create assignment (teachers only)
router.post('/', auth, authorize('teacher'), async (req, res) => {
    try {
        const assignment = new Assignment({
            ...req.body,
            instructor: req.user._id
        });
        await assignment.save();
        res.status(201).json(assignment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Submit assignment
router.post('/:id/submit', auth, authorize('student'), async (req, res) => {
    try {
        const { answers } = req.body;
        const assignment = await Assignment.findById(req.params.id);
        
        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }

        // Check if already submitted
        const existingSubmission = assignment.submissions.find(
            sub => sub.student.toString() === req.user._id.toString()
        );

        if (existingSubmission) {
            return res.status(400).json({ message: 'Already submitted' });
        }

        // Auto-grade multiple choice questions
        let totalPoints = 0;
        let earnedPoints = 0;

        assignment.questions.forEach((question, index) => {
            totalPoints += question.points || 0;
            if (question.type === 'multiple-choice' && 
                answers[index] === question.correctAnswer) {
                earnedPoints += question.points || 0;
            }
        });

        const grade = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0;

        assignment.submissions.push({
            student: req.user._id,
            answers,
            grade,
            aiGraded: true
        });

        await assignment.save();

        // Award points to student
        await User.findByIdAndUpdate(req.user._id, {
            $inc: { points: Math.floor(grade) }
        });

        res.json({ message: 'Assignment submitted', grade });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get student submissions
router.get('/my-submissions', auth, authorize('student'), async (req, res) => {
    try {
        const assignments = await Assignment.find({
            'submissions.student': req.user._id
        }).populate('course', 'title');
        
        const submissions = assignments.map(assignment => {
            const submission = assignment.submissions.find(
                sub => sub.student.toString() === req.user._id.toString()
            );
            return {
                assignment: {
                    id: assignment._id,
                    title: assignment.title,
                    course: assignment.course.title,
                    maxPoints: assignment.maxPoints
                },
                submission
            };
        });

        res.json(submissions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;