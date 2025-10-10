import serverless from 'serverless-http';
import express from 'express';
import transactionRoutes from '../../src/routes/transaction.routes';

// Apply transaction routes to a new Express app for this Lambda function
const transactionApp = express();
transactionApp.use('/', transactionRoutes);

export const handler = serverless(transactionApp);