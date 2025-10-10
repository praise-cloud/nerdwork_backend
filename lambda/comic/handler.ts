import serverless from 'serverless-http';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

// Import from compiled JavaScript
const comicRoutes = require('./routes/comic.routes');

// Create Express app with essential middleware for Lambda
const comicApp = express();

// Add essential middleware
comicApp.use(express.json());
comicApp.use(express.urlencoded({ extended: true }));
comicApp.use(cors());
comicApp.use(helmet());

// Apply routes
comicApp.use('/', comicRoutes.default || comicRoutes);

export const handler = serverless(comicApp);
