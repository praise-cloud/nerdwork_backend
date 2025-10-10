export {};
const serverless = require('serverless-http');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

// Import from compiled JavaScript
const paymentRoutes = require('./routes/payment.routes');

// Create Express app with essential middleware for Lambda
const paymentApp = express();

// Add essential middleware
paymentApp.use(express.json());
paymentApp.use(express.urlencoded({ extended: true }));
paymentApp.use(cors());
paymentApp.use(helmet());

// Apply routes
paymentApp.use('/', paymentRoutes.default || paymentRoutes);

module.exports.handler = serverless(paymentApp);
