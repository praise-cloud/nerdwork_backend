import serverless from 'serverless-http';
import express from 'express';
import chapterRoutes from '../../src/routes/chapter.routes';

// Apply chapter routes to a new Express app for this Lambda function
const chapterApp = express();
chapterApp.use('/', chapterRoutes);

export const handler = serverless(chapterApp);