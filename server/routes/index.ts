import { router } from '../_core/trpc';
import { systemRouter } from '../_core/systemRouter';
import { transactionLedCoreRouter } from './transactionLedCore';

/**
 * Main tRPC Router
 * Combines all sub-routers into a single API
 */
export const appRouter = router({
  system: systemRouter,
  core: transactionLedCoreRouter,
});

export type AppRouter = typeof appRouter;
