import { eq } from "drizzle-orm";
import { db } from "../config/db";
import { payments, userProfiles } from "../model/schema";
import axios from "axios";
import { sdk } from "../config/helio.config";
import { CreatePaylinkHookByApiKeyDto, CreatePaylinkWithApiDto } from "@heliofi/common";
const HELIO_API_BASE = "https://api.dev.hel.io/v1";
// const HELIO_API_BASE = "https://api.hel.io/v1"; // For production
const HELIO_PUBLIC_KEY = process.env.HELIO_PUBLIC_KEY;
const HELIO_PRIVATE_KEY = process.env.HELIO_PRIVATE_KEY;
const WEBHOOK_REDIRECT_URL = process.env.WEBHOOK_REDIRECT_URL;

import { InsertPayment } from "../model/payment"; // Make sure this import exists

export const createPaymentLink = async (req: any, res: any) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized: User not authenticated" });
    }
    try {
        const { amount, name } = req.body;

        if (!amount ) {
            return res.status(400).json({
                error: 'Missing required fields: amount, currency, name'
            });
        }
        // const currencies = await sdk.currency.getAllCurrencies();
        // return res.status(200).json({
        //     success: true,  
        //     currencies
        // });

        // Prepare DTO for Helio
        const createPaylinkDto: CreatePaylinkWithApiDto = {
            name: req.user.id + name + new Date().toISOString(), // Unique name for each payment link
            price: (Number(amount) * 1000000).toString(), // Ensure amount is a number
            pricingCurrency: "63777da9d2f1ab96ae0ee600",
            description: `Payment for Nerd Work Token by ${req.user.id} on ${new Date().toISOString()} amount: ${amount} `,
            features: {},
            recipients: [
                {
                    walletId: "685ef2364608b2fabd47f02d",
                    currencyId: "66e2b724a88df2dcc5f63fe8"
                }
            ],
        };

        // Call Helio SDK
        const helioResponse = await sdk.paylink.create(createPaylinkDto);

       console.log(req.user)
        // get user from db
        const user = await db.query.authUsers.findFirst({
            where: (users, { eq }) => eq(users.id, req.user.id),
            with: {
                profile: true, // 👈 include the wallet relation here
            },
        });
    
        console.log(user)

        const userProfile = await db.query.userProfiles.findFirst({
            where:(profiles, {eq}) => eq(profiles.id, user.profile.id),
            with: {
                wallet: true
            }
        })

        

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Insert into DB
        const paymentToInsert: InsertPayment = {
            userWalletId: userProfile.wallet.id || "testuser", // adjust as needed
            amount: helioResponse.price.toString(),
            currency: helioResponse.currency?.symbol || "USD", // Default to USD if not provided
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

        await db.insert(payments).values(paymentToInsert);
        console.log(helioResponse.id)
        // Return the full Helio response
        res.json({
            success: true,
            payment: helioResponse,
            paylinkId: helioResponse.id
        });
    } catch (error: any) {
        console.error('Helio payment link creation error:', error.response?.data || error.message);
        res.status(500).json({
            error: 'Failed to create payment link',
            details: error.response?.data || error.message
        });
    }
};


export const createWebhookForPayment = async (req: any, res: any) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized: User not authenticated" });
    }
    try {
        const { paymentId } = req.body;
        const events = ["CREATED"];

        const webhookPayload :CreatePaylinkHookByApiKeyDto={
            name: "Nerd Work Payment Webhook",
            targetUrl: WEBHOOK_REDIRECT_URL || "http://localhost:5000/helio/webhook/handle",
            paylinkId: paymentId,
        }

        const response = await sdk.paylinkWebhook.createPaylinkWebhook(webhookPayload);
        console.log('Webhook created successfully:', response);
        await db.update(payments)
            .set({ webhookId: response.id }) // Add this column if you want to store webhookId
            .where(eq(payments.paymentIntentId, paymentId));

        res.json({
            success: true,
            data: response
        })

    } catch (error: any) {
         console.error('Helio payment webhhok :', error.response?.data || error.message);
        res.status(500).json({
            error: 'Failed to create webhook',
            details: error.response?.data || error.message
        });
    }
}

export const handlePaymentWebhook = async (req: any, res: any) => {
    try {
        console.log(req.body);
        const { event, data } = req.body;
        console.log('Received webhook event:', event, 'with data:', data);

        // Example: Update payment status and metadata based on webhook event
        if (data?.id) {
            await db.update(payments)
                .set({
                    status: data.status || 'processing',
                    failureReason: data.failureReason || null,
                    blockchainTxHash: data.blockchainTxHash || null,
                    processedAt: data.processedAt ? new Date(data.processedAt) : null,
                    metadata: data, // Save the full webhook data for reference
                    updatedAt: new Date()
                })
                .where(eq(payments.paymentIntentId, data.id));
        }

        res.status(200).json({ success: true });
    } catch (error: any) {
        console.error('Error handling payment webhook:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}