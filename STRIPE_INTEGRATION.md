# Stripe Integration Guide

## 🚀 Quick Setup

### 1. Get Stripe API Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Developers** → **API keys**
3. Copy your **Secret key** (starts with `sk_test_` for test mode)
4. Copy your **Publishable key** (starts with `pk_test_` for test mode)

### 2. Configure Environment Variables

Create a `.env` file in the root directory (copy from `.env.example`):

```bash
cp .env.example .env
```

Edit `.env` and add your Stripe keys:

```env
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

### 3. Set Up Webhook Endpoint

#### Development (using Stripe CLI)

1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
2. Login to Stripe:
   ```bash
   stripe login
   ```
3. Forward webhooks to your local server:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```
4. Copy the webhook signing secret from the output and add to `.env`:
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxx
   ```

#### Production

1. Go to [Stripe Webhooks](https://dashboard.stripe.com/webhooks)
2. Click **Add endpoint**
3. Set URL to: `https://your-domain.com/api/webhooks/stripe`
4. Select events to listen to:
   - `checkout.session.completed`
   - `checkout.session.expired`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`
5. Copy the **Signing secret** and add to production `.env`

### 4. Test the Integration

#### Test Cards

Use these test card numbers in Stripe test mode:

| Card Number | Description |
|-------------|-------------|
| `4242 4242 4242 4242` | Successful payment |
| `4000 0000 0000 9995` | Payment declined |
| `4000 0025 0000 3155` | Requires authentication (3D Secure) |

**Expiry**: Any future date (e.g., 12/34)  
**CVC**: Any 3 digits (e.g., 123)  
**ZIP**: Any 5 digits (e.g., 12345)

#### Test Flow

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Start Stripe webhook forwarding:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

3. Go to `/wallet` page
4. Click **Deposit** button
5. Enter amount (e.g., 1000)
6. You'll be redirected to Stripe Checkout
7. Use test card `4242 4242 4242 4242`
8. Complete payment
9. You'll be redirected back to wallet page
10. Check your balance - it should be updated!

## 📊 Webhook Events

The platform handles these Stripe webhook events:

### `checkout.session.completed`
- Triggered when a user completes payment
- Adds funds to user's wallet
- Creates transaction record
- Updates payment session status

### `checkout.session.expired`
- Triggered when checkout session expires (30 min timeout)
- Updates payment session status to 'expired'

### `payment_intent.succeeded`
- Logged for tracking successful payments

### `payment_intent.payment_failed`
- Logged for tracking failed payments
- Can implement retry logic or user notification

### `charge.refunded`
- Handles refund events
- Can implement automatic wallet deduction

## 🔐 Security Best Practices

1. **Never commit `.env` file** to Git
   - `.env` is in `.gitignore`
   - Only commit `.env.example`

2. **Use webhook secrets** for signature verification
   - All webhook events are verified with HMAC signature
   - Prevents fake webhook attacks

3. **Test mode vs Live mode**
   - Use `sk_test_` keys for development
   - Use `sk_live_` keys for production
   - Never mix test and live keys

4. **Secure key storage**
   - Store keys in environment variables
   - Use secret management services in production (e.g., AWS Secrets Manager)

## 💰 Pricing

Stripe charges per successful transaction:

- **2.9% + $0.30** per successful card charge (US)
- **3.9% + $0.30** for international cards
- **No monthly fees** or setup costs
- **Volume discounts** available for high-volume businesses

## 📖 API Reference

### Create Deposit Session

```typescript
const session = await trpc.wallet.createDepositSession.mutate({
  amount: 1000,
  paymentProvider: 'stripe',
  successUrl: 'https://your-domain.com/wallet?payment=success',
  cancelUrl: 'https://your-domain.com/wallet?payment=cancelled',
});

// Redirect user to session.checkoutUrl
window.location.href = session.checkoutUrl;
```

### Check Stripe Configuration

```typescript
import { isStripeConfigured } from './server/stripe-utils';

if (isStripeConfigured()) {
  console.log('Stripe is configured and ready!');
} else {
  console.log('Stripe is not configured. Using mock mode.');
}
```

## 🐛 Troubleshooting

### "Stripe not configured" error

**Problem**: `STRIPE_SECRET_KEY` not set or invalid

**Solution**:
1. Check `.env` file exists
2. Verify `STRIPE_SECRET_KEY=sk_test_...` is set
3. Restart server after adding env vars

### Webhook signature verification failed

**Problem**: Invalid webhook secret

**Solution**:
1. Check `STRIPE_WEBHOOK_SECRET` in `.env`
2. For development: Get secret from `stripe listen` output
3. For production: Get secret from Stripe Dashboard → Webhooks

### Payment succeeds but wallet not updated

**Problem**: Webhook not received or failed

**Solution**:
1. Check webhook forwarding is running: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
2. Check server logs for webhook errors
3. Check Stripe Dashboard → Webhooks → Recent deliveries

### Test card declined

**Problem**: Using wrong test card number

**Solution**: Use `4242 4242 4242 4242` for successful payments

## 📚 Additional Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe API Reference](https://stripe.com/docs/api)
- [Stripe Checkout](https://stripe.com/docs/payments/checkout)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
- [Stripe Testing](https://stripe.com/docs/testing)

## 🎯 Next Steps

1. ✅ Stripe integration complete
2. 🔄 Test with real test cards
3. 📧 Add email notifications for successful deposits
4. 💳 Add payment method management
5. 🔄 Implement subscription plans (optional)
6. 🌍 Add multi-currency support
7. 🏦 Integrate Yandex.Kassa for Russian market

---

**Need help?** Contact the development team or check [Stripe Support](https://support.stripe.com/)
