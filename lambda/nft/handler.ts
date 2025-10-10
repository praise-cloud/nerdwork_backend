import serverless from 'serverless-http';
import express from 'express';
import nftRoutes from '../../src/routes/nft.routes';

// Apply NFT routes to a new Express app for this Lambda function
const nftApp = express();
nftApp.use('/', nftRoutes);

export const handler = serverless(nftApp);