/**
 * Wallet utilities for user balance management
 */

import { getDb } from './db';
import { wallets, walletTransactions, paymentSessions } from '../drizzle/schema-sqlite';
import { eq, and, desc } from 'drizzle-orm';

export interface WalletBalance {
  balance: number;
  currency: string;
  status: string;
}

export interface TransactionRecord {
  id: number;
  amount: number;
  type: string;
  status: string;
  description: string | null;
  createdAt: number;
  completedAt: number | null;
}

/**
 * Get user's wallet balance
 */
export function getUserWallet(userId: number): WalletBalance | null {
  const db = getDb();
  if (!db) throw new Error('Database not available');

  const result = db
    .select()
    .from(wallets)
    .where(eq(wallets.userId, userId))
    .limit(1)
    .all();

  if (!result || result.length === 0) {
    return null;
  }

  const wallet = result[0];
  return {
    balance: wallet.balance || 0,
    currency: wallet.currency || 'USD',
    status: wallet.status || 'active',
  };
}

/**
 * Create wallet for user if doesn't exist
 */
export function createWalletIfNotExists(userId: number): boolean {
  const db = getDb();
  if (!db) throw new Error('Database not available');

  // Check if wallet exists
  const existing = db
    .select()
    .from(wallets)
    .where(eq(wallets.userId, userId))
    .limit(1)
    .all();

  if (existing && existing.length > 0) {
    return false; // Wallet already exists
  }

  // Create new wallet
  db.insert(wallets).values({
    userId,
    balance: 0.0,
    currency: 'USD',
    status: 'active',
    createdAt: Math.floor(Date.now() / 1000),
    updatedAt: Math.floor(Date.now() / 1000),
  }).run();

  return true;
}

/**
 * Add funds to user's wallet
 */
export function depositFunds(
  userId: number,
  amount: number,
  description?: string,
  paymentId?: string,
  metadata?: any
): TransactionRecord {
  const db = getDb();
  if (!db) throw new Error('Database not available');

  if (amount <= 0) {
    throw new Error('Deposit amount must be positive');
  }

  // Ensure wallet exists
  createWalletIfNotExists(userId);

  // Get current wallet
  const wallet = db
    .select()
    .from(wallets)
    .where(eq(wallets.userId, userId))
    .limit(1)
    .all()[0];

  if (!wallet) throw new Error('Wallet not found');
  if (wallet.status !== 'active') throw new Error('Wallet is not active');

  const currentBalance = wallet.balance || 0;
  const newBalance = currentBalance + amount;

  // Update wallet balance
  db.update(wallets)
    .set({
      balance: newBalance,
      updatedAt: Math.floor(Date.now() / 1000),
    })
    .where(eq(wallets.userId, userId))
    .run();

  // Create transaction record
  const tx = db.insert(walletTransactions).values({
    walletId: wallet.id,
    userId,
    amount,
    type: 'deposit',
    status: 'completed',
    description: description || 'Deposit to wallet',
    externalTransactionId: paymentId || null,
    metadata: metadata ? JSON.stringify(metadata) : null,
    createdAt: Math.floor(Date.now() / 1000),
    completedAt: Math.floor(Date.now() / 1000),
  }).run();

  return {
    id: tx.lastInsertRowid as number,
    amount,
    type: 'deposit',
    status: 'completed',
    description: description || 'Deposit to wallet',
    createdAt: Math.floor(Date.now() / 1000),
    completedAt: Math.floor(Date.now() / 1000),
  };
}

/**
 * Withdraw funds from user's wallet
 */
export function withdrawFunds(
  userId: number,
  amount: number,
  description?: string,
  metadata?: any
): TransactionRecord {
  const db = getDb();
  if (!db) throw new Error('Database not available');

  if (amount <= 0) {
    throw new Error('Withdrawal amount must be positive');
  }

  // Get current wallet
  const wallet = db
    .select()
    .from(wallets)
    .where(eq(wallets.userId, userId))
    .limit(1)
    .all()[0];

  if (!wallet) throw new Error('Wallet not found');
  if (wallet.status !== 'active') throw new Error('Wallet is not active');

  const currentBalance = wallet.balance || 0;
  if (currentBalance < amount) {
    throw new Error('Insufficient balance');
  }

  const newBalance = currentBalance - amount;

  // Update wallet balance
  db.update(wallets)
    .set({
      balance: newBalance,
      updatedAt: Math.floor(Date.now() / 1000),
    })
    .where(eq(wallets.userId, userId))
    .run();

  // Create transaction record
  const tx = db.insert(walletTransactions).values({
    walletId: wallet.id,
    userId,
    amount: -amount,
    type: 'withdrawal',
    status: 'completed',
    description: description || 'Withdrawal from wallet',
    metadata: metadata ? JSON.stringify(metadata) : null,
    createdAt: Math.floor(Date.now() / 1000),
    completedAt: Math.floor(Date.now() / 1000),
  }).run();

  return {
    id: tx.lastInsertRowid as number,
    amount: -amount,
    type: 'withdrawal',
    status: 'completed',
    description: description || 'Withdrawal from wallet',
    createdAt: Math.floor(Date.now() / 1000),
    completedAt: Math.floor(Date.now() / 1000),
  };
}

