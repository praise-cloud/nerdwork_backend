import serverless from 'serverless-http';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

// Import from compiled JavaScript
const authRoutes = require('./routes/auth.routes');

// Create Express app with essential middleware for Lambda
const authApp = express();

// Add essential middleware
authApp.use(express.json());
authApp.use(express.urlencoded({ extended: true }));
authApp.use(cors());
authApp.use(helmet());

// Apply routes
authApp.use('/', authRoutes.default || authRoutes);

export const handler = serverless(authApp);
