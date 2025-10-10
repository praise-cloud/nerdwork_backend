export {};
const serverless = require('serverless-http');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

// Import from compiled JavaScript
const chapterRoutes = require('./routes/chapter.routes');

// Create Express app with essential middleware for Lambda
const chapterApp = express();

// Add essential middleware
chapterApp.use(express.json());
chapterApp.use(express.urlencoded({ extended: true }));
chapterApp.use(cors());
chapterApp.use(helmet());

// Apply routes
chapterApp.use('/', chapterRoutes.default || chapterRoutes);

module.exports.handler = serverless(chapterApp);
