const serverless = require('serverless-http');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

// Import from compiled JavaScript
const helioWebhooksRoutes = require('./routes/helio.webhooks.routes');

// Create Express app with essential middleware for Lambda
const helioWebhooksApp = express();

// Add essential middleware
helioWebhooksApp.use(express.json());
helioWebhooksApp.use(express.urlencoded({ extended: true }));
helioWebhooksApp.use(cors());
helioWebhooksApp.use(helmet());

// Apply routes
helioWebhooksApp.use('/', helioWebhooksRoutes.default || helioWebhooksRoutes);

module.exports.handler = serverless(helioWebhooksApp);
