import { Router } from "express";
import {
  createWebhookForPayment,
  handlePayment,
} from "../controller/payment.controller";

const router = Router();

/**
 * @swagger
 * /helio-webhooks/create:
 *   post:
 *     summary: Create a webhook for payment monitoring
 *     description: Sets up a webhook endpoint to receive payment status updates from Helio.
 *     tags:
 *       - Webhooks
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               paymentId:
 *                 type: string
 *                 description: The payment ID to create webhook for
 *     responses:
 *       200:
 *         description: Webhook created successfully
 *       500:
 *         description: Failed to create webhook
 */
router.post("/create", createWebhookForPayment);

/**
 * @swagger
 * /helio-webhooks/handle:
 *   post:
 *     summary: Handle incoming payment webhooks from Helio
 *     description: Processes webhook events from Helio payment system to update payment status.
 *     tags:
 *       - Webhooks
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               transaction:
 *                 type: string
 *               data:
 *                 type: object
 *               blockchainSymbol:
 *                 type: string
 *               senderPK:
 *                 type: string
 *     responses:
 *       200:
 *         description: Webhook processed successfully
 *       500:
 *         description: Internal server error
 */
router.post("/handle", handlePayment);

export default router;