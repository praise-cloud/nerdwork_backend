import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  integer,
  json
} from 'drizzle-orm/pg-core';
import { userWallets } from './wallet';

export const payments = pgTable('payments', {
  id: uuid('id').primaryKey().defaultRandom(),
  userWalletId: uuid('user_wallet_id')
    .notNull()
    .references(() => userWallets.id, { onDelete: 'cascade' }),

    // should payment method type be set in the database
    //   paymentMethodId: uuid('payment_method_id').references(() => paymentMethods.id),
  amount: text('amount').notNull(),
  currency: text('currency').notNull(),
  nwtAmount: text('nwt_amount'),
  exchangeRate: text('exchange_rate'),
  webhookId: text('webhook_id'), // Helio webhook ID
  paymentIntentId: text('payment_intent_id'),
  blockchainTxHash: text('blockchain_tx_hash'),
  status: text('status').notNull(), // 'pending', 'processing', etc.
  failureReason: text('failure_reason'),
  metadata: json('metadata').notNull(),
  processedAt: timestamp('processed_at', { mode: 'date' }),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).notNull().defaultNow(),
});


export type InsertPayment = typeof payments.$inferInsert;
export type SelectPayment = typeof payments.$inferSelect;