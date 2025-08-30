"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sdk = void 0;
var sdk_1 = require("@heliofi/sdk");
var HELIO_API_BASE = "https://api.dev.hel.io/v1";
// const HELIO_API_BASE = "https://api.hel.io/v1"; // For production
var HELIO_PUBLIC_KEY = process.env.HELIO_PUBLIC_KEY;
var HELIO_PRIVATE_KEY = process.env.HELIO_PRIVATE_KEY;
var WEBHOOK_REDIRECT_URL = process.env.WEBHOOK_REDIRECT_URL;
exports.sdk = new sdk_1.HelioSDK({
    apiKey: HELIO_PUBLIC_KEY,
    secretKey: HELIO_PRIVATE_KEY,
    network: 'devnet', // or 'mainnet' (optional, mainnet by default)
});
