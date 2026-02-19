import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle, Copy } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';
import Header from '@/components/Header';

interface TestAccount {
  email: string;
  password: string;
  role: string;
}

export default function DeveloperTools() {
  const [testAccounts, setTestAccounts] = useState<TestAccount[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAccounts, setShowAccounts] = useState(false);

  const createTestAccountsMutation = trpc.auth.createTestAccounts.useMutation({
    onSuccess: (data) => {
      setTestAccounts(data);
      setShowAccounts(true);
      toast.success('Test accounts created successfully!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create test accounts');
    },
  });

  const handleCreateTestAccounts = async () => {
    setIsLoading(true);
    try {
      await createTestAccountsMutation.mutateAsync();
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const handleLogin = (account: TestAccount) => {
    // Store credentials in localStorage for quick access
    localStorage.setItem('devTestAccount', JSON.stringify(account));
    toast.success(`Ready to login as ${account.role}`);
    // Redirect to login page
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-4xl mx-auto p-4">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🛠️ Developer Tools
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> This page is for development purposes only. Use these test accounts to test different user roles and features on the platform.
              </p>
            </div>

            <Button
              onClick={handleCreateTestAccounts}
              disabled={isLoading}
              className="w-full"
              size="lg"
            >
              {isLoading ? 'Creating Test Accounts...' : 'Create Test Accounts for All Roles'}
            </Button>

            {showAccounts && testAccounts.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-bold text-lg">Test Accounts Created:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {testAccounts.map((account, index) => (
                    <Card key={index} className="border-green-200 bg-green-50">
                      <CardContent className="pt-6">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <CheckCircle size={16} className="text-green-600" />
                            <span className="font-bold capitalize text-green-900">
                              {account.role}
                            </span>
                          </div>

                          <div className="bg-white p-3 rounded border border-green-200">
                            <p className="text-xs text-gray-600 mb-1">Email:</p>
                            <div className="flex items-center justify-between gap-2">
                              <code className="text-sm font-mono">{account.email}</code>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(account.email)}
                              >
                                <Copy size={14} />
                              </Button>
                            </div>
                          </div>

                          <div className="bg-white p-3 rounded border border-green-200">
                            <p className="text-xs text-gray-600 mb-1">Password:</p>
                            <div className="flex items-center justify-between gap-2">
                              <code className="text-sm font-mono">{account.password}</code>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(account.password)}
                              >
                                <Copy size={14} />
                              </Button>
                            </div>
                          </div>

                          <Button
                            onClick={() => handleLogin(account)}
                            className="w-full"
                            variant="outline"
                          >
                            Login as {account.role}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Available Test Roles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded">
                <span className="font-bold text-blue-600 min-w-24">Artist</span>
                <p className="text-sm text-gray-700">Can upload and sell their own artworks</p>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded">
                <span className="font-bold text-blue-600 min-w-24">Collector</span>
                <p className="text-sm text-gray-700">Can buy and sell artworks</p>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded">
                <span className="font-bold text-blue-600 min-w-24">Gallery</span>
                <p className="text-sm text-gray-700">Can manage gallery and exhibitions</p>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded">
                <span className="font-bold text-blue-600 min-w-24">Curator</span>
                <p className="text-sm text-gray-700">Can organize exhibitions and events</p>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded">
                <span className="font-bold text-blue-600 min-w-24">Partner</span>
                <p className="text-sm text-gray-700">Partnership services and collaboration</p>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded">
                <span className="font-bold text-blue-600 min-w-24">Consultant</span>
                <p className="text-sm text-gray-700">Can consult and evaluate artworks</p>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded">
                <span className="font-bold text-blue-600 min-w-24">Guest</span>
                <p className="text-sm text-gray-700">Can browse catalog and participate in auctions</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
