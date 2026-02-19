/**
 * Wallet API Router
 * Handles wallet operations, deposits, withdrawals, and transaction history
 */

import { z } from 'zod';
import { publicProcedure, protectedProcedure, router } from './_core/trpc';
import {
  getUserWallet,
  createWalletIfNotExists,
  depositFunds,
  withdrawFunds,
  transferForPurchase,
  getUserTransactions,
} from './wallet-utils';
import { createStripeCheckoutSession, isStripeConfigured } from './stripe-utils';
import { getDb } from './db';

// Input schemas
const depositSchema = z.object({
  amount: z.number().positive(),
  paymentProvider: z.enum(['stripe', 'yandex_kassa']).default('stripe'),
  successUrl: z.string().url().optional(),
  cancelUrl: z.string().url().optional(),
});

const withdrawSchema = z.object({
  amount: z.number().positive(),
  description: z.string().optional(),
});

const getTransactionsSchema = z.object({
  limit: z.number().min(1).max(100).optional().default(50),
  offset: z.number().min(0).optional().default(0),
});

/**
 * Wallet Router
 */
export const walletRouter = router({
  /**
   * Get user's wallet balance
   */
  getBalance: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user?.id;
    if (!userId) {
      throw new Error('User not authenticated');
    }

    // Ensure wallet exists
    createWalletIfNotExists(userId);

    const wallet = getUserWallet(userId);
    if (!wallet) {
      throw new Error('Failed to get wallet');
    }

    return {
      balance: wallet.balance,
      currency: wallet.currency,
      status: wallet.status,
      formatted: `${wallet.currency} ${wallet.balance.toFixed(2)}`,
    };
  }),

  /**
   * Create deposit session (Stripe checkout)
   */
  createDepositSession: protectedProcedure
    .input(depositSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user?.id;
      const userEmail = ctx.user?.email;
      
      if (!userId || !userEmail) {
        throw new Error('User not authenticated');
      }

      const { amount, paymentProvider, successUrl, cancelUrl } = input;

      // Ensure wallet exists
      createWalletIfNotExists(userId);

      // Default URLs if not provided
      const defaultSuccessUrl = successUrl || `${process.env.APP_URL || 'http://localhost:3000'}/wallet?payment=success`;
      const defaultCancelUrl = cancelUrl || `${process.env.APP_URL || 'http://localhost:3000'}/wallet?payment=cancelled`;

      if (paymentProvider === 'stripe') {
        // Check if Stripe is configured
        if (!isStripeConfigured()) {
          // Fallback to mock for development
          const sessionId = `sess_mock_${Date.now()}_${Math.random().toString(36).substring(7)}`;
          const checkoutUrl = `https://checkout.stripe.com/mock/${sessionId}`;

          return {
            sessionId,
            checkoutUrl,
            amount,
            currency: 'USD',
            status: 'created',
            expiresAt: Math.floor(Date.now() / 1000) + 1800,
            message: 'Stripe not configured. Using mock session for development.',
            isMock: true,
          };
        }

        try {
          // Create real Stripe checkout session
          const session = await createStripeCheckoutSession({
            userId,
            userEmail,
            amount,
            currency: 'USD',
            successUrl: defaultSuccessUrl,
            cancelUrl: defaultCancelUrl,
            metadata: {
              walletDeposit: 'true',
            },
          });

          // Save session to database
          const db = getDb();
          if (db) {
            try {
              db.prepare(`
                INSERT INTO payment_sessions (
                  user_id, session_id, payment_provider, amount, currency,
                  status, checkout_url, success_url, cancel_url, created_at, expires_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
              `).run(
                userId,
                session.sessionId,
                'stripe',
                session.amount,
                session.currency,
                'created',
                session.checkoutUrl,
                defaultSuccessUrl,
                defaultCancelUrl,
                Math.floor(Date.now() / 1000),
                session.expiresAt
              );
            } catch (error) {
              console.error('Failed to save payment session:', error);
            }
          }

          return {
            sessionId: session.sessionId,
            checkoutUrl: session.checkoutUrl,
            amount: session.amount,
            currency: session.currency,
            status: session.status,
            expiresAt: session.expiresAt,
            message: 'Payment session created. Redirect user to checkoutUrl to complete payment.',
            isMock: false,
          };
        } catch (error: any) {
          console.error('Stripe session creation failed:', error);
          throw new Error(`Failed to create Stripe session: ${error.message}`);
        }
      } else if (paymentProvider === 'yandex_kassa') {
        // TODO: Implement Yandex.Kassa integration
        throw new Error('Yandex.Kassa integration not yet implemented');
      }

      throw new Error('Invalid payment provider');
    }),

  /**
   * Manually add funds (for testing/admin)
   */
  addFunds: protectedProcedure
    .input(z.object({ amount: z.number().positive(), description: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user?.id;
      if (!userId) {
        throw new Error('User not authenticated');
      }

      const transaction = depositFunds(
        userId,
        input.amount,
        input.description || 'Manual deposit',
        undefined,
        { manual: true, timestamp: Date.now() }
      );

      const wallet = getUserWallet(userId);

      return {
        success: true,
        transaction,
        newBalance: wallet?.balance || 0,
        message: `Successfully added ${input.amount} to your wallet`,
      };
    }),

  /**
   * Request withdrawal
   */
  withdraw: protectedProcedure
    .input(withdrawSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user?.id;
      if (!userId) {
        throw new Error('User not authenticated');
      }

      const { amount, description } = input;

      try {
        const transaction = withdrawFunds(
          userId,
          amount,
          description,
          { timestamp: Date.now() }
        );

        const wallet = getUserWallet(userId);

        return {
          success: true,
          transaction,
          newBalance: wallet?.balance || 0,
          message: `Successfully withdrawn ${amount} from your wallet`,
        };
      } catch (error: any) {
        throw new Error(error.message || 'Withdrawal failed');
      }
    }),

  /**
   * Get transaction history
   */
  getTransactions: protectedProcedure
    .input(getTransactionsSchema)
    .query(async ({ ctx, input }) => {
      const userId = ctx.user?.id;
      if (!userId) {
        throw new Error('User not authenticated');
      }

      const { limit, offset } = input;
      const transactions = getUserTransactions(userId, limit, offset);

      return {
        transactions,
        total: transactions.length,
        hasMore: transactions.length === limit,
      };
    }),

  /**
   * Get specific transaction by ID
   */
  getTransaction: protectedProcedure
    .input(z.object({ transactionId: z.number().positive() }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.user?.id;
      if (!userId) {
        throw new Error('User not authenticated');
      }

      const transactions = getUserTransactions(userId, 1000, 0);
      const transaction = transactions.find(tx => tx.id === input.transactionId);

      if (!transaction) {
        throw new Error('Transaction not found');
      }

      return transaction;
    }),

  /**
   * Get wallet statistics
   */
  getStats: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user?.id;
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const wallet = getUserWallet(userId);
    const transactions = getUserTransactions(userId, 100, 0);

    const deposits = transactions.filter(tx => tx.type === 'deposit');
    const withdrawals = transactions.filter(tx => tx.type === 'withdrawal');
    const purchases = transactions.filter(tx => tx.type === 'purchase');
    const sales = transactions.filter(tx => tx.type === 'sale');

    const totalDeposits = deposits.reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
    const totalWithdrawals = withdrawals.reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
    const totalSpent = purchases.reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
    const totalEarned = sales.reduce((sum, tx) => sum + tx.amount, 0);

    return {
      currentBalance: wallet?.balance || 0,
      currency: wallet?.currency || 'USD',
      totalDeposits,
      totalWithdrawals,
      totalSpent,
      totalEarned,
      transactionCount: transactions.length,
      lastTransaction: transactions[0] || null,
    };
  }),
});
