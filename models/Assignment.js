const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    dueDate: { type: Date, required: true },
    maxPoints: { type: Number, default: 100 },
    questions: [{
        question: String,
        type: { type: String, enum: ['multiple-choice', 'essay', 'code'] },
        options: [String],
        correctAnswer: String,
        points: Number
    }],
    submissions: [{
        student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        answers: [String],
        submittedAt: { type: Date, default: Date.now },
        grade: Number,
        feedback: String,
        aiGraded: { type: Boolean, default: false }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Assignment', assignmentSchema);