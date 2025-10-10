import serverless from 'serverless-http';
import express from 'express';
import fileRoutes from '../../src/routes/files.routes';

// Apply file routes to a new Express app for this Lambda function
const fileApp = express();
fileApp.use('/', fileRoutes);

export const handler = serverless(fileApp);