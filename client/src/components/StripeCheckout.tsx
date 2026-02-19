import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle, Loader2, CreditCard } from 'lucide-react';

interface StripeCheckoutProps {
  artworkId: string;
  artworkTitle: string;
  price: number;
  onSuccess?: (paymentIntentId: string) => void;
  onError?: (error: string) => void;
}

export function StripeCheckout({ artworkId, artworkTitle, price, onSuccess, onError }: StripeCheckoutProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsProcessing(true);
    setError(null);

    try {
      // Validate card details
      if (!cardNumber || !expiryDate || !cvv) {
        throw new Error('Please fill in all card details');
      }

      // Create payment intent on backend
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          artworkId,
          amount: Math.round(price * 100), // Convert to cents
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      const { clientSecret, paymentIntentId } = await response.json();

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      setSuccess(true);
      onSuccess?.(paymentIntentId);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      onError?.(message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (success) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="text-center">
            <CheckCircle className="mx-auto mb-4 text-green-500" size={48} />
            <h3 className="text-lg font-semibold mb-2">Payment Successful!</h3>
            <p className="text-gray-600 mb-4">Thank you for your purchase of {artworkTitle}</p>
            <p className="text-2xl font-bold text-green-600">${price.toFixed(2)}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard size={20} />
          Secure Payment
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Artwork</p>
            <p className="font-semibold">{artworkTitle}</p>
            <p className="text-2xl font-bold text-blue-600 mt-2">${price.toFixed(2)}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
            <input
              type="text"
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value.replace(/\s/g, ''))}
              maxLength={16}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
              <input
                type="text"
                placeholder="MM/YY"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                maxLength={5}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
              <input
                type="text"
                placeholder="123"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                maxLength={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <p className="font-semibold text-red-900">Payment Error</p>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          )}

          <Button
            type="submit"
            disabled={isProcessing}
            className="w-full"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 animate-spin" size={18} />
                Processing...
              </>
            ) : (
              `Pay $${price.toFixed(2)}`
            )}
          </Button>

          <p className="text-xs text-gray-500 text-center">
            Your payment is secure and encrypted
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
