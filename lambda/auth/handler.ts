import serverless from 'serverless-http';
import express from 'express';
import { app } from '../../src/server';  // Changed from '../../dist/server'
import authRoutes from '../../src/routes/auth.routes';  // Changed from '../../dist/routes/auth.routes'

// Apply auth routes to a new Express app for this Lambda function
const authApp = express();
authApp.use('/', authRoutes);

export const handler = serverless(authApp);