/**
 * Transfer funds for purchase
 */
export function transferForPurchase(
  buyerId: number,
  sellerId: number,
  amount: number,
  artworkId: number,
  description?: string
): { buyerTx: TransactionRecord; sellerTx: TransactionRecord } {
  const db = getDb();
  if (!db) throw new Error('Database not available');

  if (amount <= 0) {
    throw new Error('Transfer amount must be positive');
  }

  // Get buyer wallet
  const buyerWallet = db
    .select()
    .from(wallets)
    .where(eq(wallets.userId, buyerId))
    .limit(1)
    .all()[0];

  if (!buyerWallet) throw new Error('Buyer wallet not found');
  if (buyerWallet.status !== 'active') throw new Error('Buyer wallet is not active');

  const buyerBalance = buyerWallet.balance || 0;
  if (buyerBalance < amount) {
    throw new Error('Insufficient balance');
  }

  // Ensure seller has wallet
  createWalletIfNotExists(sellerId);

  const sellerWallet = db
    .select()
    .from(wallets)
    .where(eq(wallets.userId, sellerId))
    .limit(1)
    .all()[0];

  if (!sellerWallet) throw new Error('Seller wallet not found');

  // Deduct from buyer
  db.update(wallets)
    .set({
      balance: buyerBalance - amount,
      updatedAt: Math.floor(Date.now() / 1000),
    })
    .where(eq(wallets.userId, buyerId))
    .run();

  // Add to seller
  const sellerBalance = sellerWallet.balance || 0;
  db.update(wallets)
    .set({
      balance: sellerBalance + amount,
      updatedAt: Math.floor(Date.now() / 1000),
    })
    .where(eq(wallets.userId, sellerId))
    .run();

  const now = Math.floor(Date.now() / 1000);

  // Create buyer transaction
  const buyerTx = db.insert(walletTransactions).values({
    walletId: buyerWallet.id,
    userId: buyerId,
    amount: -amount,
    type: 'purchase',
    status: 'completed',
    description: description || `Purchase artwork #${artworkId}`,
    relatedArtworkId: artworkId,
    createdAt: now,
    completedAt: now,
  }).run();

  // Create seller transaction
  const sellerTx = db.insert(walletTransactions).values({
    walletId: sellerWallet.id,
    userId: sellerId,
    amount: amount,
    type: 'sale',
    status: 'completed',
    description: description || `Sale of artwork #${artworkId}`,
    relatedArtworkId: artworkId,
    createdAt: now,
    completedAt: now,
  }).run();

  return {
    buyerTx: {
      id: buyerTx.lastInsertRowid as number,
      amount: -amount,
      type: 'purchase',
      status: 'completed',
      description: description || `Purchase artwork #${artworkId}`,
      createdAt: now,
      completedAt: now,
    },
    sellerTx: {
      id: sellerTx.lastInsertRowid as number,
      amount: amount,
      type: 'sale',
      status: 'completed',
      description: description || `Sale of artwork #${artworkId}`,
      createdAt: now,
      completedAt: now,
    },
  };
}

/**
 * Get user's transaction history
 */
export function getUserTransactions(
  userId: number,
  limit: number = 50,
  offset: number = 0
): TransactionRecord[] {
  const db = getDb();
  if (!db) throw new Error('Database not available');

  const results = db
    .select()
    .from(walletTransactions)
    .where(eq(walletTransactions.userId, userId))
    .orderBy(desc(walletTransactions.createdAt))
    .limit(limit)
    .offset(offset)
    .all();

  return results.map(tx => ({
    id: tx.id,
    amount: tx.amount || 0,
    type: tx.type || 'unknown',
    status: tx.status || 'unknown',
    description: tx.description,
    createdAt: tx.createdAt || 0,
    completedAt: tx.completedAt,
  }));
}
