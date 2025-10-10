import serverless from 'serverless-http';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import paymentRoutes from '../../src/routes/payment.routes';

// Create Express app with essential middleware for Lambda
const paymentApp = express();

// Add essential middleware
paymentApp.use(express.json());
paymentApp.use(express.urlencoded({ extended: true }));
paymentApp.use(cors());
paymentApp.use(helmet());

// Apply routes
paymentApp.use('/', paymentRoutes);

export const handler = serverless(paymentApp);
