/**
 * Art-OS Integration Layer
 * Connects existing Node.js backend with new microservices
 */

import express from 'express';
import axios from 'axios';
import { EventEmitter } from 'events';

const router = express.Router();

// Microservice URLs
const SERVICES = {
  eventRouter: process.env.EVENT_ROUTER_URL || 'http://localhost:8080',
  analytics: process.env.ANALYTICS_URL || 'http://localhost:8001',
  transactionHub: process.env.TRANSACTION_HUB_URL || 'http://localhost:8002',
  mediaHub: process.env.MEDIA_HUB_URL || 'http://localhost:8003',
};

// Event emitter for internal pub/sub
const eventBus = new EventEmitter();

/**
 * Proxy analytics requests to Analytics Service
 */
router.post('/analytics/fair-price', async (req, res) => {
  try {
    const response = await axios.post(
      `${SERVICES.analytics}/api/v1/analytics/fair-price`,
      req.body
    );
    res.json(response.data);
  } catch (error) {
    console.error('Analytics service error:', error.message);
    res.status(500).json({ error: 'Analytics service unavailable' });
  }
});

router.get('/analytics/market-gravity/:category', async (req, res) => {
  try {
    const response = await axios.get(
      `${SERVICES.analytics}/api/v1/analytics/market-gravity/${req.params.category}`
    );
    res.json(response.data);
  } catch (error) {
    console.error('Analytics service error:', error.message);
    res.status(500).json({ error: 'Analytics service unavailable' });
  }
});

/**
 * Proxy transaction requests to Transaction Hub
 */
router.post('/transactions', async (req, res) => {
  try {
    const response = await axios.post(
      `${SERVICES.transactionHub}/api/v1/transactions`,
      req.body
    );
    res.json(response.data);
  } catch (error) {
    console.error('Transaction Hub error:', error.message);
    res.status(500).json({ error: 'Transaction service unavailable' });
  }
});

router.get('/transactions/:id', async (req, res) => {
  try {
    const response = await axios.get(
      `${SERVICES.transactionHub}/api/v1/transactions/${req.params.id}`
    );
    res.json(response.data);
  } catch (error) {
    console.error('Transaction Hub error:', error.message);
    res.status(404).json({ error: 'Transaction not found' });
  }
});

router.get('/transactions/:id/saga-steps', async (req, res) => {
  try {
    const response = await axios.get(
      `${SERVICES.transactionHub}/api/v1/transactions/${req.params.id}/saga-steps`
    );
    res.json(response.data);
  } catch (error) {
    console.error('Transaction Hub error:', error.message);
    res.status(500).json({ error: 'Saga steps unavailable' });
  }
});

/**
 * Proxy media/sentiment requests to Media Hub
 */
router.post('/media/analyze-article', async (req, res) => {
  try {
    const response = await axios.post(
      `${SERVICES.mediaHub}/api/v1/media/analyze-article`,
      req.body
    );
    res.json(response.data);
  } catch (error) {
    console.error('Media Hub error:', error.message);
    res.status(500).json({ error: 'Media analysis service unavailable' });
  }
});

router.post('/media/analyze-impact', async (req, res) => {
  try {
    const response = await axios.post(
      `${SERVICES.mediaHub}/api/v1/media/analyze-impact`,
      null,
      { params: req.query }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Media Hub error:', error.message);
    res.status(500).json({ error: 'Media impact analysis unavailable' });
  }
});

/**
 * Publish events to Event Router
 */
async function publishEvent(eventType: string, payload: any) {
  try {
    const token = process.env.JWT_SECRET || 'sandbox-test-secret-key';
    
    await axios.post(
      `${SERVICES.eventRouter}/api/v1/events`,
      {
        type: eventType,
        source: 'nodejs_backend',
        payload,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    console.log(`Event published: ${eventType}`);
  } catch (error) {
    console.error(`Failed to publish event ${eventType}:`, error.message);
  }
}

/**
 * Artwork lifecycle events
 */
eventBus.on('artwork:created', async (artwork) => {
  await publishEvent('artwork.created', artwork);
  
  // Trigger KDE analysis for initial pricing
  try {
    const fairPrice = await axios.post(
      `${SERVICES.analytics}/api/v1/analytics/fair-price`,
      {
        artwork_id: artwork.id,
        category: artwork.category,
        artist_id: artwork.artist_id,
      }
    );
    
    console.log(`Fair price calculated for ${artwork.id}:`, fairPrice.data.fair_price);
  } catch (error) {
    console.error('Failed to calculate fair price:', error.message);
  }
});

eventBus.on('artwork:price_updated', async (data) => {
  await publishEvent('price.changed', data);
});

/**
 * Transaction lifecycle events
 */
eventBus.on('transaction:initiated', async (transaction) => {
  await publishEvent('transaction.created', transaction);
});

eventBus.on('transaction:completed', async (transaction) => {
  await publishEvent('transaction.completed', transaction);
  
  // Trigger cascade pricing
  try {
    await axios.post(
      `${SERVICES.analytics}/api/v1/analytics/cascade-pricing`,
      {
        artwork_id: transaction.artwork_id,
        new_price: transaction.amount,
      }
    );
  } catch (error) {
    console.error('Failed to trigger cascade pricing:', error.message);
  }
});

/**
 * Service health check aggregator
 */
router.get('/health', async (req, res) => {
  const healthChecks = await Promise.allSettled([
    axios.get(`${SERVICES.analytics}/health`),
    axios.get(`${SERVICES.mediaHub}/health`),
  ]);
  
  const status = {
    artos_integration: 'healthy',
    services: {
      analytics: healthChecks[0].status === 'fulfilled' ? 'healthy' : 'unhealthy',
      media_hub: healthChecks[1].status === 'fulfilled' ? 'healthy' : 'unhealthy',
    },
  };
  
  res.json(status);
});

/**
 * Export event bus for use in other modules
 */
export { eventBus, publishEvent };
export default router;
