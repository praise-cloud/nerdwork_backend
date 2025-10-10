import serverless from 'serverless-http';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

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

export const handler = serverless(walletApp);

