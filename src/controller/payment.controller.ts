import { eq } from "drizzle-orm";
import { db } from "../config/db";
import {
  creatorProfile,
  payments,
  readerProfile,
  userProfiles,
} from "../model/schema";
import axios from "axios";
import { sdk } from "../config/helio.config";
import {
  CreatePaylinkHookByApiKeyDto,
  CreatePaylinkWithApiDto,
} from "@heliofi/common";

const HELIO_API_BASE = "https://api.dev.hel.io/v1";
// const HELIO_API_BASE = "https://api.hel.io/v1"; // For production
const HELIO_PUBLIC_KEY = process.env.HELIO_PUBLIC_KEY;
const HELIO_PRIVATE_KEY = process.env.HELIO_PRIVATE_KEY;
const WEBHOOK_REDIRECT_URL = process.env.WEBHOOK_REDIRECT_URL;
const HELIO_WALLET_ID = process.env.HELIO_WALLET_ID;
const HELIO_PCURRENCY = process.env.HELIO_PCURRENCY;

import jwt from "jsonwebtoken";
import {
  createUserPurchaseTransaction,
  updateUserTransactionStatus,
  updateUserWalletBalance,
} from "./transaction.controller";
import { userTransactions } from "../model/userTransaction";

export const createPaymentLink = async (req: any, res: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
  const userId = decoded.userId;

  console.log(userId);

  try {
    const { amount, name, redirectUrl } = req.body;

    if (!amount) {
      return res.status(400).json({
        error: "Missing required fields: amount, currency, name",
      });
    }
    // const currencies = await sdk.currency.getAllCurrencies();
    // return res.status(200).json({
    //     success: true,
    //     currencies
    // });

    console.log(HELIO_PCURRENCY, HELIO_WALLET_ID);
    // Prepare DTO for Helio
    const createPaylinkDto: CreatePaylinkWithApiDto = {
      name: "NWT_PURCHASE", // Unique name for each payment link
      price: (Number(amount) * 1000000).toString(), // Ensure amount is a number
      pricingCurrency: HELIO_PCURRENCY,
      description: `Payment for Nerd Work Token by ${userId} on ${new Date().toISOString()} amount: ${amount} `,
      features: {},
      redirectUrl,
      recipients: [
        {
          walletId: HELIO_WALLET_ID,
          currencyId: HELIO_PCURRENCY,
        },
      ],
    };

    // Call Helio SDK
    const helioResponse = await sdk.paylink.create(createPaylinkDto);

    // Calculate NWT amount (assuming 1 USD = 90.49 NWT based on your frontend calculation)
    const nwtAmount = amount * 90.49; // This should match your frontend calculation

    // Create user purchase transaction record
    const transactionResult = await createUserPurchaseTransaction(
      userId,
      nwtAmount,
      amount, // USD amount
      helioResponse.id,
      `Purchase ${nwtAmount} NWT for $${amount} via Helio`
    );

    if (!transactionResult.success) {
      console.error(
        "Failed to create transaction record:",
        transactionResult.error
      );
      // Continue anyway - we can still process the payment
    }

    console.log("Helio payment created:", helioResponse.id);
    console.log("Transaction record created:", transactionResult.success);

    res.json({
      success: true,
      payment: helioResponse,
      paylinkId: helioResponse.id,
      transactionId: transactionResult.transaction?.id,
      nwtAmount,
      usdAmount: amount,
    });
  } catch (error: any) {
    console.error(
      "Helio payment link creation error:",
      error.response?.data || error.message
    );
    res.status(500).json({
      error: "Failed to create payment link",
      details: error.response?.data || error.message,
    });
  }
};

export const createWebhookForPayment = async (req: any, res: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
  const userId = decoded.userId;

  console.log(userId);
  try {
    const { paymentId } = req.body;
    console.log(paymentId);
    const events = ["CREATED"];

    const webhookPayload: CreatePaylinkHookByApiKeyDto = {
      name: "Nerd Work Payment Webhook",
      targetUrl:
        WEBHOOK_REDIRECT_URL || "http://nerdwork.ng/helio/webhook/handle",
      paylinkId: paymentId,
    };

    const response = await sdk.paylinkWebhook.createPaylinkWebhook(
      webhookPayload
    );
    console.log("Webhook created successfully:", response);
    // add paymet update
    // await db.update(payments)
    //     .set({ webhookId: response.id }) // Add this column if you want to store webhookId
    //     .where(eq(payments.paymentIntentId, paymentId));

    res.json({
      success: true,
      data: response,
    });
  } catch (error: any) {
    console.error(
      "Helio payment webhhok :",
      error.response?.data || error.message
    );
    res.status(500).json({
      error: "Failed to create webhook",
      details: error.response?.data || error.message,
    });
  }
};

