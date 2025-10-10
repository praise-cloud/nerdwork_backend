import serverless from 'serverless-http';
import express from 'express';
import profileRoutes from '../../src/routes/profile.routes';

// Apply profile routes to a new Express app for this Lambda function
const profileApp = express();
profileApp.use('/', profileRoutes);

export const handler = serverless(profileApp);