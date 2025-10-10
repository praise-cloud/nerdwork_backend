const serverless = require('serverless-http');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

// Import from compiled JavaScript
const fileRoutes = require('./routes/files.routes');

// Create Express app with essential middleware for Lambda
const fileApp = express();

// Add essential middleware
fileApp.use(express.json());
fileApp.use(express.urlencoded({ extended: true }));
fileApp.use(cors());
fileApp.use(helmet());

// Apply routes
fileApp.use('/', fileRoutes.default || fileRoutes);

module.exports.handler = serverless(fileApp);