// // incomming req body

// {
//     transaction: 'BcQK8ibZFXpjQbBNSWGar11Xi85AT21hfaknQB4FJB4HPLtV2mrZbjSZtKeug14crw9qKVgmyWxtJT7G4fBq3WD',
//     data: {
//       content: {},
//       transactionSignature: 'BcQK8ibZFXpjQbBNSWGar11Xi85AT21hfaknQB4FJB4HPLtV2mrZbjSZtKeug14crw9qKVgmyWxtJT7G4fBq3WD',
//       status: 'SUCCESS',
//       statusToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0cmFuc2FjdGlvblNpZ25hdHVyZSI6IkJjUUs4aWJaRlhwalFiQk5TV0dhcjExWGk4NUFUMjFoZmFrblFCNEZKQjRIUEx0VjJtclpialNadEtldWcxNGNydzlxS1ZnbXlXeHRKVDdHNGZCcTNXRCIsInRyYW5zYWN0aW9uSWQiOiI2OGJlNjlkNzVmMTI3ODQzZjFiZjQ1MmQiLCJpYXQiOjE3NTczMDk0MDMsImV4cCI6MTc1NzMxNjYwM30.lXf2-BAlDhJrWytTZGCwK-ehm27Oq7XKtmATtlyAldk'
//     },
//     blockchainSymbol: 'SOL',
//     senderPK: 'FBnExnQQzaowHA3g5VQKV9JKbD4StwnMNz8EymUo9wcT'
//   }

export const handlePayment = async (req: any, res: any) => {
  try {
    console.log("Webhook received:", req.body);
    const { transaction: txHash, data, blockchainSymbol, senderPK } = req.body;

    if (!data || !data.transactionSignature) {
      console.log("Invalid webhook data received");
      return res.status(400).json({ error: "Invalid webhook data" });
    }

    const { transactionSignature, status, statusToken } = data;

    console.log("Processing webhook:", {
      status,
      transactionSignature,
      blockchainSymbol,
    });

    // Find the transaction by transaction signature or other identifier
    // Note: You'll need to store the transaction signature when creating the payment
    // For now, we'll try to match by metadata or implement a lookup mechanism

    if (status === "SUCCESS") {
      // For successful payments, we need to:
      // 1. Update the transaction status
      // 2. Add NWT to user's wallet

      console.log("Payment successful, processing...");

      // You might need to implement a way to map the blockchain transaction
      // back to your Helio payment ID. For now, this is a placeholder:

      // Example: If you store the transaction signature in metadata
      const updateResult = await updateUserTransactionStatus(
        transactionSignature, // Using tx signature as lookup - you may need to adjust this
        "completed",
        transactionSignature,
        {
          blockchainSymbol,
          senderPK,
          statusToken,
          webhookData: req.body,
        }
      );

      if (updateResult.success && updateResult.transaction) {
        // Update user wallet balance
        const balanceResult = await updateUserWalletBalance(
          updateResult.transaction.userId,
          parseFloat(updateResult.transaction.nwtAmount),
          "add"
        );

        console.log("Transaction completed:", {
          transactionId: updateResult.transaction.id,
          balanceUpdated: balanceResult.success,
          newBalance: balanceResult.newBalance,
        });
      }
    } else {
      // Handle failed transactions
      console.log("Payment failed or pending:", status);

      await updateUserTransactionStatus(
        transactionSignature,
        "failed",
        transactionSignature,
        {
          blockchainSymbol,
          senderPK,
          statusToken,
          webhookData: req.body,
        },
        `Payment failed with status: ${status}`
      );
    }

    res.status(200).json({ success: true });
  } catch (error: any) {
    console.error("Error handling payment webhook:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const fetchTransactionByJwtForReaders = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    const userId = decoded.userId;

    const [reader] = await db
      .select()
      .from(readerProfile)
      .where(eq(readerProfile.userId, userId));
    if (!reader) {
      return res.status(404).json({ message: "Reader With Jwt not found" });
    }

    const userTransaction = await db
      .select()
      .from(userTransactions)
      .where(eq(userTransactions.userId, reader.id));

    return res.json({ transaction: userTransaction });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ message: "Failed to fetch Transactions" });
  }
};

export const fetchTransactionByJwtForCreators = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    const userId = decoded.userId;

    const [creator] = await db
      .select()
      .from(creatorProfile)
      .where(eq(creatorProfile.userId, userId));
    if (!creator) {
      return res.status(404).json({ message: "Creator With Jwt not found" });
    }

    const userTransaction = await db
      .select()
      .from(userTransactions)
      .where(eq(userTransactions.userId, creator.id));

    return res.json({ transaction: userTransaction });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ message: "Failed to fetch Transactions" });
  }
};
