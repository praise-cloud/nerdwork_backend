const serverless = require('serverless-http');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

// Import from compiled JavaScript
const libraryRoutes = require('./routes/library.routes');

// Create Express app with essential middleware for Lambda
const libraryApp = express();

// Add essential middleware
libraryApp.use(express.json());
libraryApp.use(express.urlencoded({ extended: true }));
libraryApp.use(cors());
libraryApp.use(helmet());

// Apply routes
libraryApp.use('/', libraryRoutes.default || libraryRoutes);

module.exports.handler = serverless(libraryApp);

