import serverless from 'serverless-http';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

// Import from compiled JavaScript
const libraryRoutes = require('./routes/library.routes');

// Create Express app with essential middleware for Lambda
const libraryApp = express();

// Add essential middleware
libraryApp.use(express.json());
libraryApp.use(express.urlencoded({ extended: true }));
libraryApp.use(cors());
libraryApp.use(helmet());

// Apply routes
libraryApp.use('/', libraryRoutes.default || libraryRoutes);

export const handler = serverless(libraryApp);

