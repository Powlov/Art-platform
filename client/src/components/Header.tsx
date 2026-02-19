import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageCircle, Camera, Bell, User, LogOut, Menu, X, Search, ArrowLeft, Wallet } from 'lucide-react';
import { useLocation } from 'wouter';
import { toast } from 'sonner';
import QRScanner from './QRScanner';
import { HeaderStats } from './HeaderStats';
import NotificationsDropdown from './NotificationsDropdown';
import WalletWidget from './WalletWidget';

interface HeaderProps {
  showBackButton?: boolean;
  onBack?: () => void;
}

export default function Header({ showBackButton = false, onBack }: HeaderProps) {
  const [, setLocation] = useLocation();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showWallet, setShowWallet] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(3);
  const [unreadNotifications, setUnreadNotifications] = useState(5);

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setLocation('/login');
    toast.success('Logged out successfully');
  };

  const handleQRScanned = (data: string) => {
    try {
      // Parse QR code data (could be user profile or artwork)
      if (data.includes('/user/')) {
        const username = data.split('/user/')[1];
        setLocation(`/user/${username}`);
      } else if (data.includes('/artwork/')) {
        const artworkId = data.split('/artwork/')[1];
        setLocation(`/artwork/${artworkId}`);
      } else {
        toast.error('Invalid QR code');
      }
      setShowQRScanner(false);
    } catch (error) {
      toast.error('Failed to parse QR code');
    }
  };

  return (
    <>
      <HeaderStats />
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Left: Back Button + Logo */}
            <div className="flex items-center gap-3">
              {showBackButton && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onBack}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft size={20} />
                </Button>
              )}
              <div
                className="text-xl font-bold cursor-pointer hover:text-blue-600"
                onClick={() => setLocation('/dashboard')}
              >
                🎨 ART BANK
              </div>
            </div>

            {/* Center: Search */}
            <div className="hidden md:flex flex-1 max-w-md">
              <div className="relative w-full">
                <Input
                  placeholder="Search artworks, artists..."
                  className="pl-10"
                />
                <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
              {/* Camera/QR Scanner */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowQRScanner(true)}
                title="Scan QR Code"
                className="relative"
              >
                <Camera size={20} />
              </Button>

              {/* Messenger */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocation('/messenger')}
                title="Messages"
                className="relative"
              >
                <MessageCircle size={20} />
                {unreadMessages > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadMessages}
                  </span>
                )}
              </Button>

              {/* Notifications */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNotifications(!showNotifications)}
                  title="Notifications"
                  className="relative"
                >
                  <Bell size={20} />
                  {unreadNotifications > 0 && (
                    <span className="absolute top-0 right-0 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadNotifications}
                    </span>
                  )}
                </Button>
                
                <NotificationsDropdown
                  isOpen={showNotifications}
                  onClose={() => setShowNotifications(false)}
                  badgeCount={unreadNotifications}
                />
              </div>

              {/* Wallet */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowWallet(!showWallet)}
                  title="Wallet"
                  className="relative"
                >
                  <Wallet size={20} />
                </Button>
                
                <WalletWidget
                  isOpen={showWallet}
                  onClose={() => setShowWallet(false)}
                />
              </div>

              {/* User Profile Dropdown */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2"
                >
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {currentUser.name?.charAt(0) || 'U'}
                  </div>
                </Button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <div className="p-4 border-b border-gray-200">
                      <p className="font-bold text-sm">{currentUser.name}</p>
                      <p className="text-xs text-gray-500">@{currentUser.username}</p>
                      <p className="text-xs text-gray-500 capitalize">{currentUser.role}</p>
                    </div>
                    <div className="p-2 space-y-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => {
                          setLocation('/profile');
                          setShowUserMenu(false);
                        }}
                      >
                        <User size={16} className="mr-2" />
                        My Profile
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => {
                          setLocation('/statistics');
                          setShowUserMenu(false);
                        }}
                      >
                        📊 Statistics
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => {
                          setLocation('/settings');
                          setShowUserMenu(false);
                        }}
                      >
                        ⚙️ Settings
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start text-red-600 hover:text-red-700"
                        onClick={handleLogout}
                      >
                        <LogOut size={16} className="mr-2" />
                        Logout
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="md:hidden"
              >
                {showMobileMenu ? <X size={20} /> : <Menu size={20} />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {showMobileMenu && (
            <div className="md:hidden mt-4 pt-4 border-t border-gray-200 space-y-2">
              <Input placeholder="Search artworks, artists..." />
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  setLocation('/profile');
                  setShowMobileMenu(false);
                }}
              >
                <User size={16} className="mr-2" />
                My Profile
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  setLocation('/settings');
                  setShowMobileMenu(false);
                }}
              >
                ⚙️ Settings
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-red-600"
                onClick={handleLogout}
              >
                <LogOut size={16} className="mr-2" />
                Logout
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* QR Scanner Modal */}
      {showQRScanner && (
        <QRScanner
          onClose={() => setShowQRScanner(false)}
          onScan={handleQRScanned}
        />
      )}
    </>
  );
}
