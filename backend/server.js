// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const helmet = require('helmet');
// const rateLimit = require('express-rate-limit');
// const mongoSanitize = require('express-mongo-sanitize');
// const xss = require('xss-clean');
// require('dotenv').config();

// const app = express();

// // Security middleware
// app.use(helmet());
// app.use(cors({
//   origin: 'http://localhost:5173', // Change to your frontend URL if different
//   credentials: true
// }));
// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ extended: true, limit: '10mb' }));
// app.use(mongoSanitize());
// app.use(xss());

// // Rate limiting
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100 // limit each IP to 100 requests per windowMs
// });
// app.use('/api/', limiter);

// // Database connection
// mongoose.connect(process.env.MONGODB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
// .then(() => console.log('MongoDB connected successfully'))
// .catch(err => console.error('MongoDB connection error:', err));

// // Routes
// app.use('/api/auth', require('./routes/auth'));
// // Temporarily disabled routes that require database
// app.use('/api/projects', require('./routes/projects'));
// app.use('/api/partners', require('./routes/partners'));
// app.use('/api/news', require('./routes/news'));
// app.use('/api/gallery', require('./routes/gallery'));
// app.use('/api/contact', require('./routes/contact'));
// app.use('/api/users', require('./routes/users'));

// // Health check endpoint
// app.get('/api/health', (req, res) => {
//   res.status(200).json({ 
//     status: 'healthy', 
//     timestamp: new Date().toISOString(),
//     service: 'Matakiri Tumaini Centre API'
//   });
// });

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(err.status || 500).json({
//     success: false,
//     message: err.message || 'Internal server error',
//     ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
//   });
// });

// // 404 handler
// app.use((req, res) => {
//   res.status(404).json({
//     success: false,
//     message: 'Endpoint not found'
//   });
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
require('dotenv').config();

const app = express();

// Security middleware
app.use(helmet());
// Allow multiple origins for local dev and production. Can be overridden via
// ALLOWED_ORIGINS environment variable (comma-separated list).
const defaultOrigins = [
  'http://localhost:5173',
  'http://localhost:3002',
  'http://localhost:5000',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3002',
  'https://matakiri-website-revamp-client.vercel.app',
  'https://matakiri-website-revamp-admin-dashb-omega.vercel.app'
];
const allowedOrigins = (process.env.ALLOWED_ORIGINS || defaultOrigins.join(',')).split(',').map(s => s.trim()).filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);

    // Normalize origin (remove trailing slash) before matching
    const norm = origin.endsWith('/') ? origin.slice(0, -1) : origin;
    if (allowedOrigins.includes(norm)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS: ' + origin));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(mongoSanitize());
app.use(xss());

// Rate limiting
const RATE_LIMIT_WINDOW_MIN = Number(process.env.RATE_LIMIT_WINDOW_MIN) || 15;
const RATE_LIMIT_MAX = Number(process.env.RATE_LIMIT_MAX) || 100;

const limiter = rateLimit({
  windowMs: RATE_LIMIT_WINDOW_MIN * 60 * 1000, // window in minutes
  max: RATE_LIMIT_MAX, // limit each IP to RATE_LIMIT_MAX requests per window
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply rate limiting middleware.
// In development we skip rate limiting to avoid hitting in-memory counters during fast local iteration.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: Number(process.env.AUTH_RATE_LIMIT_MAX) || 20, // e.g., 20 attempts per window
  message: 'Too many authentication attempts from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

if (process.env.NODE_ENV === 'development') {
  console.log('Dev mode: skipping global rate limiter and auth limiter to avoid 429 during local development');
} else {
  // Apply global limiter to all /api routes EXCEPT auth endpoints.
  // This allows us to use a separate, stricter limiter for login routes.
  app.use('/api', (req, res, next) => {
    if (req.path && req.path.startsWith('/auth')) return next();
    return limiter(req, res, next);
  });

  // Apply auth limiter specifically to login route
  app.use('/api/auth/login', authLimiter);
}

// Database connection
const connectDB = require('./config/database');
connectDB();

// Import routes
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const partnerRoutes = require('./routes/partners');
const newsRoutes = require('./routes/news');
const galleryRoutes = require('./routes/gallery');
const contactRoutes = require('./routes/contact');
const userRoutes = require('./routes/users');
const metricsRoutes = require('./routes/metrics');

const programRoutes = require('./routes/programs');
const themeRoutes = require('./routes/themes');

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/partners', partnerRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/users', userRoutes);
app.use('/api/programs', programRoutes);
app.use('/api/themes', themeRoutes);
app.use('/api/metrics', metricsRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'Matakiri Tumaini Centre API',
    version: '1.0.0'
  });
});

// Import error handler
const errorHandler = require('./middleware/error');

// Use error handler (must be after all routes)
app.use(errorHandler);

// Serve uploaded files with CORS headers for images
const path = require('path');
const staticCors = (req, res, next) => {
  // Check the origin and allow specific origins
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    // If no origin or not in allowed list, allow all (for direct access)
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  
  // Also add these headers for images
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
};

app.use('/uploads', staticCors, express.static(path.join(__dirname, 'uploads')));
app.use('/api/uploads', staticCors, express.static(path.join(__dirname, 'uploads')));

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

// Export app for serverless platforms like Vercel. When running locally
// (not on Vercel), start the server with app.listen().
const PORT = process.env.PORT || 5000;
if (process.env.VERCEL) {
  module.exports = app;
} else {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
  });
}