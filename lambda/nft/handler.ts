import serverless from 'serverless-http';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

// Import from compiled JavaScript
const nftRoutes = require('./routes/nft.routes');

// Create Express app with essential middleware for Lambda
const nftApp = express();

// Add essential middleware
nftApp.use(express.json());
nftApp.use(express.urlencoded({ extended: true }));
nftApp.use(cors());
nftApp.use(helmet());

// Apply routes
nftApp.use('/', nftRoutes.default || nftRoutes);

export const handler = serverless(nftApp);

