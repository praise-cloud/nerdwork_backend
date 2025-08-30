import { Router } from "express";
import {
  createPaymentLink,
  createWebhookForPayment,
  handlePaymentWebhook,
} from "../controller/payment.controller";

const router = Router();

// Payment routes
// This route creates a payment link using the Helio API
// It requires the user to be authenticated
// The payment link can be used for various payment methods like card, bank transfer, etc.
// The webhook is set up to listen for payment events
router.post("/helio/link", createPaymentLink);
router.post("/helio/webhook/create", createWebhookForPayment);
router.post("/helio/webhook/handle", handlePaymentWebhook);

export default router;
