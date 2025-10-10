const serverless = require('serverless-http');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

// Import from compiled JavaScript
const comicRoutes = require('./routes/comic.routes');

// Create Express app with essential middleware for Lambda
const comicApp = express();

// Add essential middleware
comicApp.use(express.json());
comicApp.use(express.urlencoded({ extended: true }));
comicApp.use(cors());
comicApp.use(helmet());

// Apply routes
comicApp.use('/', comicRoutes.default || comicRoutes);

module.exports.handler = serverless(comicApp);

