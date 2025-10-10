import serverless from 'serverless-http';
import express from 'express';
import libraryRoutes from '../../src/routes/library.routes';

// Apply library routes to a new Express app for this Lambda function
const libraryApp = express();
libraryApp.use('/', libraryRoutes);

export const handler = serverless(libraryApp);