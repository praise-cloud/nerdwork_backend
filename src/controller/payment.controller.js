"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlePaymentWebhook = exports.createWebhookForPayment = exports.createPaymentLink = void 0;
var drizzle_orm_1 = require("drizzle-orm");
var db_1 = require("../config/db");
var schema_1 = require("../model/schema");
var helio_config_1 = require("../config/helio.config");
var HELIO_API_BASE = "https://api.dev.hel.io/v1";
// const HELIO_API_BASE = "https://api.hel.io/v1"; // For production
var HELIO_PUBLIC_KEY = process.env.HELIO_PUBLIC_KEY;
var HELIO_PRIVATE_KEY = process.env.HELIO_PRIVATE_KEY;
var WEBHOOK_REDIRECT_URL = process.env.WEBHOOK_REDIRECT_URL;
var createPaymentLink = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, amount, name_1, createPaylinkDto, helioResponse, user_1, userProfile, paymentToInsert, error_1;
    var _b, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                if (!req.user) {
                    return [2 /*return*/, res.status(401).json({ message: "Unauthorized: User not authenticated" })];
                }
                _e.label = 1;
            case 1:
                _e.trys.push([1, 6, , 7]);
                _a = req.body, amount = _a.amount, name_1 = _a.name;
                if (!amount) {
                    return [2 /*return*/, res.status(400).json({
                            error: 'Missing required fields: amount, currency, name'
                        })];
                }
                createPaylinkDto = {
                    name: req.user.id + name_1 + new Date().toISOString(), // Unique name for each payment link
                    price: (Number(amount) * 1000000).toString(), // Ensure amount is a number
                    pricingCurrency: "63777da9d2f1ab96ae0ee600",
                    description: "Payment for Nerd Work Token by ".concat(req.user.id, " on ").concat(new Date().toISOString(), " amount: ").concat(amount, " "),
                    features: {},
                    recipients: [
                        {
                            walletId: "685ef2364608b2fabd47f02d",
                            currencyId: "66e2b724a88df2dcc5f63fe8"
                        }
                    ],
                };
                return [4 /*yield*/, helio_config_1.sdk.paylink.create(createPaylinkDto)];
            case 2:
                helioResponse = _e.sent();
                console.log(req.user);
                return [4 /*yield*/, db_1.db.query.authUsers.findFirst({
                        where: function (users, _a) {
                            var eq = _a.eq;
                            return eq(users.id, req.user.id);
                        },
                        with: {
                            profile: true, // 👈 include the wallet relation here
                        },
                    })];
            case 3:
                user_1 = _e.sent();
                console.log(user_1);
                return [4 /*yield*/, db_1.db.query.userProfiles.findFirst({
                        where: function (profiles, _a) {
                            var eq = _a.eq;
                            return eq(profiles.id, user_1.profile.id);
                        },
                        with: {
                            wallet: true
                        }
                    })];
            case 4:
                userProfile = _e.sent();
                if (!user_1) {
                    return [2 /*return*/, res.status(404).json({ error: 'User not found' })];
                }
                paymentToInsert = {
                    userWalletId: userProfile.wallet.id || "testuser", // adjust as needed
                    amount: helioResponse.price.toString(),
                    currency: ((_b = helioResponse.currency) === null || _b === void 0 ? void 0 : _b.symbol) || "USD", // Default to USD if not provided
                    nwtAmount: amount,
                    exchangeRate: "100",
                    paymentIntentId: helioResponse.id,
                    blockchainTxHash: null,
                    status: "pending",
                    failureReason: null,
                    metadata: helioResponse, // Save full response for reference
                    processedAt: null,
                    // createdAt and updatedAt will default to now
                };
                return [4 /*yield*/, db_1.db.insert(schema_1.payments).values(paymentToInsert)];
            case 5:
                _e.sent();
                console.log(helioResponse.id);
                // Return the full Helio response
                res.json({
                    success: true,
                    payment: helioResponse,
                    paylinkId: helioResponse.id
                });
                return [3 /*break*/, 7];
            case 6:
                error_1 = _e.sent();
                console.error('Helio payment link creation error:', ((_c = error_1.response) === null || _c === void 0 ? void 0 : _c.data) || error_1.message);
                res.status(500).json({
                    error: 'Failed to create payment link',
                    details: ((_d = error_1.response) === null || _d === void 0 ? void 0 : _d.data) || error_1.message
                });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.createPaymentLink = createPaymentLink;
var createWebhookForPayment = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var paymentId, events, webhookPayload, response, error_2;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                if (!req.user) {
                    return [2 /*return*/, res.status(401).json({ message: "Unauthorized: User not authenticated" })];
                }
                _c.label = 1;
            case 1:
                _c.trys.push([1, 4, , 5]);
                paymentId = req.body.paymentId;
                events = ["CREATED"];
                webhookPayload = {
                    name: "Nerd Work Payment Webhook",
                    targetUrl: WEBHOOK_REDIRECT_URL || "http://localhost:5000/helio/webhook/handle",
                    paylinkId: paymentId,
                };
                return [4 /*yield*/, helio_config_1.sdk.paylinkWebhook.createPaylinkWebhook(webhookPayload)];
            case 2:
                response = _c.sent();
                console.log('Webhook created successfully:', response);
                return [4 /*yield*/, db_1.db.update(schema_1.payments)
                        .set({ webhookId: response.id }) // Add this column if you want to store webhookId
                        .where((0, drizzle_orm_1.eq)(schema_1.payments.paymentIntentId, paymentId))];
            case 3:
                _c.sent();
                res.json({
                    success: true,
                    data: response
                });
                return [3 /*break*/, 5];
            case 4:
                error_2 = _c.sent();
                console.error('Helio payment webhhok :', ((_a = error_2.response) === null || _a === void 0 ? void 0 : _a.data) || error_2.message);
                res.status(500).json({
                    error: 'Failed to create webhook',
                    details: ((_b = error_2.response) === null || _b === void 0 ? void 0 : _b.data) || error_2.message
                });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.createWebhookForPayment = createWebhookForPayment;
var handlePaymentWebhook = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, event_1, data, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                console.log(req.body);
                _a = req.body, event_1 = _a.event, data = _a.data;
                console.log('Received webhook event:', event_1, 'with data:', data);
                if (!(data === null || data === void 0 ? void 0 : data.id)) return [3 /*break*/, 2];
                return [4 /*yield*/, db_1.db.update(schema_1.payments)
                        .set({
                        status: data.status || 'processing',
                        failureReason: data.failureReason || null,
                        blockchainTxHash: data.blockchainTxHash || null,
                        processedAt: data.processedAt ? new Date(data.processedAt) : null,
                        metadata: data, // Save the full webhook data for reference
                        updatedAt: new Date()
                    })
                        .where((0, drizzle_orm_1.eq)(schema_1.payments.paymentIntentId, data.id))];
            case 1:
                _b.sent();
                _b.label = 2;
            case 2:
                res.status(200).json({ success: true });
                return [3 /*break*/, 4];
            case 3:
                error_3 = _b.sent();
                console.error('Error handling payment webhook:', error_3.message);
                res.status(500).json({ error: 'Internal Server Error' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.handlePaymentWebhook = handlePaymentWebhook;
