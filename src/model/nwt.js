"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nwtTransactions = void 0;
var pg_core_1 = require("drizzle-orm/pg-core");
var wallet_1 = require("./wallet");
exports.nwtTransactions = (0, pg_core_1.pgTable)('nwt_transactions', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    userWalletId: (0, pg_core_1.uuid)('user_wallet_id')
        .notNull()
        .references(function () { return wallet_1.userWallets.id; }, { onDelete: 'cascade' }),
    transactionType: (0, pg_core_1.text)('transaction_type').notNull(), // 'credit' | 'debit'
    category: (0, pg_core_1.text)('category').notNull(), // 'purchase', 'sale', etc.
    amount: (0, pg_core_1.text)('amount').notNull(),
    balanceBefore: (0, pg_core_1.text)('balance_before').notNull(),
    balanceAfter: (0, pg_core_1.text)('balance_after').notNull(),
    referenceId: (0, pg_core_1.text)('reference_id'),
    referenceType: (0, pg_core_1.text)('reference_type'),
    description: (0, pg_core_1.text)('description').notNull(),
    metadata: (0, pg_core_1.json)('metadata'),
    blockchainTxHash: (0, pg_core_1.text)('blockchain_tx_hash'),
    status: (0, pg_core_1.text)('status').notNull(), // 'pending', 'completed', etc.
    processedAt: (0, pg_core_1.timestamp)('processed_at', { mode: 'date' }),
    createdAt: (0, pg_core_1.timestamp)('created_at', { mode: 'date' }).notNull().defaultNow(),
});
