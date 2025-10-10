const serverless = require('serverless-http');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

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

module.exports.handler = serverless(nftApp);

