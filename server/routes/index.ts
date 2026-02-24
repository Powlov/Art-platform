import { router } from '../_core/trpc';
import { systemRouter } from '../_core/systemRouter';
import { transactionLedCoreRouter } from './transactionLedCore';
import { neo4jGraphRouter } from './neo4jGraph';

/**
 * Main tRPC Router
 * Combines all sub-routers into a single API
 */
export const appRouter = router({
  system: systemRouter,
  core: transactionLedCoreRouter,
  graph: neo4jGraphRouter,
});

export type AppRouter = typeof appRouter;
