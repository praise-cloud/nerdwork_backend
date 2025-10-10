const serverless = require('serverless-http');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

// Import from compiled JavaScript
const transactionRoutes = require('./routes/transaction.routes');

// Create Express app with essential middleware for Lambda
const transactionApp = express();

// Add essential middleware
transactionApp.use(express.json());
transactionApp.use(express.urlencoded({ extended: true }));
transactionApp.use(cors());
transactionApp.use(helmet());

// Apply routes
transactionApp.use('/', transactionRoutes.default || transactionRoutes);

module.exports.handler = serverless(transactionApp);

