const serverless = require('serverless-http');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

// Import from compiled JavaScript
const walletRoutes = require('./routes/wallet.routes');

// Create Express app with essential middleware for Lambda
const walletApp = express();

// Add essential middleware
walletApp.use(express.json());
walletApp.use(express.urlencoded({ extended: true }));
walletApp.use(cors());
walletApp.use(helmet());

// Apply routes
walletApp.use('/', walletRoutes.default || walletRoutes);

module.exports.handler = serverless(walletApp);

