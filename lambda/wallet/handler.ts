import serverless from 'serverless-http';
import express from 'express';
import walletRoutes from '../../src/routes/wallet.routes';

// Apply wallet routes to a new Express app for this Lambda function
const walletApp = express();
walletApp.use('/', walletRoutes);

export const handler = serverless(walletApp);