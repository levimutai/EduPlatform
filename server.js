const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses');
const assignmentRoutes = require('./routes/assignments');
const analyticsRoutes = require('./routes/analytics');
const communicationRoutes = require('./routes/communication');
const aiRoutes = require('./routes/ai');

const app = express();
const server = http.createServer(app);
const FRONTEND_ORIGIN = process.env.NODE_ENV === 'production'
    ? process.env.FRONTEND_URL
    : 'http://localhost:8080';

const requiredEnv = ['JWT_SECRET'];
requiredEnv.forEach((key) => {
    if (!process.env[key]) {
        console.error(`Missing required environment variable: ${key}`);
        process.exit(1);
    }
});

let isDbConnected = false;

const io = socketIo(server, {
    cors: {
        origin: FRONTEND_ORIGIN,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true
    }
});

app.set('trust proxy', 1);

const corsOptions = {
    origin: FRONTEND_ORIGIN,
    credentials: true,
    exposedHeaders: ['Authorization']
};

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false
});

// Configure Helmet with relaxed settings for development
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://cdnjs.cloudflare.com"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'"],
            scriptSrcAttr: ["'unsafe-inline'"], // Allow inline event handlers
        },
    },
    crossOriginEmbedderPolicy: false
}));
app.use(morgan('dev'));
app.use(compression());
app.use(cors(corsOptions));
app.use('/api', apiLimiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Debug middleware to log API requests
app.use('/api', (req, res, next) => {
    console.log(`📡 API Request: ${req.method} ${req.path}`);
    next();
});

// API routes BEFORE static files
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        database: isDbConnected ? 'Connected' : 'Offline',
        timestamp: new Date().toISOString()
    });
});

app.get('/api/dashboard', (req, res) => {
    res.json({
        stats: {
            activeCourses: 12,
            pendingAssignments: 8,
            pointsEarned: 1250,
            averageGrade: 85
        },
        upcomingClasses: [
            { time: '10:00', title: 'Advanced Mathematics', instructor: 'Prof. Johnson', room: 'Room 204' },
            { time: '14:30', title: 'Physics Lab', instructor: 'Dr. Smith', room: 'Lab 3' }
        ]
    });
});

app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/communication', communicationRoutes);
app.use('/api/ai', aiRoutes);

// Return JSON 404 for unknown API routes before falling back to static assets
app.use((req, res, next) => {
    if (req.path === '/api' || req.path.startsWith('/api/')) {
        return res.status(404).json({ message: 'API route not found' });
    }
    next();
});

// Static files AFTER API routes
app.use(express.static(path.join(__dirname, 'public')));

// Serve index.html for all non-API routes (SPA fallback)
app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    }
});

// Centralized error handler
app.use((err, req, res, next) => {
    console.error(err);
    const status = err.status || 500;
    res.status(status).json({ message: err.message || 'Internal server error' });
});

// Graceful MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/eduplatform')
    .then(() => {
        console.log('✅ MongoDB Connected');
        isDbConnected = true;
    })
    .catch(err => {
        console.log('⚠️ MongoDB not available:', err.message);
        console.log('🔄 Server running in offline mode');
    });

// Real-time features with enhanced error handling
io.on('connection', (socket) => {
    console.log('👤 User connected:', socket.id);

    socket.on('join-class', (classId) => {
        socket.join(classId);
        socket.to(classId).emit('user-joined', socket.id);
    });

    socket.on('chat-message', (data) => {
        io.to(data.classId).emit('chat-message', data);
    });

    socket.on('disconnect', () => {
        console.log('👤 User disconnected:', socket.id);
    });
});

process.on('unhandledRejection', (reason) => {
    console.error('Unhandled promise rejection:', reason);
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🔗 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`📊 Dashboard API: http://localhost:${PORT}/api/dashboard`);
});