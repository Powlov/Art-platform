import React, { useState } from 'react';
import Header from './Header';
import RoleBasedNavigation from './RoleBasedNavigation';

type UserRole = 'user' | 'artist' | 'collector' | 'gallery' | 'partner' | 'curator' | 'consultant' | 'admin';

interface RoleBasedLayoutProps {
  children: React.ReactNode;
  userRole: UserRole;
  showSidebar?: boolean;
}

export default function RoleBasedLayout({
  children,
  userRole,
  showSidebar = true,
}: RoleBasedLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (!showSidebar) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto">{children}</main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 overflow-hidden`}>
        <RoleBasedNavigation userRole={userRole} isOpen={sidebarOpen} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header showBackButton={false} />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
