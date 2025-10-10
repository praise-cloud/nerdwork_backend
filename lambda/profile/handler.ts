import serverless from 'serverless-http';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

// Import from compiled JavaScript
const profileRoutes = require('./routes/profile.routes');

// Create Express app with essential middleware for Lambda
const profileApp = express();

// Add essential middleware
profileApp.use(express.json());
profileApp.use(express.urlencoded({ extended: true }));
profileApp.use(cors());
profileApp.use(helmet());

// Apply routes
profileApp.use('/', profileRoutes.default || profileRoutes);

export const handler = serverless(profileApp);

