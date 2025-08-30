"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var payment_controller_1 = require("../controller/payment.controller");
var router = (0, express_1.Router)();
// Payment routes
// This route creates a payment link using the Helio API
// It requires the user to be authenticated
// The payment link can be used for various payment methods like card, bank transfer, etc.
// The webhook is set up to listen for payment events
router.post("/helio/link", payment_controller_1.createPaymentLink);
router.post("/helio/webhook/create", payment_controller_1.createWebhookForPayment);
router.post("/helio/webhook/handle", payment_controller_1.handlePaymentWebhook);
exports.default = router;
