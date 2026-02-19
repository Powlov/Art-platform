import React, { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import {
  Wallet as WalletIcon,
  ArrowDownCircle,
  ArrowUpCircle,
  History,
  TrendingUp,
  TrendingDown,
  CreditCard,
  DollarSign,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Filter,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

export default function WalletPage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');

  // Queries
  const { data: balanceData, refetch: refetchBalance } = trpc.wallet.getBalance.useQuery();
  const { data: statsData } = trpc.wallet.getStats.useQuery();
  const { data: transactionsData } = trpc.wallet.getTransactions.useQuery({ limit: 50, offset: 0 });

  // Mutations
  const addFundsMutation = trpc.wallet.addFunds.useMutation({
    onSuccess: (data) => {
      toast({
        title: 'Success!',
        description: data.message,
      });
      setShowDeposit(false);
      setDepositAmount('');
      refetchBalance();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const withdrawMutation = trpc.wallet.withdraw.useMutation({
    onSuccess: (data) => {
      toast({
        title: 'Success!',
        description: data.message,
      });
      setShowWithdraw(false);
      setWithdrawAmount('');
      refetchBalance();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please sign in to access your wallet</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => setLocation('/login')} className="w-full">
              Sign In
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const handleDeposit = () => {
    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid amount',
        variant: 'destructive',
      });
      return;
    }

    addFundsMutation.mutate({
      amount,
      description: 'Manual deposit to wallet',
    });
  };

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid amount',
        variant: 'destructive',
      });
      return;
    }

    withdrawMutation.mutate({
      amount,
      description: 'Withdrawal from wallet',
    });
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: 'default',
      pending: 'secondary',
      failed: 'destructive',
      cancelled: 'outline',
    };
    return <Badge variant={variants[status as keyof typeof variants] || 'default'}>{status}</Badge>;
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownCircle className="w-5 h-5 text-green-500" />;
      case 'withdrawal':
        return <ArrowUpCircle className="w-5 h-5 text-red-500" />;
      case 'purchase':
        return <DollarSign className="w-5 h-5 text-blue-500" />;
      case 'sale':
        return <TrendingUp className="w-5 h-5 text-purple-500" />;
      default:
        return <History className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <WalletIcon className="w-8 h-8" />
            My Wallet
          </h1>
          <p className="text-gray-600 mt-2">Manage your balance and transactions</p>
        </div>

        {/* Balance Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="mb-8 bg-gradient-to-br from-blue-500 to-purple-600 text-white">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                <span>Current Balance</span>
                <WalletIcon className="w-6 h-6" />
              </CardTitle>
              <CardDescription className="text-blue-100">Available funds in your account</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-5xl font-bold mb-6">
                {balanceData?.currency} {balanceData?.balance.toFixed(2) || '0.00'}
              </div>
              <div className="flex gap-4">
                <Button
                  onClick={() => setShowDeposit(true)}
                  variant="secondary"
                  className="flex-1"
                >
                  <ArrowDownCircle className="w-4 h-4 mr-2" />
                  Deposit
                </Button>
                <Button
                  onClick={() => setShowWithdraw(true)}
                  variant="secondary"
                  className="flex-1"
                >
                  <ArrowUpCircle className="w-4 h-4 mr-2" />
                  Withdraw
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Statistics */}
        {statsData && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Deposits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  ${statsData.totalDeposits.toFixed(2)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Withdrawals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  ${statsData.totalWithdrawals.toFixed(2)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Spent</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  ${statsData.totalSpent.toFixed(2)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Earned</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  ${statsData.totalEarned.toFixed(2)}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Transactions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="w-5 h-5" />
              Transaction History
            </CardTitle>
            <CardDescription>Your recent wallet activity</CardDescription>
          </CardHeader>
          <CardContent>
            {transactionsData && transactionsData.transactions.length > 0 ? (
              <div className="space-y-4">
                {transactionsData.transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition"
                  >
                    <div className="flex items-center gap-4">
                      {getTransactionIcon(tx.type)}
                      <div>
                        <div className="font-medium capitalize">{tx.type}</div>
                        <div className="text-sm text-gray-600">{tx.description || 'No description'}</div>
                        <div className="text-xs text-gray-400 mt-1">
                          {formatDate(tx.createdAt)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`text-lg font-bold ${
                          tx.amount >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {tx.amount >= 0 ? '+' : ''}${Math.abs(tx.amount).toFixed(2)}
                      </div>
                      {getStatusBadge(tx.status)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <History className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>No transactions yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Deposit Dialog */}
        <Dialog open={showDeposit} onOpenChange={setShowDeposit}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Deposit Funds</DialogTitle>
              <DialogDescription>Add funds to your wallet</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="deposit-amount">Amount (USD)</Label>
                <Input
                  id="deposit-amount"
                  type="number"
                  placeholder="0.00"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDeposit(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleDeposit}
                disabled={addFundsMutation.isPending}
              >
                {addFundsMutation.isPending ? 'Processing...' : 'Deposit'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Withdraw Dialog */}
        <Dialog open={showWithdraw} onOpenChange={setShowWithdraw}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Withdraw Funds</DialogTitle>
              <DialogDescription>
                Withdraw funds from your wallet. Current balance: ${balanceData?.balance.toFixed(2) || '0.00'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="withdraw-amount">Amount (USD)</Label>
                <Input
                  id="withdraw-amount"
                  type="number"
                  placeholder="0.00"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  min="0"
                  step="0.01"
                  max={balanceData?.balance || 0}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowWithdraw(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleWithdraw}
                disabled={withdrawMutation.isPending}
                variant="destructive"
              >
                {withdrawMutation.isPending ? 'Processing...' : 'Withdraw'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
