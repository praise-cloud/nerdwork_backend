import serverless from 'serverless-http';
import express from 'express';
import helioWebhooksRoutes from '../../src/routes/helio.webhooks.routes';

// Apply helio webhooks routes to a new Express app for this Lambda function
const helioWebhooksApp = express();
helioWebhooksApp.use('/', helioWebhooksRoutes);

export const handler = serverless(helioWebhooksApp);