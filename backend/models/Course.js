const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    modules: [{
        title: String,
        content: String,
        videoUrl: String,
        duration: Number,
        completed: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
    }],
    assignments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Assignment' }],
    schedule: [{
        day: String,
        time: String,
        duration: Number,
        room: String
    }],
    category: String,
    difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'] },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);