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



export const nwtTransactions = pgTable('nwt_transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userWalletId: uuid('user_wallet_id')
    .notNull()
    .references(() => userWallets.id, { onDelete: 'cascade' }),
  transactionType: text('transaction_type').notNull(), // 'credit' | 'debit'
  category: text('category').notNull(), // 'purchase', 'sale', etc.
  amount: text('amount').notNull(),
  balanceBefore: text('balance_before').notNull(),
  balanceAfter: text('balance_after').notNull(),
  referenceId: text('reference_id'),
  referenceType: text('reference_type'),
  description: text('description').notNull(),
  metadata: json('metadata'),
  blockchainTxHash: text('blockchain_tx_hash'),
  status: text('status').notNull(), // 'pending', 'completed', etc.
  processedAt: timestamp('processed_at', { mode: 'date' }),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
});


export type InsertNWTTransaction = typeof nwtTransactions.$inferInsert;
export type SelectNWTTransaction = typeof nwtTransactions.$inferSelect;