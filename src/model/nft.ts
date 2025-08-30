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



export const nftTransactions = pgTable('nwt_transactions', {
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



export const nft = pgTable('nwt_transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  owner: uuid('user_wallet_id')
    .notNull()
    .references(() => userWallets.id, { onDelete: 'cascade' }),
  colection: text('collection'), // 'credit' | 'debit'
  price: integer('price').default(0), // 'purchase', 'sale', etc.
  isLimitedEdition: boolean('is_limited_edition').default(false),
  amount: integer("amount"),
  metadata: json('metadata'),
  status: text('status').notNull(), // 'pending', 'completed', etc.
});


