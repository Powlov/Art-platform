import React from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import {
  Home,
  ShoppingCart,
  Upload,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

type UserRole = 'user' | 'artist' | 'collector' | 'gallery' | 'partner' | 'curator' | 'consultant' | 'admin';

interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
}

const ROLE_NAVIGATION: Record<UserRole, NavItem[]> = {
  artist: [
    { label: 'Dashboard', icon: <Home size={20} />, path: '/dashboard' },
    { label: 'Upload', icon: <Upload size={20} />, path: '/artworks/new' },
    { label: 'My Works', icon: <ShoppingCart size={20} />, path: '/artist/artworks' },
    { label: 'Statistics', icon: <BarChart3 size={20} />, path: '/statistics' },
    { label: 'Profile', icon: <Users size={20} />, path: '/profile' },
  ],
  collector: [
    { label: 'Dashboard', icon: <Home size={20} />, path: '/dashboard' },
    { label: 'Marketplace', icon: <ShoppingCart size={20} />, path: '/marketplace' },
    { label: 'My Collection', icon: <Users size={20} />, path: '/collector/collection' },
    { label: 'Auctions', icon: <BarChart3 size={20} />, path: '/auctions' },
    { label: 'Profile', icon: <Settings size={20} />, path: '/profile' },
  ],
  gallery: [
    { label: 'Dashboard', icon: <Home size={20} />, path: '/dashboard' },
    { label: 'Exhibitions', icon: <Upload size={20} />, path: '/gallery/exhibitions' },
    { label: 'Artists', icon: <Users size={20} />, path: '/gallery/artists' },
    { label: 'Analytics', icon: <BarChart3 size={20} />, path: '/statistics' },
    { label: 'Settings', icon: <Settings size={20} />, path: '/gallery/settings' },
  ],
  curator: [
    { label: 'Dashboard', icon: <Home size={20} />, path: '/dashboard' },
    { label: 'Create Exhibition', icon: <Upload size={20} />, path: '/curator/exhibitions/new' },
    { label: 'My Exhibitions', icon: <ShoppingCart size={20} />, path: '/curator/exhibitions' },
    { label: 'Events', icon: <Users size={20} />, path: '/curator/events' },
    { label: 'Analytics', icon: <BarChart3 size={20} />, path: '/statistics' },
  ],
  consultant: [
    { label: 'Dashboard', icon: <Home size={20} />, path: '/dashboard' },
    { label: 'Clients', icon: <Users size={20} />, path: '/consultant/clients' },
    { label: 'Appointments', icon: <ShoppingCart size={20} />, path: '/consultant/appointments' },
    { label: 'Valuations', icon: <Upload size={20} />, path: '/consultant/valuations' },
    { label: 'Analytics', icon: <BarChart3 size={20} />, path: '/statistics' },
  ],
  partner: [
    { label: 'Dashboard', icon: <Home size={20} />, path: '/dashboard' },
    { label: 'Programs', icon: <ShoppingCart size={20} />, path: '/partner/programs' },
    { label: 'Commissions', icon: <BarChart3 size={20} />, path: '/partner/commissions' },
    { label: 'Reports', icon: <Upload size={20} />, path: '/partner/reports' },
    { label: 'Contacts', icon: <Users size={20} />, path: '/partner/contacts' },
  ],
  admin: [
    { label: 'Dashboard', icon: <Home size={20} />, path: '/admin' },
    { label: 'Users', icon: <Users size={20} />, path: '/admin/users' },
    { label: 'Content', icon: <ShoppingCart size={20} />, path: '/admin/content' },
    { label: 'Analytics', icon: <BarChart3 size={20} />, path: '/admin/analytics' },
    { label: 'Settings', icon: <Settings size={20} />, path: '/admin/settings' },
  ],
  user: [
    { label: 'Dashboard', icon: <Home size={20} />, path: '/dashboard' },
    { label: 'Marketplace', icon: <ShoppingCart size={20} />, path: '/marketplace' },
    { label: 'Auctions', icon: <BarChart3 size={20} />, path: '/auctions' },
    { label: 'Wishlist', icon: <Users size={20} />, path: '/wishlist' },
    { label: 'Profile', icon: <Settings size={20} />, path: '/profile' },
  ],
};

interface RoleBasedNavigationProps {
  userRole: UserRole;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function RoleBasedNavigation({
  userRole,
  isOpen = true,
  onClose,
}: RoleBasedNavigationProps) {
  const [, setLocation] = useLocation();
  const navItems = ROLE_NAVIGATION[userRole] || ROLE_NAVIGATION.user;

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    localStorage.removeItem('token');
    setLocation('/login');
  };

  return (
    <nav className="bg-gray-900 text-white w-64 min-h-screen p-4 flex flex-col">
      {/* Logo */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">🎨 ART BANK</h1>
        <p className="text-xs text-gray-400 mt-1 capitalize">{userRole}</p>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 space-y-2">
        {navItems.map((item, index) => (
          <Button
            key={index}
            variant="ghost"
            className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800"
            onClick={() => {
              setLocation(item.path);
              onClose?.();
            }}
          >
            {item.icon}
            <span className="ml-3">{item.label}</span>
          </Button>
        ))}
      </div>

      {/* Logout Button */}
      <Button
        variant="ghost"
        className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-gray-800"
        onClick={handleLogout}
      >
        <LogOut size={20} />
        <span className="ml-3">Logout</span>
      </Button>
    </nav>
  );
}
